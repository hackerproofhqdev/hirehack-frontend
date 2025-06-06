"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { useRouter } from 'next/navigation';
import { useCookies } from '@/hooks/cookiesHook/useCookies';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const {setPaymentValues , paymentUrl} = usePayment();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const {push} = useRouter();
  const {getCookie} = useCookies();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');
        
        if (accessToken && refreshToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, [getCookie]);

  // Handle payment URL redirect
  useEffect(() => {
    if (paymentUrl) {
      push(paymentUrl);
    }
  },[paymentUrl, push]);

  const features = [
    {
      name: 'Resume Analyser Assistant',
      description: 'AI Powerd Resume Analyzation'
    },
    {
      name: 'Job Search Assistant',
      description: 'Find the perfect job matches'
    },
    {
      name: 'Quiz Assistant',
      description: 'Prepare for interviews with practice quizzes'
    }
  ];
  
  const pricing = {
    monthly: 9,
    yearly: 97,
  };
  
  const handleClick = () => {
    // Check if user is authenticated before proceeding with payment
    if (isAuthenticated === false) {
      // Store current pricing selection for after login
      sessionStorage.setItem('pendingPricing', JSON.stringify({
        isYearly,
        amount: isYearly ? pricing.yearly : pricing.monthly,
        period: isYearly ? 'YEAR' : 'MONTH'
      }));
      
      // Redirect to login page
      push('/login?redirect=/pricing');
      return;
    }

    // Proceed with payment if authenticated
    setLoading(true);
    if (isYearly) {
      setPaymentValues(pricing.yearly, 'YEAR');
    } else {
      setPaymentValues(pricing.monthly, "MONTH");
    }
  };

  // Handle resuming payment after login
  useEffect(() => {
    if (isAuthenticated === true) {
      const pendingPricing = sessionStorage.getItem('pendingPricing');
      if (pendingPricing) {
        const { amount, period } = JSON.parse(pendingPricing);
        sessionStorage.removeItem('pendingPricing');
        setLoading(true);
        setPaymentValues(amount, period);
      }
    }
  }, [isAuthenticated, setPaymentValues]);

  return (
    <div className="min-h-screen bg-gray-950 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p 
            className="text-white/90 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Unlock all features with our flexible pricing
          </motion.p>
        </div>

        {/* Pricing Toggle */}
        <motion.div 
          className="flex items-center justify-center mb-8 space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className={`text-sm ${!isYearly ? 'text-emerald-400' : 'text-white'}`}>Monthly</span>
          <Switch 
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-emerald-400"
          />
          <span className={`text-sm ${isYearly ? 'text-emerald-400' : 'text-white'}`}>
            Yearly
            <Badge variant="outline" className="ml-2 bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
              Save 10%
            </Badge>
          </span>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-900 border-emerald-400/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
            
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-white">
                Pro Access
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* Price Display */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    ${isYearly ? pricing.yearly : pricing.monthly}
                  </span>
                  <span className="text-white/80 ml-2">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50"
                  >
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">{feature.name}</h3>
                      <p className="text-white/80 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pb-8">
              <Button 
                className="w-full bg-emerald-400 hover:bg-emerald-500 text-gray-900 font-semibold py-6 transition-all duration-200"
                onClick={handleClick}
                disabled={loading || isAuthenticated === null}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : isAuthenticated === null ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Checking authentication...
                  </>
                ) : isAuthenticated === false ? (
                  'Login to Continue'
                ) : (
                  'Get Started Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;