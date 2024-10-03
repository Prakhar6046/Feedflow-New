import { revalidatePath } from "next/cache";
// interface GETUSERS {
//   role: string |;
//   organisationId: number;
// }

export const getAllOrganisations = async () => {
  try {
    const data = await fetch(`${process.env.BASE_URL}/api/organisation/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    revalidatePath("/dashboard/organisation");
    revalidatePath("/dashboard/user");
    return await data.json();
  } catch (error) {
    return error;
  }
};
export const getOrganisations = async (
  organisationId?: number,
  role?: string
) => {
  try {
    const data = await fetch(
      `${process.env.BASE_URL}/api/organisation${
        organisationId && role
          ? `?organisationId=${organisationId}&role=${role}`
          : ""
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
// export const getUsers = async (payload: any) => {
//   try {
//     const data = await fetch(
//       `https://feedflow.vercel.app/api/users?role=${payload.role}&organisationId=${payload.organisationId}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return await data.json();
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };
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
export const getFarms = async () => {
  try {
    const data = await fetch(`${process.env.BASE_URL}/api/farm`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const res = await data.json();
    revalidatePath(`/dashboard/farm`);
    console.log(res);

    return res;
  } catch (error) {
    return error;
  }
};
export const AddNewFeedSupply = async (formData: any) => {
  try {
    const data = await fetch(`${process.env.BASE_URL}/api/feed/new-feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const res = await data.json();
    revalidatePath(`/dashboard/feedSupply`);

    return res;
  } catch (error) {
    return error;
  }
};
