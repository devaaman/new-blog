import { Link, useLocation } from "react-router-dom"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { URL } from "../url"
import HomePosts from "../components/HomePosts"
import Loader from "../components/Loader"
import Button from "../components/Button"
import BackButton from "../components/BackButton"

const MyBlogs = () => {
    let location = useLocation()
    const [posts, setPosts] = useState([])
    const [noResults, setNoResults] = useState(false)
    const [loader, setLoader] = useState(false)
    const { user } = useContext(UserContext)
    const userId = location.pathname.split("/")[2]

    const fetchPosts = async () => {
        setLoader(true)
        try {
            const res = await axios.get(URL + "/api/posts/user/" + userId)
            setPosts(res.data)
            if (res.data.length === 0) {
                setNoResults(true)
            } else {
                setNoResults(false)
            }
            setLoader(false)
        } catch (err) {
            console.log(err)
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [userId])

    return (
        <div>
            <Navbar />
            
            <div className="px-8 md:px-[200px] py-4">
                <BackButton />
            </div>
            
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12">
                <div className="container mx-auto px-6 md:px-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">My Blog Posts</h1>
                    <p className="text-purple-200 mb-6">Manage all your blog content in one place</p>
                    <Button to="/write" variant="primary" size="large">
                        Write New Post
                    </Button>
                </div>
            </div>
            
            <div className="container mx-auto px-8 md:px-[200px] min-h-[60vh] py-8">
                {loader ? (
                    <div className="h-[40vh] flex justify-center items-center">
                        <Loader />
                    </div>
                ) : !noResults ? (
                    <>
                        <div className="flex justify-between items-center mb-6 border-b pb-2">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Your Posts ({posts.length})
                            </h2>
                            <div className="flex space-x-2">
                                <select className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition text-gray-700">
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="az">A-Z</option>
                                </select>
                            </div>
                        </div>
                        
                        {posts.map((post) => (
                            <Link key={post._id} to={user ? `/posts/post/${post?._id}` : "/login"}>
                                <HomePosts post={post} />
                            </Link>
                        ))}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[30vh]">
                        <div className="bg-purple-50 p-8 rounded-lg text-center max-w-md">
                            <h3 className="text-2xl font-bold mb-4 text-gray-700">No posts yet</h3>
                            <p className="text-gray-600 mb-6">Start writing and share your thoughts with the world!</p>
                            <Button to="/write" variant="primary">
                                Create Your First Post
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    )
}

export default MyBlogs