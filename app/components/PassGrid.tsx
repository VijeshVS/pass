'use client'
import React, { useState, useEffect } from 'react';
import { Pass } from '../types';
import PassCard from './PassCard';
import PassSkeleton from './PassSkeleton';
import { Search, Download, Filter, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getAllPasses } from '../actions/details';

const PassGrid: React.FC = () => {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [filteredPasses, setFilteredPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pass' | 'event'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState({
    start: '',
    startTime: '00:00',
    end: '',
    endTime: '23:59'
  });

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        setLoading(true);
        const data = await getAllPasses(localStorage.getItem('token') || "");
        setPasses(data.passes);
        setFilteredPasses(data.passes);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch passes. Please try again later.');
        setLoading(false);
        console.error('Error fetching passes:', err);
      }
    };

    fetchPasses();
  }, []);

  useEffect(() => {
    let filtered = [...passes];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pass => 
        pass.name.toLowerCase().includes(term) || 
        pass.orderId.toLowerCase().includes(term) ||
        (pass.participantsData && pass.participantsData.some(p => 
          p.name.toLowerCase().includes(term)
        ))
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(pass => pass.type === typeFilter);
    }

    // Apply date range filter with time
    if (dateRange.start) {
      const startDateTime = new Date(`${dateRange.start}T${dateRange.startTime}`);
      filtered = filtered.filter(pass => 
        new Date(pass.createdAt) >= startDateTime
      );
    }
    if (dateRange.end) {
      const endDateTime = new Date(`${dateRange.end}T${dateRange.endTime}`);
      filtered = filtered.filter(pass => 
        new Date(pass.createdAt) <= endDateTime
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredPasses(filtered);
  }, [searchTerm, typeFilter, sortOrder, dateRange, passes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    const data = filteredPasses.map(pass => ({
      'Order ID': pass.orderId,
      'Payment ID': pass.signature,
      'Type': pass.type,
      'Name': pass.name,
      'First Participant': pass.participantsData[0]?.name || 'N/A',
      'Total Participants': pass.noOfParticipants,
      'Amount': pass.amount,
      'Created At': new Date(pass.createdAt).toLocaleString(),
      'Updated At': new Date(pass.updatedAt).toLocaleString(),
      'Email': pass.email,
      'Phone': pass.phone
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Passes');
    XLSX.writeFile(wb, 'passes-export.xlsx');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, index) => (
            <PassSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md inline-block">
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search passes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'pass' | 'event')}
            >
              <option value="all">All Types</option>
              <option value="pass">Passes</option>
              <option value="event">Events</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download size={20} className="mr-2" />
            Export to Excel
          </button>
        </div>

        {/* Date Range Filters with Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange.startTime}
                onChange={(e) => setDateRange(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange.endTime}
                onChange={(e) => setDateRange(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>
      
      {filteredPasses.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No passes found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPasses.map(pass => (
            <PassCard key={pass._id} pass={pass} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PassGrid;