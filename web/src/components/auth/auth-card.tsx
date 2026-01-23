'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AUTH_CARD_CLASSES } from '@/lib/styles';

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/** Reusable auth card – DRY layout for login/signup/forgot-password/etc. */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className={AUTH_CARD_CLASSES}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white text-center">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-center text-gray-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
