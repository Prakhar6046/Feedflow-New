import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "./utils";
import { GetToken } from "./cookiesGetter";
const token = await GetToken();
console.log(token);

export const getOrganisations = async (payload: {
  role?: string;
  organisationId?: number;
  query?: string;
  tab?: string;
}) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/organisation${
        payload.organisationId && payload.role
          ? `?organisationId=${payload.organisationId}&role=${payload.role}&tab=${payload?.tab}&query=${payload.query}`
          : payload?.tab
          ? `?tab=${payload?.tab}`
          : `?query=${payload.query}`
      }`,
      {
        method: "GET",
      },
      token
    );
    revalidatePath("/dashboard/organisation?tab=all");
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getOrganisationCount = async () => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/organisation/count`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getAllOrganisations = async () => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/organisation/all`,
      {
        method: "GET",
        cache: "no-store",
      },
      token
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getUsers = async (payload: any) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/users?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/user/${userId}`,
      {
        method: "GET",
      }
    );
    revalidatePath(`/dashboard/user/${userId}`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const AddNewFeedSupply = async (formData: any) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/feedSupply/new-feed`,
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );
    revalidatePath(`/dashboard/feedSupply`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getFeedSupplys = async (payload: {
  role: string;
  organisationId: string;
  query: string;
}) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/feedSupply?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    revalidatePath(`/dashboard/feedSupply`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getFishSupply = async (payload: {
  role?: string;
  organisationId?: number;
  query?: string;
}) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/fish?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
      }
    );
    revalidatePath("/dashboard/fishSupply");
    return await res.json();
  } catch (error) {
    return error;
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
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/farm?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}&tab=${payload.tab}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    revalidatePath(`/dashboard/farm`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getFarmMangers = async (organisationId?: string) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/farm/managers?organisationId=${organisationId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getOrganisationForhatchery = async () => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/organisation/hatchery`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
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
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/production?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}&userId=${payload.userId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    revalidatePath(`/dashboard/farmManager`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getBatches = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
  noFilter?: boolean;
}) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/production/batches`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    revalidatePath(`/dashboard/production`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getSampleEnvironment = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
  noFilter?: boolean;
}) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/sample/sampleEnvironment?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    revalidatePath(`/dashboard/sample`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getSampleStock = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
  noFilter?: boolean;
}) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/sample/sampleStock?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    revalidatePath(`/dashboard/sample`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getGrowthModels = async () => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/growth-model`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getFeedStores = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
}) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/feed-store?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getFeedSuppliers = async () => {
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/organisation/feedSuppliers`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};
