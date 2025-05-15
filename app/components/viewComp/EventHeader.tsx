'use client'
import React from 'react';
import { Event } from '@/app/types';
import { Calendar, MapPin, Clock, Users, Tag } from 'lucide-react';

interface EventHeaderProps {
  event: Event;
}

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  // Default image if photoPath is not available
  const backgroundImage = 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg';

  return (
    <div className="relative">
      {/* Hero Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-white">
        <div className="animate-fade-in">
          <div className="inline-block mb-4">
            <span className={`
              px-3 py-1 text-sm font-medium rounded-full
              ${event.category === 'Cultural' ? 'bg-purple-600' : 
                event.category === 'Technical' ? 'bg-blue-600' : 
                event.category === 'Innovative' ? 'bg-green-600' : 
                event.category === 'Gaming' ? 'bg-yellow-600' : 'bg-gray-600'}
            `}>
              {event.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.name}</h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mb-8">
            {event.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {event.date && (
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{event.date}</span>
              </div>
            )}
            
            {event.time && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{event.time}</span>
              </div>
            )}
            
            {event.venue && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{event.venue}</span>
              </div>
            )}
            
            {event.teamsize && (
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>{event.teamsize} per team</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className={`
              inline-flex items-center px-4 py-2 rounded-md font-medium text-sm
              ${event.registrationOpen ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
            `}>
              {event.registrationOpen ? 'Registration Open' : 'Registration Closed'}
            </div>
            
            {event.registrationDeadline && (
              <div className="text-gray-200 text-sm flex items-center">
                <span className="font-medium mr-1">Deadline:</span> {event.registrationDeadline}
              </div>
            )}
            
            {event.registrationFee > 0 && (
              <div className="text-gray-200 text-sm flex items-center">
                <span className="font-medium mr-1">Fee:</span> ₹{event.registrationFee} per {event.feetype || 'individual'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;