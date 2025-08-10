'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

interface Sponsor {
  id: string
  name: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'COMMUNITY'
  isActive: boolean
  order: number
  contactName?: string
  contactEmail?: string
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  const tierOptions = [
    { value: 'all', label: 'All Tiers' },
    { value: 'PLATINUM', label: 'Strategic Research Partners' },
    { value: 'GOLD', label: 'Innovation Partners' },
    { value: 'SILVER', label: 'Technology Partners' },
    { value: 'BRONZE', label: 'Development Partners' },
    { value: 'COMMUNITY', label: 'Community Partners' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' }
  ]

  const fetchSponsors = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(tierFilter !== 'all' && { tier: tierFilter }),
        ...(statusFilter !== 'all' && { isActive: statusFilter })
      })

      const response = await fetch(`/api/sponsors?${params}`)
      const data = await response.json()
      
      setSponsors(data.sponsors)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching sponsors:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSponsors()
  }, [tierFilter, statusFilter])

  const deleteSponsor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) {
      return
    }

    try {
      const response = await fetch(`/api/sponsors/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchSponsors(pagination.page)
        setShowDetails(false)
      }
    } catch (error) {
      console.error('Error deleting sponsor:', error)
    }
  }

  const getTierBadge = (tier: string) => {
    const badges = {
      PLATINUM: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      GOLD: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      SILVER: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      BRONZE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      COMMUNITY: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return badges[tier as keyof typeof badges] || badges.COMMUNITY
  }

  const filteredSponsors = sponsors.filter(sponsor =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sponsor.description && sponsor.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c1272d]"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-[#c1272d] mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Sponsors Management
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingSponsor(null)
              setShowForm(true)
            }}
            className="bg-[#c1272d] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Sponsor
          </motion.button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage sponsors and partnerships for research, education, agritech, and innovation initiatives
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
                placeholder="Search sponsors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Tier Filter */}
          <div className="md:w-48">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {tierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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

      {/* Sponsors Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {filteredSponsors.length === 0 ? (
          <div className="p-8 text-center">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No sponsors found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Sponsor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSponsors.map((sponsor) => (
                    <tr key={sponsor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {sponsor.logoUrl ? (
                            <img
                              src={sponsor.logoUrl}
                              alt={sponsor.name}
                              className="h-10 w-10 rounded-lg object-cover mr-4"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                              <PhotoIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sponsor.name}
                            </div>
                            {sponsor.websiteUrl && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <a
                                  href={sponsor.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-[#c1272d]"
                                >
                                  {sponsor.websiteUrl}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierBadge(
                            sponsor.tier
                          )}`}
                        >
                          {sponsor.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            sponsor.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          {sponsor.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {sponsor.contactName || sponsor.contactEmail || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(sponsor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSponsor(sponsor)
                              setShowDetails(true)
                            }}
                            className="text-[#c1272d] hover:text-red-700 p-1 rounded"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingSponsor(sponsor)
                              setShowForm(true)
                            }}
                            className="text-[#c1272d] hover:text-red-700 p-1 rounded"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSponsor(sponsor.id)}
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
                  onClick={() => fetchSponsors(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchSponsors(pagination.page + 1)}
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
                      onClick={() => fetchSponsors(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchSponsors(pagination.page + 1)}
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

      {/* Sponsor Details Modal */}
      {showDetails && selectedSponsor && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDetails(false)}
            ></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-10">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Sponsor Details
                      </h3>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Basic Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                              {selectedSponsor.name}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Tier:</span>
                            <span
                              className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierBadge(
                                selectedSponsor.tier
                              )}`}
                            >
                              {selectedSponsor.tier}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                            <span
                              className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                selectedSponsor.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {selectedSponsor.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {selectedSponsor.websiteUrl && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Website:</span>
                              <a
                                href={selectedSponsor.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-[#c1272d] hover:underline"
                              >
                                {selectedSponsor.websiteUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Contact Information
                        </h4>
                        <div className="space-y-2">
                          {selectedSponsor.contactName && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Contact Name:</span>
                              <span className="ml-2 text-gray-900 dark:text-gray-100">
                                {selectedSponsor.contactName}
                              </span>
                            </div>
                          )}
                          {selectedSponsor.contactEmail && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                              <span className="ml-2 text-gray-900 dark:text-gray-100">
                                {selectedSponsor.contactEmail}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Order:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                              {selectedSponsor.order}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logo */}
                    {selectedSponsor.logoUrl && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Logo
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <img
                            src={selectedSponsor.logoUrl}
                            alt={selectedSponsor.name}
                            className="max-h-32 rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {selectedSponsor.description && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Description
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {selectedSponsor.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    {(selectedSponsor.startDate || selectedSponsor.endDate) && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Partnership Duration
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="space-y-2">
                            {selectedSponsor.startDate && (
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Start Date:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-100">
                                  {new Date(selectedSponsor.startDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {selectedSponsor.endDate && (
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">End Date:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-100">
                                  {new Date(selectedSponsor.endDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    setEditingSponsor(selectedSponsor)
                    setShowDetails(false)
                    setShowForm(true)
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#c1272d] text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1272d] sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Edit
                </button>
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

      {/* TODO: Add SponsorForm component */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              {editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sponsor form component will be implemented next.
            </p>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
