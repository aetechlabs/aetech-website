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
  DocumentTextIcon
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
  const [activeTab, setActiveTab] = useState<'enrollments' | 'management'>('enrollments')
  const [showSendDocumentsModal, setShowSendDocumentsModal] = useState(false)
  const [selectedEnrollmentForDocs, setSelectedEnrollmentForDocs] = useState<BootcampEnrollment | null>(null)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchTerm, itemsPerPage])

  useEffect(() => {
    fetchEnrollments()
  }, [statusFilter, searchTerm, currentPage, itemsPerPage])

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-l-lg transition-colors ${
              activeTab === 'enrollments'
                ? 'bg-[#c1272d] dark:bg-red-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <UserGroupIcon className="h-5 w-5" />
              <span>Enrollments</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-r-lg transition-colors ${
              activeTab === 'management'
                ? 'bg-[#c1272d] dark:bg-red-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <DocumentTextIcon className="h-5 w-5" />
              <span>Management</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'management' ? (
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
    </div>
  )
}
