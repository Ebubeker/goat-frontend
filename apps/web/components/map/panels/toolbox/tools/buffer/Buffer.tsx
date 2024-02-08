import React, { useMemo } from "react";
import { BufferBaseSchema } from "@/lib/validations/tools";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { sendBufferRequest } from "@/lib/api/tools";
import { useParams } from "next/navigation";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import { toast } from "react-toastify";

import InputLayer from "@/components/map/panels/toolbox/tools/buffer/InputLayer";
import BufferSettings from "@/components/map/panels/toolbox/tools/buffer/BufferSettings";

import type { PostBuffer } from "@/lib/validations/tools";

const Buffer = () => {
  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<PostBuffer>({
    mode: "onChange",
    resolver: zodResolver(BufferBaseSchema),
    defaultValues: {
      source_layer_project_id: 0,
      max_distance: 500,
      distance_step: 5,
      polygon_union: true,
      polygon_difference: false,
    },
  });

  const { projectId } = useParams();

  const handleReset = () => {
    reset();
  };

  const handleRun = () => {
    toast.info("Buffer tool is running");
    sendBufferRequest(getValues(), projectId as string)
      .then((data) =>
        data.ok
          ? toast.success("Buffer tool is successful")
          : toast.error("Buffer tool failed"),
      )
      .catch(() => {
        toast.error("Buffer tool failed");
      });
    reset();
  };

  const watchFormValues = watch();

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Box
        sx={{
          height: "95%",
          maxHeight: "95%",
          overflow: "scroll",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <InputLayer
          register={register}
          watch={getCurrentValues}
          errors={errors}
        />
        <BufferSettings
          register={register}
          watch={getCurrentValues}
          errors={errors}
          setValue={setValue}
        />
      </Box>
      <ToolboxActionButtons
        runFunction={handleRun}
        runDisabled={!isValid}
        resetFunction={handleReset}
        resetDisabled={
          !getCurrentValues.max_distance &&
          !getCurrentValues.distance_step &&
          !getCurrentValues.source_layer_project_id
        }
      />
    </Box>
  );
};

export default Buffer;
