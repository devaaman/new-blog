/* eslint-disable react/prop-types */
import {IF} from '../url'

const HomePosts = ({post}) => {
  const cloudinaryUrl = post.photo;
  
  return (
    <div className="w-full flex mt-8 space-x-4 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
      {/* left */}
      <div className="w-[35%] h-[200px] flex justify-center items-center overflow-hidden">
        <img 
          src={cloudinaryUrl} 
          alt="" 
          className="h-full w-full object-cover transition duration-500 hover:scale-110"
        />
      </div>
      
      {/* right */}
      <div className="flex flex-col w-[65%] p-4">
        <h1 className="text-xl font-bold md:mb-2 mb-1 md:text-2xl text-gray-800 hover:text-purple-700 transition duration-300">
          {post.title}
        </h1>
        
        <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
          <p className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-bold">@{post.username}</p>
          <div className="flex space-x-2 text-sm">
            <p>{new Date(post.updatedAt).toString().slice(0,15)}</p>
            <p>{new Date(post.updatedAt).toString().slice(16,24)}</p>
          </div>
        </div>
        
        <p className="text-sm md:text-lg text-gray-600">
          {post.desc.slice(0,200)}
          <span className="text-purple-600 font-semibold hover:text-pink-600 transition duration-300"> ...Read more</span>
        </p>
        
        {post.categories && post.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((category, index) => (
              <span 
                key={index} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePosts

