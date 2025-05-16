
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaUsers, FaVoteYea } from 'react-icons/fa';
import { useAccount } from 'wagmi';
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
const ElectionsList = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { address, isConnected } = useAccount();
  useEffect(() => {
    if (isConnected) {
      fetchElections();
    }
  }, [isConnected]);
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
          path: '/api/elections/active',
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
        }
      ]);
    } finally {
      setLoading(false);
    }
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
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  if (elections.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No active elections at the moment.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {elections.map((election) => (
        <div 
          key={election.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
  );
};
export default ElectionsList;
