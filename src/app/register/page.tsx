
'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { FaIdCard, FaCamera, FaCheck, FaTimes } from 'react-icons/fa';
export default function Register() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('');
  const [voterId, setVoterId] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [idImage, setIdImage] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);
  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdImage(file);
      setIdPreview(URL.createObjectURL(file));
    }
  };
  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure you have granted camera permissions.');
      setIsCapturing(false);
    }
  };
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'face-capture.png', { type: 'image/png' });
            setFaceImage(file);
            setFacePreview(URL.createObjectURL(blob));
            stopCamera();
          }
        }, 'image/png');
      }
    }
  };
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };
  const retakePhoto = () => {
    setFaceImage(null);
    setFacePreview(null);
    startCamera();
  };
  const validateStep1 = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!voterId.trim()) {
      setError('Please enter your voter ID');
      return false;
    }
    if (!birthdate) {
      setError('Please enter your birthdate');
      return false;
    }
    if (!idImage) {
      setError('Please upload an image of your voter ID');
      return false;
    }
    setError(null);
    return true;
  };
  const validateStep2 = () => {
    if (!faceImage) {
      setError('Please capture your face image');
      return false;
    }
    setError(null);
    return true;
  };
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      submitRegistration();
    }
  };
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const submitRegistration = async () => {
    if (!address) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create form data for file uploads
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('voterId', voterId);
      formData.append('birthdate', birthdate);
      formData.append('walletAddress', address);
      if (idImage) formData.append('idImage', idImage);
      if (faceImage) formData.append('faceImage', faceImage);
      
      // In a real implementation, you would send this to your API
      // For now, we'll simulate a successful registration
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page
      router.push('/register/success');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
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
          <div className="bg-black text-white p-6">
            <h1 className="text-2xl font-bold">Voter Registration</h1>
            <p className="text-gray-300 mt-2">Complete your registration to participate in elections</p>
          </div>
          {/* Progress Steps */}
          <div className="flex justify-center p-4 border-b">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>
          {/* Form Content */}
          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Personal Information</h2>
                
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="voterId" className="block text-gray-700 mb-2">Voter ID</label>
                  <input
                    type="text"
                    id="voterId"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your voter ID number"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="birthdate" className="block text-gray-700 mb-2">Birthdate</label>
                  <input
                    type="date"
                    id="birthdate"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Upload Voter ID</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdImageChange}
                      className="hidden"
                      id="id-upload"
                    />
                    {!idPreview ? (
                      <label htmlFor="id-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <FaIdCard className="text-4xl text-gray-400 mb-2" />
                          <span className="text-gray-600">Click to upload your voter ID</span>
                          <span className="text-gray-400 text-sm mt-1">JPG, PNG or PDF accepted</span>
                        </div>
                      </label>
                    ) : (
                      <div>
                        <img src={idPreview} alt="ID Preview" className="max-h-40 mx-auto mb-2" />
                        <button
                          onClick={() => {
                            setIdImage(null);
                            setIdPreview(null);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">Biometric Verification</h2>
                <p className="text-gray-600 mb-6">
                  We need to capture your face to verify your identity. This helps prevent fraud and ensures the integrity of the voting process.
                </p>
                
                <div className="mb-6">
                  {!facePreview ? (
                    <div className="border rounded-lg overflow-hidden">
                      {isCapturing ? (
                        <div className="relative">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-64 object-cover"
                          ></video>
                          <button
                            onClick={captureImage}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                          >
                            Capture
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 bg-gray-100">
                          <FaCamera className="text-4xl text-gray-400 mb-2" />
                          <button
                            onClick={startCamera}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                          >
                            Start Camera
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={facePreview}
                          alt="Face Preview"
                          className="w-full h-64 object-cover"
                        />
                        <button
                          onClick={retakePhoto}
                          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                          Retake
                        </button>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-blue-800 font-semibold mb-2">Privacy Notice</h3>
                  <p className="text-blue-700 text-sm">
                    Your biometric data is encrypted and stored securely. It will only be used for voter verification purposes and will not be shared with third parties.
                  </p>
                </div>
              </div>
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  disabled={isSubmitting}
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
              
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : step < 2 ? 'Next' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
