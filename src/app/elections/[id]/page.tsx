
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from '@coinbase/onchainkit/transaction';
import { FaCalendarAlt, FaUsers, FaVoteYea, FaArrowLeft, FaCheckCircle, FaInfoCircle, FaLock } from 'react-icons/fa';
interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  imageUrl: string;
  votes: number;
}
interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalVoters: number;
  totalVotes: number;
  status: 'upcoming' | 'active' | 'ended';
  positions: {
    id: string;
    title: string;
    maxSelections: number;
    candidates: Candidate[];
  }[];
}
export default function ElectionDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string[]>>({});
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
    
    fetchElectionDetails();
    checkVotingStatus();
  }, [isConnected, params.id, router]);
  const fetchElectionDetails = async () => {
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
          path: `/api/elections/${params.id}`,
          method: 'GET',
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch election details');
      }
      const data = await response.json();
      setElection(data.election || null);
    } catch (error) {
      console.error('Error fetching election details:', error);
      // For demo purposes, set sample data
      setElection({
        id: params.id,
        title: 'Barangay Elections 2023',
        description: 'Vote for your local Barangay officials for the term 2023-2026. Your vote matters in shaping the future of your community.',
        startDate: '2023-10-30T00:00:00Z',
        endDate: '2023-10-30T23:59:59Z',
        totalVoters: 1500,
        totalVotes: 750,
        status: 'active',
        positions: [
          {
            id: 'pos1',
            title: 'Barangay Captain',
            maxSelections: 1,
            candidates: [
              {
                id: 'cand1',
                name: 'Maria Santos',
                party: 'Unity Party',
                position: 'Barangay Captain',
                imageUrl: '/candidates/maria.jpg',
                votes: 320
              },
              {
                id: 'cand2',
                name: 'Juan Dela Cruz',
                party: 'Progress Party',
                position: 'Barangay Captain',
                imageUrl: '/candidates/juan.jpg',
                votes: 280
              },
              {
                id: 'cand3',
                name: 'Pedro Reyes',
                party: 'Independent',
                position: 'Barangay Captain',
                imageUrl: '/candidates/pedro.jpg',
                votes: 150
              }
            ]
          },
          {
            id: 'pos2',
            title: 'Barangay Councilor',
            maxSelections: 3,
            candidates: [
              {
                id: 'cand4',
                name: 'Ana Gonzales',
                party: 'Unity Party',
                position: 'Barangay Councilor',
                imageUrl: '/candidates/ana.jpg',
                votes: 400
              },
              {
                id: 'cand5',
                name: 'Roberto Lim',
                party: 'Progress Party',
                position: 'Barangay Councilor',
                imageUrl: '/candidates/roberto.jpg',
                votes: 350
              },
              {
                id: 'cand6',
                name: 'Elena Magtanggol',
                party: 'Unity Party',
                position: 'Barangay Councilor',
                imageUrl: '/candidates/elena.jpg',
                votes: 300
              },
              {
                id: 'cand7',
                name: 'Carlos Bautista',
                party: 'Independent',
                position: 'Barangay Councilor',
                imageUrl: '/candidates/carlos.jpg',
                votes: 250
              },
              {
                id: 'cand8',
                name: 'Sophia Reyes',
                party: 'Progress Party',
                position: 'Barangay Councilor',
                imageUrl: '/candidates/sophia.jpg',
                votes: 200
              }
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };
  const checkVotingStatus = async () => {
    if (!address || !params.id) return;
    
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protocol: 'https',
          origin: 'api.trustvote.ph',
          path: `/api/elections/${params.id}/check-vote`,
          method: 'POST',
          body: JSON.stringify({ walletAddress: address }),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to check voting status');
      }
      const data = await response.json();
      setHasVoted(data.hasVoted || false);
    } catch (error) {
      console.error('Error checking voting status:', error);
      // For demo purposes, assume not voted
      setHasVoted(false);
    }
  };
  const handleCandidateSelection = (positionId: string, candidateId: string) => {
    if (election?.status !== 'active' || hasVoted) return;
    
    const position = election.positions.find(p => p.id === positionId);
    if (!position) return;
    
    setSelectedCandidates(prev => {
      const currentSelections = prev[positionId] || [];
      
      // If single selection position
      if (position.maxSelections === 1) {
        return {
          ...prev,
          [positionId]: [candidateId]
        };
      }
      
      // If multi-selection position
      if (currentSelections.includes(candidateId)) {
        // Remove if already selected
        return {
          ...prev,
          [positionId]: currentSelections.filter(id => id !== candidateId)
        };
      } else if (currentSelections.length < position.maxSelections) {
        // Add if under max selections
        return {
          ...prev,
          [positionId]: [...currentSelections, candidateId]
        };
      }
      
      return prev;
    });
  };
  const isCandidateSelected = (positionId: string, candidateId: string) => {
    return (selectedCandidates[positionId] || []).includes(candidateId);
  };
  const isVoteComplete = () => {
    if (!election) return false;
    
    // Check if all positions have selections
    return election.positions.every(position => {
      const selections = selectedCandidates[position.id] || [];
      return selections.length > 0;
    });
  };
  const handleSubmitVote = async () => {
    if (!address || !election || !isVoteComplete()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real implementation, this would be a blockchain transaction
      // For demo purposes, we'll simulate a successful vote
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasVoted(true);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Voting error:', error);
      setError('Failed to submit your vote. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Active</span>;
      case 'upcoming':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Upcoming</span>;
      case 'ended':
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">Ended</span>;
      default:
        return null;
    }
  };
  const getVotingCalls = () => {
    // In a real implementation, this would create the actual blockchain transaction calls
    // For demo purposes, we'll return a simple call
    return [
      {
        address: '0x67c97D1FB8184F038592b2109F854dfb09C77C75',
        abi: [
          {
            type: 'function',
            name: 'vote',
            inputs: [
              {
                type: 'string',
                name: 'electionId'
              },
              {
                type: 'string[]',
                name: 'candidateIds'
              }
            ],
            outputs: [],
            stateMutability: 'nonpayable',
          },
        ] as const,
        functionName: 'vote',
        args: [
          params.id,
          Object.values(selectedCandidates).flat()
        ],
      }
    ];
  };
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <nav className="bg-black text-white p-4 rounded-lg mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src="/logo.svg" alt="TrustVote Logo" className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold">TrustVote</span>
              </div>
              <div>
                <ConnectWallet>
                  <Avatar className="h-6 w-6" />
                  <Name />
                </ConnectWallet>
              </div>
            </div>
          </nav>
          
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </main>
    );
  }
  if (!election) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <nav className="bg-black text-white p-4 rounded-lg mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src="/logo.svg" alt="TrustVote Logo" className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold">TrustVote</span>
              </div>
              <div>
                <ConnectWallet>
                  <Avatar className="h-6 w-6" />
                  <Name />
                </ConnectWallet>
              </div>
            </div>
          </nav>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Election Not Found</h2>
            <p className="text-gray-600 mb-6">The election you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/elections')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Back to Elections
            </button>
          </div>
        </div>
      </main>
    );
  }
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
        {/* Back Button */}
        <button
          onClick={() => router.push('/elections')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Elections
        </button>
        {/* Election Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{election.title}</h1>
              <div className="flex items-center space-x-4">
                {getStatusBadge(election.status)}
                <span className="text-gray-600">
                  <FaCalendarAlt className="inline mr-2 text-indigo-500" />
                  {formatDate(election.startDate)} - {formatDate(election.endDate)}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{election.totalVoters}</div>
                <div className="text-sm text-gray-600">Registered Voters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{election.totalVotes}</div>
                <div className="text-sm text-gray-600">Votes Cast</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {election.totalVoters > 0 ? Math.round((election.totalVotes / election.totalVoters) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Participation</div>
              </div>
            </div>
          </div>
          <p className="text-gray-700">{election.description}</p>
        </div>
        {/* Voting Status Message */}
        {hasVoted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start">
            <FaCheckCircle className="text-green-500 text-xl mr-3 mt-1" />
            <div>
              <h3 className="text-green-800 font-semibold">You have already voted in this election</h3>
              <p className="text-green-700">Your vote has been securely recorded on the blockchain and cannot be changed.</p>
            </div>
          </div>
        )}
        {election.status === 'upcoming' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start">
            <FaInfoCircle className="text-blue-500 text-xl mr-3 mt-1" />
            <div>
              <h3 className="text-blue-800 font-semibold">This election has not started yet</h3>
              <p className="text-blue-700">Voting will begin on {formatDate(election.startDate)}. Please check back then to cast your vote.</p>
            </div>
          </div>
        )}
        {election.status === 'ended' && !hasVoted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-start">
            <FaInfoCircle className="text-yellow-500 text-xl mr-3 mt-1" />
            <div>
              <h3 className="text-yellow-800 font-semibold">This election has ended</h3>
              <p className="text-yellow-700">Voting closed on {formatDate(election.endDate)}. You did not participate in this election.</p>
            </div>
          </div>
        )}
        {/* Voting Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">
            {election.status === 'active' && !hasVoted ? 'Cast Your Vote' : 'Candidates & Results'}
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {election.positions.map((position) => (
            <div key={position.id} className="mb-8">
              <div className="border-b border-gray-200 pb-2 mb-4">
                <h3 className="text-xl font-semibold text-black">{position.title}</h3>
                {election.status === 'active' && !hasVoted && (
                  <p className="text-gray-600 text-sm">
                    Select {position.maxSelections > 1 ? `up to ${position.maxSelections} candidates` : 'one candidate'}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {position.candidates.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    className={`border rounded-lg p-4 ${
                      election.status === 'active' && !hasVoted
                        ? isCandidateSelected(position.id, candidate.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'hover:border-gray-400 cursor-pointer'
                        : ''
                    }`}
                    onClick={() => {
                      if (election.status === 'active' && !hasVoted) {
                        handleCandidateSelection(position.id, candidate.id);
                      }
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                        {candidate.imageUrl ? (
                          <img 
                            src={candidate.imageUrl} 
                            alt={candidate.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback for missing images
                              (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                            {candidate.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">{candidate.name}</h4>
                        <p className="text-gray-600 text-sm">{candidate.party}</p>
                      </div>
                    </div>
                    
                    {election.status === 'active' && !hasVoted ? (
                      <div className="flex items-center">
                        <div className={`w-5 h-5 border rounded-full mr-2 flex items-center justify-center ${
                          isCandidateSelected(position.id, candidate.id) 
                            ? 'bg-indigo-600 border-indigo-600' 
                            : 'border-gray-400'
                        }`}>
                          {isCandidateSelected(position.id, candidate.id) && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-700">
                          {isCandidateSelected(position.id, candidate.id) ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ 
                              width: `${position.candidates.reduce((sum, c) => sum + c.votes, 0) > 0 
                                ? (candidate.votes / position.candidates.reduce((sum, c) => sum + c.votes, 0)) * 100 
                                : 0}%` 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{candidate.votes} votes</span>
                          <span className="font-medium text-indigo-600">
                            {position.candidates.reduce((sum, c) => sum + c.votes, 0) > 0 
                              ? Math.round((candidate.votes / position.candidates.reduce((sum, c) => sum + c.votes, 0)) * 100) 
                              : 0}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Submit Vote Button */}
          {election.status === 'active' && !hasVoted && (
            <div className="mt-8">
              <Transaction
                chainId={8453} // Base chain ID
                calls={getVotingCalls()}
              >
                <TransactionButton
                  disabled={!isVoteComplete() || isSubmitting}
                  className={`w-full py-3 rounded-lg ${
                    !isVoteComplete() || isSubmitting
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white font-semibold`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Submit Vote'
                  )}
                </TransactionButton>
                <TransactionStatus>
                  <TransactionStatusLabel />
                  <TransactionStatusAction />
                </TransactionStatus>
              </Transaction>
              
              <p className="text-gray-600 text-sm mt-2 text-center">
                <FaLock className="inline mr-1" />
                Your vote will be securely recorded on the blockchain and cannot be changed once submitted.
              </p>
            </div>
          )}
        </div>
        {/* Vote Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="text-center">
                <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-black mb-2">Vote Successfully Cast!</h2>
                <p className="text-gray-600 mb-6">
                  Your vote has been securely recorded on the blockchain. Thank you for participating in this election.
                </p>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    // Refresh the page to show updated results
                    window.location.reload();
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  View Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
