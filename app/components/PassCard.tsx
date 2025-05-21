'use client'
import React from 'react';
import { Mail, Calendar, User, CreditCard, Tag, Clock } from 'lucide-react';
import { Pass } from '../types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { resendMailto } from '../actions/email';


interface PassCardProps {
  pass: Pass;
}

const PassCard: React.FC<PassCardProps> = ({ pass }) => {
  const navigate = useRouter();
  
  const handleCardClick = () => {
    navigate.push(`/admin/passes/view?pass_id=${pass._id}`);
  };
  
  const handleSendEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    const promise = resendMailto(pass.type, pass, pass._id);
    toast.promise(
      promise,
      {
      loading: 'Sending email...',
      success: 'Email sent successfully!',
      error: 'Failed to send email.',
      }
    );
  };
  
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const firstParticipantName = pass.participantsData && pass.participantsData.length > 0 
    ? pass.participantsData[0].name 
    : 'No participant';
  
  return (
    <div 
      onClick={handleCardClick}
      className={`
        bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 
        transition-all duration-300 cursor-pointer overflow-hidden
        border-l-4 ${pass.type === 'event' ? 'border-orange-500' : 'border-teal-500'}
      `}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{firstParticipantName}</h3>
          <span className={`
            text-xs font-medium px-2 py-1 rounded-full uppercase
            ${pass.type === 'event' ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800'}
          `}>
            {pass.type}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Tag size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{pass.name}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">Created: {formatDateTime(pass.createdAt)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">Updated: {formatDateTime(pass.updatedAt)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <CreditCard size={16} className="mr-2 flex-shrink-0" />
            <div className="text-sm">
              <span className="block">Order: {pass.orderId}</span>
              <span className="block text-gray-500">Payment: {pass.signature}</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600">
            <User size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{pass.noOfParticipants} {pass.noOfParticipants === 1 ? 'Participant' : 'Participants'}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleSendEmail}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Mail size={16} className="mr-2" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassCard;