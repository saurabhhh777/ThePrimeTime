import React, { useState, useEffect } from 'react';
import { userAuthStore } from '../../store/userAuthStore';

type BlogPost = {
  id: number;
  title: string;
  content: string;
};

const Blog: React.FC = () => {
  const { getAllBlogs, createBlog } = userAuthStore();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch blogs when the component mounts
  useEffect(() => {
    const fetchedBlogs = getAllBlogs();
    if (Array.isArray(fetchedBlogs)) {
      setBlogs(fetchedBlogs);
    } else {
      console.warn('getAllBlogs did not return an array:', fetchedBlogs);
    }
  }, []);

  // Handle form submission to create a new blog
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert('Please fill in both title and content.');
      return;
    }

    const newBlog: BlogPost = {
      id: Date.now(),
      title,
      content,
    };

    createBlog(title, content); // Save to the store

    setBlogs((prev) => [newBlog, ...prev]); // Update state
    setTitle('');
    setContent('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

      {/* Create Blog Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter blog title"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={5}
              placeholder="Write your blog content here..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Blog
          </button>
        </form>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-700 mt-2">{blog.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No blogs available.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
