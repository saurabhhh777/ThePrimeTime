import { motion } from 'framer-motion';
import { ChevronDown, Star, MessageCircle, Zap, Target, TrendingUp, Code2, BarChart2, Clock, Globe, Github, Instagram, Linkedin, Twitter, Copyright } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleJoinWaitlist = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="bg-gray-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-white text-gray-900 px-3 py-1 rounded font-bold text-lg">
              PrimeTime
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="hover:text-gray-300 transition-colors">Products</a>
            <a href="#resources" className="hover:text-gray-300 transition-colors">Resources</a>
            <a href="#integrations" className="hover:text-gray-300 transition-colors">Integrations</a>
            <div className="flex items-center gap-1 hover:text-gray-300 transition-colors cursor-pointer">
              <span>More</span>
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button 
              className="px-4 py-2 hover:bg-gray-800 rounded transition-colors"
              onClick={handleLogin}
            >
              Log in
            </button>
            <button 
              className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-900 transition-colors"
              onClick={handleJoinWaitlist}
            >
              Join the waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center px-6 py-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              className="relative z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Floating Star */}
              <motion.div 
                className="absolute -top-4 -left-4 text-gray-800"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Star size={24} fill="currentColor" />
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Complete AI{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
                    Coding
                  </span>
                  <motion.div 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>{' '}
                Productivity Ecosystem
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We resolve 60-80% of your coding productivity issues via real-time tracking, analytics, and insights, 
                reducing your development time by over 50%.
              </p>

              {/* CTA Button */}
              <motion.button
                className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinWaitlist}
              >
                Join the waitlist
              </motion.button>
            </motion.div>

            {/* Right Content - Browser Window Mockup */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Browser Window */}
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300">
                {/* Browser Header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 ml-4">
                    primetime.dev
                  </div>
                </div>

                {/* Browser Content */}
                <div className="flex h-96">
                  {/* Sidebar */}
                  <div className="w-64 bg-gray-50 p-4 border-r border-gray-200">
                    <div className="mb-4">
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                        New Session
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 font-medium">Recent Projects</div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 hover:bg-gray-200 p-2 rounded cursor-pointer">
                          React Dashboard
                        </div>
                        <div className="text-xs text-gray-500 hover:bg-gray-200 p-2 rounded cursor-pointer">
                          Node.js API
                        </div>
                        <div className="text-xs text-gray-500 hover:bg-gray-200 p-2 rounded cursor-pointer">
                          Python ML Model
                        </div>
                        <div className="text-xs text-gray-500 hover:bg-gray-200 p-2 rounded cursor-pointer">
                          TypeScript Library
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Coding Session</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">Current Project: React Dashboard</span>
                          <span className="text-xs text-blue-600">2h 34m</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Active - Dashboard.tsx</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Last edit: 2 minutes ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Productivity Score</span>
                        <span className="font-semibold text-green-600">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Icons */}
              <motion.div 
                className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -top-4 -right-8 bg-white p-3 rounded-lg shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-8 -left-4 bg-white p-3 rounded-lg shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Network Diagram Section */}
      <div className="py-20 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Connected Development Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our integrated network connects all your development tools and provides real-time insights across your entire workflow.
            </p>
          </motion.div>

          {/* Network Diagram */}
          <div className="relative h-96 flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full" style={{
                backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Central Hub */}
            <motion.div 
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="grid grid-cols-2 gap-1">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full z-10">
              {/* Starting node to central hub */}
              <motion.path
                d="M 15% 50% L 42% 50%"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              />

              {/* Central hub to upper red branch */}
              <motion.path
                d="M 58% 50% Q 65% 35% 70% 25%"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              />

              {/* Upper red branch connections */}
              <motion.path
                d="M 70% 25% L 82% 15%"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 70% 25% L 82% 25%"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 70% 25% L 82% 35%"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                viewport={{ once: true }}
              />

              {/* Central hub to middle gray branch */}
              <motion.path
                d="M 58% 50% L 70% 50%"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                viewport={{ once: true }}
              />

              {/* Middle gray branch connections */}
              <motion.path
                d="M 70% 50% L 82% 45%"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 70% 50% L 82% 50%"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 70% 50% L 82% 55%"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.0 }}
                viewport={{ once: true }}
              />

              {/* Central hub to lower gray branch */}
              <motion.path
                d="M 58% 50% Q 65% 65% 70% 75%"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                viewport={{ once: true }}
              />

              {/* Lower gray branch connections */}
              <motion.path
                d="M 70% 75% L 82% 85%"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                viewport={{ once: true }}
              />

              {/* Central hub to bottom curved branch */}
              <motion.path
                d="M 58% 50% Q 45% 75% 70% 90%"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
              />

              {/* Cross connections between nodes */}
              <motion.path
                d="M 82% 15% L 82% 25%"
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="2,2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 82% 25% L 82% 35%"
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="2,2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 82% 45% L 82% 50%"
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="2,2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 82% 50% L 82% 55%"
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="2,2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                viewport={{ once: true }}
              />

              {/* Diagonal connections for more network feel */}
              <motion.path
                d="M 82% 35% L 82% 45%"
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="3,3"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 82% 55% L 82% 85%"
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="3,3"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.7 }}
                viewport={{ once: true }}
              />

              {/* Connection from central hub to bottom node */}
              <motion.path
                d="M 58% 50% L 70% 90%"
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="4,4"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.0 }}
                viewport={{ once: true }}
              />
            </svg>

            {/* Node Clusters */}
            {/* Upper Red Nodes */}
            <motion.div 
              className="absolute top-[15%] left-[82%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute top-[25%] left-[82%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              viewport={{ once: true }}
            >
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute top-[35%] left-[82%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <div className="grid grid-cols-4 gap-0.5">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Middle Gray Nodes */}
            <motion.div 
              className="absolute top-[45%] left-[82%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              viewport={{ once: true }}
            >
              <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            </motion.div>

            <motion.div 
              className="absolute top-[50%] left-[82%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              viewport={{ once: true }}
            >
              <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            </motion.div>

            <motion.div 
              className="absolute top-[55%] left-[82%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              viewport={{ once: true }}
            >
              <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            </motion.div>

            {/* Lower Gray Nodes */}
            <motion.div 
              className="absolute top-[85%] left-[82%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <div className="grid grid-cols-4 gap-0.5">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute top-[90%] left-[70%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              viewport={{ once: true }}
            >
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Small Nodes */}
            <motion.div 
              className="absolute top-[25%] left-[70%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </motion.div>

            <motion.div 
              className="absolute top-[75%] left-[70%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
            </motion.div>

            {/* Starting Node */}
            <motion.div 
              className="absolute top-[50%] left-[15%]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            </motion.div>
          </div>

          {/* Network Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { number: "1000+", label: "Active Developers", color: "red" },
              { number: "50+", label: "Integrations", color: "gray" },
              { number: "99.9%", label: "Uptime", color: "blue" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`text-4xl font-bold text-${stat.color}-600 mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose PrimeTime?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive coding analytics and productivity insights to help you become a more efficient developer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Real-time Tracking",
                description: "Monitor your coding sessions in real-time with detailed file and project analytics.",
                color: "blue"
              },
              {
                icon: BarChart2,
                title: "Advanced Analytics",
                description: "Get insights into your productivity patterns and coding habits.",
                color: "green"
              },
              {
                icon: Code2,
                title: "Language Insights",
                description: "Track time spent across different programming languages and frameworks.",
                color: "purple"
              },
              {
                icon: Target,
                title: "Goal Setting",
                description: "Set coding goals and track your progress with detailed metrics.",
                color: "orange"
              },
              {
                icon: TrendingUp,
                title: "Productivity Trends",
                description: "Analyze your productivity trends and identify improvement opportunities.",
                color: "pink"
              },
              {
                icon: Globe,
                title: "Multi-platform",
                description: "Works seamlessly across VS Code, web browsers, and other development tools.",
                color: "indigo"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 hover:bg-gray-50 transition-colors duration-300 shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <a href="https://github.com/saurabhhh777" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/saurabh-maurya-92b727245/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Linkedin size={24} />
              </a>
              <a href="https://www.instagram.com/asksaurabhhh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Instagram size={24} />
              </a>
              <a href="https://x.com/saurabhhh777" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Twitter size={24} />
              </a>
            </div>

            <div className="flex items-center text-gray-400 gap-2">
              <Copyright size={16} />
              <span>Copyright 2025 PrimeTime. All rights reserved.</span>
            </div>

            <div 
              className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              onClick={() => window.open("https://www.asksaurabh.xyz/")}
            >
              <span>Developed by</span>
              <img className='w-8 h-8 rounded-full' src="https://res.cloudinary.com/dongxnnnp/image/upload/v1739618128/urlShortner/rgwojzux26zzl2tc4rmm.webp" alt="Developer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;