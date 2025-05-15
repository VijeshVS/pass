import React from 'react';
import { Award } from 'lucide-react';

interface EventGuidelinesProps {
  guidelines: string[];
  prizes?: string[];
}

const EventGuidelines: React.FC<EventGuidelinesProps> = ({ guidelines, prizes }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-slide-up-delay">
      {guidelines && guidelines.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Guidelines</h2>
          <ul className="list-disc pl-5 space-y-2">
            {guidelines.map((guideline, index) => (
              <li key={index} className="text-gray-600">{guideline}</li>
            ))}
          </ul>
        </div>
      )}
      
      {prizes && prizes.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <Award className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Prizes</h2>
          </div>
          
          <div className="space-y-3">
            {prizes.map((prize, index) => (
              <div 
                key={index} 
                className={`
                  border-l-4 px-4 py-3 rounded-r-md
                  ${index === 0 ? 'border-yellow-400 bg-yellow-50' : 
                    index === 1 ? 'border-gray-400 bg-gray-50' : 
                    index === 2 ? 'border-amber-600 bg-amber-50' : 
                    'border-purple-400 bg-purple-50'}
                `}
              >
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-2">
                    {index === 0 ? '1st Prize:' : 
                      index === 1 ? '2nd Prize:' : 
                      index === 2 ? '3rd Prize:' : 
                      `Prize ${index + 1}:`}
                  </span>
                  <span className="text-gray-600">{prize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGuidelines;