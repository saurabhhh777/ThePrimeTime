import React, { useState, useEffect } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { instance } from "../../lib/axios";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Eye,
  Clock,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  readTime?: number;
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please sign in to view blogs");
        setLoading(false);
        return;
      }

      const response = await instance.get("/api/v1/blogs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs");
      // For demo purposes, create some mock blogs
      setBlogs([
        {
          id: '1',
          title: 'Getting Started with VS Code Extensions',
          content: 'Learn how to create your first VS Code extension and understand the basics of extension development. This guide will walk you through the process step by step.',
          author: 'ThePrimeTime Team',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          readTime: 5
        },
        {
          id: '2',
          title: 'Productivity Tips for Developers',
          content: 'Discover the best practices and tools that can significantly improve your coding productivity. From keyboard shortcuts to automation tools.',
          author: 'ThePrimeTime Team',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          readTime: 8
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async () => {
    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        toast.error('Please fill in both title and content');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await instance.post("/api/v1/blogs", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBlogs([response.data.data, ...blogs]);
      setShowCreateModal(false);
      setFormData({ title: '', content: '' });
      toast.success('Blog created successfully!');
    } catch (error: any) {
      console.error("Error creating blog:", error);
      toast.error('Failed to create blog');
    }
  };

  const updateBlog = async () => {
    try {
      if (!editingBlog || !formData.title.trim() || !formData.content.trim()) {
        toast.error('Please fill in both title and content');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await instance.put(`/api/v1/blogs/${editingBlog.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBlogs(blogs.map(blog => 
        blog.id === editingBlog.id ? response.data.data : blog
      ));
      setEditingBlog(null);
      setFormData({ title: '', content: '' });
      toast.success('Blog updated successfully!');
    } catch (error: any) {
      console.error("Error updating blog:", error);
      toast.error('Failed to update blog');
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await instance.delete(`/api/v1/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      toast.success('Blog deleted successfully!');
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      toast.error('Failed to delete blog');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center font-['Poppins']">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading blog posts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center font-['Poppins']">
        <div className="text-white text-xl text-center">
          <div className="mb-4">{error}</div>
          <button 
            onClick={() => window.location.href = '/signin'} 
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-['Poppins']">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Blog Posts</h1>
              <p className="text-gray-300 text-lg">Share your knowledge and insights with the community</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white text-white backdrop-blur-sm placeholder-gray-400"
                />
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                New Blog
              </button>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white line-clamp-2">{blog.title}</h3>
                      <p className="text-gray-400 text-sm">{formatDate(blog.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingBlog(blog);
                        setFormData({ title: blog.title, content: blog.content });
                      }}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={() => deleteBlog(blog.id)}
                      className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-3">
                  {blog.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{blog.readTime || calculateReadTime(blog.content)} min read</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors">
                    <Eye className="h-4 w-4" />
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {searchTerm ? 'No blogs found' : 'No blogs yet'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Create your first blog post to share your knowledge with the community'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
                  >
                    Create Your First Blog
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Blog Modal */}
      {(showCreateModal || editingBlog) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  placeholder="Write your blog content here..."
                  rows={8}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingBlog(null);
                  setFormData({ title: '', content: '' });
                }}
                className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingBlog ? updateBlog : createBlog}
                disabled={!formData.title.trim() || !formData.content.trim()}
                className="flex-1 bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingBlog ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
