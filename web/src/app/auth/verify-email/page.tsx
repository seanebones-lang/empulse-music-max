'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail, resendVerificationEmail } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Mail, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Check if we have a token in the URL (from email link)
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'email') {
      handleVerify(token);
    } else if (user?.email_confirmed_at) {
      // User is already verified
      setVerified(true);
    }
  }, [searchParams, user]);

  const handleVerify = async (token: string) => {
    setLoading(true);
    try {
      const result = await verifyEmail(token);
      if (result.error) {
        toast.error(result.error.message || 'Failed to verify email. The link may have expired.');
      } else {
        setVerified(true);
        toast.success('Email verified successfully!');
        await refresh();
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!user?.email) {
      toast.error('No email found. Please sign up again.');
      router.push('/auth/signup');
      return;
    }

    setResending(true);
    try {
      const result = await resendVerificationEmail(user.email);
      if (result.error) {
        toast.error(result.error.message || 'Failed to resend verification email.');
      } else {
        toast.success('Verification email sent! Check your inbox.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-purple-950 to-indigo-950">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border-purple-500/30">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Email Verified!
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Your email has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400 text-center">
              You can now access all features of EmPulse Music.
            </p>
            <Link href="/">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Go to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-purple-950 to-indigo-950">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border-purple-500/30">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Mail className="h-16 w-16 text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white text-center">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            We've sent a verification link to {user?.email || 'your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 text-center">
                Click the link in the email to verify your account. The link will expire in 24 hours.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={handleResend}
                  variant="outline"
                  className="w-full bg-white/5 border-purple-500/30 text-white hover:bg-white/10"
                  disabled={resending}
                >
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="w-full text-purple-400 hover:text-purple-300"
                  >
                    Continue to Home
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
