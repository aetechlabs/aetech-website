'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
  CalendarDaysIcon,
  UsersIcon,
  LinkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface AttendanceSession {
  id: string
  title: string
  description: string
  course?: string | null
  question: string
  correctAnswer: string
  meetingDate: string
  expiresAt: string
  isActive: boolean
  emailSent: boolean
  createdAt: string
  responses?: AttendanceResponse[]
  _count?: {
    responses: number
  }
}

interface AttendanceResponse {
  id: string
  studentEmail: string
  studentName: string
  submittedAnswer: string
  isCorrect: boolean
  submittedAt: string
}

export default function AttendanceManagement() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    question: '',
    correctAnswer: '',
    meetingDate: new Date().toISOString().split('T')[0],
    meetingTime: '10:00',
    expirationHours: '24',
    sendEmails: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/attendance?includeResponses=false')
      const data = await response.json()
      
      if (data.success) {
        setSessions(data.data.sessions || data.data)
      }
    } catch (error) {
      console.error('Error fetching attendance sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/attendance?includeResponses=true&sessionId=${sessionId}`)
      const data = await response.json()
      
      if (data.success) {
        const session = data.data.sessions?.find((s: AttendanceSession) => s.id === sessionId) || data.data
        setSelectedSession(session)
        setShowDetailModal(true)
      }
    } catch (error) {
      console.error('Error fetching session details:', error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.course.trim()) newErrors.course = 'Course is required'
    if (!formData.question.trim()) newErrors.question = 'Question is required'
    if (!formData.correctAnswer.trim()) newErrors.correctAnswer = 'Answer is required'
    if (!formData.meetingDate) newErrors.meetingDate = 'Meeting date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateSession = async () => {
    if (!validateForm()) return

    try {
      setCreating(true)

      // Combine date and time
      const meetingDateTime = new Date(`${formData.meetingDate}T${formData.meetingTime}`)
      
      // Calculate expiration time
      const expiresAt = new Date(meetingDateTime)
      expiresAt.setHours(expiresAt.getHours() + parseInt(formData.expirationHours))

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          course: formData.course,
          question: formData.question,
          correctAnswer: formData.correctAnswer,
          meetingDate: meetingDateTime.toISOString(),
          expiresAt: expiresAt.toISOString(),
          sendEmail: formData.sendEmails
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message || 'Attendance session created successfully!')
        setShowCreateModal(false)
        resetForm()
        fetchSessions()
      } else {
        alert(data.message || 'Failed to create attendance session')
      }
    } catch (error) {
      console.error('Error creating attendance session:', error)
      alert('Failed to create attendance session')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course: '',
      question: '',
      correctAnswer: '',
      meetingDate: new Date().toISOString().split('T')[0],
      meetingTime: '10:00',
      expirationHours: '24',
      sendEmails: true
    })
    setErrors({})
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getSessionStatus = (session: AttendanceSession) => {
    const now = new Date()
    const expiresAt = new Date(session.expiresAt)
    
    if (!session.isActive) return { status: 'inactive', color: 'gray', text: 'Inactive' }
    if (now > expiresAt) return { status: 'expired', color: 'red', text: 'Expired' }
    return { status: 'active', color: 'green', text: 'Active' }
  }

  const copyAttendanceLink = (sessionId: string) => {
    const link = `${window.location.origin}/attendance/${sessionId}`
    navigator.clipboard.writeText(link)
    alert('Attendance link copied to clipboard!')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c1272d]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Attendance Management</h2>
            <p className="text-sm sm:text-base text-gray-600">Create and track student attendance sessions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-[#c1272d]">{sessions.length}</div>
              <div className="text-xs sm:text-sm text-gray-500">Total Sessions</div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#c1272d] text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Create Session</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Attendance Sessions</h3>
        </div>

        {sessions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Attendance Sessions</h3>
            <p className="text-gray-600 mb-4">Create your first attendance session to start tracking student participation.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#c1272d] text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Create First Session</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sessions.map((session) => {
              const status = getSessionStatus(session)
              return (
                <div key={session.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{session.title}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                          {status.text}
                        </span>
                        {session.emailSent && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Emails Sent
                          </span>
                        )}
                      </div>
                      
                      {session.description && (
                        <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <CalendarDaysIcon className="h-3 w-3" />
                          <span>Meeting: {formatDate(session.meetingDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>Expires: {formatDate(session.expiresAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UsersIcon className="h-3 w-3" />
                          <span>{session._count?.responses || 0} responses</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyAttendanceLink(session.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy attendance link"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => fetchSessionDetails(session.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Create Attendance Session</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XCircleIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Week 1 - JavaScript Fundamentals"
                    />
                    {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Brief description of the session"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course *
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select a course</option>
                      <option value="Data Science">Data Science</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Graphic Design with Canva">Graphic Design with Canva</option>
                      <option value="Creative Programming">Creative Programming</option>
                      <option value="Beginner Web Development">Beginner Web Development</option>
                    </select>
                    {errors.course && <p className="text-red-600 text-sm mt-1">{errors.course}</p>}
                  </div>
                </div>

                {/* Attendance Question */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Attendance Question</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Question *
                      </label>
                      <input
                        type="text"
                        value={formData.question}
                        onChange={(e) => handleInputChange('question', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., What was the main topic discussed today?"
                      />
                      {errors.question && <p className="text-red-600 text-sm mt-1">{errors.question}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Correct Answer *
                      </label>
                      <input
                        type="text"
                        value={formData.correctAnswer}
                        onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="The expected answer (case insensitive)"
                      />
                      {errors.correctAnswer && <p className="text-red-600 text-sm mt-1">{errors.correctAnswer}</p>}
                      <p className="text-blue-600 text-xs mt-1">
                        Answer matching is case-insensitive. Students must provide this exact answer.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Date *
                    </label>
                    <input
                      type="date"
                      value={formData.meetingDate}
                      onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {errors.meetingDate && <p className="text-red-600 text-sm mt-1">{errors.meetingDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Time
                    </label>
                    <input
                      type="time"
                      value={formData.meetingTime}
                      onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expires After (Hours)
                    </label>
                    <select
                      value={formData.expirationHours}
                      onChange={(e) => handleInputChange('expirationHours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="1">1 Hour</option>
                      <option value="2">2 Hours</option>
                      <option value="6">6 Hours</option>
                      <option value="12">12 Hours</option>
                      <option value="24">24 Hours</option>
                      <option value="48">48 Hours</option>
                    </select>
                  </div>
                </div>

                {/* Email Option */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="sendEmails"
                      checked={formData.sendEmails}
                      onChange={(e) => handleInputChange('sendEmails', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendEmails" className="text-sm font-medium text-yellow-800">
                      Send attendance emails to all approved students
                    </label>
                  </div>
                  <p className="text-yellow-700 text-xs mt-2">
                    If checked, all approved students will receive an email with the attendance question and link.
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateSession}
                    disabled={creating}
                    className="flex items-center space-x-2 px-6 py-2 bg-[#c1272d] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4" />
                        <span>Create Session</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {showDetailModal && selectedSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
            
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
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSession.title}</h2>
                    <p className="text-gray-600 mt-1">Session Details & Responses</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XCircleIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Session Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Session Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Question:</strong> {selectedSession.question}</div>
                      <div><strong>Answer:</strong> {selectedSession.correctAnswer}</div>
                      <div><strong>Meeting:</strong> {formatDate(selectedSession.meetingDate)}</div>
                      <div><strong>Expires:</strong> {formatDate(selectedSession.expiresAt)}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Response Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Total Responses:</strong> {selectedSession.responses?.length || 0}</div>
                      <div><strong>Correct Answers:</strong> {selectedSession.responses?.filter(r => r.isCorrect).length || 0}</div>
                      <div><strong>Attendance Rate:</strong> {selectedSession.responses?.length ? Math.round((selectedSession.responses.filter(r => r.isCorrect).length / selectedSession.responses.length) * 100) : 0}%</div>
                    </div>
                  </div>
                </div>

                {/* Responses */}
                {selectedSession.responses && selectedSession.responses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Student Responses</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedSession.responses.map((response) => (
                            <tr key={response.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{response.studentName}</div>
                                  <div className="text-sm text-gray-500">{response.studentEmail}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {response.submittedAnswer}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  response.isCorrect 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {response.isCorrect ? (
                                    <>
                                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                                      Present
                                    </>
                                  ) : (
                                    <>
                                      <XCircleIcon className="h-3 w-3 mr-1" />
                                      Absent
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(response.submittedAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {(!selectedSession.responses || selectedSession.responses.length === 0) && (
                  <div className="text-center py-8">
                    <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Responses Yet</h3>
                    <p className="text-gray-600">Students haven't submitted their attendance for this session yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
