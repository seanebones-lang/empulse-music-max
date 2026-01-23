'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

export interface PasswordRequirementsState {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

const REQUIREMENTS: { key: keyof PasswordRequirementsState; label: string }[] = [
  { key: 'minLength', label: 'At least 8 characters' },
  { key: 'hasUpper', label: 'One uppercase letter' },
  { key: 'hasLower', label: 'One lowercase letter' },
  { key: 'hasNumber', label: 'One number' },
  { key: 'hasSpecial', label: 'One special character' },
];

/** Reusable password requirements list – DRY between signup and reset-password */
export function PasswordRequirements({ state }: { state: PasswordRequirementsState }) {
  return (
    <div className="mt-2 space-y-1 text-xs">
      {REQUIREMENTS.map(({ key, label }) => (
        <div
          key={key}
          className={`flex items-center gap-2 ${state[key] ? 'text-green-400' : 'text-gray-400'}`}
        >
          {state[key] ? (
            <CheckCircle2 className="h-3 w-3 shrink-0" />
          ) : (
            <XCircle className="h-3 w-3 shrink-0" />
          )}
          {label}
        </div>
      ))}
    </div>
  );
}

export function getPasswordRequirements(password: string): PasswordRequirementsState {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

export function allRequirementsMet(state: PasswordRequirementsState): boolean {
  return (Object.keys(state) as (keyof PasswordRequirementsState)[]).every(
    (k) => state[k]
  );
}
