'use client'
import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, Save } from 'lucide-react';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import { Select } from './ui/Select';
import { Switch } from './ui/Switch';
import { Button } from './ui/Button';
import ContactForm from './ContactForm';
import DynamicFieldArray from './DynamicFieldArray';
import { EventFormData, defaultEventData, EventCategory, FeeType } from '../types/EventTypes';

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<EventFormData>(defaultEventData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'name' && !formData.slug) {
      // Auto-generate slug from name
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      setFormData({ ...formData, [name]: value, slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData._id) newErrors._id = 'Event ID is required';
    if (!formData.name) newErrors.name = 'Event name is required';
    if (!formData.slug) newErrors.slug = 'Event slug is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.time) newErrors.time = 'Event time is required';
    if (!formData.venue) newErrors.venue = 'Event venue is required';
    
    // Validate contacts
    const invalidContacts = formData.contact.some(c => !c.name || !c.phone);
    if (invalidContacts) newErrors.contacts = 'All contact information must be completed';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Innovative', label: 'Innovative' },
    { value: 'Gaming', label: 'Gaming' },
  ];

  const feeTypeOptions = [
    { value: 'individuals', label: 'Per Individual' },
    { value: 'team', label: 'Per Team' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Event ID"
            name="_id"
            value={formData._id}
            onChange={handleInputChange}
            placeholder="Enter event ID"
            required
            error={errors._id}
          />

          <Input
            label="Photo Path"
            name="photoPath"
            value={formData.photoPath}
            onChange={handleInputChange}
            placeholder="Enter photo path"
          />
          
          <Input
            label="Event Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter event name"
            required
            error={errors.name}
          />
          
          <Input
            label="Event Slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="event-name-slug"
            required
            error={errors.slug}
          />
          
          <div className="md:col-span-2">
            <TextArea
              label="Event Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the event"
              rows={4}
            />
          </div>
          
          <div className="relative">
            <Input
              label="Event Date"
              name="date"
              // type="string"
              value={formData.date}
              onChange={handleInputChange}
              required
              error={errors.date}
              className="pl-10"
            />
            <CalendarIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="relative">
            <Input
              label="Event Time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              placeholder="e.g., 2:00 PM"
              required
              error={errors.time}
              className="pl-10"
            />
            <ClockIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="relative">
            <Input
              label="Event Venue"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              placeholder="Enter venue location"
              required
              error={errors.venue}
              className="pl-10"
            />
            <MapPinIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>
          
          <Select
            label="Event Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange as React.ChangeEventHandler<HTMLSelectElement>}
            options={categoryOptions}
          />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Participation Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Team Size"
            name="teamsize"
            value={formData.teamsize}
            onChange={handleInputChange}
            placeholder="e.g., 1-3 members, or Individual"
          />
          
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Input
              label="Registration Fee"
              name="registrationFee"
              type="number"
              min="0"
              value={formData.registrationFee.toString()}
              onChange={handleInputChange}
              placeholder="0 for free"
              className="flex-grow"
            />
            
            <Select
              label="Fee Type"
              name="feetype"
              value={formData.feetype}
              onChange={handleInputChange as React.ChangeEventHandler<HTMLSelectElement>}
              options={feeTypeOptions}
              className="sm:w-1/2"
            />
          </div>
          
          <div className="relative">
            <Input
              label="Registration Deadline"
              name="registrationDeadline"
              type="date"
              value={formData.registrationDeadline}
              onChange={handleInputChange}
              className="pl-10"
            />
            <CalendarIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex items-end">
            <Switch
              label="Registration Open"
              name="registrationOpen"
              checked={formData.registrationOpen}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <DynamicFieldArray
          title="Prizes"
          items={formData.prizes}
          onChange={(prizes) => setFormData({ ...formData, prizes })}
          placeholder="Enter prize details"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <DynamicFieldArray
          title="Guidelines"
          items={formData.guidelines}
          onChange={(guidelines) => setFormData({ ...formData, guidelines })}
          placeholder="Enter guideline"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <ContactForm
          contacts={formData.contact}
          onChange={(contact) => {
            setFormData({ ...formData, contact });
            if (errors.contacts) {
              setErrors({ ...errors, contacts: '' });
            }
          }}
        />
        {errors.contacts && <p className="mt-2 text-sm text-red-500">{errors.contacts}</p>}
      </div>
      
      <div className="flex justify-end mt-8">
        <Button
          type="submit"
          disabled={isSubmitting}
          leftIcon={<Save size={18} />}
          className="px-8 py-2"
        >
          {isSubmitting ? 'Creating Event...' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;