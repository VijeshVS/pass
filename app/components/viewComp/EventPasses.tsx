'use client'
import React from 'react';
import { Users, Calendar, AlertCircle } from 'lucide-react';
import { Pass } from '@/app/types';
import { useRouter } from 'next/navigation';

interface EventPassesProps {
  passes: Pass[];
  totalParticipants: number;
  registrationOpen: boolean;
  registrationDeadline?: string;
  registrationFee?: number;
  feetype?: string;
}

const EventPasses: React.FC<EventPassesProps> = ({ 
  passes, 
  totalParticipants, 
  registrationOpen,
  registrationDeadline,
  registrationFee,
  feetype
}) => {
  
  const router = useRouter();

  const handlePassClick = (passId: string) => {
    router.push(`/admin/pass/view?pass_id=${passId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-in-delay">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Registration</h2>
        <div className={`
          px-3 py-1 text-sm font-medium rounded-full
          ${registrationOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}>
          {registrationOpen ? 'Open' : 'Closed'}
        </div>
      </div>
      
      {/* Registration Status */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Users className="w-4 h-4 mr-2 text-purple-600" />
          <span>{totalParticipants} participant{totalParticipants !== 1 ? 's' : ''} registered</span>
        </div>
        
        {registrationDeadline && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4 mr-2 text-purple-600" />
            <span>Registration Deadline: {registrationDeadline}</span>
          </div>
        )}
        
        {registrationFee !== undefined && (
          <div className="text-sm text-gray-600">
            {registrationFee === 0 ? (
              <span className="text-green-600 font-medium">Free Entry</span>
            ) : (
              <span>Registration Fee: ₹{registrationFee} per {feetype || 'individual'}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Registration Button or Message */}
      {registrationOpen ? (
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 mb-6">
          Register Now
        </button>
      ) : (
        <div className="flex items-center bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-6">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">Registration is currently closed for this event.</p>
        </div>
      )}
      
      {/* Participants List */}
      {passes.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Recent Registrations</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {passes.slice(0, 10).map((pass, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handlePassClick(pass._id)}
              >
                <div className="font-medium text-gray-700">{pass.name}</div>
                {pass.participantsData && pass.participantsData.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Team Members:</div>
                    <div className="flex flex-wrap gap-1">
                      {pass.participantsData.map((participant, i) => (
                        <div 
                          key={i} 
                          className={`
                            text-xs px-2 py-1 rounded-full
                            ${participant.arrived ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}
                          `}
                        >
                          {participant.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {passes.length > 10 && (
            <div className="text-center mt-3">
              <button className="text-sm text-purple-600 hover:text-purple-800">
                View all {passes.length} registrations
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventPasses;