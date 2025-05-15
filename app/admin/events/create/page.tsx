'use client'

import { createOneEvent } from '@/app/actions/events';
import EventForm from '@/app/components/EventForm';
import { EventFormData } from '@/app/types/EventTypes';

const createEvent = async (eventData: EventFormData) => {
  console.log('Creating event with data:', eventData);
  
  return createOneEvent(eventData, localStorage.getItem('token') || "")
};

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-2">
              Create New Event
            </h1>
            <p className="text-gray-600">
              Fill in the details below to create a new event
            </p>
          </header>
          
          <EventForm onSubmit={createEvent} />
        </div>
      </div>
    </div>
  );
}

export default App;