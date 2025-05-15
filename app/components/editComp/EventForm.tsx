'use client'
import React, { useState, useEffect } from 'react';
import { Event } from '@/app/types/event';
import ContactList from './ContactList';
import ArrayField from './ArrayField';
import { formatDateForInput } from '@/app/utils/helpers';
import { AlertTriangle, Calendar, Clock, MapPin, Save } from 'lucide-react';

interface EventFormProps {
  event: Event;
  onSave: (updatedEvent: Event) => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave }) => {
  const [formData, setFormData] = useState<Event>(event);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(event);
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'registrationFee') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    
    if (formData.contact.length === 0) {
      newErrors.contact = 'At least one contact is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(formData);
      // Success message or redirect could be added here
    } catch (error) {
      console.error('Failed to save event:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePrizes = (prizes: string[]) => {
    setFormData({ ...formData, prizes });
  };

  const updateGuidelines = (guidelines: string[]) => {
    setFormData({ ...formData, guidelines });
  };

  const updateContacts = (contact: Event['contact']) => {
    setFormData({ ...formData, contact });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Event Name*
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle size={14} className="mr-1" /> {errors.name}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug*
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.slug ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle size={14} className="mr-1" /> {errors.slug}
              </p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              <option value="Cultural">Cultural</option>
              <option value="Technical">Technical</option>
              <option value="Sports">Innovative</option>
              <option value="Workshop">Gaming</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="photoPath" className="block text-sm font-medium text-gray-700 mb-1">
              Photo Path
            </label>
            <input
              id="photoPath"
              name="photoPath"
              type="text"
              value={formData.photoPath || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar size={16} className="mr-1" /> Date
            </label>
            <input
              id="date"
              name="date"
              // type="date"
              value={formatDateForInput(formData.date)}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Clock size={16} className="mr-1" /> Time
            </label>
            <input
              id="time"
              name="time"
              type="text"
              value={formData.time || ''}
              onChange={handleChange}
              placeholder="e.g. 10:00 AM"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MapPin size={16} className="mr-1" /> Venue
            </label>
            <input
              id="venue"
              name="venue"
              type="text"
              value={formData.venue || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="teamsize" className="block text-sm font-medium text-gray-700 mb-1">
              Team Size
            </label>
            <input
              id="teamsize"
              name="teamsize"
              type="text"
              value={formData.teamsize || ''}
              onChange={handleChange}
              placeholder="e.g. 2-4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Registration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Registration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="registrationFee" className="block text-sm font-medium text-gray-700 mb-1">
              Registration Fee
            </label>
            <input
              id="registrationFee"
              name="registrationFee"
              type="number"
              min="0"
              step="0.01"
              value={formData.registrationFee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="feetype" className="block text-sm font-medium text-gray-700 mb-1">
              Fee Type
            </label>
            <select
              id="feetype"
              name="feetype"
              value={formData.feetype}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="individuals">Per Individual</option>
              <option value="team">Per Team</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
              Registration Deadline
            </label>
            <input
              id="registrationDeadline"
              name="registrationDeadline"
              type="date"
              value={formatDateForInput(formData.registrationDeadline)}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="registrationOpen"
              name="registrationOpen"
              type="checkbox"
              checked={formData.registrationOpen}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="registrationOpen" className="ml-2 block text-sm text-gray-700">
              Registration Open
            </label>
          </div>
        </div>
      </div>
      
      {/* Array Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <ArrayField
            title="Prizes"
            items={formData.prizes}
            onChange={updatePrizes}
            placeholder="Add a prize"
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ArrayField
            title="Guidelines"
            items={formData.guidelines}
            onChange={updateGuidelines}
            placeholder="Add a guideline"
          />
        </div>
      </div>
      
      {/* Contacts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <ContactList 
          contacts={formData.contact} 
          onChange={updateContacts} 
          error={errors.contact}
        />
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70"
        >
          <Save size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;