"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { deleteEventById, getAllEvents } from "@/app/actions/events";
import Loading from "@/app/components/Loading";
import { toast } from "sonner";

const Page = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token") || "";
    const confirmDelete = confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    toast.promise(
      (async () => {
        const result = await deleteEventById(id, token);
        if (result.status === 200) {
          setEvents(events.filter((event) => event._id !== id));
        } else {
          throw new Error(result.error || "Failed to delete event");
        }
      })(),
      {
        loading: "Deleting event...",
        success: "Event deleted successfully!",
        error: (err) => err.message || "An error occurred while deleting",
      }
    );
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token") || "";
      try {
        const result = await getAllEvents(token);
        if (result.status === 200) {
          // @ts-ignore
          setEvents(result.events);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-semibold">
        Unauthorized or error fetching events
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#f9dd9c] px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl ml-2 font-extrabold tracking-wide">Events</h1>
        <Link href="/admin/events/create">
          <button className="bg-[#f9dd9c] text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300">
            + Create Event
          </button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-lg text-yellow-200">No events found.</div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="relative bg-gradient-to-br from-black via-gray-900 to-black p-5 rounded-2xl border border-[#f9dd9c]/30 shadow-lg hover:shadow-yellow-400/20 transition-shadow duration-300 group"
            >
              {/* Glowing background with pointer-events disabled */}
              <div className="absolute inset-0 rounded-2xl border-2 border-[#f9dd9c] opacity-10 blur-xl group-hover:opacity-20 transition pointer-events-none" />

              <h2 className="text-xl font-bold mb-2 text-[#f9dd9c] transition-transform duration-300">
                {event.name}
              </h2>
              <p className="text-sm text-[#f9dd9c]/70 mb-4 line-clamp-3">
                {event.description?.substring(0, 120) || "No description"}
              </p>

              <div className="text-sm space-y-1 mb-3">
                <p>
                  <strong>Category:</strong> {event.category || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {event.date || "N/A"}
                </p>
                <p>
                  <strong>Time:</strong> {event.time || "N/A"}
                </p>
                <p>
                  <strong>Venue:</strong> {event.venue || "N/A"}
                </p>
              </div>

              {event.contact?.length > 0 && (
                <div className="text-sm text-yellow-100 mb-2">
                  <strong>Contact:</strong>
                  <ul className="ml-4 list-disc mt-1 space-y-1">
                    {event.contact.map((c: any, idx: number) => (
                      <li key={idx}>
                        {c.name} ({c.phone})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <Link href={`/admin/events/view?event_id=${event._id}`}>
                  <button className="bg-[#f9dd9c] text-black px-4 py-1 rounded-full text-sm font-semibold shadow hover:bg-yellow-300 transition">
                    View
                  </button>
                </Link>
                <Link href={`/admin/events/edit?event_id=${event._id}`}>
                  <button className="bg-transparent border border-[#f9dd9c] text-[#f9dd9c] px-4 py-1 rounded-full text-sm font-semibold hover:bg-[#f9dd9c] hover:text-black transition">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
