'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'

interface Sponsor {
  id: string
  name: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'COMMUNITY'
  isActive: boolean
  order: number
}

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await api.get('/sponsors?public=true')
        const data = response.data
        setSponsors(data.sponsors || [])
      } catch (error) {
        console.error('Error fetching sponsors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSponsors()
  }, [])

  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    if (!acc[sponsor.tier]) {
      acc[sponsor.tier] = []
    }
    acc[sponsor.tier].push(sponsor)
    return acc
  }, {} as Record<string, Sponsor[]>)

  const tierOrder = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'COMMUNITY']
  const tierLabels = {
    PLATINUM: 'Strategic Research Partners',
    GOLD: 'Innovation Partners', 
    SILVER: 'Technology Partners',
    BRONZE: 'Development Partners',
    COMMUNITY: 'Community Partners'
  }

  const tierStyles = {
    PLATINUM: 'text-gray-700 dark:text-gray-300',
    GOLD: 'text-amber-600 dark:text-amber-400',
    SILVER: 'text-gray-600 dark:text-gray-400', 
    BRONZE: 'text-orange-600 dark:text-orange-400',
    COMMUNITY: 'text-blue-600 dark:text-blue-400'
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96 mx-auto mb-8"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (sponsors.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Our Partners & Sponsors
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We collaborate with leading organizations to advance research, education, agritech innovation, and technology solutions across Africa and beyond.
          </p>
        </motion.div>

        <div className="space-y-16">
          {tierOrder.map((tier) => {
            const tierSponsors = groupedSponsors[tier]
            if (!tierSponsors || tierSponsors.length === 0) return null

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className={`text-lg font-medium mb-6 ${tierStyles[tier as keyof typeof tierStyles]} opacity-80`}>
                  {tierLabels[tier as keyof typeof tierLabels]}
                </h3>
                
                <div className={`grid gap-4 sm:gap-6 ${
                  tier === 'PLATINUM' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                    : tier === 'GOLD'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                }`}>
                  {tierSponsors
                    .sort((a, b) => a.order - b.order)
                    .map((sponsor, index) => (
                      <motion.div
                        key={sponsor.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className="group"
                      >
                        {sponsor.websiteUrl ? (
                          <a
                            href={sponsor.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <SponsorCard sponsor={sponsor} tier={tier} />
                          </a>
                        ) : (
                          <SponsorCard sponsor={sponsor} tier={tier} />
                        )}
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Become a Research & Innovation Partner
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Join our mission to advance research, education, and agritech innovation across Africa. Partner with us to drive technological solutions in agriculture, education, healthcare, and sustainable development.
          </p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 bg-[#c1272d] text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            Partner With Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

interface SponsorCardProps {
  sponsor: Sponsor
  tier: string
}

function SponsorCard({ sponsor, tier }: SponsorCardProps) {
  const getCardConfig = () => {
    switch (tier) {
      case 'PLATINUM':
        return {
          height: 'min-h-32 sm:min-h-36',
          padding: 'p-6',
          textSize: 'text-base',
          descSize: 'text-sm'
        }
      case 'GOLD':
        return {
          height: 'min-h-28 sm:min-h-32',
          padding: 'p-5',
          textSize: 'text-sm',
          descSize: 'text-xs'
        }
      case 'SILVER':
        return {
          height: 'min-h-24 sm:min-h-28',
          padding: 'p-4',
          textSize: 'text-sm',
          descSize: 'text-xs'
        }
      case 'BRONZE':
        return {
          height: 'min-h-20 sm:min-h-24',
          padding: 'p-3',
          textSize: 'text-xs',
          descSize: 'text-xs'
        }
      default:
        return {
          height: 'min-h-18 sm:min-h-20',
          padding: 'p-3',
          textSize: 'text-xs',
          descSize: 'text-xs'
        }
    }
  }

  const config = getCardConfig()

  return (
    <div className={`${config.height} w-full bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 ${config.padding} flex items-center justify-center group-hover:shadow-md group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-all duration-300 backdrop-blur-sm`}>
      {sponsor.logoUrl ? (
        <img
          src={sponsor.logoUrl}
          alt={sponsor.name}
          className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all duration-300 opacity-80 group-hover:opacity-100"
        />
      ) : (
        <div className="text-center w-full flex flex-col justify-center">
          <div className={`font-medium text-gray-700 dark:text-gray-300 ${config.textSize} group-hover:text-[#c1272d] dark:group-hover:text-[#c1272d] transition-colors leading-tight mb-2`}>
            {sponsor.name}
          </div>
          {sponsor.description && (
            <div className={`text-gray-500 dark:text-gray-400 ${config.descSize} leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
              {tier === 'PLATINUM' || tier === 'GOLD' 
                ? (sponsor.description.length > 80 
                    ? `${sponsor.description.substring(0, 80)}...` 
                    : sponsor.description)
                : (sponsor.description.length > 50 
                    ? `${sponsor.description.substring(0, 50)}...` 
                    : sponsor.description)
              }
            </div>
          )}
        </div>
      )}
    </div>
  )
}
