'use client'
import React, { useState, useEffect } from 'react';
// import { getEventById, updateEvent } from './api/eventService';
import { getEventIdFromUrl } from '@/app/utils/helpers';
import EventForm from '@/app/components/editComp/EventForm';
import { Event } from '@/app/types/event';
import { FileSpreadsheet, Loader2 } from 'lucide-react';

function App() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const eventId = getEventIdFromUrl();
        
        if (!eventId) {
          setError('No event ID provided. Please include event_id in the URL.');
          setLoading(false);
          return;
        }
        
        const eventData = await getEventById(eventId,localStorage.getItem('token') || "");
        
        if (!eventData) {
          setError(`Event with ID ${eventId} not found.`);
        } else {
            // @ts-ignore
          setEvent(eventData.event);
        }
      } catch (err) {
        setError('Failed to fetch event data. Please try again.');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, []);

  const handleSaveEvent = async (updatedEvent: Event) => {
    try {
      await updateOneEvent(updatedEvent,localStorage.getItem('token') || "");
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return true;
    } catch (err) {
      console.error('Error updating event:', err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileSpreadsheet size={24} className="mr-2 text-blue-600" />
              Event Management
            </h1>
            
            {saveSuccess && (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md">
                Event saved successfully!
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading event data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <div className="flex flex-col items-center">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <h2 className="text-lg font-medium text-red-800 mb-2">Error</h2>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : event ? (
          <EventForm event={event} onSave={handleSaveEvent} />
        ) : null}
      </main>
    </div>
  );
}

// Import this here to avoid circular dependency
import { AlertCircle } from 'lucide-react';
import { getEventById, updateOneEvent } from '@/app/actions/events';

export default App;