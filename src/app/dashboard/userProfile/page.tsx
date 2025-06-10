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

        {/* Billing Invoice Section */}
        {user.subscription_status === 'premium' && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8 text-emerald-400" />
                <h2 className="text-2xl font-bold text-white">Billing Invoice</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subscription Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">Current Plan</h3>
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Plan Type</span>
                      <span className="font-semibold text-white capitalize">
                        {user.plain_period === 'month' ? 'Monthly Premium' : 'Yearly Premium'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Amount</span>
                      <span className="text-2xl font-bold text-emerald-400">
                        ${user.plain_period === 'month' ? '9.00' : '97.00'}
                        <span className="text-sm text-gray-400 ml-1">
                          {user.plain_period === 'month' ? '/month' : '/year'}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Auto-Renewal</span>
                      <span className="flex items-center gap-2 text-emerald-400">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Next Billing</span>
                      <span className="text-white">
                        {new Date(Date.now() + (user.plain_period === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Auto-Renewal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">Auto-Renewal Details</h3>
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white font-medium mb-1">Automatic Billing</p>
                        <p className="text-gray-400 text-sm">
                          Your subscription will automatically renew every {user.plain_period === 'month' ? 'month' : 'year'} 
                          for ${user.plain_period === 'month' ? '9.00' : '97.00'}.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white font-medium mb-1">Payment Method</p>
                        <p className="text-gray-400 text-sm">
                          Charges will be automatically processed using your default payment method.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white font-medium mb-1">Cancellation</p>
                        <p className="text-gray-400 text-sm">
                          You can cancel anytime before your next billing cycle to avoid future charges.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="mt-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-400">Current Invoice</h4>
                    <p className="text-gray-400 text-sm">
                      Next charge: {new Date(Date.now() + (user.plain_period === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">
                      ${user.plain_period === 'month' ? '9.00' : '97.00'}
                    </p>
                    <p className="text-emerald-400 text-sm">
                      Auto-renewal {user.plain_period === 'month' ? 'monthly' : 'yearly'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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