import { motion } from 'framer-motion';
import { Clock, BarChart2, Code2, Globe, Github, Instagram, Linkedin, Twitter, Copyright } from 'lucide-react';

const Home = () => {
  const text = "The Prime Time".split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#273A48] overflow-x-hidden">
      {/* Hero Section */}
      <div className="h-screen flex flex-col items-center justify-center relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-[#4A5C6A]/30 to-[#273A48]/50 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="z-10 text-center">
          <motion.h1 
            className="text-7xl md:text-9xl font-bold font-anton text-white flex overflow-hidden justify-center"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {text.map((letter, index) => (
              <motion.span
                key={index}
                variants={child}
                className="inline-block hover:text-[#98A9BD] transition-colors"
                whileHover={{
                  scale: 1.2,
                  rotate: [0, 10, -10, 0],
                  transition: {
                    duration: 0.3
                  }
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          <motion.span 
            className='text-2xl md:text-3xl text-[#738496] font-bold font-jost mt-8 block'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Track Your Coding Time, Boost Your Productivity
          </motion.span>
          <motion.button
            className="mt-12 px-8 py-3 bg-[#4A5C6A] text-[#B4C4DB] font-poppins rounded-full hover:bg-[#738496] transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Install VS Code Extension
          </motion.button>
        </div>
      </div>
      <hr />

      {/* Features Section */}
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <motion.div 
          className='bg-[#98A9BD] p-12 flex items-center justify-center'
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-xl">
            <h2 className="text-4xl font-anton text-[#273A48] mb-6">Track Everything</h2>
            <div className="space-y-6 text-[#4A5C6A] font-poppins">
              <div className="flex items-center gap-4">
                <Clock size={24} />
                <p>Monitor time spent per file and project</p>
              </div>
              <div className="flex items-center gap-4">
                <Code2 size={24} />
                <p>Track usage across different programming languages</p>
              </div>
              <div className="flex items-center gap-4">
                <BarChart2 size={24} />
                <p>Daily and weekly coding analytics</p>
              </div>
              <div className="flex items-center gap-4">
                <Globe size={24} />
                <p>Website time tracking integration</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div 
          className='bg-[#273A48] p-12 flex items-center justify-center'
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-xl">
            <h2 className="text-4xl font-anton text-[#B4C4DB] mb-6">Key Features</h2>
            <div className="space-y-4 text-[#738496] font-poppins">
              <p>• Real-time tracking in VS Code</p>
              <p>• Detailed time analytics dashboard</p>
              <p>• Language-wise time distribution</p>
              <p>• Project-based time tracking</p>
              <p>• Daily productivity insights</p>
              <p>• Website usage monitoring</p>
            </div>
          </div>
        </motion.div>
      </div>
      <hr className='border-t-1'/>

      {/* Analytics Preview Section */}
      <div className='min-h-screen bg-[#4A5C6A] p-12'>
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-anton text-[#B4C4DB] mb-12 text-center">Analytics Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Time Analytics", desc: "View detailed breakdowns of your coding time across projects and files" },
              { title: "Language Stats", desc: "Track time spent in different programming languages and frameworks" },
              { title: "Productivity Insights", desc: "Get insights about your most productive coding hours and patterns" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#273A48] rounded-lg overflow-hidden shadow-lg"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-48 bg-[#738496]"></div>
                <div className="p-6">
                  <h3 className="text-xl font-jost font-bold text-[#B4C4DB] mb-2">{feature.title}</h3>
                  <p className="text-[#738496] font-poppins text-sm">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Section */}
      <footer className="bg-[#273A48] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <a href="https://github.com/saurabhhh777" target="_blank" rel="noopener noreferrer" className="text-[#B4C4DB] hover:text-[#98A9BD] transition-colors">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/saurabh-maurya-92b727245/" target="_blank" rel="noopener noreferrer" className="text-[#B4C4DB] hover:text-[#98A9BD] transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="https://www.instagram.com/asksaurabhhh/" target="_blank" rel="noopener noreferrer" className="text-[#B4C4DB] hover:text-[#98A9BD] transition-colors">
              <Instagram size={24} />
            </a>
            <a href="https://x.com/saurabhhh777" target="_blank" rel="noopener noreferrer" className="text-[#B4C4DB] hover:text-[#98A9BD] transition-colors">
              <Twitter size={24} />
            </a>
          </div>

          <div className="flex items-center text-[#B4C4DB] gap-2">
            <Copyright size={16} />
            <span>Copyright 2025 Prime Time. All rights reserved.</span>
          </div>

          <div 
            className="flex items-center gap-2 text-[#B4C4DB] cursor-pointer hover:text-[#98A9BD] transition-colors"
            onClick={() => window.open("https://www.asksaurabh.xyz/")}
          >
            <span>Developed by</span>
            <img className='w-8 h-8 rounded-full' src="https://res.cloudinary.com/dongxnnnp/image/upload/v1739618128/urlShortner/rgwojzux26zzl2tc4rmm.webp" alt="Developer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;