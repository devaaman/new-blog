const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-t-purple-600 border-r-transparent border-b-pink-600 border-l-transparent rounded-full animate-spin"></div>
        
        {/* Inner ring */}
        <div className="absolute inset-2 border-4 border-t-transparent border-r-pink-500 border-b-transparent border-l-purple-500 rounded-full animate-spin-slow"></div>
        
        {/* Center */}
        <div className="absolute inset-5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

export default Loader