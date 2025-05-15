import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';

interface ArrayFieldProps {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

const ArrayField: React.FC<ArrayFieldProps> = ({ title, items, onChange, placeholder }) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    onChange(updatedItems);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
      
      <div className="space-y-4">
        <div className="flex">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder || `Add new ${title.toLowerCase()}`}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li 
              key={index} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 group"
            >
              <span className="text-sm text-gray-700">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors duration-200"
                aria-label={`Remove ${item}`}
              >
                <Trash size={16} />
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="p-3 text-sm text-gray-500 italic bg-gray-50 rounded-md border border-gray-200">
              No {title.toLowerCase()} added yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ArrayField;