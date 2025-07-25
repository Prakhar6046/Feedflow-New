import { revalidatePath } from 'next/cache';

import { secureFetch } from './auth';

export const getOrganisations = async (payload: {
  role?: string;
  organisationId?: number;
  query?: string;
  tab?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (payload.organisationId)
      params.append('organisationId', String(payload.organisationId));
    if (payload.role) params.append('role', payload.role);
    if (payload.tab) params.append('tab', payload.tab);
    if (payload.query) params.append('query', payload.query);

    const url = `${process.env.BASE_URL}/api/organisation?${params}`;

    const res = await secureFetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch organisations');

    return await res.json();
  } catch (error) {
    console.error('getOrganisations error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getOrganisationCount = async () => {
  try {
    const url = `${process.env.BASE_URL}/api/organisation/count`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('getOrganisationCount error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getAllOrganisations = async () => {
  try {
    const url = `${process.env.BASE_URL}/api/organisation/all`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('getAllOrganisations error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getUsers = async (payload: {
  role?: string;
  organisationId?: number;
  query?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (payload.role) params.append('role', payload.role);
    if (payload.organisationId)
      params.append('organisationId', String(payload.organisationId));
    if (payload.query) params.append('query', payload.query);

    const url = `${process.env.BASE_URL}/api/users?${params}`;
    const res = await secureFetch(url, {
      method: 'GET',
    });
    return await res.json();
  } catch (error) {
    console.error('getUsers error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getUser = async (userId: number) => {
  try {
    const url = `${process.env.BASE_URL}/api/user/${userId}`;
    const res = await secureFetch(url, {
      method: 'GET',
    });
    revalidatePath(`/dashboard/user/${userId}`);
    return await res.json();
  } catch (error) {
    console.error('getUser error:', error);
    return { error: 'Something went wrong' };
  }
};

export const AddNewFeedSupply = async (formData: any) => {
  try {
    const url = `${process.env.BASE_URL}/api/feedSupply/new-feed`;
    const res = await secureFetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json', // Assuming JSON body
      },
    });
    revalidatePath(`/dashboard/feedSupply`);
    return await res.json();
  } catch (error) {
    console.error('AddNewFeedSupply error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getFeedSupplys = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (payload.role) params.append('role', payload.role);
    if (payload.organisationId)
      params.append('organisationId', payload.organisationId);
    if (payload.query) params.append('query', payload.query);

    const url = `${process.env.BASE_URL}/api/feedSupply?${params}`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    revalidatePath(`/dashboard/feedSupply`);
    return await res.json();
  } catch (error) {
    console.error('getFeedSupplys error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getFishSupply = async (payload: {
  role?: string;
  organisationId?: number;
  query?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (payload.role) params.append('role', payload.role);
    if (payload.organisationId)
      params.append('organisationId', String(payload.organisationId));
    if (payload.query) params.append('query', payload.query);

    const url = `${process.env.BASE_URL}/api/fish?${params}`;
    const res = await secureFetch(url, {
      method: 'GET',
    });
    revalidatePath('/dashboard/fishSupply');
    return await res.json();
  } catch (error) {
    console.error('getFishSupply error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getFarms = async (payload: {
  role?: string;
  organisationId?: number;
  query?: string;
  noFilter?: boolean;
  tab?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (payload.role) params.append('role', payload.role);
    if (payload.organisationId)
      params.append('organisationId', String(payload.organisationId));
    if (payload.query) params.append('query', payload.query);
    if (payload.noFilter !== undefined)
      params.append('filter', String(payload.noFilter)); // Renamed from 'noFilter' to 'filter' as per your original URL
    if (payload.tab) params.append('tab', payload.tab);

    const url = `${process.env.BASE_URL}/api/farm?${params}`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    revalidatePath(`/dashboard/farm`);
    return await res.json();
  } catch (error) {
    console.error('getFarms error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getFarmMangers = async (organisationId?: string) => {
  try {
    const params = new URLSearchParams();
    if (organisationId) params.append('organisationId', organisationId);

    const url = `${process.env.BASE_URL}/api/farm/managers?${params}`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('getFarmMangers error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getOrganisationForhatchery = async () => {
  try {
    const url = `${process.env.BASE_URL}/api/organisation/hatchery`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('getOrganisationForhatchery error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getProductions = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
  noFilter?: boolean;
  userId?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (payload.role) params.append('role', payload.role);
    if (payload.organisationId)
      params.append('organisationId', payload.organisationId);
    if (payload.query) params.append('query', payload.query);
    if (payload.noFilter !== undefined)
      params.append('filter', String(payload.noFilter));
    if (payload.userId) params.append('userId', payload.userId);

    const url = `${process.env.BASE_URL}/api/production?${params}`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    revalidatePath(`/dashboard/farmManager`); // or `/dashboard/production` depending on typical revalidation
    return await res.json();
  } catch (error) {
    console.error('getProductions error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getBatches = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
  noFilter?: boolean;
}) => {
  try {
    const params = new URLSearchParams();
    // Note: Your original `getBatches` URL does not seem to use these parameters in the URL directly,
    // but I'm adding them for consistency if you intend to use them.
    if (payload.role) params.append('role', payload.role);
    if (payload.organisationId)
      params.append('organisationId', payload.organisationId);
    if (payload.query) params.append('query', payload.query);
    if (payload.noFilter !== undefined)
      params.append('filter', String(payload.noFilter));

    const url = `${process.env.BASE_URL}/api/production/batches?${params}`; // Appending params for consistency
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    revalidatePath(`/dashboard/production`);
    return await res.json();
  } catch (error) {
    console.error('getBatches error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getSampleEnvironment = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
  noFilter?: boolean;
}) => {
  try {
    const params = new URLSearchParams();
    if (payload.role) params.append('role', payload.role);
    if (payload.organisationId)
      params.append('organisationId', payload.organisationId);
    if (payload.query) params.append('query', payload.query);
    if (payload.noFilter !== undefined)
      params.append('filter', String(payload.noFilter));

    const url = `${process.env.BASE_URL}/api/sample/sampleEnvironment?${params}`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    revalidatePath(`/dashboard/sample`);
    return await res.json();
  } catch (error) {
    console.error('getSampleEnvironment error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getSampleStock = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
  noFilter?: boolean;
}) => {
  try {
    const params = new URLSearchParams();
    if (payload.role) params.append('role', payload.role);
    if (payload.organisationId)
      params.append('organisationId', payload.organisationId);
    if (payload.query) params.append('query', payload.query);
    if (payload.noFilter !== undefined)
      params.append('filter', String(payload.noFilter));

    const url = `${process.env.BASE_URL}/api/sample/sampleStock?${params}`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    revalidatePath(`/dashboard/sample`);
    return await res.json();
  } catch (error) {
    console.error('getSampleStock error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getGrowthModels = async () => {
  try {
    const url = `${process.env.BASE_URL}/api/growth-model`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('getGrowthModels error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getFeedStores = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (payload.role) params.append('role', payload.role);
    if (payload.organisationId)
      params.append('organisationId', payload.organisationId);
    if (payload.query) params.append('query', payload.query);

    const url = `${process.env.BASE_URL}/api/feed-store?${params}`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('getFeedStores error:', error);
    return { error: 'Something went wrong' };
  }
};

export const getFeedSuppliers = async () => {
  try {
    const url = `${process.env.BASE_URL}/api/organisation/feedSuppliers`;
    const res = await secureFetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('getFeedSuppliers error:', error);
    return { error: 'Something went wrong' };
  }
};
