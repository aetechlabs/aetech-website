'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import LikeButton from '@/components/LikeButton';
import BlogHeader from '../components/BlogHeader';
import { 
  MagnifyingGlassIcon, 
  ChatBubbleLeftIcon,
  HeartIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  readingTime?: number;
  views: number;
  likes: number;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  _count: {
    comments: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  _count: {
    posts: number;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory, searchQuery, page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
      });
      
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();
      
      setPosts(data.posts);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-black dark:via-gray-900 dark:to-red-950">
      {/* Blog Header Navigation */}
      <BlogHeader currentPage="blog" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/opened-editor-with-codes-written.jpg"
            alt="Code editor with programming code"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-red-900/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Tech Insights
              </span>
              <br />
              <span className="text-white">& Innovation</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover cutting-edge technology trends, expert tutorials, and thought-provoking insights 
              that shape the future of digital innovation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 w-full max-w-2xl">
                <form onSubmit={handleSearch} className="flex">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search articles, topics, or technologies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Search
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Categories Filter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Explore by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCategory('');
                setPage(1);
              }}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg ${
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-xl border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="flex items-center space-x-2">
                <TagIcon className="w-4 h-4" />
                <span>All Posts</span>
              </span>
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(category.slug);
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg border ${
                  selectedCategory === category.slug
                    ? 'text-white transform scale-105 border-transparent'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-xl border-gray-200 dark:border-gray-700'
                }`}
                style={{
                  background: selectedCategory === category.slug 
                    ? `linear-gradient(135deg, ${category.color}, ${category.color}dd)` 
                    : undefined
                }}
              >
                <span className="flex items-center space-x-2">
                  <span>{category.name}</span>
                  <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
                    {category._count.posts}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl h-96 overflow-hidden shadow-xl"
              >
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center">
                          <span className="text-white text-3xl font-bold">AETech</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium backdrop-blur-sm"
                        style={{ backgroundColor: `${post.category.color}cc` }}
                      >
                        {post.category.name}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      {/* Author & Meta Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {post.author.image ? (
                            <Image
                              src={post.author.image}
                              alt={post.author.name}
                              width={32}
                              height={32}
                              className="rounded-full border-2 border-gray-200 dark:border-gray-700"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {post.author.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {post.author.name}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{formatDate(post.publishedAt)}</span>
                              {post.readingTime && (
                                <>
                                  <span>•</span>
                                  <ClockIcon className="w-3 h-3" />
                                  <span>{post.readingTime} min</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-200" />
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <EyeIcon className="w-4 h-4" />
                            <span>{post.views}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ChatBubbleLeftIcon className="w-4 h-4" />
                            <span>{post._count.comments}</span>
                          </span>
                        </div>
                        <span className="flex items-center space-x-1">
                          <HeartIcon className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Like Button */}
                  <div className="px-6 pb-6">
                    <LikeButton 
                      slug={post.slug} 
                      initialLikes={post.likes}
                      size="sm"
                      className="w-full justify-center bg-gray-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-center mt-16"
              >
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-medium"
                  >
                    Previous
                  </motion.button>
                  {[...Array(totalPages)].map((_, i) => (
                    <motion.button
                      key={i + 1}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                        page === i + 1
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                    >
                      {i + 1}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-medium"
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Blog Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-black to-red-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Image
                  src="/assets/Light transparent logo.png"
                  alt="AETech Research Labs Limited"
                  width={150}
                  height={48}
                  className="h-12 w-auto"
                />
                <div>
                  <span className="text-2xl font-bold">AETech Blog</span>
                  <p className="text-red-400 text-sm">Technology Insights & Innovation</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Stay ahead of the curve with expert insights, cutting-edge tutorials, and the latest trends 
                in technology, AI, and software development.
              </p>
              <div className="flex space-x-4">
                <Link href="/contact" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-medium transition-colors">
                  Get in Touch
                </Link>
                <Link href="/about" className="border border-gray-600 hover:border-red-500 px-6 py-3 rounded-xl font-medium transition-colors">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-300 hover:text-red-400 transition-colors">Home</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-red-400 transition-colors">All Posts</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-red-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-red-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Categories</h3>
              <ul className="space-y-3">
                {categories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category.slug);
                        setPage(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-gray-300 hover:text-red-400 transition-colors text-left"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 AETech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
