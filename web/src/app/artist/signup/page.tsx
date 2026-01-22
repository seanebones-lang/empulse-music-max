'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  FileText,
  DollarSign,
  Music,
  ShoppingBag,
  Shield,
  User,
  Building2,
  Users,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';

type RoleType = 'solo' | 'band' | 'manager' | 'management-company' | '';

interface FormData {
  // Step 1: Basic Profile
  role: RoleType;
  legalName: string;
  stageName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  website: string;
  spotifyLink: string;
  instagramLink: string;
  tiktokLink: string;
  youtubeLink: string;
  bio: string;
  profilePhoto: File | null;
  ageVerified: boolean;
  bandMembers: string[];
  companyName: string;
  ein: string;

  // Step 2: Legal Agreements
  termsAccepted: boolean;
  licenseAccepted: boolean;
  warrantiesAccepted: boolean;
  managementAuthAccepted: boolean;

  // Step 3: Tax & Payout
  taxFormType: 'w9' | 'w8ben' | 'w8bene' | '';
  taxId: string;
  entityName: string;
  bankAccount: string;
  bankRouting: string;
  payoutFrequency: 'monthly' | 'quarterly' | 'threshold' | '';
  payoutThreshold: string;

  // Step 4: PRO Affiliation
  proAffiliated: boolean;
  proName: 'ascap' | 'bmi' | 'sesac' | 'gmr' | 'other' | '';
  proMemberId: string;
  ipiNumber: string;
  publisherName: string;
  writerShare: string;

  // Step 5: Merch Store
  platformMerchEnabled: boolean;
  artistMerchEnabled: boolean;
  betaPerkAcknowledged: boolean;
}

