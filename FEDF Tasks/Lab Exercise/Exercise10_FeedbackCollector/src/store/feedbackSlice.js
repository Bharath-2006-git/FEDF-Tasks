import { createSlice } from '@reduxjs/toolkit'

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    entries: []
  },
  reducers: {
    addFeedback: (state, action) => {
      state.entries.push({
        id: Date.now(),
        rating: action.payload.rating,
        comment: action.payload.comment,
        timestamp: new Date().toLocaleString()
      })
    }
  }
})

export const { addFeedback } = feedbackSlice.actions
export default feedbackSlice.reducer
