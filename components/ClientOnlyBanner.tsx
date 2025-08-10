'use client'

import { useEffect, useState } from 'react'
import DynamicBanner from './DynamicBanner'

interface ClientOnlyBannerProps {
  type?: 'TOP_ANNOUNCEMENT' | 'BOOTCAMP' | 'URGENCY' | 'GENERAL'
  position?: 'top' | 'bottom' | 'inline'
  delay?: number
  autoShow?: boolean
  className?: string
}

export default function ClientOnlyBanner(props: ClientOnlyBannerProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <DynamicBanner {...props} />
}
