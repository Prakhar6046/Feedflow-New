"use client";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import NewFeed from "@/app/_components/feedSupply/NewFeed";
import { selectIsEditFeed } from "@/lib/features/feed/feedSlice";
import { useAppSelector } from "@/lib/hooks";
import { Grid } from "@mui/material";

import { useEffect, useState } from "react";

export default function Page({ params }: { params: { feedSupplyId: string } }) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const isEditFeed = useAppSelector(selectIsEditFeed);

  useEffect(() => {
    if (isEditFeed) {
      setActiveStep(1);
    }
  }, [isEditFeed]);
  return (
    <>
      <BasicBreadcrumbs
        heading={"Edit Feed Supply"}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Feed Supply", link: "/dashboard/feedSupply" },
          {
            name: "Edit Feed Supply",
            link: `/dashboard/feedSupply/${params.feedSupplyId}`,
          },
        ]}
      />
      <Grid
        container
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
          p: 3,
        }}
      >
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        ></Grid>
        <Grid item xl={9} md={8} xs={12} my={2}>
          <NewFeed
            setActiveStep={setActiveStep}
            feedSupplyId={params.feedSupplyId}
          />
        </Grid>
      </Grid>
    </>
  );
}
