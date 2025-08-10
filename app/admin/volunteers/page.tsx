'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Volunteer {
  id: string
  name: string
  email: string
  phone?: string
  experience: string
  interests: string[]
  availability: string
  motivation: string
  skills?: string
  previousVolunteering?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE'
  notes?: string
  createdAt: string
  updatedAt: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function VolunteersAdminPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: FunnelIcon },
    { value: 'pending', label: 'Pending', icon: ClockIcon },
    { value: 'approved', label: 'Approved', icon: CheckCircleIcon },
    { value: 'rejected', label: 'Rejected', icon: XCircleIcon },
    { value: 'active', label: 'Active', icon: CheckIcon },
    { value: 'inactive', label: 'Inactive', icon: XMarkIcon }
  ]

  const fetchVolunteers = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })

      const response = await fetch(`/api/volunteer?${params}`)
      const data = await response.json()
      
      setVolunteers(data.volunteers)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching volunteers:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateVolunteerStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/volunteer/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status.toUpperCase(), notes }),
      })

      if (response.ok) {
        await fetchVolunteers(pagination.page)
        setShowDetails(false)
      }
    } catch (error) {
      console.error('Error updating volunteer:', error)
    }
  }

  const deleteVolunteer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this volunteer application?')) {
      return
    }

    try {
      const response = await fetch(`/api/volunteer/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchVolunteers(pagination.page)
        setShowDetails(false)
      }
    } catch (error) {
      console.error('Error deleting volunteer:', error)
    }
  }

  useEffect(() => {
    fetchVolunteers()
  }, [statusFilter])

  useEffect(() => {
    if (showDetails && selectedVolunteer) {
      console.log('Modal opened with volunteer:', selectedVolunteer)
      console.log('Show details state:', showDetails)
    }
  }, [showDetails, selectedVolunteer])

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      ACTIVE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
    return badges[status as keyof typeof badges] || badges.PENDING
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <UserGroupIcon className="h-8 w-8 text-[#c1272d] mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Volunteer Management
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage volunteer applications and track volunteer status
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search volunteers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c1272d] mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading volunteers...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="p-8 text-center">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No volunteers found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Volunteer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Interests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {volunteer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {volunteer.email}
                          </div>
                          {volunteer.phone && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {volunteer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.interests.slice(0, 2).map((interest, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
                            >
                              {interest}
                            </span>
                          ))}
                          {volunteer.interests.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{volunteer.interests.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {volunteer.availability}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            volunteer.status
                          )}`}
                        >
                          {volunteer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(volunteer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              console.log('Clicked view details for:', volunteer)
                              setSelectedVolunteer(volunteer)
                              setShowDetails(true)
                              console.log('Selected volunteer set to:', volunteer)
                              console.log('Show details set to:', true)
                            }}
                            className="text-[#c1272d] hover:text-red-700 p-1 rounded"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {volunteer.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateVolunteerStatus(volunteer.id, 'approved')}
                                className="text-green-600 hover:text-green-700 p-1 rounded"
                                title="Approve"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateVolunteerStatus(volunteer.id, 'rejected')}
                                className="text-red-600 hover:text-red-700 p-1 rounded"
                                title="Reject"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteVolunteer(volunteer.id)}
                            className="text-red-600 hover:text-red-700 p-1 rounded"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => fetchVolunteers(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchVolunteers(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => fetchVolunteers(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchVolunteers(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Volunteer Details Modal */}
      {showDetails && selectedVolunteer && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDetails(false)}
            ></div>

            {/* Modal Content */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-10">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Volunteer Application Details
                        <span className="text-sm text-gray-500 ml-2">
                          (Debug: {selectedVolunteer?.name || 'No volunteer selected'})
                        </span>
                      </h3>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Personal Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                              {selectedVolunteer?.name || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                              {selectedVolunteer?.email || 'N/A'}
                            </span>
                          </div>
                          {selectedVolunteer?.phone && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                              <span className="ml-2 text-gray-900 dark:text-gray-100">
                                {selectedVolunteer.phone}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Availability:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                              {selectedVolunteer?.availability || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Application Status */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Application Status
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                            <span
                              className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                selectedVolunteer?.status || 'PENDING'
                              )}`}
                            >
                              {selectedVolunteer?.status || 'PENDING'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Applied:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                              {selectedVolunteer?.createdAt ? new Date(selectedVolunteer.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Last Updated:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                              {selectedVolunteer?.updatedAt ? new Date(selectedVolunteer.updatedAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Areas of Interest */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Areas of Interest
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(selectedVolunteer?.interests || []).map((interest, index) => (
                          <span
                            key={index}
                            className="inline-block bg-[#c1272d]/10 text-[#c1272d] text-sm px-3 py-1 rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                        {(!selectedVolunteer?.interests || selectedVolunteer.interests.length === 0) && (
                          <span className="text-gray-500 dark:text-gray-400 italic">No interests specified</span>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Relevant Experience
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                          {selectedVolunteer?.experience || 'No experience provided'}
                        </p>
                      </div>
                    </div>

                    {/* Motivation */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Motivation
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                          {selectedVolunteer?.motivation || 'No motivation provided'}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    {selectedVolunteer?.skills && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Skills & Technologies
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {selectedVolunteer.skills}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Previous Volunteering */}
                    {selectedVolunteer?.previousVolunteering && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Previous Volunteering Experience
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {selectedVolunteer.previousVolunteering}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Admin Notes */}
                    {selectedVolunteer?.notes && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Admin Notes
                        </h4>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {selectedVolunteer.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedVolunteer?.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => updateVolunteerStatus(selectedVolunteer.id, 'approved')}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateVolunteerStatus(selectedVolunteer.id, 'rejected')}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetails(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1272d] sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
