'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSession } from 'next-auth/react';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
  readingTime?: number;
  views: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  author: {
    id: string;
    name: string;
    image?: string;
    bio?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    image?: string;
  } | null;
  anonymousName?: string;
  anonymousEmail?: string;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession()
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  
  // Comment form state
  const [commentContent, setCommentContent] = useState('');
  const [anonymousName, setAnonymousName] = useState('');
  const [anonymousEmail, setAnonymousEmail] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentMessage, setCommentMessage] = useState('');

  useEffect(() => {
    fetchPost();
  }, [params.slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched post data:', data);
        console.log('Comments in post:', data.comments);
        setPost(data);
        
        // Fetch related posts
        fetchRelatedPosts(data.category.slug, data.id);
      } else {
        console.error('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (categorySlug: string, currentPostId: string) => {
    try {
      const response = await fetch(`/api/blog?category=${categorySlug}&limit=3`);
      const data = await response.json();
      const filtered = data.posts.filter((p: any) => p.id !== currentPostId);
      setRelatedPosts(filtered.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || '');
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      setCommentMessage('Please enter a comment');
      return;
    }

    if (!session && (!anonymousName.trim() || !anonymousEmail.trim())) {
      setCommentMessage('Please enter your name and email');
      return;
    }

    setIsSubmittingComment(true);
    setCommentMessage('');

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post?.id,
          content: commentContent.trim(),
          authorName: !session ? anonymousName.trim() : undefined,
          authorEmail: !session ? anonymousEmail.trim() : undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCommentMessage(result.message);
        setCommentContent('');
        setAnonymousName('');
        setAnonymousEmail('');
        
        // Refresh the post to get updated comments (if approved immediately)
        if (!result.requiresApproval) {
          fetchPost();
        }
      } else {
        setCommentMessage(result.error || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setCommentMessage('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-8 w-2/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="text-red-600 hover:text-red-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/blog"
              className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <div className="mb-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-4"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-3">
                  {post.author.image && (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {post.author.name}
                    </p>
                    {post.author.bio && (
                      <p className="text-sm">{post.author.bio}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <span>{formatDate(post.publishedAt)}</span>
                  {post.readingTime && (
                    <span>{post.readingTime} min read</span>
                  )}
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium">Share:</span>
              <button
                onClick={() => sharePost('twitter')}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                Twitter
              </button>
              <button
                onClick={() => sharePost('linkedin')}
                className="text-blue-700 hover:text-blue-800 transition-colors"
              >
                LinkedIn
              </button>
              <button
                onClick={() => sharePost('facebook')}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Facebook
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none dark:prose-invert prose-red prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300"
        >
          <ReactMarkdown
            components={{
              code({className, children, ...props}: any) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    style={tomorrow as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.article>

        {/* Tags */}
        {post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-2xl font-bold mb-8">Comments ({post.comments.length})</h3>
          
          {post.comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium">No comments yet</p>
                <p className="text-sm">Be the first to share your thoughts!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  {/* Comment Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-medium">
                      {comment.author?.image ? (
                        <Image
                          src={comment.author.image}
                          alt={comment.author.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        (comment.author?.name || comment.anonymousName || 'Anonymous').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {comment.author?.name || comment.anonymousName || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="ml-13 mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Leave a Comment</h4>
            
            {session ? (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">
                  ✅ Signed in as <strong>{session.user?.name}</strong>. Your comment will be posted immediately.
                </p>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  💡 Anonymous comments require approval before being displayed.
                </p>
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              {!session && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={anonymousName}
                      onChange={(e) => setAnonymousName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={anonymousEmail}
                      onChange={(e) => setAnonymousEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Comment *
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-gray-100 resize-vertical"
                  placeholder="Share your thoughts..."
                  required
                />
              </div>

              {commentMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  commentMessage.includes('successfully') || commentMessage.includes('submitted') 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                }`}>
                  {commentMessage}
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session ? (
                    'Your comment will be posted immediately.'
                  ) : (
                    'Anonymous comments are reviewed before being published.'
                  )}
                </p>
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSubmittingComment ? 'Submitting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {relatedPost.coverImage ? (
                      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          width={300}
                          height={200}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                        <span className="text-white font-bold">AETech</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
