const Footer = () => {
  return (
    <footer className="mt-20">
      <div className="py-10 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Blog Market</h3>
              <p className="text-gray-300">
                Share your thoughts and ideas with the world through our blogging platform.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-pink-300 transition">Home</a></li>
                <li><a href="/login" className="text-gray-300 hover:text-pink-300 transition">Login</a></li>
                <li><a href="/register" className="text-gray-300 hover:text-pink-300 transition">Register</a></li>
                <li><a href="/write" className="text-gray-300 hover:text-pink-300 transition">Write a Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <p className="text-gray-300 mb-2">Follow us on social media</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-pink-300 transition">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-4 bg-black">
        <p className="text-center text-white text-sm">
          All rights reserved @Blog Market 2023
        </p>
      </div>
    </footer>
  )
}

export default Footer