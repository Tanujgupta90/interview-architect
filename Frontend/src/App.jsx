import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"

// Import your page components here
import Landing from "./features/interview/pages/home.jsx" 
import Interview from "./features/interview/pages/interview.jsx"

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <HashRouter>
          <Routes>
            {/* Main Home/Landing Dashboard Route */}
            <Route path="/" element={<Landing />} />
            
            {/* The Specific Interview Plan Route */}
            <Route path="/interview/:interviewId" element={<Interview />} />
            
            {/* Safety Fallback: Redirects any broken route back home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
