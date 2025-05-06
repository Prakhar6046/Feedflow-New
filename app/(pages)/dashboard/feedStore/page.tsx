import FeedStoreTable from "@/app/_components/table/FeedStore";
import { getFeedStores } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

interface Props {}

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const loggedUser: any = getCookie("logged-user", { cookies });

  const userOrganisationType = JSON.parse(loggedUser);
  const stores = await getFeedStores({
    role: userOrganisationType.role,
    organisationId: userOrganisationType.organisationId,
    query,
  });

  return (
    <div>
      <FeedStoreTable data={stores?.data} />
    </div>
  );
};

export default Page;
