'use client'

import React, { useEffect, useState } from 'react';
import EventHeader from '@/app/components/viewComp/EventHeader';
import EventDetails from '@/app/components/viewComp/EventDetails';
import EventGuidelines from '@/app/components/viewComp/EventGuidelines';
import EventContacts from '@/app/components/viewComp/EventContacts';
import EventPasses from '@/app/components/viewComp/EventPasses';
import LoadingSpinner from '@/app/components/viewComp/ui/LoadingSpinner';
import ErrorMessage from '@/app/components/viewComp/ui/ErrorMessage';
import { Event, EventPassesResponse } from '../types';
import { getEventById, getEventPasses } from '../actions/events';
import { getEventIdFromUrl } from '../utils/helpers';
import * as XLSX from 'xlsx';

const EventDetailsPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [passes, setPasses] = useState<EventPassesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const DownloadAsExcel = () => {
    const allPasses = passes?.passes;

    const allSheets: { [sheetName: string]: XLSX.WorkSheet } = {};

    allPasses?.forEach(pass => {
      const participants = pass.participantsData ?? [];

      // Create a header row with event/pass name
      const headerRow = [[`Event Name: ${event?.name}`]];
      
      // Column headers
      const columns = [
        'Participant Name',
        'Arrived',
        'Email',
        'Phone',
        'Order ID',
        'Class ID',
        'Amount',
        'Type',
        'Created At',
        'Updated At',
      ];

      // Data rows
      const dataRows = participants.map(participant => [
        participant.name,
        participant.arrived ? 'Yes' : 'No',
        pass.email,
        pass.phone,
        pass.orderId ?? '',
        pass.classId ?? '',
        pass.amount,
        pass.type,
        pass.createdAt ? new Date(pass.createdAt).toISOString() : '',
        pass.updatedAt ? new Date(pass.updatedAt).toISOString() : '',
      ]);

      const fullSheetData = [
        ...headerRow,
        [],
        columns,
        ...dataRows,
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(fullSheetData);
      allSheets[pass.name] = worksheet;
    });

    const workbook = XLSX.utils.book_new();

    Object.entries(allSheets).forEach(([sheetName, worksheet]) => {
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31)); // Excel sheet names max length: 31
    });

    XLSX.writeFile(workbook, `passes-${event?.name}.xlsx`);
  }

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventId = getEventIdFromUrl();
        
        if (!eventId) {
          setError('Event ID is missing from the URL');
          setLoading(false);
          return;
        }

        // Fetch event details
        const eventResponse = await getEventById(eventId, localStorage.getItem('token') || "");
        if (eventResponse.status !== 200 || !eventResponse.event) {
          setError('Failed to load event details');
          setLoading(false);
          return;
        }
        // @ts-ignore
        setEvent(eventResponse.event);

        // Fetch event passes
        const passesResponse = await getEventPasses(localStorage.getItem('token') || "",eventId);
        if (!passesResponse.success) {
          console.error('Failed to load passes, but continuing with event details');
        } else {
          // @ts-ignore
          setPasses(passesResponse);
        }
      } catch (err) {
        setError('An error occurred while fetching event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !event) {
    return <ErrorMessage message={error || 'Event not found'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventHeader event={event} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventDetails event={event} />
            {event.guidelines && event.guidelines.length > 0 && (
              <EventGuidelines guidelines={event.guidelines} prizes={event.prizes} />
            )}
          </div>
          
          <div className="space-y-8">
            {event.contact && event.contact.length > 0 && (
              <EventContacts contacts={event.contact} />
            )}
            
            {passes && (
              <EventPasses 
                event_id={event._id}
                passes={passes.passes} 
                totalParticipants={passes.totalParticipants} 
                registrationOpen={event.registrationOpen}
                registrationDeadline={event.registrationDeadline}
                registrationFee={event.registrationFee}
                feetype={event.feetype}
                teamsRegistered={passes.teamsRegistered}
                partiallyTeamsEntered={passes.partiallyEntered}
                teamsEnteredFully={passes.teamEnteredFully}
                participantsEntered={passes.participantsEntered}
              />
            )}

            {/* @ts-ignore */}
            {passes?.passes.length > 0 ? <button onClick={DownloadAsExcel}
              className="w-full px-2 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Download as Excel
            </button>: <></>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;