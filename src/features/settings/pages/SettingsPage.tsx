import { useState } from 'react'
import { PageShell } from '@/components/common/PageShell'
import { Bell, Globe, Lock, Save, Shield, User } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormInput, FormSelect, FormSwitch, FormTextArea } from '@/components/form'
import { cn } from '@/lib/utils'

type TabId = 'profile' | 'preferences' | 'notifications' | 'security'

const tabs: { id: TabId; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
]

interface ProfileValues {
  fullName: string
  email: string
  phone: string
  currency: string
  country: string
  bio: string
}

interface PreferencesValues {
  language: string
  dateFormat: string
  theme: string
  riskTolerance: string
}

interface NotificationsValues {
  emailAlerts: boolean
  smsAlerts: boolean
  pushNotifications: boolean
  transactionAlerts: boolean
  budgetAlerts: boolean
  securityAlerts: boolean
  marketing: boolean
}

interface SecurityValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  twoFactor: boolean
}

const currencyOptions = [
  { label: 'Kuwaiti Dinar (KWD)', value: 'KWD' },
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'British Pound (GBP)', value: 'GBP' },
  { label: 'Saudi Riyal (SAR)', value: 'SAR' },
  { label: 'UAE Dirham (AED)', value: 'AED' },
]

const countryOptions = [
  { label: 'Kuwait', value: 'KW' },
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'United Arab Emirates', value: 'AE' },
  { label: 'India', value: 'IN' },
]

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Hindi', value: 'hi' },
]

const dateFormatOptions = [
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
]

const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
]

