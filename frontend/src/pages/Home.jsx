import axios from "axios"
import Footer from "../components/Footer"
import HomePosts from "../components/HomePosts"
import Navbar from "../components/Navbar"
import { URL } from "../url"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Loader from '../components/Loader'
import { UserContext } from "../context/UserContext"
import { toast } from 'react-toastify';
 
const Home = () => {
  let location = useLocation();
  const [posts, setPosts] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [loader, setLoader] = useState(false)
  const {user} = useContext(UserContext)
  let searchKey = location.state?.search || null;
  
  const fetchPosts = async() => {
    setLoader(true)
    try {
      let res;
      if(location.state?.search == null) {
        res = await axios.get(URL+"/api/posts/")
      } else {
        res = await axios.get(URL+"/api/posts?search="+location.state?.search)
        location.state.search = null;
      }
      setPosts(res.data)
      if(res.data.length === 0) {
        setNoResults(true)
      } else {
        setNoResults(false)
      }
      setLoader(false)
    } catch(err) {
      console.log(err)
      setLoader(false)
      toast.error("Failed to load posts. Please try again.");
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [location])

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      {!location.state?.search && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-16">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Share Your Ideas With The World
              </h1>
              <p className="text-lg md:text-xl mb-6 text-purple-200">
                Discover stories, thinking, and expertise from writers on any topic.
              </p>
              {user ? (
                <Link 
                  to="/write" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transition duration-300 font-bold text-lg inline-block"
                >
                  Start Writing
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transition duration-300 font-bold text-lg inline-block"
                >
                  Get Started
                </Link>
              )}
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2340&auto=format&fit=crop" 
                alt="Blog writing" 
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Search Results Title */}
      {location.state?.search && (
        <div className="bg-gray-100 py-6">
          <div className="container mx-auto px-8 md:px-[200px]">
            <h2 className="text-2xl font-bold text-gray-800">
              Search results for: <span className="text-purple-600">"{location.state.search}"</span>
            </h2>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-8 md:px-[200px] min-h-[50vh] py-8">
        {loader ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : !noResults ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
              {location.state?.search ? "Search Results" : "Latest Articles"}
            </h2>
            {posts.map((post) => (
              <Link key={post._id} to={user ? `/posts/post/${post?._id}` : "/login"}>
                <HomePosts post={post} />
              </Link>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[30vh]">
            <h3 className="text-2xl font-bold mt-16 text-gray-600">No posts available</h3>
            <p className="text-gray-500 mt-2">Try a different search or check back later!</p>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  )
}

export default Home