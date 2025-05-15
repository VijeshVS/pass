import React, { Suspense } from 'react'
import EventViewPage from './view'
import Loading from '@/app/components/Loading'

const Page = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <EventViewPage />
    </Suspense>
  )
}

export default Page
