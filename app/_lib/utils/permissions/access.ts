import { resolveModuleAccess, UserAccessConfig } from "../../constants/userAccessMatrix";

/**
 * Check if user is SUPERADMIN - bypasses all permission checks
 */
const isSuperAdmin = (userRole?: string): boolean => {
  return userRole === 'SUPERADMIN';
};

export const canAddOrganisationOfType = (
    userAccess: UserAccessConfig | undefined,
    organisationTarget: 'feedManufacturers' | 'fishProducers',
    userRole?: string
  ): boolean => {
    // SUPERADMIN has full access
    if (isSuperAdmin(userRole)) return true;
    
    if (!userAccess) return false;
  
    const accessValue = resolveModuleAccess(
      userAccess,
      'organisations',
      organisationTarget
    );
    return accessValue >= 3;
  };

/**
 * Check if user can add organizations (any type)
 * Level 3 or 4 required
 * SUPERADMIN has full access
 */
export const canAddOrganisation = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  const feedManufacturerAccess = resolveModuleAccess(
    userAccess,
    'organisations',
    'feedManufacturers'
  );
  const fishProducerAccess = resolveModuleAccess(
    userAccess,
    'organisations',
    'fishProducers'
  );
  
  // Can add if access level >= 3 for either type
  return feedManufacturerAccess >= 3 || fishProducerAccess >= 3;
};

/**
 * Check if user can view organizations
 * Level 1, 2, or 4 required
 * Permission levels:
 * - 4: Add, Edit & View (full control)
 * - 3: Add only (cannot edit or view details)
 * - 2: Edit & View (can edit and view)
 * - 1: View only
 * SUPERADMIN has full access
 */
export const canViewOrganisation = (
  userAccess: UserAccessConfig | undefined,
  organisationTarget?: 'feedManufacturers' | 'fishProducers',
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  if (organisationTarget) {
    const accessValue = resolveModuleAccess(
      userAccess,
      'organisations',
      organisationTarget
    );
    // Level 1 (View only), 2 (Edit & View), 3 (Add only), or 4 (Full control) can view
    // Level 3 is included because users need to access the module to add items
    return accessValue === 1 || accessValue === 2 || accessValue === 3 || accessValue === 4;
  }
  
  // Check both types - can view if access is 1, 2, 3, or 4 for either
  const feedManufacturerAccess = resolveModuleAccess(
    userAccess,
    'organisations',
    'feedManufacturers'
  );
  const fishProducerAccess = resolveModuleAccess(
    userAccess,
    'organisations',
    'fishProducers'
  );
  
  // Can view if either type has level 1, 2, 3, or 4
  return (feedManufacturerAccess === 1 || feedManufacturerAccess === 2 || feedManufacturerAccess === 3 || feedManufacturerAccess === 4) ||
         (fishProducerAccess === 1 || fishProducerAccess === 2 || fishProducerAccess === 3 || fishProducerAccess === 4);
};

/**
 * Check if user can edit organizations
 * Level 2 or 4 required (NOT level 3 - level 3 is "Add only")
 * Permission levels:
 * - 4: Add, Edit & View (full control)
 * - 3: Add only (cannot edit)
 * - 2: Edit & View (can edit but cannot add)
 * - 1: View only
 * SUPERADMIN has full access
 */
export const canEditOrganisation = (
  userAccess: UserAccessConfig | undefined,
  organisationTarget?: 'feedManufacturers' | 'fishProducers',
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  if (organisationTarget) {
    const accessValue = resolveModuleAccess(
      userAccess,
      'organisations',
      organisationTarget
    );
    // Level 2 (Edit & View) or Level 4 (Full control) can edit
    // Level 3 (Add only) cannot edit
    return accessValue === 2 || accessValue === 4;
  }
  
  // Check both types - can edit if access is 2 or 4 for either
  const feedManufacturerAccess = resolveModuleAccess(
    userAccess,
    'organisations',
    'feedManufacturers'
  );
  const fishProducerAccess = resolveModuleAccess(
    userAccess,
    'organisations',
    'fishProducers'
  );
  
  // Can edit if either type has level 2 or 4
  return (feedManufacturerAccess === 2 || feedManufacturerAccess === 4) ||
         (fishProducerAccess === 2 || fishProducerAccess === 4);
};

/**
 * Check if user can delete organizations
 * Level 4 required (full control)
 * SUPERADMIN has full access
 */
export const canDeleteOrganisation = (
  userAccess: UserAccessConfig | undefined,
  organisationTarget?: 'feedManufacturers' | 'fishProducers',
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  if (organisationTarget) {
    const accessValue = resolveModuleAccess(
      userAccess,
      'organisations',
      organisationTarget
    );
    return accessValue === 4;
  }
  
  // Check both types - can delete if access === 4 for either
  const feedManufacturerAccess = resolveModuleAccess(
    userAccess,
    'organisations',
    'feedManufacturers'
  );
  const fishProducerAccess = resolveModuleAccess(
    userAccess,
    'organisations',
    'fishProducers'
  );
  
  return feedManufacturerAccess === 4 || fishProducerAccess === 4;
};

