'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    published: false,
    tags: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent, published: boolean) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        }),
      });

      if (response.ok) {
        const post = await response.json();
        router.push('/admin/posts');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let newText = '';
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText || placeholder}**`;
        break;
      case 'italic':
        newText = `*${selectedText || placeholder}*`;
        break;
      case 'heading':
        newText = `## ${selectedText || placeholder}`;
        break;
      case 'link':
        newText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'image':
        newText = `![${selectedText || 'alt text'}](image-url)`;
        break;
      case 'code':
        newText = `\`${selectedText || placeholder}\``;
        break;
      case 'codeblock':
        newText = `\`\`\`javascript\n${selectedText || placeholder}\n\`\`\``;
        break;
      case 'list':
        newText = `- ${selectedText || placeholder}`;
        break;
      case 'quote':
        newText = `> ${selectedText || placeholder}`;
        break;
      default:
        newText = selectedText;
    }
    
    const updatedContent = beforeText + newText + afterText;
    setFormData(prev => ({ ...prev, content: updatedContent }));
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create New Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Write and publish a new blog post
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ← Back to Posts
        </button>
      </motion.div>

      <form className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter post title..."
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="post-url-slug"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Brief description of the post..."
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="technology, web development, etc."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Content
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
          
          {/* Markdown Toolbar */}
          {!previewMode && (
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <button
                type="button"
                onClick={() => insertMarkdown('bold', 'bold text')}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('italic', 'italic text')}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('heading', 'Heading')}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="Heading"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('link')}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="Link"
              >
                🔗
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('image')}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="Image"
              >
                🖼️
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('code', 'code')}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="Inline Code"
              >
                {'</>'}
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('codeblock', 'your code here')}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="Code Block"
              >
                {'{ }'}
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('list', 'list item')}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="List"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('quote', 'quote text')}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="Quote"
              >
                "
              </button>
            </div>
          )}
          
          {previewMode ? (
            <div className="prose prose-gray dark:prose-invert max-w-none min-h-[400px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
              {formData.content ? (
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No content to preview</p>
              )}
            </div>
          ) : (
            <textarea
              id="content"
              rows={20}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
              placeholder="Write your post content in Markdown format..."
            />
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-end"
        >
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading || !formData.title.trim()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
          
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading || !formData.title.trim() || !formData.content.trim()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
