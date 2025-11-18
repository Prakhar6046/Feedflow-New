export const ACCESS_LEVEL_DEFINITIONS: Record<number, string> = {
  4: 'Add, edit, delete and allocate (full access)',
  3: 'Add only',
  2: 'Edit & View',
  1: 'View only',
  0: 'No access',
};

export type ModuleAccessMap = {
  growthModels?: number | number[];
  feedLibrary?: number | number[];
  organisations?: {
    feedManufacturers?: number | number[];
    fishProducers?: number | number[];
  };
  users?: {
    feedManufacturers?: number | number[];
    fishProducers?: number | number[];
  };
  setup?: {
    fishSupply?: number | number[];
    farm?: number | number[];
    feedSupply?: number | number[];
  };
  manage?: {
    production?: number | number[];
    feedPrediction?: number | number[];
  };
};

export interface UserAccessConfig {
  definition: string;
  modules: ModuleAccessMap;
}

type UserTypeMatrix = Record<string, UserAccessConfig>;

export const USER_TYPE_DEFINITIONS: Record<string, Record<string, string>> = {
  'Feed flow help desk': {
    'Business manager': 'Senior management.',
    'Feedflow Administrator (Admin)':
      'Responsible for assistance with user and organisation administration (adding or editing fish farms, users, feeds, etc.) and associated support.',
    'Advisor: Technical services - adviser to Clients':
      'Provides technical support to clients across feed manufacturers and fish producers with full access to assigned organisations.',
  },
  'Feed manufacturer': {
    'Business Manager': 'Senior management responsible for production operations.',
    'Feedflow administrator':
      'Handles day-to-day assistance with user and organisation administration within the feed manufacturer.',
    'Advisor: Technical services - adviser to Clients':
      'Provides technical support to feed manufacturers and their client organisations.',
  },
  'Fish Producer': {
    'Business manager': 'Senior management for the fish producer organisation.',
    'Feedflow administrator':
      'Responsible for user and organisation administration within the fish producer.',
    'Operational manager':
      'Management role able to view and edit assigned farms.',
    'Farm manager':
      'Oversees day-to-day farm operations, sampling and feeding table inputs.',
    'General worker (level 2)':
      'Responsible for daily farm tasks including recording fish, samples and feeding tables.',
    'General worker (level 1)': 'Supports core farm operations with limited data entry.',
  },
  'Third party advisors (external)': {
    'Business manager': 'Senior management within the advisory business.',
    'Feedflow administrator':
      'Supports advisory teams with user and organisation administration for assigned clients.',
    'Advisor: Technical services - adviser to Clients':
      'Provides technical support to fish producers with full access to assigned organisations.',
  },
  'Fish supplier': {
    'Business manager': 'Senior management for the fish supplier organisation.',
    'Feedflow administrator':
      'Supports the supplier with user and organisation administration duties.',
    'Advisor: Technical services - adviser to Clients':
      'Advises fish producers on supplier-related technical matters for assigned organisations.',
  },
};

export const MODULE_DISPLAY_ORDER: Array<{
  key: keyof ModuleAccessMap;
  label: string;
  children?: Array<{ key: string; label: string }>;
}> = [
  { key: 'growthModels', label: 'Growth models' },
  { key: 'feedLibrary', label: 'Feed library (master doc)' },
  {
    key: 'organisations',
    label: 'Organisations',
    children: [
      { key: 'feedManufacturers', label: 'Feed manufacturers' },
      { key: 'fishProducers', label: 'Fish producers' },
    ],
  },
  {
    key: 'users',
    label: 'Users',
    children: [
      { key: 'feedManufacturers', label: 'Feed manufacturers' },
      { key: 'fishProducers', label: 'Fish producers' },
      { key: 'fishSupply', label: 'Fish supply' },
    ],
  },
  {
    key: 'setup',
    label: 'Set-up',
    children: [
      { key: 'farm', label: 'Farm' },
      { key: 'feedSupply', label: 'Feed supply' },
    ],
  },
  {
    key: 'manage',
    label: 'Manage',
    children: [
      { key: 'production', label: 'Production' },
      { key: 'feedPrediction', label: 'Feed prediction' },
    ],
  },
];

