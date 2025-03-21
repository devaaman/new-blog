import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PostDetails from './pages/PostDetails'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Profile from './pages/Profile'
import { UserContextProvider } from './context/UserContext'
import MyBlogs from './pages/MyBlogs'
import NotFound from './pages/NotFound'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { useEffect } from 'react'
import ScrollToTop from './components/ScrollToTop'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + H = Home
      if (e.altKey && e.key === 'h') {
        window.location.href = '/';
      }
      
      // Alt + W = Write new post
      if (e.altKey && e.key === 'w') {
        window.location.href = '/write';
      }
      
      // Alt + B = Go back
      if (e.altKey && e.key === 'b') {
        window.history.back();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <UserContextProvider>
      <ThemeProvider>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/write" element={<CreatePost />} />
            <Route exact path="/posts/post/:id" element={<PostDetails />} />
            <Route exact path="/edit/:id" element={<EditPost />} />
            <Route exact path="/myblogs/:id" element={<MyBlogs />} />
            <Route exact path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ScrollToTop />
        </ToastProvider>
      </ThemeProvider>
    </UserContextProvider>
  )
}

export default App