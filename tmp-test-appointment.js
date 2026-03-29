async function testAppointment() {
  try {
    // Tomamos la fecha de mañana, que caiga Lunes o Martes
    const d = new Date()
    while (d.getDay() !== 1 && d.getDay() !== 2) {
      d.setDate(d.getDate() + 1)
    }
    d.setHours(10, 0, 0, 0) // 10:00 AM

    const payload = {
      patientName: "TEST USER SMTP",
      patientEmail: "test@example.com",
      patientPhone: "04141234567",
      type: "atencion-ciudadano",
      notes: "Test notes",
      dateTime: d.toISOString(),
    }

    const res = await fetch("http://localhost:3000/api/public/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    
    const data = await res.json()
    console.log("Status:", res.status)
    console.log("Response:", JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("Error:", error)
  }
}

testAppointment()
