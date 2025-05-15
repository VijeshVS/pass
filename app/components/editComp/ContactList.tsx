'use client'
import React, { useState } from 'react';
import { Event, Contact } from '@/app/types/event';
import { Plus, Trash, AlertTriangle, Phone, User } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
  error?: string;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onChange, error }) => {
  const [newContact, setNewContact] = useState<Contact>({ name: '', phone: '' });
  const [validation, setValidation] = useState({ name: true, phone: true });

  const validateContact = (contact: Contact): boolean => {
    const isNameValid = contact.name.trim() !== '';
    const isPhoneValid = contact.phone.trim() !== '';
    
    setValidation({
      name: isNameValid,
      phone: isPhoneValid
    });
    
    return isNameValid && isPhoneValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Reset validation error when typing
    if (!validation[name as keyof typeof validation]) {
      setValidation((prev) => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleAddContact = () => {
    if (validateContact(newContact)) {
      onChange([...contacts, { ...newContact }]);
      setNewContact({ name: '', phone: '' });
    }
  };

  const handleRemoveContact = (index: number) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    onChange(updatedContacts);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h3>
      
      {error && (
        <p className="mb-3 text-sm text-red-600 flex items-center">
          <AlertTriangle size={14} className="mr-1" /> {error}
        </p>
      )}
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User size={16} className="mr-1" /> Contact Name
            </label>
            <input
              id="contactName"
              name="name"
              type="text"
              value={newContact.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                !validation.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter contact name"
            />
            {!validation.name && (
              <p className="mt-1 text-sm text-red-600">Name is required</p>
            )}
          </div>
          
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Phone size={16} className="mr-1" /> Phone Number
            </label>
            <div className="flex">
              <input
                id="contactPhone"
                name="phone"
                type="text"
                value={newContact.phone}
                onChange={handleInputChange}
                className={`flex-grow px-4 py-2 border rounded-l-md focus:ring-blue-500 focus:border-blue-500 ${
                  !validation.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              <button
                type="button"
                onClick={handleAddContact}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Plus size={20} />
              </button>
            </div>
            {!validation.phone && (
              <p className="mt-1 text-sm text-red-600">Phone number is required</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Contact List</h4>
          {contacts.length > 0 ? (
            <ul className="space-y-2">
              {contacts.map((contact, index) => (
                <li 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div>
                    <span className="font-medium text-gray-800">{contact.name}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600">{contact.phone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(index)}
                    className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors duration-200"
                    aria-label={`Remove ${contact.name}`}
                  >
                    <Trash size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-3 text-sm text-gray-500 italic bg-gray-50 rounded-md border border-gray-200">
              No contacts added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;