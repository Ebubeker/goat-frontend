"use client";

import { useSubscription } from "@/lib/api/subscription";
import { Button, Typography, useTheme, Box, Skeleton } from "@mui/material";
import { v4 } from "uuid";
import Banner from "@/components/dashboard/settings/Banner";
import SubscriptionStatusCard from "./SubscriptionStatusCard";

import type { ISubscriptionStatusCardDataType } from "@/types/dashboard/subscription";
import type { ISubscriptionCard } from "@/types/dashboard/subscription";

const Subscription = () => {
  const theme = useTheme();

  const { Subscriptions, isError, isLoading } = useSubscription();

  function getSubscriptionDetails(datas: ISubscriptionCard[]) {
    const visualData: ISubscriptionStatusCardDataType[] = datas.map((data) => ({
      icon: data.icon,
      title: data.title,
      listItems: data.listItems.map((item: string) => (
        <Typography variant="body2" key={v4()}>
          {item}
        </Typography>
      )),
      action: (
        <Button
          sx={{
            marginTop: theme.spacing(3),
            padding: `${theme.spacing(1)} ${theme.spacing(2) + 2}`,
            fontSize: "13px",
          }}
          color="primary"
        >
          Add seats
        </Button>
      ),
    }));
    return visualData;
  }

  function beforeLoadedMessage() {
    if (isLoading) {
      return (
        <>
          <Skeleton variant="rounded" width="100%" height={210} />;
          <Skeleton variant="rounded" width="100%" height={210} />;
          <Skeleton variant="rounded" width="100%" height={210} />;
        </>
      );
    } else if (isError) {
      return "Error";
    } else {
      return "No results found!";
    }
  }

  return (
    <div>
      <Box sx={{marginBottom: "100px"}}>
        {!isLoading && !isError
          ? [
              ...getSubscriptionDetails([Subscriptions.subscription]),
              ...getSubscriptionDetails(Subscriptions.extensions),
            ].map((extension) => (
              <SubscriptionStatusCard sectionData={extension} key={v4()} />
            ))
          : beforeLoadedMessage()}
      </Box>
      <Banner
        actions={<Button variant="outlined">Subscribe Now</Button>}
        content={
          <Typography
            sx={{
              color: "white",
              "@media (max-width: 1268px)": {
                fontSize: "14px",
              },
            }}
            variant="body1"
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.{" "}
          </Typography>
        }
        image="https://s3-alpha-sig.figma.com/img/630a/ef8f/d732bcd1f3ef5d6fe31bc6f94ddfbca8?Expires=1687132800&Signature=aJvQ22UUlmvNjDlrgzV6MjJK~YgohUyT9mh8onGD-HhU5yMI0~ThWZUGVn562ihhRYqlyiR5Rskno84OseNhAN21WqKNOZnAS0TyT3SSUP4t4AZJOmeuwsl2EcgElMzcE0~Qx2X~LWxor1emexxTlWntivbnUeS6qv1DIPwCferjYIwWsiNqTm7whk78HUD1-26spqW3AXVbTtwqz3B8q791QigocHaK9b4f-Ulrk3lsmp8BryHprwgetHlToFNlYYR-SqPFrEeOKNQuEDKH0QzgGv3TX7EfBNL0kgP3Crued~JNth-lIEPCjlDRnFQyNpSiLQtf9r2tH9xIsKA~XQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
        imageSide="right"
      />
    </div>
  );
};

export default Subscription;
