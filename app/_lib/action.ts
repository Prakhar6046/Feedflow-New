import { revalidatePath } from "next/cache";

export const getOrganisations = async () => {
  try {
    const data = await fetch(`${process.env.BASE_URL}/api/organisation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    revalidatePath("/dashboard/organisation");
    return await data.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getUsers = async () => {
  try {
    const data = await fetch(`${process.env.BASE_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    revalidatePath("/dashboard/user");
    return await data.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};
