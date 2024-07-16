import axios from "axios"
import Footer from "../components/Footer"
import HomePosts from "../components/HomePosts"
import Navbar from "../components/Navbar"
import { IF, URL } from "../url"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Loader from '../components/Loader'
import { UserContext } from "../context/UserContext"
 

const Home = () => {
  
  // const {search}=useLocation()
  let location = useLocation();
  // console.log(search)
  const [posts,setPosts]=useState([])
  const [noResults,setNoResults]=useState(false)
  const [loader,setLoader]=useState(false)
  const {user}=useContext(UserContext)
  let searchKey = location.state?.search || null;
  // console.log(user)
  const fetchPosts=async()=>{
    setLoader(true)
    try{
      let res;
      console.log("location.state?.search",location.state?.search);
      if(location.state?.search == null){
        res = await axios.get(URL+"/api/posts/")
      }else{
        res = await axios.get(URL+"/api/posts?search="+location.state?.search)
        location.state.search = null;
      }
      setPosts(res.data)
      if(res.data.length===0){
        setNoResults(true)
      }
      else{
        setNoResults(false)
      }
      setLoader(false)
    }
    catch(err){
      console.log(err)
      setLoader(true)
    }
  }

  useEffect(()=>{
    fetchPosts()
  },[location])



  return (
    
    <>
    <Navbar/>
<div className="px-8 md:px-[200px] min-h-[80vh]">
        {loader?<div className="h-[40vh] flex justify-center items-center"><Loader/></div>:!noResults?
        posts.map((post)=>(
          <>
          <Link to={user?`/posts/post/${post?._id}`:"/login"}>
          <HomePosts key={post._id} post={post}/>
          </Link>
          </>
        )):<h3 className="text-center font-bold mt-16">No posts available..</h3>}
    </div>
    <Footer/>
    </>
    
  )
}

export default Home