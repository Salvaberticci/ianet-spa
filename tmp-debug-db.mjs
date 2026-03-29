import mongoose from 'mongoose'

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { collection: 'settings' }
)

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema)

async function testConnection() {
  try {
    const uri = "mongodb://localhost:27017/ianet-admin"
    await mongoose.connect(uri)
    console.log("Connected to MongoDB")
    
    const settings = await Setting.find()
    console.log("Settings found:", JSON.stringify(settings, null, 2))
    
    await mongoose.disconnect()
  } catch (error) {
    console.error("Connection error:", error.message)
  }
}

testConnection()
