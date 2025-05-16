
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import ElectionsList from './components/ElectionsList';
export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  useEffect(() => {
    // Check if user is registered when wallet is connected
    if (isConnected && address) {
      checkUserRegistration(address);
    }
  }, [isConnected, address]);
  const checkUserRegistration = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protocol: 'https',
          origin: 'api.trustvote.ph',
          path: '/api/voters/check',
          method: 'POST',
          body: JSON.stringify({ walletAddress }),
        }),
      });
      const data = await response.json();
      setIsRegistered(data.isRegistered);
    } catch (error) {
      console.error('Error checking registration:', error);
      setIsRegistered(false);
    }
  };
  const handleGetStarted = () => {
    if (isConnected) {
      if (isRegistered) {
        router.push('/elections');
      } else {
        router.push('/register');
      }
    } else {
      // The wallet connection modal will be triggered by the ConnectWallet component
      document.getElementById('connect-wallet-button')?.click();
    }
  };
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.svg" alt="TrustVote Logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">TrustVote</span>
            <span className="ml-2 text-xs text-gray-400">Built with OnchainKit SDK v0.38.13</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#features" className="hover:text-indigo-400">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-400">How It Works</a>
            <div id="connect-wallet-button">
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <Hero onGetStarted={handleGetStarted} />
      {/* Active Elections Section (only shown when connected) */}
      {isConnected && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-black text-center mb-8">Active Elections</h2>
            <ElectionsList />
            <div className="text-center mt-8">
              <button
                onClick={() => router.push('/elections')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View All Elections
              </button>
            </div>
          </div>
        </section>
      )}
      {/* Features Section */}
      <Features />
      {/* How It Works Section */}
      <HowItWorks />
      {/* Footer */}
      <Footer />
    </main>
  );
}
