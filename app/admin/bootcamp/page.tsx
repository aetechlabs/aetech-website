'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BootcampManagementPanel from '@/components/BootcampManagementPanel'
import {
  UserGroupIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  LinkIcon,
  UsersIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface BootcampEnrollment {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  age: string
  educationLevel: string
  coursesInterested: string[]
  hasLaptop: string
  experience: string
  motivation: string
  heardAbout: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED'
  createdAt: string
  updatedAt: string
}

interface EnrollmentStats {
  total: number
  PENDING: number
  APPROVED: number
  REJECTED: number
  WAITLISTED: number
}

interface ApiResponse {
  success: boolean
  data: {
    enrollments: BootcampEnrollment[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    stats: EnrollmentStats
  }
}

interface MessageTemplate {
  id: string
  name: string
  subject: string
  content: string
}

const messageTemplates: MessageTemplate[] = [
  {
    id: 'orientation',
    name: 'Orientation Meeting',
    subject: 'DevStarter Bootcamp - Orientation Meeting Today',
    content: `Hi {firstName},

Congratulations on being accepted to the DevStarter Bootcamp! 

We have an orientation meeting scheduled for today. Please join us using the details below:

📅 Date: {date}
🕒 Time: {time}
📹 Zoom Link: {zoomLink}
🆔 Meeting ID: {meetingId}
🔑 Passcode: {passcode}

Important: Please join our Discord server as soon as possible for ongoing communication and support:
🎮 Discord Invite: {discordLink}

What to expect:
• Introduction to the bootcamp structure
• Meet your instructors and fellow students
• Technical setup guidance
• Q&A session

Please ensure you have:
✓ A stable internet connection
✓ A working microphone and camera
✓ A quiet environment for the meeting

If you have any questions or cannot attend, please reply to this email immediately.

Looking forward to seeing you there!

Best regards,
AETech Team`
  },
  {
    id: 'schedule',
    name: 'Weekly Schedule',
    subject: 'DevStarter Bootcamp - Weekly Schedule',
    content: `Hi {firstName},

Here's your schedule for this week:

📅 Weekly Schedule:
{weeklySchedule}

📹 Class Links:
{classLinks}

🎮 Discord: {discordLink}

Important Notes:
• Please be punctual for all sessions
• Join our Discord for announcements and peer interaction
• Bring any questions you have to our sessions

Best regards,
AETech Team`
  },
  {
    id: 'discord',
    name: 'Discord Invitation',
    subject: 'Join Our Discord Community - DevStarter Bootcamp',
    content: `Hi {firstName},

Welcome to the DevStarter Bootcamp community!

Please join our Discord server immediately for:
• Real-time communication with instructors
• Peer collaboration and networking
• Important announcements and updates
• Technical support

🎮 Discord Invite: {discordLink}

Make sure to:
1. Set your display name as: {firstName} {lastName}
2. Read the rules in #general-rules
3. Introduce yourself in #introductions

See you there!

Best regards,
AETech Team`
  },
  {
    id: 'custom',
    name: 'Custom Message',
    subject: '',
    content: ''
  }
]

export default function BootcampManagement() {
  const [enrollments, setEnrollments] = useState<BootcampEnrollment[]>([])
  const [stats, setStats] = useState<EnrollmentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEnrollment, setSelectedEnrollment] = useState<BootcampEnrollment | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [currentEnrollmentForUpdate, setCurrentEnrollmentForUpdate] = useState<BootcampEnrollment | null>(null)
  const [statusUpdateData, setStatusUpdateData] = useState({
    enrollmentId: '',
    status: '',
    notes: '',
    selectedCourse: ''
  })
  
  // New state for view management and send documents
  const [activeTab, setActiveTab] = useState<'enrollments' | 'management' | 'messaging'>('enrollments')
  const [showSendDocumentsModal, setShowSendDocumentsModal] = useState(false)
  const [selectedEnrollmentForDocs, setSelectedEnrollmentForDocs] = useState<BootcampEnrollment | null>(null)

  // Messaging state
  const [approvedStudents, setApprovedStudents] = useState<BootcampEnrollment[]>([])
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageRecipients, setMessageRecipients] = useState<string[]>([]) // 'all' or specific IDs
  const [messageData, setMessageData] = useState({
    template: 'orientation',
    subject: '',
    content: '',
    zoomLink: '',
    meetingId: '',
    passcode: '',
    discordLink: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    weeklySchedule: '',
    classLinks: ''
  })
  const [sendingMessage, setSendingMessage] = useState(false)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchTerm, itemsPerPage])

  useEffect(() => {
    fetchEnrollments()
  }, [statusFilter, searchTerm, currentPage, itemsPerPage])

  useEffect(() => {
    if (activeTab === 'messaging') {
      fetchApprovedStudents()
    }
  }, [activeTab])

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/bootcamp?${params}`)
      const result: ApiResponse = await response.json()

      if (result.success) {
        setEnrollments(result.data.enrollments)
        setStats(result.data.stats)
        setTotalPages(result.data.pagination.totalPages)
        setTotalItems(result.data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateEnrollmentStatus = async (enrollmentId: string, newStatus: string, notes?: string, selectedCourse?: string) => {
    try {
      setUpdating(enrollmentId)
      const response = await fetch('/api/bootcamp', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentId,
          status: newStatus,
          notes,
          selectedCourse
        })
      })

      if (response.ok) {
        await fetchEnrollments()
        setSelectedEnrollment(null)
        setShowStatusModal(false)
        setStatusUpdateData({ enrollmentId: '', status: '', notes: '', selectedCourse: '' })
        setCurrentEnrollmentForUpdate(null)
      }
    } catch (error) {
      console.error('Error updating enrollment status:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleStatusUpdate = (enrollmentId: string, status: string) => {
    const enrollment = enrollments.find(e => e.id === enrollmentId)
    setCurrentEnrollmentForUpdate(enrollment || null)
    setStatusUpdateData({
      enrollmentId,
      status,
      notes: '',
      selectedCourse: enrollment?.coursesInterested[0] || '' // Default to first course
    })
    setShowStatusModal(true)
  }

  const confirmStatusUpdate = async () => {
    await updateEnrollmentStatus(
      statusUpdateData.enrollmentId, 
      statusUpdateData.status, 
      statusUpdateData.notes,
      statusUpdateData.selectedCourse
    )
  }

  const handleSendDocuments = (enrollment: BootcampEnrollment) => {
    setSelectedEnrollmentForDocs(enrollment)
    setShowSendDocumentsModal(true)
  }

  const handleDocumentsSent = () => {
    // Refresh the enrollments to update any status indicators
    fetchEnrollments()
    setShowSendDocumentsModal(false)
    setSelectedEnrollmentForDocs(null)
  }

  const fetchApprovedStudents = async () => {
    try {
      const response = await fetch('/api/bootcamp?status=APPROVED&limit=1000')
      const result: ApiResponse = await response.json()
      
      if (result.success) {
        setApprovedStudents(result.data.enrollments)
      }
    } catch (error) {
      console.error('Error fetching approved students:', error)
    }
  }

  const handleMessageStudents = (type: 'all' | 'individual', studentId?: string) => {
    if (type === 'all') {
      setMessageRecipients(['all'])
    } else if (studentId) {
      setMessageRecipients([studentId])
    }
    setShowMessageModal(true)
  }

  const handleTemplateChange = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId)
    if (template) {
      setMessageData(prev => ({
        ...prev,
        template: templateId,
        subject: template.subject,
        content: template.content
      }))
    }
  }

  const replacePlaceholders = (text: string, student: BootcampEnrollment) => {
    return text
      .replace(/{firstName}/g, student.firstName)
      .replace(/{lastName}/g, student.lastName)
      .replace(/{email}/g, student.email)
      .replace(/{date}/g, new Date(messageData.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
      .replace(/{time}/g, messageData.time)
      .replace(/{zoomLink}/g, messageData.zoomLink)
      .replace(/{meetingId}/g, messageData.meetingId)
      .replace(/{passcode}/g, messageData.passcode)
      .replace(/{discordLink}/g, messageData.discordLink)
      .replace(/{weeklySchedule}/g, messageData.weeklySchedule)
      .replace(/{classLinks}/g, messageData.classLinks)
  }

  const sendMessage = async () => {
    try {
      setSendingMessage(true)
      
      const recipients = messageRecipients.includes('all') 
        ? approvedStudents 
        : approvedStudents.filter(student => messageRecipients.includes(student.id))

      for (const student of recipients) {
        const personalizedSubject = replacePlaceholders(messageData.subject, student)
        const personalizedContent = replacePlaceholders(messageData.content, student)

        const response = await fetch('/api/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: student.email,
            subject: personalizedSubject,
            content: personalizedContent,
            studentName: `${student.firstName} ${student.lastName}`
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to send message to ${student.email}`)
        }
      }

      alert(`Message sent successfully to ${recipients.length} student(s)!`)
      setShowMessageModal(false)
      setMessageData({
        template: 'orientation',
        subject: '',
        content: '',
        zoomLink: '',
        meetingId: '',
        passcode: '',
        discordLink: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        weeklySchedule: '',
        classLinks: ''
      })
      setMessageRecipients([])
      
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'REJECTED': return <XCircleIcon className="h-5 w-5 text-red-600" />
      case 'WAITLISTED': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
      default: return <ClockIcon className="h-5 w-5 text-[#c1272d]" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200'
      case 'WAITLISTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && enrollments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1272d]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Bootcamp Enrollments</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Manage DevStarter Bootcamp applications</p>
          </div>
          <div className="hidden lg:flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <UserGroupIcon className="h-8 w-8 text-[#c1272d] dark:text-red-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'enrollments'
                ? 'bg-[#c1272d] dark:bg-red-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Enrollments</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-t sm:border-t-0 sm:border-l border-gray-200 ${
              activeTab === 'management'
                ? 'bg-[#c1272d] dark:bg-red-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Management</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('messaging')}
            className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-t sm:border-t-0 sm:border-l border-gray-200 ${
              activeTab === 'messaging'
                ? 'bg-[#c1272d] dark:bg-red-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Messaging</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'messaging' ? (
        <div className="space-y-6">
          {/* Messaging Header */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Student Messaging</h2>
                <p className="text-sm sm:text-base text-gray-600">Send messages to approved students</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#c1272d]">{approvedStudents.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Approved Students</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => handleMessageStudents('all')}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#c1272d] text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
              >
                <UsersIcon className="h-5 w-5" />
                <span>Message All Students</span>
              </button>
            </div>
          </div>

          {/* Approved Students List for Individual Messaging */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Approved Students</h3>
              <p className="text-xs sm:text-sm text-gray-500">Click on a student to send them an individual message</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {approvedStudents.map((student) => (
                <div
                  key={student.id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleMessageStudents('individual', student.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-600 to-[#c1272d] rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">{student.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2 pl-11 sm:pl-0">
                      <span className="text-xs sm:text-sm text-gray-500 flex-1 sm:flex-none">
                        {student.coursesInterested.slice(0, 1).join(', ')}
                        {student.coursesInterested.length > 1 && ` +${student.coursesInterested.length - 1} more`}
                      </span>
                      <button className="p-2 text-[#c1272d] hover:bg-red-50 rounded-lg transition-colors">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {approvedStudents.length === 0 && (
                <div className="px-4 sm:px-6 py-12 text-center">
                  <UserGroupIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Approved Students</h3>
                  <p className="text-sm sm:text-base text-gray-600">Approve some students first to start messaging them.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'management' ? (
        <BootcampManagementPanel />
      ) : (
        <>
          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          <motion.div
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600">
                <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                {itemsPerPage >= 1000 ? totalItems : enrollments.length}
                {itemsPerPage < 1000 && totalItems !== enrollments.length && (
                  <span className="text-sm text-gray-500 ml-1">/ {totalItems}</span>
                )}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {itemsPerPage >= 1000 ? 'All Applications' : 'Showing Applications'}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-red-600 to-[#c1272d]">
                <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900">{stats.PENDING}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Pending Review</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900">{stats.APPROVED}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Approved</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900">{stats.WAITLISTED}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Waitlisted</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900">{stats.REJECTED}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Rejected</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col space-y-4 sm:space-y-0 md:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent min-w-0 flex-1 sm:flex-none"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="WAITLISTED">Waitlisted</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value))
                  setCurrentPage(1)
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent min-w-0"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
                <option value={1000}>Show All</option>
              </select>
            </div>
          </div>

          <div className="relative w-full md:w-auto">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Enrollments - Desktop Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Courses Interested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((enrollment, index) => (
                  <motion.tr
                    key={enrollment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {enrollment.firstName} {enrollment.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Age: {enrollment.age} • {enrollment.educationLevel}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{enrollment.email}</div>
                      <div className="text-sm text-gray-500">{enrollment.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {enrollment.coursesInterested.slice(0, 2).map((course, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {course}
                          </span>
                        ))}
                        {enrollment.coursesInterested.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{enrollment.coursesInterested.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(enrollment.status)}`}>
                        {getStatusIcon(enrollment.status)}
                        {enrollment.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enrollment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedEnrollment(enrollment)}
                        className="text-[#c1272d] hover:text-red-700 mr-3"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enrollments - Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {enrollments.map((enrollment, index) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 sm:p-6 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-[#c1272d] rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {enrollment.firstName.charAt(0)}{enrollment.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {enrollment.firstName} {enrollment.lastName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Age: {enrollment.age} • {enrollment.educationLevel}
                    </p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(enrollment.status)}`}>
                  {getStatusIcon(enrollment.status)}
                  {enrollment.status}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 break-all">{enrollment.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{enrollment.phone}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Courses Interested:</p>
                  <div className="flex flex-wrap gap-1">
                    {enrollment.coursesInterested.slice(0, 3).map((course, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {course}
                      </span>
                    ))}
                    {enrollment.coursesInterested.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{enrollment.coursesInterested.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Applied {formatDate(enrollment.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => setSelectedEnrollment(enrollment)}
                    className="inline-flex items-center px-3 py-1 bg-[#c1272d] text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {enrollments.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No enrollments found</h3>
            <p className="text-gray-600">No bootcamp applications match your current filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalItems > 0 && itemsPerPage < 1000 && (
          <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center text-sm text-gray-700 mb-4 sm:mb-0">
                <span>
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{totalItems}</span> results
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {/* Show page numbers */}
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md ${
                          currentPage === pageNum
                            ? 'z-10 bg-[#c1272d] border-[#c1272d] text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show All Info */}
        {itemsPerPage >= 1000 && totalItems > 0 && (
          <div className="bg-red-50 border-t border-red-200 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center text-sm text-red-700">
                <span className="font-medium">Showing all {totalItems} applications</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enrollment Detail Modal */}
      {selectedEnrollment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEnrollment(null)}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedEnrollment.firstName} {selectedEnrollment.lastName}
                    </h2>
                    <p className="text-gray-600 mt-1">Bootcamp Application Details</p>
                  </div>
                  <button
                    onClick={() => setSelectedEnrollment(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XCircleIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status Update Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Application Status</h3>
                  <div className="flex gap-3">
                    {['PENDING', 'APPROVED', 'WAITLISTED', 'REJECTED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedEnrollment.id, status)}
                        disabled={updating === selectedEnrollment.id}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          selectedEnrollment.status === status
                            ? 'bg-[#c1272d] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        } ${updating === selectedEnrollment.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updating === selectedEnrollment.id ? 'Updating...' : status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <span className="text-sm text-gray-900">{selectedEnrollment.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Phone:</span>
                        <span className="text-sm text-gray-900">{selectedEnrollment.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Age:</span>
                        <span className="text-sm text-gray-900">{selectedEnrollment.age}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Education:</span>
                        <span className="text-sm text-gray-900">{selectedEnrollment.educationLevel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ComputerDesktopIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Laptop:</span>
                        <span className="text-sm text-gray-900">{selectedEnrollment.hasLaptop}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Application Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Applied:</span>
                        <span className="text-sm text-gray-900 ml-2">{formatDate(selectedEnrollment.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Last Updated:</span>
                        <span className="text-sm text-gray-900 ml-2">{formatDate(selectedEnrollment.updatedAt)}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">How they heard about us:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedEnrollment.heardAbout || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courses Interested */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    Courses Interested In
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEnrollment.coursesInterested.map((course, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                {selectedEnrollment.experience && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                      Previous Experience
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEnrollment.experience}</p>
                    </div>
                  </div>
                )}

                {/* Motivation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    Motivation
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEnrollment.motivation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
              setShowStatusModal(false)
              setCurrentEnrollmentForUpdate(null)
            }}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Status to {statusUpdateData.status}
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes/Comments (Optional)
                  </label>
                  <textarea
                    value={statusUpdateData.notes}
                    onChange={(e) => setStatusUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder={`Add notes for ${statusUpdateData.status.toLowerCase()} status...`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {statusUpdateData.status === 'APPROVED' && 'Include course details, start dates, or special instructions.'}
                    {statusUpdateData.status === 'REJECTED' && 'Provide constructive feedback for improvement.'}
                    {statusUpdateData.status === 'WAITLISTED' && 'Explain waitlist position and next steps.'}
                    {statusUpdateData.status === 'PENDING' && 'Add any internal notes or follow-up reminders.'}
                  </p>
                </div>

                {/* Course Selection for Approved Status */}
                {statusUpdateData.status === 'APPROVED' && currentEnrollmentForUpdate && currentEnrollmentForUpdate.coursesInterested.length > 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Course to Approve <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={statusUpdateData.selectedCourse}
                      onChange={(e) => setStatusUpdateData(prev => ({ ...prev, selectedCourse: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      {currentEnrollmentForUpdate.coursesInterested.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      This student applied for multiple courses. Select which course to approve them for.
                    </p>
                  </div>
                )}

                {/* Show selected course for single course applications */}
                {statusUpdateData.status === 'APPROVED' && currentEnrollmentForUpdate && currentEnrollmentForUpdate.coursesInterested.length === 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course to Approve
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-gray-900">{currentEnrollmentForUpdate.coursesInterested[0]}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowStatusModal(false)
                      setCurrentEnrollmentForUpdate(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusUpdate}
                    disabled={!!updating}
                    className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                      statusUpdateData.status === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' :
                      statusUpdateData.status === 'REJECTED' ? 'bg-red-600 hover:bg-red-700' :
                      statusUpdateData.status === 'WAITLISTED' ? 'bg-yellow-600 hover:bg-yellow-700' :
                      'bg-[#c1272d] hover:bg-red-700'
                    } disabled:opacity-50`}
                  >
                    {updating ? 'Updating...' : `Confirm ${statusUpdateData.status}`}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMessageModal(false)}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-xl">
                <div className="flex items-start sm:items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Send Message</h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      {messageRecipients.includes('all') 
                        ? `Sending to all ${approvedStudents.length} approved students`
                        : `Sending to ${messageRecipients.length} selected student(s)`
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-2 flex-shrink-0"
                  >
                    <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Template
                  </label>
                  <select
                    value={messageData.template}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {messageTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Fields Based on Template */}
                {messageData.template === 'orientation' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <VideoCameraIcon className="h-4 w-4 inline mr-1" />
                        Zoom Link
                      </label>
                      <input
                        type="url"
                        value={messageData.zoomLink}
                        onChange={(e) => setMessageData(prev => ({ ...prev, zoomLink: e.target.value }))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="https://zoom.us/j/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting ID
                      </label>
                      <input
                        type="text"
                        value={messageData.meetingId}
                        onChange={(e) => setMessageData(prev => ({ ...prev, meetingId: e.target.value }))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passcode
                      </label>
                      <input
                        type="text"
                        value={messageData.passcode}
                        onChange={(e) => setMessageData(prev => ({ ...prev, passcode: e.target.value }))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="123456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                        Date
                      </label>
                      <input
                        type="date"
                        value={messageData.date}
                        onChange={(e) => setMessageData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={messageData.time}
                        onChange={(e) => setMessageData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <LinkIcon className="h-4 w-4 inline mr-1" />
                        Discord Link
                      </label>
                      <input
                        type="url"
                        value={messageData.discordLink}
                        onChange={(e) => setMessageData(prev => ({ ...prev, discordLink: e.target.value }))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="https://discord.gg/..."
                      />
                    </div>
                  </div>
                )}

                {messageData.template === 'schedule' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weekly Schedule
                      </label>
                      <textarea
                        value={messageData.weeklySchedule}
                        onChange={(e) => setMessageData(prev => ({ ...prev, weeklySchedule: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Monday 10:00 AM - JavaScript Fundamentals&#10;Tuesday 10:00 AM - React Basics&#10;..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class Links
                      </label>
                      <textarea
                        value={messageData.classLinks}
                        onChange={(e) => setMessageData(prev => ({ ...prev, classLinks: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="JavaScript: https://zoom.us/j/123&#10;React: https://zoom.us/j/456&#10;..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discord Link
                      </label>
                      <input
                        type="url"
                        value={messageData.discordLink}
                        onChange={(e) => setMessageData(prev => ({ ...prev, discordLink: e.target.value }))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="https://discord.gg/..."
                      />
                    </div>
                  </div>
                )}

                {messageData.template === 'discord' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discord Link
                    </label>
                    <input
                      type="url"
                      value={messageData.discordLink}
                      onChange={(e) => setMessageData(prev => ({ ...prev, discordLink: e.target.value }))}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="https://discord.gg/..."
                    />
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={messageData.subject}
                    onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Email subject..."
                  />
                </div>

                {/* Message Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    value={messageData.content}
                    onChange={(e) => setMessageData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
                    placeholder="Your message content..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use placeholders: {'{firstName}'}, {'{lastName}'}, {'{email}'}, {'{date}'}, {'{time}'}, {'{zoomLink}'}, {'{meetingId}'}, {'{passcode}'}, {'{discordLink}'}, {'{weeklySchedule}'}, {'{classLinks}'}
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="w-full sm:w-auto px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={sendingMessage || !messageData.subject || !messageData.content}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 bg-[#c1272d] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
