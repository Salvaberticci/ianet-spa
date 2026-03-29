import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import nodemailer from "nodemailer"
import Setting from "@/models/Setting"
import dbConnect from "@/lib/mongodb"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    await dbConnect()
    
    // Obtener el correo institucional configurado
    const setting = await Setting.findOne({ key: "institutionalEmail" })
    const targetEmail = setting?.value

    if (!targetEmail) {
      return NextResponse.json({ 
        success: false, 
        error: "No se ha configurado un correo institucional de destino en la base de datos." 
      }, { status: 400 })
    }

    // Limpiar espacios en la contraseña (frecuente en App Passwords de Google)
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : ""
    const isGmail = process.env.SMTP_HOST?.includes("gmail.com")

    const transportConfig = {
      ...(isGmail 
        ? { service: "gmail" } 
        : { 
            host: process.env.SMTP_HOST, 
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true"
          }),
      auth: {
        user: process.env.SMTP_USER,
        pass: smtpPass,
      },
      // Timeout corto para la prueba
      connectionTimeout: 10000, 
      greetingTimeout: 10000,
    }

    const transporter = nodemailer.createTransport(transportConfig)

    // Verificar la conexión
    try {
      await transporter.verify()
    } catch (verifyError) {
      return NextResponse.json({ 
        success: false, 
        error: `Fallo de conexión SMTP: ${verifyError.message}`,
        details: verifyError.code || "UNKNOWN_ERROR"
      }, { status: 500 })
    }

    // Enviar correo de prueba
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "IANET Sistema"}" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject: "🧪 Prueba de Configuración SMTP - IANET",
      text: "Esta es una prueba de envío de correo institucional desde el sistema IANET. Si recibes este mensaje, la configuración es CORRECTA.",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #10b981; border-radius: 8px;">
          <h2 style="color: #10b981;">¡Conexión Exitosa!</h2>
          <p>Has recibido este correo porque la configuración SMTP en el Panel Administrativo de IANET es correcta.</p>
          <hr />
          <p style="font-size: 0.8em; color: #666;">ID de mensaje: ${Date.now()}</p>
        </div>
      `,
    })

    return NextResponse.json({ 
      success: true, 
      message: "Correo de prueba enviado correctamente. Revisa la bandeja de entrada del correo institucional.",
      messageId: info.messageId 
    })

  } catch (error) {
    console.error("[SMTP TEST ERROR]:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Error interno del servidor",
      code: error.code
    }, { status: 500 })
  }
}
