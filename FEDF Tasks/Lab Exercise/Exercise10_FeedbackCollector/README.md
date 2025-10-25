# Exercise 10: Feedback Collector with Redux Toolkit

## 📘 Overview
A feedback collection tool for training programs built with React and Redux Toolkit. Users can rate sessions (1-5 stars) and leave optional comments. All feedback is managed through Redux state and displayed in real-time.

## 🎯 Features Implemented

### ✅ Core Requirements

1. **Redux Toolkit Setup**
   - `feedbackSlice` with actions and reducers
   - `addFeedback` action to store feedback entries
   - Centralized Redux store configuration

2. **Feedback Form (Controlled Components)**
   - Radio button group for rating (1-5 stars)
   - Optional textarea for comments
   - Form validation (rating required)
   - Error message display

3. **Form Submission**
   - Dispatches `addFeedback` action to Redux
   - Validates rating selection before submission
   - Clears form after successful submission
   - Generates unique ID and timestamp for each entry

4. **Feedback Display**
   - Uses `useSelector` to retrieve all feedback from Redux state
   - Real-time display of submitted entries
   - Shows rating (star visualization) and comments
   - Displays submission timestamp
   - Shows total count of feedback entries

5. **Styling**
   - Clean, responsive layout with inline styles
   - Blue accent color scheme
   - Visual feedback for selected rating
   - Hover effects on buttons
   - Empty state message

## 🗂️ Project Structure

```
Exercise10_FeedbackCollector/
├── src/
│   ├── store/
│   │   ├── store.js           # Redux store configuration
│   │   └── feedbackSlice.js   # Feedback slice with actions/reducers
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point with Provider
│   └── index.css              # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Installation

1. Navigate to the project directory:
```bash
cd "d:\Study\Frontend Classes\FEDF Tasks\Lab Exercise\Exercise10_FeedbackCollector"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (typically `http://localhost:5173`)

## 📊 Redux State Structure

```javascript
{
  feedback: {
    entries: [
      {
        id: 1729849200000,
        rating: 5,
        comment: "Great session!",
        timestamp: "10/25/2025, 10:00:00 AM"
      }
    ]
  }
}
```

## 🔧 Key Redux Toolkit Concepts

### 1. Creating a Slice
```javascript
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: { entries: [] },
  reducers: {
    addFeedback: (state, action) => {
      state.entries.push(action.payload)
    }
  }
})
```

### 2. Configuring the Store
```javascript
export const store = configureStore({
  reducer: {
    feedback: feedbackReducer
  }
})
```

### 3. Using Redux in Components
```javascript
// Dispatch actions
const dispatch = useDispatch()
dispatch(addFeedback({ rating, comment }))

// Select state
const entries = useSelector(state => state.feedback.entries)
```

## 📝 Component Features

### Form Validation
- Rating is required (shows error if not selected)
- Comment is optional
- Form clears after successful submission

### Rating Selection
- Visual radio button group (1-5)
- Highlighted when selected (blue border/background)
- Shows star emoji for each rating

### Feedback Display
- Chronological list (newest first can be implemented)
- Star visualization (⭐⭐⭐⭐⭐)
- Timestamp for each entry
- Empty state when no feedback exists

## 🎨 Styling Details

- **Background**: Light gray (#f0f2f5)
- **Cards**: White with subtle borders
- **Accent**: Blue (#3b82f6)
- **Error**: Red (#dc2626)
- **Text**: Slate color scheme
- **Layout**: Max-width 700px, centered

## 🧪 Testing the Application

### Test Cases:
1. **Form Validation**: Try submitting without selecting a rating
2. **Rating Selection**: Click different ratings to see visual feedback
3. **Comment Submission**: Submit with and without comments
4. **Real-time Updates**: Verify feedback appears immediately after submission
5. **Multiple Entries**: Submit multiple feedback entries
6. **Empty State**: Check display when no feedback exists

## 🎓 Learning Outcomes

✅ Redux Toolkit setup and configuration  
✅ Creating slices with reducers and actions  
✅ Using `useDispatch` to dispatch actions  
✅ Using `useSelector` to read Redux state  
✅ Form validation and controlled components  
✅ State management in React with Redux  
✅ Real-time UI updates from Redux state  
✅ Immutable state updates with Redux Toolkit  

## 🛠️ Technologies Used

- **React 18.3.1**: UI library
- **Redux Toolkit 2.2.1**: State management
- **React-Redux 9.1.0**: React bindings for Redux
- **Vite 5.3.1**: Build tool and dev server
- **Inline CSS**: Component styling

## 📸 Key Features to Screenshot

1. **Empty Form**: Before any feedback is submitted
2. **Validation Error**: Attempting to submit without rating
3. **Selected Rating**: Form with rating selected
4. **Submitted Feedback**: List showing multiple entries
5. **Complete View**: Form + feedback list together

## 📄 License

This project is for educational purposes as part of the Frontend Development course.