// NOTE: The numerical values mirror the shared spreadsheet. They can be tuned
// easily without touching component logic.
export const USER_ACCESS_MATRIX: Record<string, UserTypeMatrix> = {
  'Feed flow help desk': {
    'Business manager': {
      definition: USER_TYPE_DEFINITIONS['Feed flow help desk']['Business manager'],
      modules: {
        growthModels: 4,
        feedLibrary: 4,
        organisations: { feedManufacturers: 3, fishProducers: 3 },
        users: { feedManufacturers: 0, fishProducers: 0 },
        setup: {fishSupply: 0, farm: 0, feedSupply: 0},
        manage: { production: 3, feedPrediction: 0 },
      },
    },
    'Feedflow Administrator (Admin)': {
      definition:
        USER_TYPE_DEFINITIONS['Feed flow help desk']['Feedflow Administrator (Admin)'],
      modules: {
        growthModels: 1,
        feedLibrary: 1,
        organisations: { feedManufacturers: 3, fishProducers: 3},
        users: { feedManufacturers: 0, fishProducers: 0},
        setup: { fishSupply: 0, farm: 0, feedSupply: 0},
        manage: { production:0, feedPrediction: 0 },
      },
    },
    'Advisor: Technical services - adviser to Clients': {
      definition:
        USER_TYPE_DEFINITIONS['Feed flow help desk']['Advisor: Technical services - adviser to Clients'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: [2,1], fishProducers: [2,1] },
        users: { feedManufacturers: [2,1], fishProducers: [4,2,1]},
        setup: {  fishSupply: [4,2,1] ,farm: [4,2,1], feedSupply: [4,2,1]},
        manage: { production: [4,2,1], feedPrediction: [4,2,1] },
      },
    },
  },
  'Feed manufacturer': {
    'Business Manager': {
      definition: USER_TYPE_DEFINITIONS['Feed manufacturer']['Business Manager'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 2, fishProducers: 3 },
        users: { feedManufacturers: 4, fishProducers:0},
        setup: {fishSupply: 0, farm: 0, feedSupply: 0 },
        manage: { production: 0, feedPrediction: 3},
      },
    },
    'Feedflow administrator': {
      definition: USER_TYPE_DEFINITIONS['Feed manufacturer']['Feedflow administrator'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 2, fishProducers: 3 },
        users: { feedManufacturers: 4, fishProducers:0},
        setup: {fishSupply: 0, farm: 0, feedSupply: 0 },
        manage: { production: 0, feedPrediction: 3},
      },
    },
    'Advisor: Technical services - adviser to Clients': {
      definition:
        USER_TYPE_DEFINITIONS['Feed manufacturer']['Advisor: Technical services - adviser to Clients'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: [2,1] },
        users: { feedManufacturers: 0, fishProducers: [4,2,1] },
        setup: { fishSupply: [4,2,1], farm: [4,2,1], feedSupply: [4,2,1] },
        manage: { production: [4,2,1], feedPrediction: [4,2,1] },
      },
    },
  },
  'Fish Producer': {
    'Business manager': {
      definition: USER_TYPE_DEFINITIONS['Fish Producer']['Business manager'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 1, fishProducers: 2},
        users: { feedManufacturers: 0, fishProducers: 4},
        setup: {fishSupply: 4 , farm: 4, feedSupply: 1 },
        manage: { production: 4, feedPrediction: 4 },
      },
    },
    'Feedflow administrator': {
      definition: USER_TYPE_DEFINITIONS['Fish Producer']['Feedflow administrator'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 1, fishProducers: 2},
        users: { feedManufacturers: 0, fishProducers: 4},
        setup: {fishSupply: 4 , farm: 1, feedSupply: 1 },
        manage: { production: 1, feedPrediction: 1 },
      },
    },
    'Operational manager': {
      definition: USER_TYPE_DEFINITIONS['Fish Producer']['Operational manager'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 1},
        users: { feedManufacturers: 0, fishProducers: 1},
        setup: {fishSupply: 4 , farm: 4, feedSupply: 1 },
        manage: { production: 4, feedPrediction: 4 },
      },
    },
    'Farm manager': {
      definition: USER_TYPE_DEFINITIONS['Fish Producer']['Farm manager'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 1},
        users: { feedManufacturers: 0, fishProducers: 1},
        setup: {fishSupply: 2 , farm: 2, feedSupply: 1 },
        manage: { production: 4, feedPrediction: 4 },
      },
    },
    'General worker (level 2)': {
      definition: USER_TYPE_DEFINITIONS['Fish Producer']['General worker (level 2)'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 1},
        users: { feedManufacturers: 0, fishProducers: 1},
        setup: {fishSupply: 2 , farm: 1, feedSupply: 1 },
        manage: { production: 1, feedPrediction: 1},
      },
    },
    'General worker (level 1)': {
      definition: USER_TYPE_DEFINITIONS['Fish Producer']['General worker (level 1)'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 1},
        users: { feedManufacturers: 0, fishProducers: 1},
        setup: {fishSupply: 1 , farm: 1, feedSupply: 1 },
        manage: { production: 1, feedPrediction: 1},
      },
    },
  },
  'Third party advisors (external)': {
    'Business manager': {
      definition: USER_TYPE_DEFINITIONS['Third party advisors (external)']['Business manager'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 1},
        users: { feedManufacturers: 0, fishProducers: 0},
        setup: {fishSupply: 0 , farm:0, feedSupply: 0 },
        manage: { production:3, feedPrediction: 3 },
      },
    },
    'Feedflow administrator': {
      definition: USER_TYPE_DEFINITIONS['Third party advisors (external)']['Feedflow administrator'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 1},
        users: { feedManufacturers: 0, fishProducers: 0},
        setup: {fishSupply: 0 , farm:0, feedSupply: 0 },
        manage: { production:3, feedPrediction: 3 },
      },
    },
    'Advisor: Technical services - adviser to Clients': {
      definition:
        USER_TYPE_DEFINITIONS['Third party advisors (external)']['Advisor: Technical services - adviser to Clients'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 1},
        users: { feedManufacturers: 0, fishProducers: [4,2,1]},   
        setup: {fishSupply: [4,2,1] , farm: [4,2,1], feedSupply: [4,2,1] },
        manage: { production: [4,2,1], feedPrediction: [4,2,1] },
      },
    },
  },
  'Fish supplier': {
    'Business manager': {
      definition: USER_TYPE_DEFINITIONS['Fish supplier']['Business manager'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 0},
        users: { feedManufacturers: 0, fishProducers: 0},
        setup: { fishSupply: 0 , farm: 0, feedSupply: 0},
        manage: { production: 0, feedPrediction: 0},
      },
    },
    'Feedflow administrator': {
      definition: USER_TYPE_DEFINITIONS['Fish supplier']['Feedflow administrator'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 0},
        users: { feedManufacturers: 0, fishProducers: 0},
        setup: { fishSupply: 0 , farm: 0, feedSupply: 0},
        manage: { production: 0, feedPrediction: 0},
      },
    },
    'Advisor: Technical services - adviser to Clients': {
      definition:
        USER_TYPE_DEFINITIONS['Fish supplier']['Advisor: Technical services - adviser to Clients'],
      modules: {
        growthModels: 0,
        feedLibrary: 0,
        organisations: { feedManufacturers: 0, fishProducers: 0},
        users: { feedManufacturers: 0, fishProducers: 0},
        setup: { fishSupply: 0 , farm: 0, feedSupply: 0},
        manage: { production: 0, feedPrediction: 0},
      },
    },
  },
};
export const getUserAccessConfig = (
  organisationType?: string,
  userType?: string,
): UserAccessConfig | undefined => {
  if (!organisationType || !userType) return undefined;
  return USER_ACCESS_MATRIX[organisationType]?.[userType];
};

