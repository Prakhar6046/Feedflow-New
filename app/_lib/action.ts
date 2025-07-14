import { revalidatePath } from "next/cache";
// import { GetToken } from "./cookiesGetter";
import { fetchWithAuth } from "./auth/fetchWithAuth";
// import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
// const token = await GetToken();
export const getOrganisations = async (payload: {
  role?: string;
  organisationId?: number;
  query?: string;
  tab?: string;
  refreshToken?: string;
}) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
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
      token,
      true,
      payload.refreshToken
    );
    revalidatePath("/dashboard/organisation?tab=all");
    return await res.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getOrganisationCount = async (refreshToken?: string) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/organisation/count`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      refreshToken
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getAllOrganisations = async (refreshToken?: string) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/organisation/all`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      refreshToken
    );
    return await res.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getUsers = async (payload: any & { refreshToken?: string }) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/users?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
      },
      token,
      true,
      payload.refreshToken
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getUser = async (userId: string, refreshToken?: string) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/user/${userId}`,
      {
        method: "GET",
      },
      token,
      true,
      refreshToken
    );
    revalidatePath(`/dashboard/user/${userId}`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const AddNewFeedSupply = async (
  formData: any,
  refreshToken?: string
) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/feedSupply/new-feed`,
      {
        method: "POST",
        body: JSON.stringify(formData),
      },
      token,
      true,
      refreshToken
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
  refreshToken?: string;
}) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/feedSupply?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      payload.refreshToken
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
  refreshToken?: string;
}) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/fish?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
      },
      token,
      true,
      payload.refreshToken
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
  refreshToken?: string;
}) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/farm?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}&tab=${payload.tab}`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      payload.refreshToken
    );
    revalidatePath(`/dashboard/farm`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getFarmMangers = async (
  organisationId?: string,
  refreshToken?: string
) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/farm/managers?organisationId=${organisationId}`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      refreshToken
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getOrganisationForhatchery = async (refreshToken?: string) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/organisation/hatchery`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      refreshToken
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
  refreshToken?: string;
}) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/production?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}&userId=${payload.userId}`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      payload.refreshToken
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
  refreshToken?: string;
}) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/production/batches`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      payload.refreshToken
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
  refreshToken?: string;
}) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/sample/sampleEnvironment?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      payload.refreshToken
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
  refreshToken?: string;
}) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/sample/sampleStock?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      payload.refreshToken
    );
    revalidatePath(`/dashboard/sample`);
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getGrowthModels = async (refreshToken?: string) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/growth-model`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      refreshToken
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
  refreshToken?: string;
}) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/feed-store?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      payload.refreshToken
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getFeedSuppliers = async (refreshToken?: string) => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("auth-token")?.value;
  try {
    const res = await fetchWithAuth(
      `${process.env.BASE_URL}/api/organisation/feedSuppliers`,
      {
        method: "GET",
        cache: "no-store",
      },
      token,
      true,
      refreshToken
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};
