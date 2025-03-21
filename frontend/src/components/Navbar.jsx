import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from 'react-icons/bs';
import { FaBars, FaKeyboard } from 'react-icons/fa';
import { useContext, useEffect, useState } from "react";
import Menu from "./Menu";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { toast } from 'react-toastify';

const Navbar = () => {
    const [prompt, setPrompt] = useState("");
    const [menu, setMenu] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const navigate = useNavigate();
    const path = useLocation().pathname;
    let location = useLocation();

    const showMenu = () => {
        setMenu(!menu);
    };

    const { user, logout } = useContext(UserContext);

    const handleSearch = () => {
        if (prompt) {
            navigate("/", { state: { search: prompt } });
            toast.info(`Searching for "${prompt}"`);
        } else {
            toast.warning("Please enter a search term");
        }
    };

    const clearSearch = () => {
        setPrompt("");
        navigate("/");
    };

    useEffect(() => {
        const navigationEntries = window.performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
            if (location?.state?.search) location.state.search = null;
        }
    }, []);

    return (
        <div className="relative">
            <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-gradient-to-r from-purple-800 to-indigo-900 text-white shadow-lg">
                <h1 className="text-lg md:text-xl font-extrabold">
                    <Link to="/" className="hover:text-pink-300 transition duration-300">Blog Market</Link>
                </h1>
                
                <div className="flex justify-center items-center space-x-0 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                    <input
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                        className="outline-none bg-transparent text-sm text-white placeholder:text-gray-300 w-full md:w-auto"
                        placeholder="Search for posts..."
                    />
                    {prompt ? (
                        <button onClick={clearSearch} className="mx-1 text-gray-300 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : null}
                    <button onClick={handleSearch} className="text-gray-300 hover:text-white">
                        <BsSearch />
                    </button>
                </div>
                
                <div className="hidden md:flex items-center space-x-4">
                    <Link to="/" className={`${path === "/" ? "text-pink-300" : "text-white"} hover:text-pink-300 transition duration-300`}>
                        Home
                    </Link>
                    
                    {user ? (
                        <>
                            <Link to="/write" className={`${path === "/write" ? "text-pink-300" : "text-white"} hover:text-pink-300 transition duration-300`}>
                                Write
                            </Link>
                            <Link to={`/myblogs/${user._id}`} className={`${path === `/myblogs/${user._id}` ? "text-pink-300" : "text-white"} hover:text-pink-300 transition duration-300`}>
                                My Blogs
                            </Link>
                            <Link to={`/profile/${user._id}`} className="flex items-center space-x-1 group">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="group-hover:text-pink-300 transition duration-300">
                                    {user.username}
                                </span>
                            </Link>
                            <button 
                                onClick={logout}
                                className="text-white hover:text-red-300 transition duration-300"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full transition duration-300">
                            Register
                        </Link>
                    )}
                </div>
                
                <div onClick={showMenu} className="md:hidden text-lg text-white hover:text-pink-300 transition duration-300">
                    <p className="cursor-pointer relative"><FaBars /></p>
                    {menu && <Menu />}
                </div>

                <button 
                    onClick={() => setShowShortcuts(!showShortcuts)}
                    className="ml-3 text-gray-600 hover:text-purple-600"
                    aria-label="Keyboard shortcuts"
                >
                    <FaKeyboard size={20} />
                </button>
            </div>

            {showShortcuts && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 w-80">
                    <h3 className="font-bold mb-2 border-b pb-1">Keyboard Shortcuts</h3>
                    <ul className="space-y-2">
                        <li className="flex justify-between">
                            <span className="text-gray-600">Go to Home</span>
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + H</kbd>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-600">Create New Post</span>
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + W</kbd>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-600">Go Back</span>
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + B</kbd>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
