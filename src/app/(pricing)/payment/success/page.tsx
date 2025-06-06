"use client"
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

const PaymentSuccess = () => {
    const {push} = useRouter()
  const redirectToLogin = () => {
    push('/dashboard')
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <div className="rounded-full bg-zinc-800 p-3">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 pt-4">
          <h1 className="text-3xl font-bold text-white">
            Payment Successful!
          </h1>
          <p className="text-zinc-400">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8">
          <Button 
            onClick={redirectToLogin}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
          >
            Continue to Application
          </Button>
          <p className="text-zinc-500 text-sm text-center">
            You will receive a confirmation email shortly
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;