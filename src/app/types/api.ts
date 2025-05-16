
export type APIError = {
    code: string;    // The Error code
    error: string;   // The Error long message
    message: string; // The Error short message
  };
  // Type guard for API error responses
  export function isApiError(response: unknown): response is APIError {
    return (
      response !== null && 
      typeof response === 'object' && 
      'error' in response
    );
  }
  export interface Voter {
    id: string;
    walletAddress: string;
    fullName: string;
    voterId: string;
    birthdate: string;
    isVerified: boolean;
    registrationDate: string;
  }
  export interface Candidate {
    id: string;
    name: string;
    party: string;
    position: string;
    imageUrl: string;
    votes: number;
  }
  export interface Position {
    id: string;
    title: string;
    maxSelections: number;
    candidates: Candidate[];
  }
  export interface Election {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    totalVoters: number;
    totalVotes: number;
    status: 'upcoming' | 'active' | 'ended';
    positions: Position[];
  }
  export interface Vote {
    id: string;
    electionId: string;
    voterAddress: string;
    candidateIds: string[];
    timestamp: string;
    transactionHash: string;
  }
  