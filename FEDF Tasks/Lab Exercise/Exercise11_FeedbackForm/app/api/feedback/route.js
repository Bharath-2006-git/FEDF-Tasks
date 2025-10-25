import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Feedback from '@/models/Feedback'

export async function GET() {
  await connectDB()
  const data = await Feedback.find().sort({ createdAt: -1 })
  return NextResponse.json({ success: true, data })
}

export async function POST(req) {
  await connectDB()
  const body = await req.json()
  const data = await Feedback.create(body)
  return NextResponse.json({ success: true, data })
}