export default function ArtistSignupPage() {
  const { sidebarWidth, isSidebarCollapsed } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState<FormData>({
    role: '',
    legalName: '',
    stageName: '',
    email: '',
    password: '',
    phone: '',
    country: '',
    website: '',
    spotifyLink: '',
    instagramLink: '',
    tiktokLink: '',
    youtubeLink: '',
    bio: '',
    profilePhoto: null,
    ageVerified: false,
    bandMembers: [],
    companyName: '',
    ein: '',
    termsAccepted: false,
    licenseAccepted: false,
    warrantiesAccepted: false,
    managementAuthAccepted: false,
    taxFormType: '',
    taxId: '',
    entityName: '',
    bankAccount: '',
    bankRouting: '',
    payoutFrequency: '',
    payoutThreshold: '50',
    proAffiliated: false,
    proName: '',
    proMemberId: '',
    ipiNumber: '',
    publisherName: '',
    writerShare: '',
    platformMerchEnabled: false,
    artistMerchEnabled: false,
    betaPerkAcknowledged: false,
  });

  const [newBandMember, setNewBandMember] = useState('');

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addBandMember = () => {
    if (newBandMember.trim()) {
      updateFormData('bandMembers', [...formData.bandMembers, newBandMember.trim()]);
      setNewBandMember('');
    }
  };

  const removeBandMember = (index: number) => {
    updateFormData(
      'bandMembers',
      formData.bandMembers.filter((_, i) => i !== index)
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.role &&
          formData.legalName &&
          formData.stageName &&
          formData.email &&
          formData.password &&
          formData.phone &&
          formData.country &&
          formData.ageVerified
        );
      case 2:
        return (
          formData.termsAccepted &&
          formData.licenseAccepted &&
          formData.warrantiesAccepted &&
          (formData.role !== 'manager' && formData.role !== 'management-company'
            ? true
            : formData.managementAuthAccepted)
        );
      case 3:
        return (
          formData.taxFormType &&
          formData.taxId &&
          formData.entityName &&
          formData.payoutFrequency
        );
      case 4:
        return true; // Optional step
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Submit form data to backend
    console.log('Form submitted:', formData);
    alert('Signup form submitted! (This would connect to your backend)');
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Artist & Management Signup</h1>
          <p className="text-gray-400">
            Join EmPulse and start earning $0.004 per stream
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Profile */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Basic Profile</h2>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      I am a: <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'solo', label: 'Solo Artist', icon: User },
                        { value: 'band', label: 'Band', icon: Users },
                        { value: 'manager', label: 'Manager', icon: User },
                        { value: 'management-company', label: 'Management Company', icon: Building2 },
                      ].map((role) => {
                        const Icon = role.icon;
                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => updateFormData('role', role.value)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              formData.role === role.value
                                ? 'border-purple-500 bg-purple-600/20'
                                : 'border-gray-700 bg-white/5 hover:border-purple-500/50'
                            }`}
                          >
                            <Icon className="h-6 w-6 text-white mx-auto mb-2" />
                            <p className="text-sm text-white font-medium">{role.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legal Name */}
                  <div>
                    <label htmlFor="legalName" className="block text-sm font-medium text-gray-300 mb-2">
                      Legal Name {formData.role === 'management-company' ? '(Company Name)' : ''}{' '}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="legalName"
                      type="text"
                      value={formData.legalName}
                      onChange={(e) => updateFormData('legalName', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your legal name"
                    />
                  </div>

                  {/* Stage/Band Name */}
                  <div>
                    <label htmlFor="stageName" className="block text-sm font-medium text-gray-300 mb-2">
                      Stage / Band Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="stageName"
                      type="text"
                      value={formData.stageName}
                      onChange={(e) => updateFormData('stageName', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your stage or band name"
                    />
                  </div>

                  {/* Email & Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Create a password"
                      />
                    </div>
                  </div>

                  {/* Phone & Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                        Country of Residence <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="country"
                        type="text"
                        value={formData.country}
                        onChange={(e) => updateFormData('country', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="United States"
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Social Media Links (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => updateFormData('website', e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Website URL"
                      />
                      <input
                        type="url"
                        value={formData.spotifyLink}
                        onChange={(e) => updateFormData('spotifyLink', e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Spotify Profile"
                      />
                      <input
                        type="url"
                        value={formData.instagramLink}
                        onChange={(e) => updateFormData('instagramLink', e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Instagram Profile"
                      />
                      <input
                        type="url"
                        value={formData.tiktokLink}
                        onChange={(e) => updateFormData('tiktokLink', e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="TikTok Profile"
                      />
                      <input
                        type="url"
                        value={formData.youtubeLink}
                        onChange={(e) => updateFormData('youtubeLink', e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="YouTube Channel"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                      Bio (max 500 characters)
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      maxLength={500}
                      value={formData.bio}
                      onChange={(e) => updateFormData('bio', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Profile Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Photo / Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          updateFormData('profilePhoto', e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="profilePhoto"
                      />
                      <label
                        htmlFor="profilePhoto"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Photo
                      </label>
                      {formData.profilePhoto && (
                        <span className="text-sm text-gray-400">
                          {formData.profilePhoto.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Band Members (if band selected) */}
                  {formData.role === 'band' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Band Members
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newBandMember}
                          onChange={(e) => setNewBandMember(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBandMember())}
                          className="flex-1 px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter member name"
                        />
                        <Button
                          type="button"
                          onClick={addBandMember}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Add
                        </Button>
                      </div>
                      {formData.bandMembers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.bandMembers.map((member, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-purple-600/30 text-white"
                            >
                              {member}
                              <button
                                type="button"
                                onClick={() => removeBandMember(index)}
                                className="ml-2 hover:text-red-400"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Management Company Fields */}
                  {(formData.role === 'management-company' || formData.role === 'manager') && (
                    <>
                      {formData.role === 'management-company' && (
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
                            Company Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="companyName"
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => updateFormData('companyName', e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Management Company Name"
                          />
                        </div>
                      )}
                      <div>
                        <label htmlFor="ein" className="block text-sm font-medium text-gray-300 mb-2">
                          EIN (Employer Identification Number)
                        </label>
                        <input
                          id="ein"
                          type="text"
                          value={formData.ein}
                          onChange={(e) => updateFormData('ein', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="XX-XXXXXXX"
                        />
                      </div>
                    </>
                  )}

                  {/* Age Verification */}
                  <div className="flex items-start gap-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <input
                      type="checkbox"
                      id="ageVerified"
                      checked={formData.ageVerified}
                      onChange={(e) => updateFormData('ageVerified', e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="ageVerified" className="text-sm text-white">
                      I confirm that I am 18 years of age or older and authorized to enter into
                      binding contracts. <span className="text-red-400">*</span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Legal Agreements */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Legal Agreements</h2>
                  </div>

                  <p className="text-gray-400">
                    Please review and accept the following agreements. All agreements will be
                    digitally signed and stored in your account.
                  </p>

                  {/* Terms of Service */}
                  <div className="p-4 bg-white/5 border border-purple-500/30 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">Terms of Service & Privacy Policy</h3>
                        <p className="text-sm text-gray-400">
                          Our platform terms and privacy policy governing your use of EmPulse.
                        </p>
                      </div>
                      <Button variant="outline" className="border-purple-500/30 text-white hover:bg-white/10">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                      />
                      <label htmlFor="termsAccepted" className="text-sm text-white">
                        I have read and agree to the Terms of Service & Privacy Policy{' '}
                        <span className="text-red-400">*</span>
                      </label>
                    </div>
                  </div>

                  {/* Music Streaming License */}
                  <div className="p-4 bg-white/5 border border-purple-500/30 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">
                          Music Streaming & Distribution License Agreement
                        </h3>
                        <p className="text-sm text-gray-400">
                          Non-exclusive, worldwide license to stream, reproduce, publicly perform,
                          and display your tracks. Platform may insert ads in free tier and pay
                          $0.004 per qualifying stream. You retain copyright ownership.
                        </p>
                      </div>
                      <Button variant="outline" className="border-purple-500/30 text-white hover:bg-white/10">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="licenseAccepted"
                        checked={formData.licenseAccepted}
                        onChange={(e) => updateFormData('licenseAccepted', e.target.checked)}
                      />
                      <label htmlFor="licenseAccepted" className="text-sm text-white">
                        I have read and agree to the Music Streaming & Distribution License
                        Agreement <span className="text-red-400">*</span>
                      </label>
                    </div>
                  </div>

                  {/* Warranties */}
                  <div className="p-4 bg-white/5 border border-purple-500/30 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">
                          Artist Warranties & Representations
                        </h3>
                        <p className="text-sm text-gray-400">
                          You warrant that you own or control all rights to the music, there are no
                          uncleared samples or third-party claims, and all members/management have
                          authorized this upload.
                        </p>
                      </div>
                      <Button variant="outline" className="border-purple-500/30 text-white hover:bg-white/10">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="warrantiesAccepted"
                        checked={formData.warrantiesAccepted}
                        onChange={(e) => updateFormData('warrantiesAccepted', e.target.checked)}
                      />
                      <label htmlFor="warrantiesAccepted" className="text-sm text-white">
                        I agree to the Artist Warranties & Representations{' '}
                        <span className="text-red-400">*</span>
                      </label>
                    </div>
                  </div>

                  {/* Management Authorization (if manager/company) */}
                  {(formData.role === 'manager' || formData.role === 'management-company') && (
                    <div className="p-4 bg-white/5 border border-purple-500/30 rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            Management Authorization Form
                          </h3>
                          <p className="text-sm text-gray-400">
                            Power of attorney / authorization to act on behalf of the artist/band.
                            Artist consent signature required alongside manager.
                          </p>
                        </div>
                        <Button variant="outline" className="border-purple-500/30 text-white hover:bg-white/10">
                          View
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="managementAuthAccepted"
                          checked={formData.managementAuthAccepted}
                          onChange={(e) => updateFormData('managementAuthAccepted', e.target.checked)}
                        />
                        <label htmlFor="managementAuthAccepted" className="text-sm text-white">
                          I agree to the Management Authorization Form{' '}
                          <span className="text-red-400">*</span>
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Tax & Payout */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Tax & Payout Information</h2>
                  </div>

                  {/* Tax Form Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Tax Form Type <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'w9', label: 'W-9 (U.S.)' },
                        { value: 'w8ben', label: 'W-8BEN (Non-U.S. Individual)' },
                        { value: 'w8bene', label: 'W-8BEN-E (Non-U.S. Entity)' },
                      ].map((form) => (
                        <button
                          key={form.value}
                          type="button"
                          onClick={() => updateFormData('taxFormType', form.value)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.taxFormType === form.value
                              ? 'border-purple-500 bg-purple-600/20'
                              : 'border-gray-700 bg-white/5 hover:border-purple-500/50'
                          }`}
                        >
                          <p className="text-sm text-white font-medium">{form.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tax ID */}
                  <div>
                    <label htmlFor="taxId" className="block text-sm font-medium text-gray-300 mb-2">
                      {formData.taxFormType === 'w9'
                        ? 'SSN or EIN'
                        : formData.taxFormType === 'w8ben'
                          ? 'Tax ID Number'
                          : 'EIN'}{' '}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="taxId"
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => updateFormData('taxId', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter tax ID"
                    />
                  </div>

                  {/* Entity Name */}
                  <div>
                    <label htmlFor="entityName" className="block text-sm font-medium text-gray-300 mb-2">
                      Legal Entity Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="entityName"
                      type="text"
                      value={formData.entityName}
                      onChange={(e) => updateFormData('entityName', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter legal entity name"
                    />
                  </div>

                  {/* Banking Info */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-300 mb-4">
                      Banking information will be collected securely via Stripe Connect. You can
                      complete this during your first payout setup.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-300 mb-2">
                          Bank Account Number (Optional)
                        </label>
                        <input
                          id="bankAccount"
                          type="text"
                          value={formData.bankAccount}
                          onChange={(e) => updateFormData('bankAccount', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter account number"
                        />
                      </div>
                      <div>
                        <label htmlFor="bankRouting" className="block text-sm font-medium text-gray-300 mb-2">
                          Routing Number (Optional)
                        </label>
                        <input
                          id="bankRouting"
                          type="text"
                          value={formData.bankRouting}
                          onChange={(e) => updateFormData('bankRouting', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter routing number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payout Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Payout Frequency <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'quarterly', label: 'Quarterly' },
                        { value: 'threshold', label: 'When threshold reached' },
                      ].map((freq) => (
                        <button
                          key={freq.value}
                          type="button"
                          onClick={() => updateFormData('payoutFrequency', freq.value)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.payoutFrequency === freq.value
                              ? 'border-purple-500 bg-purple-600/20'
                              : 'border-gray-700 bg-white/5 hover:border-purple-500/50'
                          }`}
                        >
                          <p className="text-sm text-white font-medium">{freq.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payout Threshold */}
                  {formData.payoutFrequency === 'threshold' && (
                    <div>
                      <label htmlFor="payoutThreshold" className="block text-sm font-medium text-gray-300 mb-2">
                        Minimum Payout Threshold ($)
                      </label>
                      <input
                        id="payoutThreshold"
                        type="number"
                        value={formData.payoutThreshold}
                        onChange={(e) => updateFormData('payoutThreshold', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="50"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: PRO Affiliation */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Music className="h-5 w-5 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">PRO Affiliation (Optional)</h2>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-300">
                      Joining a PRO (Performance Rights Organization) allows you to collect
                      performance royalties from radio, live venues, TV, and more (separate from
                      our streaming payouts). This is optional but strongly recommended for
                      national/touring acts.
                    </p>
                  </div>

                  {/* PRO Affiliation Toggle */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.proAffiliated}
                        onChange={(e) => updateFormData('proAffiliated', e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="text-white font-medium">
                        I am currently affiliated with a PRO
                      </span>
                    </label>
                  </div>

                  {formData.proAffiliated && (
                    <>
                      {/* PRO Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Which PRO are you affiliated with?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { value: 'ascap', label: 'ASCAP' },
                            { value: 'bmi', label: 'BMI' },
                            { value: 'sesac', label: 'SESAC' },
                            { value: 'gmr', label: 'GMR' },
                            { value: 'other', label: 'Other' },
                          ].map((pro) => (
                            <button
                              key={pro.value}
                              type="button"
                              onClick={() => updateFormData('proName', pro.value)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                formData.proName === pro.value
                                  ? 'border-purple-500 bg-purple-600/20'
                                  : 'border-gray-700 bg-white/5 hover:border-purple-500/50'
                              }`}
                            >
                              <p className="text-sm text-white font-medium">{pro.label}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* PRO Details */}
                      {formData.proName && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="proMemberId" className="block text-sm font-medium text-gray-300 mb-2">
                              PRO Member ID / Account Number
                            </label>
                            <input
                              id="proMemberId"
                              type="text"
                              value={formData.proMemberId}
                              onChange={(e) => updateFormData('proMemberId', e.target.value)}
                              className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter PRO member ID"
                            />
                          </div>
                          <div>
                            <label htmlFor="ipiNumber" className="block text-sm font-medium text-gray-300 mb-2">
                              IPI Number (Interested Party Information)
                            </label>
                            <input
                              id="ipiNumber"
                              type="text"
                              value={formData.ipiNumber}
                              onChange={(e) => updateFormData('ipiNumber', e.target.value)}
                              className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter IPI number"
                            />
                          </div>
                          <div>
                            <label htmlFor="publisherName" className="block text-sm font-medium text-gray-300 mb-2">
                              Publisher Name (if any)
                            </label>
                            <input
                              id="publisherName"
                              type="text"
                              value={formData.publisherName}
                              onChange={(e) => updateFormData('publisherName', e.target.value)}
                              className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter publisher name"
                            />
                          </div>
                          <div>
                            <label htmlFor="writerShare" className="block text-sm font-medium text-gray-300 mb-2">
                              Writer Share Percentage (if co-writes)
                            </label>
                            <input
                              id="writerShare"
                              type="text"
                              value={formData.writerShare}
                              onChange={(e) => updateFormData('writerShare', e.target.value)}
                              className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="e.g., 50%"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {!formData.proAffiliated && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-yellow-300 mb-3">
                        Not affiliated with a PRO? Consider joining one to maximize your royalty
                        collection:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { name: 'ASCAP', url: 'https://www.ascap.com/join' },
                          { name: 'BMI', url: 'https://www.bmi.com/join' },
                          { name: 'SESAC', url: 'https://www.sesac.com/join' },
                          { name: 'GMR', url: 'https://globalmusicrights.com/join' },
                        ].map((pro) => (
                          <a
                            key={pro.name}
                            href={pro.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 border border-purple-500/30 rounded-lg text-center text-sm text-white hover:bg-purple-600/20 transition-colors"
                          >
                            {pro.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Merch Store */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="h-5 w-5 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Merch Store Opt-In</h2>
                  </div>

                  {/* Platform Merch */}
                  <div className="p-4 bg-white/5 border border-purple-500/30 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="platformMerchEnabled"
                        checked={formData.platformMerchEnabled}
                        onChange={(e) => updateFormData('platformMerchEnabled', e.target.checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="platformMerchEnabled" className="text-white font-medium block mb-1">
                          Enable Platform Merch Store
                        </label>
                        <p className="text-sm text-gray-400">
                          Allow your music to be featured in platform-wide merch collections.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Artist Merch */}
                  <div className="p-4 bg-white/5 border border-purple-500/30 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="artistMerchEnabled"
                        checked={formData.artistMerchEnabled}
                        onChange={(e) => updateFormData('artistMerchEnabled', e.target.checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="artistMerchEnabled" className="text-white font-medium block mb-1">
                          Enable My Own Artist Merch Store
                        </label>
                        <p className="text-sm text-gray-400">
                          Create and manage your own branded merch store with custom designs.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Beta Perk */}
                  <div className="p-6 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/50 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <Shield className="h-6 w-6 text-yellow-400 shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-yellow-200 mb-2">Beta Founder Perk</h3>
                        <p className="text-sm text-yellow-100">
                          If you sign up by <strong>September 30, 2026</strong> (end of Q3), you
                          keep <strong>100% of merch revenue for life</strong> (after fulfillment
                          costs).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="betaPerkAcknowledged"
                        checked={formData.betaPerkAcknowledged}
                        onChange={(e) => updateFormData('betaPerkAcknowledged', e.target.checked)}
                      />
                      <label htmlFor="betaPerkAcknowledged" className="text-sm text-yellow-100">
                        I acknowledge and understand the beta founder perk terms
                      </label>
                    </div>
                  </div>

                  {/* Design Upload (for future use) */}
                  {(formData.platformMerchEnabled || formData.artistMerchEnabled) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Design Upload (Optional - can be added later)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="merchDesign"
                        />
                        <label
                          htmlFor="merchDesign"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Design
                        </label>
                        <span className="text-sm text-gray-400">
                          You can add designs later in your dashboard
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-purple-500/30 text-white hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          )}
        </div>

        {/* Save & Complete Later */}
        <div className="text-center">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => {
              // TODO: Save draft to backend
              console.log('Save draft:', formData);
            }}
          >
            Save & Complete Later
          </Button>
        </div>
      </div>
    </div>
  );
}
