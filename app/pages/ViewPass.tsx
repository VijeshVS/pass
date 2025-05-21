'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Pass } from '../types';
import { ArrowLeft, Mail, CheckCircle, XCircle } from 'lucide-react';
import { getPassDetails } from '../actions/details';
import { resendMailto } from '../actions/email';
import { toast } from 'sonner';

const ViewPass: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const passId = searchParams.get('pass_id');

  const [pass, setPass] = useState<Pass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPass = async () => {
      if (!passId) {
        setError('No pass ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const pass = await getPassDetails(passId, localStorage.getItem('token') || '');
        const foundPass = pass.pass;

        if (foundPass) {
          setPass(foundPass);
        } else {
          setError('Pass not found');
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pass details. Please try again later.');
        setLoading(false);
        console.error('Error fetching pass:', err);
      }
    };

    fetchPass();
  }, [passId]);

  const handleBack = () => {
    router.push('/admin/passes');
  };

  const handleSendEmail = () => {
    if(pass) {
      const promise = resendMailto(pass.type, pass, pass._id);
      toast.promise(
        promise,
        {
        loading: 'Sending email...',
        success: 'Email sent successfully!',
        error: 'Failed to send email.',
        }
      );
    }
    
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !pass) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{error || 'An unknown error occurred'}</p>
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Passes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8 px-4">
        <div className="container mx-auto">
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-blue-100 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to All Passes
          </button>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Pass Details</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full uppercase ${
                pass.type === 'event' ? 'bg-orange-500 text-white' : 'bg-teal-500 text-white'
              }`}
            >
              {pass.type}
            </span>
            <span className="text-blue-100">{formatDate(pass.createdAt)}</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Pass Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-800 font-medium">{pass.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-gray-800 font-medium">{pass.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment ID</p>
                    <p className="text-gray-800 font-medium">{pass.signature}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-gray-800 font-medium">Rs. {pass.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Information</p>
                    <p className="text-gray-800">{pass.email}</p>
                    <p className="text-gray-800">{pass.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-gray-800">{formatDate(pass.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-800">{formatDate(pass.updatedAt)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSendEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <Mail size={16} className="mr-2" />
                    Send Email
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Participants</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {pass.noOfParticipants} {pass.noOfParticipants === 1 ? 'Participant' : 'Participants'}
                  </span>
                </div>

                <div className="space-y-3">
                  {pass.participantsData.map((participant, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{participant.name}</p>
                          <p className="text-sm text-gray-500">Participant {index + 1}</p>
                        </div>
                        {participant.arrived ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle size={16} className="mr-1" />
                            Arrived
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <XCircle size={16} className="mr-1" />
                            Not Arrived
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewPass;
