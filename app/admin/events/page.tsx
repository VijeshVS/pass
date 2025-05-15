'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllEvents } from '@/app/actions/events'
import Loading from '@/app/components/Loading'

const Page = () => {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token') || ''
      try {
        const result = await getAllEvents(token)
        if (result.status === 200) {
          setEvents(result.events)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return <div className="text-red-500 p-6">Unauthorized or error fetching events</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Events</h1>
        <Link href="/admin/events/create">
          <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 font-semibold">
            + Create Event
          </button>
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {events.map((event) => (
          <div key={event._id} className="bg-black border border-yellow-300 p-4 rounded-lg shadow-md text-white">
            <h2 className="text-xl font-semibold mb-1">{event.name}</h2>
            <p className="text-sm text-yellow-100 mb-2">{event.description?.substring(0, 100) || 'No description'}</p>

            <p className="text-sm"><strong>Category:</strong> {event.category || 'N/A'}</p>
            <p className="text-sm"><strong>Date:</strong> {event.date || 'N/A'}</p>
            <p className="text-sm"><strong>Time:</strong> {event.time || 'N/A'}</p>
            <p className="text-sm mb-2"><strong>Venue:</strong> {event.venue || 'N/A'}</p>

            {event.contact?.length > 0 && (
              <div className="text-sm text-yellow-200 mb-2">
                <strong>Contact:</strong>
                <ul className="ml-4 list-disc">
                  {event.contact.map((c: any, idx: number) => (
                    <li key={idx}>{c.name} ({c.phone})</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between mt-3">
              <Link href={`/admin/events/view?event_id=${event._id}`}>
                <button className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 text-sm font-medium">
                  View
                </button>
              </Link>
              <Link href={`/admin/events/edit?event_id=${event._id}`}>
                <button className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 text-sm font-medium">
                  Edit
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
