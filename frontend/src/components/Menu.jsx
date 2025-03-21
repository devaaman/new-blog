import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { URL } from "../url"
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

const Menu = () => {
    const {user, logout} = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogout = async() => {
        try {
            const res = await axios.get(URL+"/api/auth/logout")
            logout()
            navigate("/")
            toast.info("You've been logged out successfully");
        }
        catch(err) {
            console.log(err)
        }
    }
    
    return (
        <div className="bg-gradient-to-b from-indigo-900 to-purple-900 w-[200px] z-10 flex flex-col items-start absolute top-12 right-6 md:right-32 rounded-lg p-4 space-y-4 shadow-xl border border-purple-500/20 backdrop-blur-sm">
            {!user && (
                <h3 className="text-white text-sm hover:text-pink-300 cursor-pointer transition duration-300">
                    <Link to="/login">Login</Link>
                </h3>
            )}
            
            {!user && (
                <h3 className="text-white text-sm hover:text-pink-300 cursor-pointer transition duration-300">
                    <Link to="/register">Register</Link>
                </h3>
            )}
            
            {user && (
                <h3 className="text-white text-sm hover:text-pink-300 cursor-pointer transition duration-300">
                    <Link to={"/profile/"+user._id}>Profile</Link>
                </h3>
            )}
            
            {user && (
                <h3 className="text-white text-sm hover:text-pink-300 cursor-pointer transition duration-300">
                    <Link to="/write">Write</Link>
                </h3>
            )}
            
            {user && (
                <h3 className="text-white text-sm hover:text-pink-300 cursor-pointer transition duration-300">
                    <Link to={"/myblogs/"+user._id}>My blogs</Link>
                </h3>
            )}
            
            {user && (
                <h3 onClick={handleLogout} className="text-white text-sm hover:text-pink-300 cursor-pointer transition duration-300">
                    Logout
                </h3>
            )}
        </div>
    )
}

export default Menu