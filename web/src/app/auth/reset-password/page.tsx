'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPasswordSchema } from '@/lib/validation';
import { updatePassword } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/auth/auth-card';
import {
  PasswordRequirements,
  getPasswordRequirements,
  allRequirementsMet,
} from '@/components/auth/password-requirements';
import { toast } from 'sonner';
import { Loader2, Lock } from 'lucide-react';
import { AUTH_INPUT_CLASSES } from '@/lib/styles';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if we have the required token from Supabase
    const hash = searchParams.get('hash');
    const type = searchParams.get('type');
    if (!hash || type !== 'recovery') {
      toast.error('Invalid or missing reset token. Please request a new password reset.');
      router.push('/auth/forgot-password');
    }
  }, [searchParams, router]);

  const passwordReqs = getPasswordRequirements(formData.password);
  const requirementsMet = allRequirementsMet(passwordReqs);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = resetPasswordSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    if (!requirementsMet) {
      toast.error('Please meet all password requirements');
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(formData.password);
      if (result.error) {
        toast.error(result.error.message || 'Failed to update password. Please try again.');
      } else {
        toast.success('Password updated successfully! You can now sign in.');
        router.push('/auth/login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-purple-950 to-indigo-950">
      <AuthCard
        title="Reset Password"
        description="Enter your new password"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={AUTH_INPUT_CLASSES}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {formData.password && <PasswordRequirements state={passwordReqs} />}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={AUTH_INPUT_CLASSES}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 text-sm"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-400">Passwords don't match</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={loading || !requirementsMet || formData.password !== formData.confirmPassword}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
          </form>

          <Link href="/auth/login">
            <Button
              variant="ghost"
              className="w-full text-purple-400 hover:text-purple-300"
            >
              Back to Sign In
            </Button>
          </Link>
      </AuthCard>
    </div>
  );
}
