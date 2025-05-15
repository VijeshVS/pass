import React from 'react';
import { Phone, User } from 'lucide-react';
import { Contact } from '@/app/types';

interface EventContactsProps {
  contacts: Contact[];
}

const EventContacts: React.FC<EventContactsProps> = ({ contacts }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-in">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
      
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-700">{contact.name}</h3>
              <div className="flex items-center mt-1">
                <Phone className="w-4 h-4 text-gray-500 mr-1" />
                <a 
                  href={`tel:${contact.phone}`} 
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventContacts;