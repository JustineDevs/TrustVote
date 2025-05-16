
'use client';
import { FaFingerprint, FaShieldAlt, FaChartLine, FaMobileAlt } from 'react-icons/fa';
const Features = () => {
  const features = [
    {
      icon: <FaFingerprint className="text-5xl text-indigo-500 mb-4" />,
      title: "Biometric Verification",
      description: "Secure identity verification with face scan and voter ID ensures only eligible voters participate, preventing fraud and duplicate votes."
    },
    {
      icon: <FaShieldAlt className="text-5xl text-indigo-500 mb-4" />,
      title: "Blockchain Security",
      description: "Votes are recorded on the Base network blockchain, creating an immutable, transparent record that cannot be tampered with."
    },
    {
      icon: <FaChartLine className="text-5xl text-indigo-500 mb-4" />,
      title: "AI-Powered Efficiency",
      description: "Advanced AI algorithms accelerate vote processing and detect fraud in real-time, ensuring the integrity of the entire voting process."
    },
    {
      icon: <FaMobileAlt className="text-5xl text-indigo-500 mb-4" />,
      title: "Accessible Voting",
      description: "Vote securely from anywhere using mobile devices or computers, increasing participation and making democracy more accessible."
    }
  ];
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-black text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;
