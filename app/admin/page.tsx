'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentTextIcon, 
  TagIcon, 
  ChatBubbleLeftIcon, 
  UserGroupIcon, 
  EnvelopeIcon,
  EyeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { ArrowTrendingUpIcon as TrendingUpIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import EmailNotificationsDashboard from '@/components/EmailNotificationsDashboard'

interface DashboardStats {
  posts: { total: number; published: number; drafts: number }
  categories: number
  comments: { total: number; pending: number }
  users: { total: number; admins: number }
  contacts: { total: number; unread: number }
}

interface RecentActivity {
  id: string
  type: 'post' | 'comment' | 'contact' | 'user'
  title: string
  description: string
  time: string
  status?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const [postsRes, categoriesRes, commentsRes, usersRes, contactsRes] = await Promise.all([
        fetch('/api/blog?limit=1000&all=true'), // Get all posts for admin
        fetch('/api/categories'),
        fetch('/api/comments'),
        fetch('/api/users'),
        fetch('/api/contacts')
      ])

      // Check if all responses are OK
      if (!postsRes.ok || !categoriesRes.ok || !commentsRes.ok || !usersRes.ok || !contactsRes.ok) {
        throw new Error('One or more API calls failed')
      }

      const [postsData, categories, comments, users, contacts] = await Promise.all([
        postsRes.json(),
        categoriesRes.json(),
        commentsRes.json(),
        usersRes.json(),
        contactsRes.json()
      ])

      const posts = postsData.posts || postsData // Handle both array and object response

      // Calculate stats with fallbacks
      const dashboardStats: DashboardStats = {
        posts: {
          total: Array.isArray(posts) ? posts.length : 0,
          published: Array.isArray(posts) ? posts.filter((p: any) => p.published).length : 0,
          drafts: Array.isArray(posts) ? posts.filter((p: any) => !p.published).length : 0
        },
        categories: Array.isArray(categories) ? categories.length : 0,
        comments: {
          total: Array.isArray(comments) ? comments.length : 0,
          pending: Array.isArray(comments) ? comments.filter((c: any) => !c.approved).length : 0
        },
        users: {
          total: Array.isArray(users) ? users.length : 0,
          admins: Array.isArray(users) ? users.filter((u: any) => u.role === 'ADMIN').length : 0
        },
        contacts: {
          total: Array.isArray(contacts) ? contacts.length : 0,
          unread: Array.isArray(contacts) ? contacts.filter((c: any) => c.status === 'NEW').length : 0
        }
      }

      setStats(dashboardStats)

      // Create recent activity from the data with safety checks
      const activity: RecentActivity[] = [
        ...(Array.isArray(posts) ? posts.slice(0, 3).map((post: any) => ({
          id: post.id,
          type: 'post' as const,
          title: post.title || 'Untitled Post',
          description: `Blog post ${post.published ? 'published' : 'drafted'}`,
          time: new Date(post.createdAt).toLocaleDateString(),
          status: post.published ? 'published' : 'draft'
        })) : []),
        ...(Array.isArray(comments) ? comments.slice(0, 2).map((comment: any) => ({
          id: comment.id,
          type: 'comment' as const,
          title: `Comment on "${comment.post?.title || 'Unknown Post'}"`,
          description: (comment.content || '').substring(0, 60) + '...',
          time: new Date(comment.createdAt).toLocaleDateString(),
          status: comment.approved ? 'approved' : 'pending'
        })) : []),
        ...(Array.isArray(contacts) ? contacts.slice(0, 2).map((contact: any) => ({
          id: contact.id,
          type: 'contact' as const,
          title: `Message from ${contact.name || 'Unknown'}`,
          description: (contact.message || '').substring(0, 60) + '...',
          time: new Date(contact.createdAt).toLocaleDateString(),
          status: contact.status || 'NEW'
        })) : [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)

      setRecentActivity(activity)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set fallback stats
      setStats({
        posts: { total: 0, published: 0, drafts: 0 },
        categories: 0,
        comments: { total: 0, pending: 0 },
        users: { total: 0, admins: 0 },
        contacts: { total: 0, unread: 0 }
      })
      setRecentActivity([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1272d]"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Blog Posts',
      value: stats?.posts.total || 0,
      subtitle: `${stats?.posts.published || 0} published, ${stats?.posts.drafts || 0} drafts`,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/posts'
    },
    {
      title: 'Categories',
      value: stats?.categories || 0,
      subtitle: 'Content categories',
      icon: TagIcon,
      color: 'from-green-500 to-green-600',
      href: '/admin/categories'
    },
    {
      title: 'Comments',
      value: stats?.comments.total || 0,
      subtitle: `${stats?.comments.pending || 0} pending approval`,
      icon: ChatBubbleLeftIcon,
      color: 'from-yellow-500 to-yellow-600',
      href: '/admin/comments'
    },
    {
      title: 'Users',
      value: stats?.users.total || 0,
      subtitle: `${stats?.users.admins || 0} administrators`,
      icon: UserGroupIcon,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/users'
    },
    {
      title: 'Contacts',
      value: stats?.contacts.total || 0,
      subtitle: `${stats?.contacts.unread || 0} unread messages`,
      icon: EnvelopeIcon,
      color: 'from-red-500 to-red-600',
      href: '/admin/contacts'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return DocumentTextIcon
      case 'comment': return ChatBubbleLeftIcon
      case 'contact': return EnvelopeIcon
      case 'user': return UserGroupIcon
      default: return CalendarDaysIcon
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'unread': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        className="bg-gradient-to-r from-[#c1272d] to-red-600 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to AETech Admin</h1>
            <p className="text-red-100">Manage your website content and monitor activity</p>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <TrendingUpIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={card.href}>
              <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <EyeIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity, index) => {
            const Icon = getActivityIcon(activity.type)
            return (
              <motion.div
                key={activity.id}
                className="p-6 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {activity.status && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    )}
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              href="/admin/posts/new"
              className="flex items-center p-3 bg-[#c1272d] text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <DocumentTextIcon className="h-5 w-5 mr-3" />
              Create New Post
            </Link>
            <Link 
              href="/admin/categories"
              className="flex items-center p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <TagIcon className="h-5 w-5 mr-3" />
              Manage Categories
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Database</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Authentication</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Email Notifications Dashboard */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <EmailNotificationsDashboard />
      </motion.div>
    </div>
  )
}