/**
 * Get organization type permission key from organization type name
 */
export const getOrganisationPermissionKey = (
  orgType: string
): 'feedManufacturers' | 'fishProducers' | null => {
  if (orgType === 'Feed manufacturer') return 'feedManufacturers';
  if (orgType === 'Fish Producer') return 'fishProducers';
  return null;
};

// ==================== FISH SUPPLY PERMISSIONS ====================

/**
 * Check if user can add fish supply
 * Level 3 or 4 required
 * SUPERADMIN has full access
 */
export const canAddFishSupply = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(
    userAccess,
    'setup',
    'fishSupply'
  );
  
  // Can add if access level >= 3
  return accessValue >= 3;
};

/**
 * Check if user can view fish supply
 * Level 1, 2, 3, or 4 required
 * Level 3 (Add only) is included because users need to access the module to add items
 * SUPERADMIN has full access
 */
export const canViewFishSupply = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(
    userAccess,
    'setup',
    'fishSupply'
  );
  
  // Level 1 (View only), 2 (Edit & View), 3 (Add only), or 4 (Full control) can view
  // Level 3 is included because users need to access the module to add items
  return accessValue === 1 || accessValue === 2 || accessValue === 3 || accessValue === 4;
};

/**
 * Check if user can edit fish supply
 * Level 2 or 4 required (NOT level 3 - level 3 is "Add only")
 * SUPERADMIN has full access
 */
export const canEditFishSupply = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(
    userAccess,
    'setup',
    'fishSupply'
  );
  
  // Level 2 (Edit & View) or Level 4 (Full control) can edit
  // Level 3 (Add only) cannot edit
  return accessValue === 2 || accessValue === 4;
};

/**
 * Check if user can delete fish supply
 * Level 4 required (full control)
 * SUPERADMIN has full access
 */
export const canDeleteFishSupply = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(
    userAccess,
    'setup',
    'fishSupply'
  );
  
  return accessValue === 4;
};

// ==================== GROWTH MODELS PERMISSIONS ====================

/**
 * Check if user can add growth models
 * Level 3 or 4 required
 * SUPERADMIN has full access
 */
export const canAddGrowthModel = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(
    userAccess,
    'growthModels'
  );
  
  // Can add if access level >= 3
  return accessValue >= 3;
};

/**
 * Check if user can view growth models
 * Level 1, 2, 3, or 4 required
 * Level 3 (Add only) is included because users need to access the module to add items
 * SUPERADMIN has full access
 */
export const canViewGrowthModel = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(
    userAccess,
    'growthModels'
  );
  
  // Level 1 (View only), 2 (Edit & View), 3 (Add only), or 4 (Full control) can view
  // Level 3 is included because users need to access the module to add items
  return accessValue === 1 || accessValue === 2 || accessValue === 3 || accessValue === 4;
};

/**
 * Check if user can edit growth models
 * Level 2 or 4 required (NOT level 3 - level 3 is "Add only")
 * SUPERADMIN has full access
 */
export const canEditGrowthModel = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(
    userAccess,
    'growthModels'
  );
  
  // Level 2 (Edit & View) or Level 4 (Full control) can edit
  // Level 3 (Add only) cannot edit
  return accessValue === 2 || accessValue === 4;
};

/**
 * Check if user can delete growth models
 * Level 4 required (full control)
 * SUPERADMIN has full access
 */
export const canDeleteGrowthModel = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  // SUPERADMIN has full access
  if (isSuperAdmin(userRole)) return true;
  
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(
    userAccess,
    'growthModels'
  );
  
  return accessValue === 4;
};

// ==================== FARM PERMISSIONS ====================

/**
 * Check if user can view farm
 * Level 1, 2, 3, or 4 required
 * Level 3 (Add only) is included because users need to access the module to add items
 * SUPERADMIN has full access
 */
export const canViewFarm = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'setup', 'farm');
  return accessValue === 1 || accessValue === 2 || accessValue === 3 || accessValue === 4;
};

/**
 * Check if user can add farm
 * Level 3 or 4 required
 * SUPERADMIN has full access
 */
export const canAddFarm = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'setup', 'farm');
  return accessValue === 3 || accessValue === 4;
};

/**
 * Check if user can edit farm
 * Level 2 or 4 required (excludes level 3 - Add only)
 * SUPERADMIN has full access
 */
export const canEditFarm = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'setup', 'farm');
  return accessValue === 2 || accessValue === 4;
};

/**
 * Check if user can delete farm
 * Level 4 required (full control)
 * SUPERADMIN has full access
 */
