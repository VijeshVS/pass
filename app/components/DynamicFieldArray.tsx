'use client'

import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface DynamicFieldArrayProps {
  items: string[];
  onChange: (items: string[]) => void;
  title: string;
  placeholder?: string;
}

const DynamicFieldArray: React.FC<DynamicFieldArrayProps> = ({ 
  items, 
  onChange, 
  title, 
  placeholder = 'Enter item' 
}) => {
  const handleItemChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    onChange(updatedItems);
  };

  const addItem = () => {
    onChange([...items, '']);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      onChange(updatedItems);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button
          type="button"
          onClick={addItem}
          variant="ghost"
          size="sm"
          leftIcon={<PlusCircle size={16} />}
        >
          Add Item
        </Button>
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-grow"
          />
          {items.length > 1 && (
            <Button 
              type="button" 
              onClick={() => removeItem(index)}
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 flex-shrink-0"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicFieldArray;