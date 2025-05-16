
'use client';
import { useAccount } from 'wagmi';
import Image from 'next/image';
interface HeroProps {
  onGetStarted: () => void;
}
const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const { isConnected } = useAccount();
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-400">
            Secure, Transparent Voting on the Blockchain
          </h1>
          <p className="text-xl mb-8">
            TrustVote revolutionizes the Philippine voting system with biometric verification, 
            blockchain transparency, and AI-enhanced security. Every vote counts, and every 
            vote is verifiable.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
          >
            {isConnected ? 'Get Started' : 'Connect Wallet to Start'}
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md h-80">
            <Image
              src="/hero-image.svg"
              alt="Secure Voting Illustration"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
