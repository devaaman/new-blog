import axios from "axios"
import { BiEdit } from "react-icons/bi"
import { MdDelete } from "react-icons/md"
import { URL } from "../url"
import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { toast } from 'react-toastify';

const Comment = ({c, post}) => {
  const {user} = useContext(UserContext)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  
  const deleteComment = async(id) => {
    if (confirmDelete) {
      setDeleteLoading(true)
      try {
        await axios.delete(URL+"/api/comments/"+id)
        window.location.reload(true)
        toast.success("Comment deleted successfully");
      }
      catch(err) {
        console.log(err)
        toast.error("Failed to delete comment");
      } finally {
        setDeleteLoading(false)
      }
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000) // Reset after 3 seconds
    }
  }
  
  return (
    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg my-2 shadow-sm hover:shadow-md transition duration-300">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">@{c.author}</h3>
        <div className="flex justify-center items-center space-x-4">
          <p className="text-gray-500 text-sm">{new Date(c.updatedAt).toString().slice(0,15)}</p>
          <p className="text-gray-500 text-sm">{new Date(c.updatedAt).toString().slice(16,24)}</p>
          {user?._id === c?.userId ? (
            <div className="flex items-center justify-center space-x-2">
              <button 
                className={`cursor-pointer flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                  confirmDelete 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                } transition duration-300`}
                onClick={() => deleteComment(c._id)}
                disabled={deleteLoading}
              >
                <MdDelete className={confirmDelete ? 'animate-pulse' : ''} />
                {confirmDelete ? 'Confirm' : ''}
                {deleteLoading && <span className="ml-1">...</span>}
              </button>
            </div>
          ) : ""}
        </div>
      </div>
      <p className="px-4 mt-2 text-gray-700">{c.comment}</p>
    </div>
  )
}

export default Comment