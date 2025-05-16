'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { FaCheckCircle } from 'react-icons/fa';
export default function RegistrationSuccess() {
  const router = useRouter();
  const { isConnected } = useAccount();
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
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
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-black mb-4">Registration Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your voter registration has been submitted and is being processed. You will receive a confirmation once your identity has been verified.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-black mb-4">What's Next?</h2>
              <ol className="text-left text-gray-700 space-y-4">
                <li className="flex items-start">
                  <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                  <span>Our system will verify your identity using the information you provided.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                  <span>Once verified, you'll receive a confirmation notification.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                  <span>You can then participate in all eligible elections on the platform.</span>
                </li>
              </ol>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => router.push('/elections')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                View Elections
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
