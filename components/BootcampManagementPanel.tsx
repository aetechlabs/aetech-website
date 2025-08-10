'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XMarkIcon,
  CogIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'

interface BootcampSettings {
  id: string
  currentScheduleUrl?: string
  templateOfferLetterUrl?: string
  batchName?: string
  batchStartDate?: string
  batchEndDate?: string
  maxEnrollments?: number
  socialMediaInstructions?: string
}

interface SendDocumentsModalProps {
  isOpen: boolean
  onClose: () => void
  enrollment: any
  onDocumentsSent: () => void
}

function SendDocumentsModal({ isOpen, onClose, enrollment, onDocumentsSent }: SendDocumentsModalProps) {
  const [settings, setSettings] = useState<BootcampSettings | null>(null)
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    includeSchedule: true,
    includeOfferLetter: true,
    customMessage: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchSettings()
    }
  }, [isOpen])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/bootcamp/settings')
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSendDocuments = async () => {
    setSending(true)
    try {
      const response = await fetch('/api/bootcamp/send-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: enrollment.id,
          ...formData
        })
      })

      if (response.ok) {
        onDocumentsSent()
        onClose()
        setFormData({ includeSchedule: true, includeOfferLetter: true, customMessage: '' })
      }
    } catch (error) {
      console.error('Error sending documents:', error)
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Send Documents
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {enrollment?.firstName} {enrollment?.lastName} - {enrollment?.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Document Selection */}
          <div>
            <h4 className="font-semibold mb-4">Select Documents to Include:</h4>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.includeSchedule}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeSchedule: e.target.checked }))}
                  className="mr-3 text-red-600 focus:ring-red-500"
                />
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="font-medium">Bootcamp Schedule</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {settings?.currentScheduleUrl ? 'Available' : 'Not uploaded yet'}
                    </p>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.includeOfferLetter}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeOfferLetter: e.target.checked }))}
                  className="mr-3 text-red-600 focus:ring-red-500"
                />
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <p className="font-medium">Offer Letter</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {enrollment?.offerLetterUrl ? 'Available' : 'Not uploaded yet'}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={formData.customMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
              rows={3}
              placeholder="Add a personal message to include in the email..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800"
            />
          </div>

          {/* Social Media Instructions Preview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ShareIcon className="h-5 w-5 mr-2 text-blue-600" />
              <h5 className="font-medium text-blue-900 dark:text-blue-200">
                Social Media Instructions Included
              </h5>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Students will receive instructions to tag @aetechlabs on LinkedIn, X, Facebook, Threads, and Instagram.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              disabled={sending}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendDocuments}
              disabled={sending || (!formData.includeSchedule && !formData.includeOfferLetter)}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Send Documents
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function BootcampManagementPanel() {
  const [settings, setSettings] = useState<BootcampSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null)
  const [approvedStudents, setApprovedStudents] = useState<any[]>([])
  const [uploadingOfferFor, setUploadingOfferFor] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
    fetchApprovedStudents()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bootcamp/settings')
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApprovedStudents = async () => {
    try {
      const response = await fetch('/api/bootcamp?status=APPROVED')
      const result = await response.json()
      if (result.success) {
        setApprovedStudents(result.data.enrollments || [])
      }
    } catch (error) {
      console.error('Error fetching approved students:', error)
    }
  }

  const handleFileUpload = async (file: File, uploadType: 'schedule' | 'offerTemplate') => {
    setUploading(uploadType)
    try {
      const formData = new FormData()
      formData.append(uploadType === 'schedule' ? 'schedule' : 'offerTemplate', file)
      formData.append('action', uploadType === 'schedule' ? 'upload_schedule' : 'upload_offer_template')

      const response = await fetch('/api/bootcamp/settings', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        await fetchSettings()
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading(null)
    }
  }

  const handleOfferLetterUpload = async (file: File, enrollmentId: string) => {
    setUploadingOfferFor(enrollmentId)
    try {
      const formData = new FormData()
      formData.append('offerLetter', file)
      formData.append('enrollmentId', enrollmentId)

      const response = await fetch('/api/bootcamp/upload-offer-letter', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        await fetchApprovedStudents()
      }
    } catch (error) {
      console.error('Error uploading offer letter:', error)
    } finally {
      setUploadingOfferFor(null)
    }
  }

  const handleUpdateSettings = async (settingsData: Partial<BootcampSettings>) => {
    try {
      const formData = new FormData()
      formData.append('action', 'update_settings')
      
      Object.entries(settingsData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      const response = await fetch('/api/bootcamp/settings', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        await fetchSettings()
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bootcamp Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage schedules, offer letters, and document distribution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <CalendarDaysIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Schedule Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload and manage bootcamp timetables
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {settings?.currentScheduleUrl ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 dark:text-green-200 font-medium">
                      Schedule uploaded
                    </span>
                  </div>
                  <a
                    href={settings.currentScheduleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                  No schedule uploaded yet
                </p>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                id="schedule-upload"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file, 'schedule')
                }}
                className="hidden"
                disabled={uploading === 'schedule'}
              />
              <label
                htmlFor="schedule-upload"
                className={`cursor-pointer flex flex-col items-center ${
                  uploading === 'schedule' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-3" />
                <span className="text-gray-600 dark:text-gray-400">
                  {uploading === 'schedule' ? 'Uploading...' : 'Click to upload schedule'}
                </span>
                <span className="text-sm text-gray-500">
                  PDF, DOC, DOCX, or image files
                </span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Individual Offer Letters Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <DocumentTextIcon className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Individual Offer Letters
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload custom offer letters for approved students
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {approvedStudents.length > 0 ? (
              <div className="space-y-3">
                {approvedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.email}
                        </p>
                        {student.assignedCourse && (
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Course: {student.assignedCourse}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {student.offerLetterUrl ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            <span className="text-sm text-green-600 dark:text-green-400">
                              Uploaded
                            </span>
                            <a
                              href={student.offerLetterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            >
                              <DocumentArrowDownIcon className="h-5 w-5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-sm text-yellow-600 dark:text-yellow-400">
                            No offer letter
                          </span>
                        )}
                        
                        <div className="relative">
                          <input
                            type="file"
                            id={`offer-${student.id}`}
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleOfferLetterUpload(file, student.id)
                            }}
                            className="hidden"
                            disabled={uploadingOfferFor === student.id}
                          />
                          <label
                            htmlFor={`offer-${student.id}`}
                            className={`cursor-pointer px-3 py-1 text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors ${
                              uploadingOfferFor === student.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {uploadingOfferFor === student.id ? 'Uploading...' : 'Upload Letter'}
                          </label>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedEnrollment(student)
                            setShowSendModal(true)
                          }}
                          disabled={!student.offerLetterUrl && !settings?.currentScheduleUrl}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No approved students yet
                </p>
                <p className="text-sm text-gray-500">
                  Students will appear here once they are approved
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Batch Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <CogIcon className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Batch Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configure current batch details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Batch Name</label>
              <input
                type="text"
                defaultValue={settings?.batchName || ''}
                onBlur={(e) => handleUpdateSettings({ batchName: e.target.value })}
                placeholder="e.g., Summer 2025 Cohort"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  defaultValue={settings?.batchStartDate?.split('T')[0] || ''}
                  onBlur={(e) => handleUpdateSettings({ batchStartDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  defaultValue={settings?.batchEndDate?.split('T')[0] || ''}
                  onBlur={(e) => handleUpdateSettings({ batchEndDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Enrollments</label>
              <input
                type="number"
                defaultValue={settings?.maxEnrollments || ''}
                onBlur={(e) => handleUpdateSettings({ maxEnrollments: parseInt(e.target.value) })}
                placeholder="50"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </motion.div>

        {/* Social Media Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <ShareIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Social Media Instructions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Customize social media sharing instructions
              </p>
            </div>
          </div>

          <div>
            <textarea
              rows={8}
              defaultValue={settings?.socialMediaInstructions || ''}
              onBlur={(e) => handleUpdateSettings({ socialMediaInstructions: e.target.value })}
              placeholder="Instructions for students to share on social media..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-sm"
            />
          </div>
        </motion.div>
      </div>

      {/* Send Documents Modal */}
      <SendDocumentsModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        enrollment={selectedEnrollment}
        onDocumentsSent={() => {
          // Refresh enrollment data if needed
          console.log('Documents sent successfully')
        }}
      />
    </div>
  )
}