const riskOptions = [
  { label: 'Conservative', value: 'conservative' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Aggressive', value: 'aggressive' },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  const profileMethods = useForm<ProfileValues>({
    mode: 'onBlur',
    defaultValues: {
      fullName: 'Ahmad Al-Rashid',
      email: 'ahmad.alrashid@example.com',
      phone: '+965 5550 1234',
      currency: 'KWD',
      country: 'KW',
      bio: 'Software engineer passionate about building smart savings habits.',
    },
  })

  const preferencesMethods = useForm<PreferencesValues>({
    mode: 'onBlur',
    defaultValues: {
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      riskTolerance: 'balanced',
    },
  })

  const notificationsMethods = useForm<NotificationsValues>({
    mode: 'onBlur',
    defaultValues: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      transactionAlerts: true,
      budgetAlerts: true,
      securityAlerts: true,
      marketing: false,
    },
  })

  const securityMethods = useForm<SecurityValues>({
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactor: true,
    },
  })

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <FormProvider {...profileMethods}>
            <form
              className="grid gap-6"
              onSubmit={profileMethods.handleSubmit((values) => {
                console.log('Profile settings saved:', values)
              })}
            >
              <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
                <h2 className="text-base font-semibold text-on-surface">Personal Information</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Update your basic information and how we address you.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormInput
                    name="fullName"
                    label="Full Name"
                    placeholder="Enter your full name"
                    rules={{ required: 'Full name is required' }}
                  />
                  <FormInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    rules={{
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
                    }}
                  />
                  <FormInput
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="+965 5XXX XXXX"
                  />
                  <FormSelect
                    name="currency"
                    label="Preferred Currency"
                    options={currencyOptions}
                    rules={{ required: 'Please select a currency' }}
                  />
                  <FormSelect
                    name="country"
                    label="Country"
                    options={countryOptions}
                    rules={{ required: 'Please select a country' }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
                <h2 className="text-base font-semibold text-on-surface">About You</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Tell us a little about yourself so we can personalize your experience.
                </p>
                <div className="mt-5">
                  <FormTextArea
                    name="bio"
                    label="Bio"
                    rows={4}
                    placeholder="A short introduction..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <SaveButton label="Save Changes" />
              </div>
            </form>
          </FormProvider>
        )

      case 'preferences':
        return (
          <FormProvider {...preferencesMethods}>
            <form
              className="grid gap-6"
              onSubmit={preferencesMethods.handleSubmit((values) => {
                console.log('Preferences saved:', values)
              })}
            >
              <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
                <h2 className="text-base font-semibold text-on-surface">App Preferences</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Customize how the app looks, feels, and formats your data.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormSelect
                    name="language"
                    label="Language"
                    options={languageOptions}
                    rules={{ required: 'Please select a language' }}
                  />
                  <FormSelect
                    name="dateFormat"
                    label="Date Format"
                    options={dateFormatOptions}
                    rules={{ required: 'Please select a date format' }}
                  />
                  <FormSelect
                    name="theme"
                    label="Theme"
                    options={themeOptions}
                    rules={{ required: 'Please select a theme' }}
                  />
                  <FormSelect
                    name="riskTolerance"
                    label="Risk Tolerance"
                    options={riskOptions}
                    rules={{ required: 'Please select a risk tolerance' }}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <SaveButton label="Save Preferences" />
              </div>
            </form>
          </FormProvider>
        )

      case 'notifications':
        return (
          <FormProvider {...notificationsMethods}>
            <form
              className="grid gap-6"
              onSubmit={notificationsMethods.handleSubmit((values) => {
                console.log('Notification settings saved:', values)
              })}
            >
              <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
                <h2 className="text-base font-semibold text-on-surface">Channels</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Choose which channels we can use to reach you.
                </p>
                <div className="mt-5 grid gap-4">
                  <FormSwitch name="emailAlerts" label="Email alerts" helperText="Get notifications by email." />
                  <FormSwitch name="smsAlerts" label="SMS alerts" helperText="Get notifications by text message." />
                  <FormSwitch name="pushNotifications" label="Push notifications" helperText="Get notifications on this device." />
                </div>
              </div>

              <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
                <h2 className="text-base font-semibold text-on-surface">What You Hear About</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Toggle the types of updates you want to receive.
                </p>
                <div className="mt-5 grid gap-4">
                  <FormSwitch name="transactionAlerts" label="Transaction alerts" helperText="Deposits, payments, and refunds." />
                  <FormSwitch name="budgetAlerts" label="Budget & goal alerts" helperText="Limit warnings and goal progress." />
                  <FormSwitch name="securityAlerts" label="Security alerts" helperText="New logins and account changes." />
                  <FormSwitch name="marketing" label="Promotions & offers" helperText="Occasional product updates and offers." />
                </div>
              </div>

              <div className="flex justify-end">
                <SaveButton label="Save Notifications" />
              </div>
            </form>
          </FormProvider>
        )

      case 'security':
        return (
          <FormProvider {...securityMethods}>
            <form
              className="grid gap-6"
              onSubmit={securityMethods.handleSubmit((values) => {
                console.log('Security settings saved:', values)
              })}
            >
              <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
                <h2 className="text-base font-semibold text-on-surface">Password</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Choose a strong password to protect your account.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <FormInput
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    rules={{ required: 'Current password is required' }}
                  />
                  <FormInput
                    name="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    rules={{
                      required: 'New password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    }}
                  />
                  <FormInput
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter new password"
                    rules={{
                      required: 'Please confirm your password',
                      validate: (value: string) =>
                        value === securityMethods.getValues('newPassword') || 'Passwords do not match',
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8ecff] text-indigo-600">
                    <Lock size={18} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-on-surface">Two-Factor Authentication</h2>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Add an extra layer of security to your account.
                    </p>
                    <div className="mt-4 max-w-md">
                      <FormSwitch name="twoFactor" label="Enable 2FA" helperText="We&apos;ll ask for a one-time code at sign-in." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <SaveButton label="Update Security" />
              </div>
            </form>
          </FormProvider>
        )
    }
  }

  return (
    <PageShell title="Settings" subtitle="Manage your account, preferences, and security">
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 border-b border-outline/30 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150',
                activeTab === tab.id
                  ? 'bg-on-surface text-surface shadow-soft'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6">{renderTab()}</div>
    </PageShell>
  )
}

function SaveButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="flex items-center gap-2 rounded-[1rem] bg-on-surface px-5 py-2.5 text-sm font-semibold text-surface shadow-soft transition-all duration-150 hover:-translate-y-px"
    >
      <Save size={16} />
      {label}
    </button>
  )
}
