import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the URL starts with @ (username pattern)
    const pathname = location.pathname;
    console.log('ErrorPage - Checking pathname:', pathname);
    
    if (pathname.startsWith('/@')) {
      const username = pathname.substring(2); // Remove /@
      console.log('ErrorPage - Detected username:', username);
      
      if (username && username.length > 0) {
        // Redirect to profile with username parameter
        console.log('ErrorPage - Redirecting to profile with username:', username);
        navigate(`/profile/${username}`, { replace: true });
        return;
      }
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-black font-['Poppins'] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-red-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full">
          {/* Error Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full border border-red-500/30 mb-6">
              <AlertTriangle className="w-16 h-16 text-red-400" />
            </div>
          </div>

          {/* Error Code */}
          <div className="text-center mb-6">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
              The page you're looking for seems to have wandered off into the digital void. 
              Don't worry, we'll help you find your way back!
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Current path: {location.pathname}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-black font-semibold rounded-xl hover:from-gray-100 hover:to-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              <Home className="w-5 h-5 group-hover:animate-bounce" />
              Go Home
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border border-gray-600"
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              Go Back
            </button>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Dashboard', path: '/dashboard', icon: '📊' },
                { name: 'Projects', path: '/projects', icon: '💻' },
                { name: 'Reports', path: '/reports', icon: '📈' },
                { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
                { name: 'Blog', path: '/blog', icon: '📝' },
                { name: 'Settings', path: '/settings', icon: '⚙️' },
                { name: 'FAQ', path: '/faq', icon: '❓' },
                { name: 'API Docs', path: '/api-docs', icon: '📚' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="group flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 border border-white/10 hover:border-white/20"
                >
                  <span className="text-2xl group-hover:animate-bounce">{item.icon}</span>
                  <span className="text-sm text-gray-300 group-hover:text-white font-medium">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <Search className="w-4 h-4" />
              <span>Can't find what you're looking for? Try searching or check our navigation above.</span>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors duration-300 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-red-500/30 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-blue-500/30 rounded-full animate-bounce delay-300"></div>
      <div className="absolute bottom-40 left-32 w-2 h-2 bg-purple-500/30 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-20 right-32 w-5 h-5 bg-green-500/30 rounded-full animate-bounce delay-500"></div>
    </div>
  );
};

export default ErrorPage;