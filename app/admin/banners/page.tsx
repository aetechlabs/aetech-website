'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  MegaphoneIcon,
  AcademicCapIcon,
  ClockIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

interface Banner {
  id: string
  type: 'TOP_ANNOUNCEMENT' | 'BOOTCAMP' | 'URGENCY' | 'GENERAL'
  title: string
  message: string
  isActive: boolean
  priority: number
  startDate: string | null
  endDate: string | null
  backgroundColor: string
  textColor: string
  linkUrl: string | null
  linkText: string | null
  showCountdown: boolean
  countdownDeadline: string | null
  createdAt: string
  updatedAt: string
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    type: 'GENERAL' as Banner['type'],
    title: '',
    message: '',
    isActive: true,
    priority: 1,
    startDate: '',
    endDate: '',
    backgroundColor: '#c1272d',
    textColor: '#ffffff',
    linkUrl: '',
    linkText: '',
    showCountdown: false,
    countdownDeadline: ''
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners')
      const result = await response.json()
      if (result.success) {
        setBanners(result.data)
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingBanner ? '/api/banners' : '/api/banners'
      const method = editingBanner ? 'PATCH' : 'POST'
      
      const payload = {
        ...formData,
        ...(editingBanner && { id: editingBanner.id }),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        linkUrl: formData.linkUrl || null,
        linkText: formData.linkText || null,
        countdownDeadline: formData.countdownDeadline || null
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (result.success) {
        fetchBanners()
        handleCloseModal()
      }
    } catch (error) {
      console.error('Error saving banner:', error)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      type: banner.type,
      title: banner.title,
      message: banner.message,
      isActive: banner.isActive,
      priority: banner.priority,
      startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
      endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
      backgroundColor: banner.backgroundColor,
      textColor: banner.textColor,
      linkUrl: banner.linkUrl || '',
      linkText: banner.linkText || '',
      showCountdown: banner.showCountdown,
      countdownDeadline: banner.countdownDeadline ? banner.countdownDeadline.split('T')[0] : ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    try {
      const response = await fetch(`/api/banners?id=${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
    }
  }

  const toggleActive = async (banner: Banner) => {
    try {
      const response = await fetch('/api/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: banner.id,
          isActive: !banner.isActive
        })
      })
      const result = await response.json()
      if (result.success) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Error toggling banner status:', error)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingBanner(null)
    setFormData({
      type: 'GENERAL',
      title: '',
      message: '',
      isActive: true,
      priority: 1,
      startDate: '',
      endDate: '',
      backgroundColor: '#c1272d',
      textColor: '#ffffff',
      linkUrl: '',
      linkText: '',
      showCountdown: false,
      countdownDeadline: ''
    })
  }

  const getBannerIcon = (type: Banner['type']) => {
    switch (type) {
      case 'TOP_ANNOUNCEMENT':
        return <MegaphoneIcon className="h-5 w-5" />
      case 'BOOTCAMP':
        return <AcademicCapIcon className="h-5 w-5" />
      case 'URGENCY':
        return <ClockIcon className="h-5 w-5" />
      default:
        return <GlobeAltIcon className="h-5 w-5" />
    }
  }

  const getBannerTypeLabel = (type: Banner['type']) => {
    switch (type) {
      case 'TOP_ANNOUNCEMENT':
        return 'Top Announcement'
      case 'BOOTCAMP':
        return 'Bootcamp'
      case 'URGENCY':
        return 'Urgency'
      default:
        return 'General'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Banner Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage website banners and announcements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Banner
        </button>
      </div>

      {/* Banners List */}
      <div className="grid gap-4">
        {banners.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <MegaphoneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No banners found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first banner to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Banner
            </button>
          </div>
        ) : (
          banners.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {getBannerIcon(banner.type)}
                      {getBannerTypeLabel(banner.type)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Priority: {banner.priority}</span>
                      {banner.isActive ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {banner.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {banner.message}
                  </p>

                  {/* Banner Preview */}
                  <div 
                    className="p-3 rounded-lg mb-3 text-sm"
                    style={{ 
                      backgroundColor: banner.backgroundColor, 
                      color: banner.textColor 
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{banner.title}</span>
                      {banner.linkUrl && banner.linkText && (
                        <span className="inline-flex items-center gap-1 text-xs opacity-75">
                          <LinkIcon className="h-3 w-3" />
                          {banner.linkText}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs opacity-90">{banner.message}</div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {banner.startDate && (
                      <span>Start: {new Date(banner.startDate).toLocaleDateString()}</span>
                    )}
                    {banner.endDate && (
                      <span>End: {new Date(banner.endDate).toLocaleDateString()}</span>
                    )}
                    {banner.showCountdown && banner.countdownDeadline && (
                      <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="h-4 w-4" />
                        Countdown: {new Date(banner.countdownDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`p-2 rounded-lg transition-colors ${
                      banner.isActive 
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title={banner.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {banner.isActive ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Banner Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Banner['type'] })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="GENERAL">General</option>
                      <option value="TOP_ANNOUNCEMENT">Top Announcement</option>
                      <option value="BOOTCAMP">Bootcamp</option>
                      <option value="URGENCY">Urgency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                </div>

                {/* Link */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Link URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Link Text (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Learn More"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date (optional)
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date (optional)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Countdown */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showCountdown"
                      checked={formData.showCountdown}
                      onChange={(e) => setFormData({ ...formData, showCountdown: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="showCountdown" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Countdown Timer
                    </label>
                  </div>

                  {formData.showCountdown && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Countdown Deadline
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.countdownDeadline}
                        onChange={(e) => setFormData({ ...formData, countdownDeadline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active (show on website)
                  </label>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview
                  </label>
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      backgroundColor: formData.backgroundColor, 
                      color: formData.textColor 
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{formData.title || 'Banner Title'}</div>
                        <div className="text-sm opacity-90">{formData.message || 'Banner message'}</div>
                      </div>
                      {formData.linkText && (
                        <button className="px-3 py-1 bg-white/20 rounded text-sm">
                          {formData.linkText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
