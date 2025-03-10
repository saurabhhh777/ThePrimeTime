import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e9ecda] to-[#c9ccba] flex items-center justify-center">
      <div className="bg-black bg-opacity-90 p-12 rounded-xl shadow-2xl text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-red-800 to-red-600 px-8 py-3 rounded-lg text-white font-semibold 
                   hover:from-red-700 hover:to-red-500 transition-all duration-300 transform hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Go Back Home
        </button>
      </div>
    </div>
  )
}

export default ErrorPage