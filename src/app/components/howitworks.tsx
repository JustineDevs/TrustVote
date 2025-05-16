
'use client';
const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Register & Verify",
      description: "Connect your wallet, register with your voter ID, and complete biometric verification to prove your identity and eligibility."
    },
    {
      number: "02",
      title: "Cast Your Vote",
      description: "When an election is active, securely cast your vote. Your vote is immediately recorded on the blockchain, making it permanent and verifiable."
    },
    {
      number: "03",
      title: "Real-Time Monitoring",
      description: "AI analyzes voting patterns to detect fraud while our system ensures each vote is counted correctly and transparently."
    },
    {
      number: "04",
      title: "Verify Results",
      description: "Once voting ends, results are automatically tallied by smart contracts and displayed publicly, allowing anyone to verify the outcome."
    }
  ];
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-black text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <div className="text-4xl font-bold text-indigo-400 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
