// frontend-user/src/app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'

// --------------------------------------------------
// 1) Zod schemas for form validation
// --------------------------------------------------
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password needs lowercase, uppercase, and a number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

// --------------------------------------------------
// 2) Utility: get auth token from localStorage
// --------------------------------------------------
function getAuthToken(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('token') || ''
}

// --------------------------------------------------
// 3) ProfilePage component
// --------------------------------------------------
export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser, logout } = useAuthStore()
  const [loadingUser, setLoadingUser] = useState(true)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<string>('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string>('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Once `user` is available in the store, we can proceed. Otherwise redirect to /login.
  useEffect(() => {
    if (user) {
      setLoadingUser(false)
    } else {
      // No user in store → redirect
      setLoadingUser(false)
      router.push('/login')
    }
  }, [user, router])

  // Cast `user` to any for fields the store might not type
  const currentUser = (user as any) || {}

  // --------------------------------------------------
  // 4) React Hook Form setup
  // --------------------------------------------------
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      email: currentUser.email || '',
    },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  // --------------------------------------------------
  // 5) onUpdateProfile → PUT /api/user/profile
  // --------------------------------------------------
  const onUpdateProfile = async (data: ProfileForm) => {
    setIsUpdatingProfile(true)
    setProfileMessage('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        // Merge updates into store + localStorage
        const updatedUser = {
          ...currentUser,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setProfileMessage('Profile updated successfully!')
      } else {
        setProfileMessage(result.error || 'Failed to update profile')
      }
    } catch (err: any) {
      setProfileMessage(err.message || 'Server error')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // --------------------------------------------------
  // 6) onChangePassword → PUT /api/user/change-password
  // --------------------------------------------------
  const onChangePassword = async (data: PasswordForm) => {
    setIsChangingPassword(true)
    setPasswordMessage('')

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        setPasswordMessage('Password changed successfully!')
        passwordForm.reset()
      } else {
        setPasswordMessage(result.error || 'Failed to change password')
      }
    } catch (err: any) {
      setPasswordMessage(err.message || 'Server error')
    } finally {
      setIsChangingPassword(false)
    }
  }

  // --------------------------------------------------
  // 7) handleDeleteAccount → DELETE /api/user/account
  // --------------------------------------------------
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setPasswordMessage('Password is required')
      return
    }
    setIsDeleting(true)

    try {
      const response = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        logout()
        window.location.href = '/login'
      } else {
        setPasswordMessage(result.error || 'Failed to delete account')
      }
    } catch (err: any) {
      setPasswordMessage(err.message || 'Server error')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setDeletePassword('')
    }
  }

  // --------------------------------------------------
  // 8) Render — show spinner while loadingUser
  // --------------------------------------------------
  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-gray-600">
          View and update your account information and security
        </p>
      </div>

      {/* ===== Profile Information Card ===== */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Profile Information</CardTitle>
          <CardDescription>Update your name and email</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onUpdateProfile)}
            className="space-y-6"
          >
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  className="mt-1 w-full"
                  {...profileForm.register('firstName')}
                />
                {profileForm.formState.errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  className="mt-1 w-full"
                  {...profileForm.register('lastName')}
                />
                {profileForm.formState.errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full"
                {...profileForm.register('email')}
              />
              {profileForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {profileForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {profileMessage && (
              <div
                className={`mt-2 text-sm ${
                  profileMessage.includes('successfully')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {profileMessage}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Updating…' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ===== Change Password Card ===== */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onChangePassword)}
            className="space-y-6"
          >
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full"
                {...passwordForm.register('currentPassword')}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full"
                {...passwordForm.register('newPassword')}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full"
                {...passwordForm.register('confirmPassword')}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {passwordMessage && (
              <div
                className={`mt-2 text-sm ${
                  passwordMessage.includes('successfully')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {passwordMessage}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? 'Changing…' : 'Change Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ===== Account Details Card ===== */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Account Information</CardTitle>
          <CardDescription>View your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-600">Full Name</p>
              <p className="mt-1 text-gray-800">
                {currentUser.firstName && currentUser.lastName
                  ? `${currentUser.firstName} ${currentUser.lastName}`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Email Address</p>
              <p className="mt-1 text-gray-800">{currentUser.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Account Status</p>
              <p className="mt-1 text-gray-800">
                {currentUser.isEmailVerified ? 'Verified' : 'Unverified'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Subscription Plan</p>
              <p className="mt-1 text-gray-800">
                {currentUser.subscription?.plan?.name || 'Free (no plan)'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Member Since</p>
              <p className="mt-1 text-gray-800">
                {currentUser.createdAt
                  ? new Date(currentUser.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Role</p>
              <p className="mt-1 text-gray-800 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== Danger Zone Card ===== */}
      <Card className="shadow-lg border border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-red-700">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </Button>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <h4 className="font-medium text-red-800">
                  Are you sure you want to delete your account?
                </h4>
                <p className="mt-1 text-sm text-red-600">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="deletePassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter Password to Confirm
                </label>
                <Input
                  id="deletePassword"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || !deletePassword.trim()}
                >
                  {isDeleting ? 'Deleting…' : 'Yes, Delete Account'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeletePassword('')
                    setPasswordMessage('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
