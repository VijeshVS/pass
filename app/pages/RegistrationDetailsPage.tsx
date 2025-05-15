'use client'
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users, Calendar, Mail, Phone } from 'lucide-react';
import { Pass } from '../types';
import LoadingSpinner from '@/app/components/viewComp/ui/LoadingSpinner';
import ErrorMessage from '@/app/components/viewComp/ui/ErrorMessage';
import { getPassDetails } from '../actions/details';
import { getPassIdFromUrl } from '../utils/helpers';
import { useRouter } from 'next/navigation';

const RegistrationDetailsPage: React.FC = () => {
  const router = useRouter();
  const [pass, setPass] = useState<Pass | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPassDetails = async () => {
      try {
        setLoading(true);
        const passId = getPassIdFromUrl();
        
        if (!passId) {
          setError('Registration ID is missing from the URL');
          setLoading(false);
          return;
        }

        const passResponse = await getPassDetails(passId,localStorage.getItem('token') || "");
        if (passResponse.status != 200 || !passResponse.pass) {
          setError('Failed to load registration details');
          setLoading(false);
          return;
        }

        setPass(passResponse.pass);
      } catch (err) {
        setError('An error occurred while fetching registration details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPassDetails();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !pass) {
    return <ErrorMessage message={error || 'Registration not found'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{pass.name}</h1>
            <p className="text-purple-100 mt-1">Registration Details</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="text-gray-900 font-medium">{pass.email}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <p className="text-gray-900 font-medium">{pass.phone}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">Number of Participants</span>
                  </div>
                  <p className="text-gray-900 font-medium">{pass.noOfParticipants}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Registration Date</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {new Date(pass.createdAt || '').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-purple-800 mb-3">Payment Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="font-medium text-gray-900">₹{pass.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Type</span>
                      <span className="font-medium text-gray-900 capitalize">{pass.type}</span>
                    </div>
                    {pass.orderId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID</span>
                        <span className="font-medium text-gray-900">{pass.orderId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {pass.participantsData && pass.participantsData.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Participants</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {pass.participantsData.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-3 rounded-lg"
                      >
                        <span className="font-medium text-gray-900">{participant.name}</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            participant.arrived
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {participant.arrived ? 'Arrived' : 'Not Arrived'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetailsPage;