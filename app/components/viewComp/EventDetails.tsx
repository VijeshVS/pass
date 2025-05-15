import React from 'react';
import { Event } from '@/app/types';
import { Calendar, MapPin, Clock, Users, Tag } from 'lucide-react';

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {event.date && (
            <div>
              <div className="flex items-center mb-1">
                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-gray-700">Date</h3>
              </div>
              <p className="text-gray-600 ml-7">{event.date}</p>
            </div>
          )}
          
          {event.time && (
            <div>
              <div className="flex items-center mb-1">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-gray-700">Time</h3>
              </div>
              <p className="text-gray-600 ml-7">{event.time}</p>
            </div>
          )}
          
          {event.venue && (
            <div>
              <div className="flex items-center mb-1">
                <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-gray-700">Venue</h3>
              </div>
              <p className="text-gray-600 ml-7">{event.venue}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {event.category && (
            <div>
              <div className="flex items-center mb-1">
                <Tag className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-gray-700">Category</h3>
              </div>
              <p className="text-gray-600 ml-7">{event.category}</p>
            </div>
          )}
          
          {event.teamsize && (
            <div>
              <div className="flex items-center mb-1">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-gray-700">Team Size</h3>
              </div>
              <p className="text-gray-600 ml-7">{event.teamsize}</p>
            </div>
          )}
          
          {event.registrationFee !== undefined && (
            <div>
              <div className="flex items-center mb-1">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-medium text-gray-700">Registration Fee</h3>
              </div>
              <p className="text-gray-600 ml-7">
                {event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee} per ${event.feetype || 'individual'}`}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {event.description && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">About This Event</h3>
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        </div>
      )}
    </div>
  );
};

export default EventDetails;