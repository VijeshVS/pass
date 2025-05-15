'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getEventById } from '@/app/actions/events' // adjust path
import Link from 'next/link'

const EventViewPage = () => {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('event_id')

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError('No event ID provided')
        setLoading(false)
        return
      }

      const token = localStorage.getItem('token') || ''
      const result = await getEventById(eventId, token)

      if (result.status === 200) {
        setEvent(result.event)
      } else {
        setError(result.error || 'Failed to fetch event')
      }

      setLoading(false)
    }

    fetchEvent()
  }, [eventId])

  if (loading) return <div className="text-[#f9dd9c] p-6">Loading...</div>
  if (error) return <div className="text-red-500 p-6">{error}</div>

  return (
    <div className="p-6 bg-black text-[#f9dd9c] min-h-screen">
      <Link href="/admin/events">
        <button className="mb-6 bg-[#f9dd9c] text-black px-4 py-2 rounded hover:bg-yellow-300 font-semibold">
          ← Back to Events
        </button>
      </Link>

      <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
      <p className="text-yellow-200 mb-4">{event.description || 'No description available'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><span className="font-semibold">Slug:</span> {event.slug}</div>
        <div><span className="font-semibold">Category:</span> {event.category}</div>
        <div><span className="font-semibold">Date:</span> {event.date}</div>
        <div><span className="font-semibold">Time:</span> {event.time}</div>
        <div><span className="font-semibold">Venue:</span> {event.venue}</div>
        <div><span className="font-semibold">Team Size:</span> {event.teamsize}</div>
        <div><span className="font-semibold">Fee Type:</span> {event.feetype}</div>
        <div><span className="font-semibold">Registration Fee:</span> ₹{event.registrationFee}</div>
        <div><span className="font-semibold">Registration Deadline:</span> {event.registrationDeadline}</div>
        <div><span className="font-semibold">Registration Open:</span> {event.registrationOpen ? 'Yes' : 'No'}</div>
        <div><span className="font-semibold">Created At:</span> {new Date(event.createdAt).toLocaleString()}</div>
        <div><span className="font-semibold">Updated At:</span> {new Date(event.updatedAt).toLocaleString()}</div>
      </div>

      {event.prizes?.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Prizes</h2>
          <ul className="list-disc ml-6 text-yellow-100">
            {event.prizes.map((prize: string, idx: number) => (
              <li key={idx}>{prize}</li>
            ))}
          </ul>
        </div>
      )}

      {event.guidelines?.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Guidelines</h2>
          <ul className="list-disc ml-6 text-yellow-100">
            {event.guidelines.map((guide: string, idx: number) => (
              <li key={idx}>{guide}</li>
            ))}
          </ul>
        </div>
      )}

      {event.contact?.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Contact</h2>
          <ul className="list-disc ml-6 text-yellow-100">
            {event.contact.map((c: any, idx: number) => (
              <li key={idx}>{c.name} ({c.phone})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default EventViewPage
