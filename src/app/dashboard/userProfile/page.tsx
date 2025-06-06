"use client"
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '@/actions/getUserProfile';
import Navbar from '../../../components/UserProfileNav';
import { useRouter } from 'next/navigation';
import { User, Calendar, CreditCard, FileText, Crown, ArrowRight, Shield, Settings, Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from '@/components/StatusBadge';
import ProfileCard from '@/components/ProfileCard';
import { useToast } from "@/hooks/use-toast";





interface User {
  id: number;
  username: string;
  email: string;
  subscription_status: string;
  plain_period: string | null;
  subscription_id: string | null;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        console.log(profile)
        setUser(profile);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCancelSubscription = async () => {
    if (!user?.subscription_id) return;
    
    try {
      const cancelUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/cancel/${user.subscription_id}`;
      const response = await fetch(cancelUrl, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser({
          ...user,
          subscription_status: 'cancelled',
          subscription_id: null
        });
        toast({
          title: "Success",
          description: "Subscription cancelled successfully",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.message || "Failed to cancel subscription",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Network error. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 p-6">
          <p className="text-red-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {error}
          </p>
        </Card>
      </div>
    );
  }

  const profileItems = [
    {
      label: "Username",
      value: user.username,
      icon: <User className="w-5 h-5 text-blue-400" />
    },
    {
      label: "Email",
      value: user.email,
      icon: <Shield className="w-5 h-5 text-emerald-400" />
    }
  ];

  const subscriptionItems = [
    {
      label: "Status",
      value: user.subscription_status || 'Free Trial',
      icon: user.subscription_status === 'active' ? 
        <Crown className="w-5 h-5 text-yellow-400" /> : 
        <Calendar className="w-5 h-5 text-gray-400" />
    },
    {
      label: "Plan Period",
      value: user.plain_period || "N/A",
      icon: <CreditCard className="w-5 h-5 text-purple-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar text="Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 text-transparent bg-clip-text">
              User Profile
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your account and subscription details
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <StatusBadge status={user.subscription_status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ProfileCard 
            icon={User} 
            title="Profile Details" 
            items={profileItems} 
          />
          <ProfileCard 
            icon={CreditCard} 
            title="Subscription Details" 
            items={subscriptionItems} 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/dashboard/saveResume")}
            className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all text-white text-lg font-medium"
          >
            <FileText className="w-5 h-5" />
            View Saved Resumes
          </button>

          <button
            onClick={() => router.push("/dashboard/jobSearch")}
            className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all text-white text-lg font-medium"
          >
            <Search className="w-5 h-5" />
            Job Search
          </button>

          {user.subscription_id ? (
            <button
              onClick={handleCancelSubscription}
              className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all text-white text-lg font-medium"
            >
              <Shield className="w-5 h-5" />
              Cancel Subscription
            </button>
          ) : (
            <button
              onClick={() => router.push("/pricing")}
              className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all text-white text-lg font-medium"
            >
              Upgrade to Premium
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}