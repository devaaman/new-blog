import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import ProfilePosts from "../components/ProfilePosts"
import axios from "axios"
import { URL } from "../url"
import { UserContext } from "../context/UserContext"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../components/Button"
import Loader from "../components/Loader"
import BackButton from "../components/BackButton"
import { ToastContext } from "../context/ToastContext"
import { toast } from 'react-toastify';

const Profile = () => {
  const param = useParams().id;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    postCount: 0,
    commentCount: 0
  });
  const showToast = useContext(ToastContext);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(URL + "/api/users/" + param);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/user/" + param);
      setPosts(res.data);
      setStats(prev => ({
        ...prev,
        postCount: res.data.length
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCommentCount = async () => {
    try {
      // Assuming you have an API endpoint to get comment count
      const res = await axios.get(URL + "/api/comments/user/" + param + "/count");
      setStats(prev => ({
        ...prev,
        commentCount: res.data.count || 0
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
    // Uncomment when you have the API endpoint:
    // fetchCommentCount();
  }, [param]);

  const handleUserDelete = async () => {
    try {
      await axios.delete(URL + "/api/users/" + user._id);
      showToast.info("Account deleted successfully");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
      showToast.error("Failed to delete account. Please try again.");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // Your existing code for profile upload
      
      toast.success("Profile picture updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile picture. Please try again.");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="px-8 md:px-[200px] py-4">
        <BackButton />
      </div>
      <div className="min-h-[80vh] px-8 md:px-[200px] mt-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                {username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{username}</h1>
              <p className="text-gray-600">{email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.postCount}</p>
                <p className="text-gray-600">Posts</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-pink-600">{stats.commentCount}</p>
                <p className="text-gray-600">Comments</p>
              </div>
            </div>
            
            {user?._id === param && (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate("/edit-profile")}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleUserDelete}
                >
                  Delete Account
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
            Posts by {username}
          </h2>
          {posts.length > 0 ? (
            posts.map((p) => (
              <ProfilePosts key={p._id} p={p} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts yet!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile