'use client'
import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ContactInfo } from '../types/EventTypes';

interface ContactFormProps {
  contacts: ContactInfo[];
  onChange: (contacts: ContactInfo[]) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contacts, onChange }) => {
  const handleContactChange = (index: number, field: keyof ContactInfo, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    onChange(updatedContacts);
  };

  const addContact = () => {
    onChange([...contacts, { name: '', phone: '' }]);
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      const updatedContacts = [...contacts];
      updatedContacts.splice(index, 1);
      onChange(updatedContacts);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <Button
          type="button"
          onClick={addContact}
          variant="ghost"
          size="sm"
          leftIcon={<PlusCircle size={16} />}
        >
          Add Contact
        </Button>
      </div>
      
      {contacts.map((contact, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-md bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Contact #{index + 1}</h4>
            {contacts.length > 1 && (
              <Button 
                type="button" 
                onClick={() => removeContact(index)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={contact.name}
              onChange={(e) => handleContactChange(index, 'name', e.target.value)}
              placeholder="Contact Person Name"
              required
            />
            <Input
              label="Phone"
              value={contact.phone}
              onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
              placeholder="Contact Phone Number"
              required
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactForm;