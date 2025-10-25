import mongoose from 'mongoose'

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema)
