
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { FaCalendarAlt, FaUsers, FaVoteYea, FaFilter, FaSearch } from 'react-icons/fa';
interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalVoters: number;
  totalVotes: number;
  status: 'upcoming' | 'active' | 'ended';
}
export default function Elections() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [elections, setElections] = useState<Election[]>([]);
  const [filteredElections, setFilteredElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  useEffect(() => {
    if (isConnected) {
      fetchElections();
    } else {
      router.push('/');
    }
  }, [isConnected, router]);
  useEffect(() => {
    filterElections();
  }, [filter, searchTerm, elections]);
  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protocol: 'https',
          origin: 'api.trustvote.ph',
          path: '/api/elections',
          method: 'GET',
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch elections');
      }
      const data = await response.json();
      setElections(data.elections || []);
    } catch (error) {
      console.error('Error fetching elections:', error);
      // For demo purposes, set some sample data
      setElections([
        {
          id: '1',
          title: 'Barangay Elections 2023',
          description: 'Vote for your local Barangay officials',
          startDate: '2023-10-30T00:00:00Z',
          endDate: '2023-10-30T23:59:59Z',
          totalVoters: 1500,
          totalVotes: 750,
          status: 'active'
        },
        {
          id: '2',
          title: 'City Council Elections',
          description: 'Vote for your city council representatives',
          startDate: '2023-11-15T00:00:00Z',
          endDate: '2023-11-15T23:59:59Z',
          totalVoters: 5000,
          totalVotes: 0,
          status: 'upcoming'
        },
        {
          id: '3',
          title: 'Provincial Governor Elections',
          description: 'Vote for your provincial governor',
          startDate: '2023-09-01T00:00:00Z',
          endDate: '2023-09-01T23:59:59Z',
          totalVoters: 10000,
          totalVotes: 7500,
          status: 'ended'
        },
        {
          id: '4',
          title: 'School Board Elections',
          description: 'Vote for your local school board representatives',
          startDate: '2023-12-05T00:00:00Z',
          endDate: '2023-12-05T23:59:59Z',
          totalVoters: 3000,
          totalVotes: 0,
          status: 'upcoming'
        },
        {
          id: '5',
          title: 'Community Association Elections',
          description: 'Vote for your community association leaders',
          startDate: '2023-10-15T00:00:00Z',
          endDate: '2023-10-15T23:59:59Z',
          totalVoters: 500,
          totalVotes: 350,
          status: 'ended'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  const filterElections = () => {
    let filtered = [...elections];
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(election => election.status === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        election => 
          election.title.toLowerCase().includes(term) || 
          election.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredElections(filtered);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Active</span>;
      case 'upcoming':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Upcoming</span>;
      case 'ended':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Ended</span>;
      default:
        return null;
    }
  };
  const handleElectionClick = (electionId: string) => {
    router.push(`/elections/${electionId}`);
  };
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <nav className="bg-black text-white p-4 rounded-lg mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="TrustVote Logo" 
                className="h-8 w-8 mr-2 cursor-pointer" 
                onClick={() => router.push('/')}
              />
              <span 
                className="text-xl font-bold cursor-pointer" 
                onClick={() => router.push('/')}
              >
                TrustVote
              </span>
            </div>
            <div>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
            </div>
          </div>
        </nav>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-black mb-6">Elections</h1>
          
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <FaFilter className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Elections</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="ended">Ended</option>
              </select>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search elections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* Elections List */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredElections.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No elections found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredElections.map((election) => (
                <div 
                  key={election.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border"
                  onClick={() => handleElectionClick(election.id)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-black">{election.title}</h3>
                      {getStatusBadge(election.status)}
                    </div>
                    <p className="text-gray-600 mb-4">{election.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="mr-2 text-indigo-500" />
                        <span>{formatDate(election.startDate)} - {formatDate(election.endDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaUsers className="mr-2 text-indigo-500" />
                        <span>{election.totalVoters} registered voters</span>
                      </div>
                      {election.status !== 'upcoming' && (
                        <div className="flex items-center text-gray-700">
                          <FaVoteYea className="mr-2 text-indigo-500" />
                          <span>{election.totalVotes} votes cast ({Math.round((election.totalVotes / election.totalVoters) * 100)}%)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3">
                    <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      {election.status === 'active' ? 'Vote Now' : election.status === 'upcoming' ? 'View Details' : 'View Results'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