export const canDeleteFarm = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'setup', 'farm');
  return accessValue === 4;
};

// ==================== FEED SUPPLY PERMISSIONS ====================

/**
 * Check if user can view feed supply
 * Level 1, 2, 3, or 4 required
 * Level 3 (Add only) is included because users need to access the module to add items
 * SUPERADMIN has full access
 */
export const canViewFeedSupply = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'setup', 'feedSupply');
  return accessValue === 1 || accessValue === 2 || accessValue === 3 || accessValue === 4;
};

// ==================== PRODUCTION PERMISSIONS ====================

/**
 * Check if user can view production
 * Level 1, 2, 3, or 4 required
 * Level 3 (Add only) is included because users need to access the module to add items
 * SUPERADMIN has full access
 */
export const canViewProduction = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'manage', 'production');
  return accessValue === 1 || accessValue === 2 || accessValue === 3 || accessValue === 4;
};

/**
 * Check if user can add production
 * Level 3 or 4 required
 * SUPERADMIN has full access
 */
export const canAddProduction = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'manage', 'production');
  return accessValue === 3 || accessValue === 4;
};

/**
 * Check if user can edit production
 * Level 2 or 4 required (excludes level 3 - Add only)
 * SUPERADMIN has full access
 */
export const canEditProduction = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'manage', 'production');
  return accessValue === 2 || accessValue === 4;
};

/**
 * Check if user can delete production
 * Level 4 required (full control)
 * SUPERADMIN has full access
 */
export const canDeleteProduction = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'manage', 'production');
  return accessValue === 4;
};

// ==================== FEED PREDICTION PERMISSIONS ====================

/**
 * Check if user can view feed prediction
 * Level 1, 2, 3, or 4 required
 * Level 3 (Add only) is included because users need to access the module to add items
 * SUPERADMIN has full access
 */
export const canViewFeedPrediction = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'manage', 'feedPrediction');
  return accessValue === 1 || accessValue === 2 || accessValue === 3 || accessValue === 4;
};

// ==================== USERS PERMISSIONS ====================

/**
 * Check if user can view users (any type)
 * Level 1, 2, 3, or 4 required for either feedManufacturers or fishProducers
 * Level 3 (Add only) is included because users need to access the module to add items
 * SUPERADMIN has full access
 */
export const canViewUsers = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const feedManufacturerAccess = resolveModuleAccess(
    userAccess,
    'users',
    'feedManufacturers'
  );
  const fishProducerAccess = resolveModuleAccess(
    userAccess,
    'users',
    'fishProducers'
  );
  
  return (feedManufacturerAccess === 1 || feedManufacturerAccess === 2 || feedManufacturerAccess === 3 || feedManufacturerAccess === 4) ||
         (fishProducerAccess === 1 || fishProducerAccess === 2 || fishProducerAccess === 3 || fishProducerAccess === 4);
};

/**
 * Get the appropriate user permission key based on organization type
 * Returns 'feedManufacturers' or 'fishProducers' based on the organization type
 */
export const getUserPermissionKey = (organisationType?: string): 'feedManufacturers' | 'fishProducers' | undefined => {
  if (!organisationType) return undefined;
  
  // Normalize organization type
  const normalizedType = organisationType.toLowerCase().trim();
  
  if (normalizedType.includes('feed manufacturer') || normalizedType.includes('feedmanufacturer')) {
    return 'feedManufacturers';
  }
  if (normalizedType.includes('fish producer') || normalizedType.includes('fishproducer')) {
    return 'fishProducers';
  }
  
  return undefined;
};

/**
 * Check if user can add users
 * Level 3 or 4 required for their organization type
 * SUPERADMIN has full access
 */
export const canAddUsers = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string,
  userOrganisationType?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const permissionKey = getUserPermissionKey(userOrganisationType);
  if (!permissionKey) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'users', permissionKey);
  return accessValue === 3 || accessValue === 4;
};

/**
 * Check if user can edit users
 * Level 2 or 4 required for their organization type (excludes level 3 - Add only)
 * SUPERADMIN has full access
 */
export const canEditUsers = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string,
  userOrganisationType?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const permissionKey = getUserPermissionKey(userOrganisationType);
  if (!permissionKey) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'users', permissionKey);
  return accessValue === 2 || accessValue === 4;
};

/**
 * Check if user can delete users
 * Level 4 required for their organization type (full control)
 * SUPERADMIN has full access
 */
export const canDeleteUsers = (
  userAccess: UserAccessConfig | undefined,
  userRole?: string,
  userOrganisationType?: string
): boolean => {
  if (isSuperAdmin(userRole)) return true;
  if (!userAccess) return false;
  
  const permissionKey = getUserPermissionKey(userOrganisationType);
  if (!permissionKey) return false;
  
  const accessValue = resolveModuleAccess(userAccess, 'users', permissionKey);
  return accessValue === 4;
};