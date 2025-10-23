/**
 * Authentication and Authorization System
 */

export interface User {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'pro' | 'starter' | 'free';
  name: string;
  createdAt: string;
}

// In production, this would check against your database
// For now, we'll use a simple check
export function getCurrentUser(): User | null {
  // This would normally check session/JWT token
  // For demo purposes, return owner user
  return {
    id: 'owner_001',
    email: 'owner@etsyautomate.com',
    role: 'owner',
    name: 'Platform Owner',
    createdAt: new Date().toISOString()
  };
}

export function isOwner(user: User | null): boolean {
  return user?.role === 'owner';
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'owner' || user?.role === 'admin';
}

export function hasProAccess(user: User | null): boolean {
  return user?.role === 'owner' || user?.role === 'admin' || user?.role === 'pro';
}

export function hasStarterAccess(user: User | null): boolean {
  return user?.role !== 'free';
}

// Feature access control
export const FEATURES = {
  // Owner only
  ADMIN_CONSOLE: (user: User | null) => isOwner(user),
  USER_MANAGEMENT: (user: User | null) => isOwner(user),
  PLATFORM_SETTINGS: (user: User | null) => isOwner(user),
  
  // Pro features
  UNLIMITED_UPLOADS: (user: User | null) => hasProAccess(user),
  AI_VIDEO_GENERATION: (user: User | null) => hasProAccess(user),
  ADVANCED_ANALYTICS: (user: User | null) => hasProAccess(user),
  BULK_OPERATIONS: (user: User | null) => hasProAccess(user),
  
  // Starter features
  IMAGE_EDITOR: (user: User | null) => hasStarterAccess(user),
  SOCIAL_POSTING: (user: User | null) => hasStarterAccess(user),
  BASIC_ANALYTICS: (user: User | null) => hasStarterAccess(user),
  
  // Free features (everyone)
  BASIC_DASHBOARD: () => true,
  VIEW_OPPORTUNITIES: () => true,
  VIEW_PLANNERS: () => true,
};

export function checkFeatureAccess(feature: keyof typeof FEATURES, user: User | null): boolean {
  return FEATURES[feature](user);
}