const normalizeAccessValue = (value: number | number[] | undefined): number => {
  if (Array.isArray(value)) return Math.max(...value);
  return value ?? 0;
};

// ✅ Safe resolveModuleAccess that supports nested structures and arrays
export const resolveModuleAccess = (
  access: UserAccessConfig | undefined,
  sectionKey: keyof ModuleAccessMap,
  childKey?: string,
): number => {
  if (!access) return 0;
  const modules = access.modules;
  const section = modules[sectionKey];

  // If child key exists, dig into nested objects
  if (childKey && section && typeof section === 'object' && !Array.isArray(section)) {
    const subValue = (section as Record<string, number | number[] | undefined>)[childKey];
    return normalizeAccessValue(subValue);
  }

  // If section itself is a number or number array
  if (typeof section === 'number' || Array.isArray(section)) {
    return normalizeAccessValue(section);
  }

  return 0;
};
export const hasFullModuleAccess = (
  access?: UserAccessConfig | ModuleAccessMap,
): boolean => {
  if (!access) return false;
  const modules =
    'modules' in access ? (access.modules as ModuleAccessMap) : access;

  // Check simple top-level modules
  if (normalizeAccessValue(modules.growthModels) === 4) return true;
  if (normalizeAccessValue(modules.feedLibrary) === 4) return true;

  const sections: Array<keyof ModuleAccessMap> = [
    'organisations',
    'users',
    'setup',
    'manage',
  ];

  return sections.some((section) => {
    const sectionValue = modules[section];

    // Skip undefined
    if (!sectionValue) return false;

    // If sectionValue is an object (like setup, users, etc.)
    if (typeof sectionValue === 'object' && !Array.isArray(sectionValue)) {
      return Object.values(sectionValue).some(
        (val) => normalizeAccessValue(val) === 4,
      );
    }

    // Otherwise check if the sectionValue itself has full access
    return normalizeAccessValue(sectionValue as number | number[]) === 4;
  });
};


