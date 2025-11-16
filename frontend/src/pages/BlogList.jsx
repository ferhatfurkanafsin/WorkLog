import { useState, useEffect } from 'react';
import './BlogList.css';

/**
 * BlogList Page Component
 * Displays all blog posts with search and filter capabilities
 *
 * Props:
 * - showAddButton: Show button to add new blog post (default: false)
 * - onPostClick: Callback when post is clicked
 */
function BlogList({ showAddButton = false, onPostClick = () => {} }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      setPosts(data);

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(post => post.category))].filter(Boolean);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory && post.status === 'published';
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="blog-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="blog-list-page">
      <div className="blog-list-header">
        <h1>Blog</h1>
        <p>Stay updated with our latest news, guides, and insights</p>
      </div>

      <div className="blog-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filter">
          <button
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {showAddButton && (
          <button className="add-post-btn" onClick={() => window.location.href = '/blog/new'}>
            + New Post
          </button>
        )}
      </div>

      <div className="blog-posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <p>No blog posts found.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <article
              key={post.id}
              className="blog-post-card"
              onClick={() => onPostClick(post)}
            >
              {post.featured_image && (
                <div className="post-image">
                  <img src={post.featured_image} alt={post.title} />
                </div>
              )}
              <div className="post-content">
                {post.category && (
                  <span className="post-category">{post.category}</span>
                )}
                <h2 className="post-title">{post.title}</h2>
                {post.excerpt && (
                  <p className="post-excerpt">{post.excerpt}</p>
                )}
                <div className="post-meta">
                  <span className="post-author">{post.author || 'Admin'}</span>
                  <span className="post-date">{formatDate(post.published_at || post.created_at)}</span>
                  <span className="post-views">👁 {post.views || 0} views</span>
                </div>
                <button className="read-more-btn">Read More →</button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default BlogList;
