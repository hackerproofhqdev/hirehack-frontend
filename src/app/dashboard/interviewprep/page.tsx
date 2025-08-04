"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Users, Phone, PhoneOff, Lock, Crown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/actions/getUserProfile';
import Vapi from "@vapi-ai/web";
import AIInterviewerHeader from '@/components/AIInterviewerHeader';
import { cn } from '@/lib/utils';

interface UserProfile {
  plain_period: string | null;
  subscription_status: string;
  username: string;
  password: string;
  email: string;
  id: number;
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const CALL_STATUS = {
  INACTIVE: 'INACTIVE',
  CONNECTING: 'CONNECTING',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
};

export default function InterviewChat() {
  const router = useRouter()
  const [jobRole, setJobRole] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [callStatus, setCallStatus] = useState(CALL_STATUS.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const vapiRef = useRef<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        
        // Check if user has free trial or active subscription
        const hasValidSubscription = profile.subscription_status === 'active' || 
                                    profile.subscription_status === 'trial' ||
                                    profile.plain_period !== null;
        
        setHasAccess(hasValidSubscription);
      } catch (error) {
        console.error('User data error:', error);
        setHasAccess(false);
      } finally {
        setIsCheckingSubscription(false);
      }
    };
    loadUserData();
  }, []);

  // VAPI Event Handlers
  const onCallStart = () => {
    setCallStatus(CALL_STATUS.ACTIVE);
    console.log("Interview call started");
  };

  const onSpeechStart = () => {
    setIsSpeaking(true);
    console.log("AI interviewer is speaking");
  };

  const onSpeechEnd = () => {
    setIsSpeaking(false);
    console.log("AI interviewer stopped speaking");
  };

  const onCallEnd = () => {
    setCallStatus(CALL_STATUS.FINISHED);
    console.log("Interview ended");
    vapiRef.current = null;
  };

  const onMessage = (message: any) => {
    if (message.type === "transcript" && message.transcriptType === "final") {
      const newMessage = { role: message.role, content: message.transcript };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  useEffect(() => {
    if (!vapiRef.current) return;

    vapiRef.current.on("call-start", onCallStart);
    vapiRef.current.on("speech-start", onSpeechStart);
    vapiRef.current.on("speech-end", onSpeechEnd);
    vapiRef.current.on("call-end", onCallEnd);
    vapiRef.current.on("message", onMessage);
    vapiRef.current.on("error", (error: any) => {
      console.error("Interview error:", error);
    });

    return () => {
      if (!vapiRef.current) return;
      vapiRef.current.off("call-start", onCallStart);
      vapiRef.current.off("speech-start", onSpeechStart);
      vapiRef.current.off("speech-end", onSpeechEnd);
      vapiRef.current.off("call-end", onCallEnd);
      vapiRef.current.off("message", onMessage);
    };
  }, [vapiRef.current]);

  const startInterview = async () => {
    if (!jobRole.trim() || !jobDesc.trim()) {
      alert("Please enter both job role and description");
      return;
    }

    if (!vapiRef.current) {
      vapiRef.current = new Vapi("7d6a7dd7-4d46-4834-b51d-117aedb166b3");
    }

    setCallStatus(CALL_STATUS.CONNECTING);
    
    try {
      await vapiRef.current.start("0950ef7a-a746-4dec-9461-7e011af51e1c", {
        variableValues: {
          role: jobRole,
          jobDescription: jobDesc,
        }
      });
    } catch (error) {
      console.error("Failed to start interview:", error);
      setCallStatus(CALL_STATUS.INACTIVE);
    }
  };

  // Show loading state while checking subscription
  if (isCheckingSubscription) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-gray-400">Checking subscription status...</p>
        </div>
      </div>
    )
  }

  // Show paywall if user doesn't have access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <AIInterviewerHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="max-w-4xl mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl border border-gray-700 p-12 text-center"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                Premium Feature
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                AI Interview Preparation is available for users with active subscriptions or free trial access.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-emerald-400">
                <Crown className="w-5 h-5" />
                <span>AI-Powered Voice Interviews</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-emerald-400">
                <Crown className="w-5 h-5" />
                <span>Real-time Feedback & Analysis</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-emerald-400">
                <Crown className="w-5 h-5" />
                <span>Personalized Interview Questions</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/pricing')}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Upgrade to Premium
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
        <AIInterviewerHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
            AI Voice Interview Simulator
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Practice your interview skills with our AI-powered voice interviewer
          </p>
        </motion.div>

        {(callStatus === CALL_STATUS.INACTIVE || callStatus === CALL_STATUS.FINISHED) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Role</label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g. Senior React Developer"
                    className="w-full bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                  <textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={5}
                    className="w-full bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30 outline-none"
                  />
                </div>
                <button
                  onClick={startInterview}
                  className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Start Voice Interview
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {(callStatus === CALL_STATUS.ACTIVE || callStatus === CALL_STATUS.CONNECTING) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-gray-900 z-50"
          >
            {/* Google Meet Style Header */}
            <div className="absolute top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm p-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">Interviewing for: {jobRole}</h2>
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${callStatus === CALL_STATUS.ACTIVE ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
                  <span className="text-sm text-gray-300">{callStatus === CALL_STATUS.ACTIVE ? 'Connected' : 'Connecting...'}</span>
                </div>
              </div>
            </div>

            {/* Main Video Grid */}
            <div className="h-full pt-16 pb-20 relative">
              {/* Large AI Interviewer Screen */}
              <div className="h-full w-full relative">
                <div className={`h-full w-full bg-gray-800 flex items-center justify-center relative ${isSpeaking ? 'ring-4 ring-emerald-500/50' : ''}`}>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center relative">
                      <Users className="w-16 h-16 text-white" />
                      {isSpeaking && (
                        <>
                          <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-speak-wave-1" />
                          <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-speak-wave-2" />
                          <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-speak-wave-3" />
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-medium text-white">AI Interviewer</h3>
                  </div>
                </div>
              </div>

              {/* Small User Video in Corner */}
              <div className="absolute bottom-24 right-6 w-48 h-32 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden">
                <div className="h-full w-full bg-gray-700 flex items-center justify-center relative">
                                     <div className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                       <Users className="w-8 h-8 text-white" />
                     </div>
                     <span className="text-sm font-medium text-white">{userProfile?.username || 'You'}</span>
                   </div>
                  
                </div>
              </div>
            </div>

            {/* Transcript Area */}
            {messages.length > 0 && lastMessage && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600"
                >
                  <p className={cn(
                    "text-white text-center transition-opacity duration-500",
                    "animate-fadeIn"
                  )}>
                    {lastMessage}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm p-4">
              <div className="flex justify-center">
                <button
                  onClick={() => vapiRef.current?.stop()}
                  className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2 text-white font-medium"
                >
                  <PhoneOff className="w-5 h-5" />
                  End Interview
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}