import { revalidatePath } from "next/cache";
export const getOrganisations = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
}) => {
  try {
    const data = await fetch(
      `${process.env.BASE_URL}/api/organisation${
        payload.organisationId && payload.role
          ? `?organisationId=${payload.organisationId}&role=${payload.role}&query=${payload.query}`
          : `?query=${payload.query}`
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    revalidatePath("/dashboard/organisation");
    return await data.json();
  } catch (error) {
    return error;
  }
};
export const getUsers = async (payload: any) => {
  try {
    const data = await fetch(
      `${process.env.BASE_URL}/api/users?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await data.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getUser = async (userId: string) => {
  try {
    const data = await fetch(`${process.env.BASE_URL}/api/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    revalidatePath(`/dashboard/user/${userId}`);
    return await data.json();
  } catch (error) {
    return error;
  }
};
export const AddNewFeedSupply = async (formData: any) => {
  try {
    const data = await fetch(
      `${process.env.BASE_URL}/api/feedSupply/new-feed`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const res = await data.json();
    revalidatePath(`/dashboard/feedSupply`);

    return res;
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
    const data = await fetch(
      `${process.env.BASE_URL}/api/feedSupply?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const res = await data.json();
    revalidatePath(`/dashboard/feedSupply`);

    return res;
  } catch (error) {
    return error;
  }
};
export const getFishSupply = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
}) => {
  try {
    const data = await fetch(
      `${process.env.BASE_URL}/api/fish?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    revalidatePath("/dashboard/fishSupply");
    return await data.json();
  } catch (error) {
    return error;
  }
};
export const getFarms = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
  noFilter?: boolean;
}) => {
  try {
    const data = await fetch(
      `${process.env.BASE_URL}/api/farm?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const res = await data.json();
    revalidatePath(`/dashboard/farm`);

    return res;
  } catch (error) {
    return error;
  }
};
export const getOrganisationForhatchery = async () => {
  try {
    const data = await fetch(
      `${process.env.BASE_URL}/api/organisation/hatchery`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const res = await data.json();

    return res;
  } catch (error) {
    return error;
  }
};
export const getFarmManagers = async (payload: {
  role?: string;
  organisationId?: string;
  query?: string;
  noFilter?: boolean;
}) => {
  try {
    const data = await fetch(
      `${process.env.BASE_URL}/api/farmManager?role=${payload.role}&organisationId=${payload.organisationId}&query=${payload.query}&filter=${payload.noFilter}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const res = await data.json();
    revalidatePath(`/dashboard/farmManager`);

    return res;
  } catch (error) {
    return error;
  }
};
