import React from "react";
import {
  Typography,
  useTheme,
  Box,
  // Select,
  // FormControl,
  // InputLabel,
  // MenuItem,
  Stack,
  TextField,
  Divider,
  Switch,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";

import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import type { PostBuffer } from "@/lib/validations/tools";

interface BufferSettingsProps {
  register: UseFormRegister<PostBuffer>;
  // getValues: UseFormGetValues<PostBuffer>;
  setValue: UseFormSetValue<PostBuffer>;
  watch: PostBuffer;
  errors: FieldErrors<PostBuffer>;
}

const BufferSettings = (props: BufferSettingsProps) => {
  const {
    register,
    // getValues,
    setValue,
    watch,
    errors,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={theme.spacing(2)}
      marginBottom={theme.spacing(4)}
    >
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing(2),
        }}
      >
        <Icon
          iconName={ICON_NAME.LAYERS}
          htmlColor={theme.palette.grey[700]}
          sx={{ fontSize: "18px" }}
        />
        Buffer Settings
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2 }}>
        <Box sx={{ height: "100%" }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack sx={{ pl: 4, py: 4, pr: 1, flexGrow: 1 }}>
          <Box display="flex" flexDirection="column" gap={theme.spacing(2)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(2),
                margin: `${theme.spacing(4)} 0`,
              }}
            >
              <TextField
                label={`${t("panels.isochrone.distance")} (m)`}
                {...register("max_distance", {
                  valueAsNumber: true,
                  setValueAs: (value) =>
                    value === "" ? undefined : parseInt(value),
                })}
                size="small"
                disabled={!watch.source_layer_project_id ? true : false}
                error={!!errors.max_distance}
                helperText={
                  !!errors.max_distance && errors.max_distance?.message
                }
                type="number"
                sx={{
                  margin: `${theme.spacing(1)} 0`,
                }}
                fullWidth
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(2),
              // marginBottom: theme.spacing(4),
            }}
          >
            <TextField
              label={t("panels.isochrone.steps")}
              disabled={!(watch.source_layer_project_id && watch.max_distance)}
              {...register("distance_step", {
                valueAsNumber: true,
                setValueAs: (value) =>
                  value === "" ? undefined : parseInt(value),
              })}
              error={!!errors.distance_step}
              helperText={
                !!errors.distance_step && errors.distance_step?.message
              }
              size="small"
              fullWidth
              type="number"
              sx={{
                margin: `${theme.spacing(1)} 0`,
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
            <Typography variant="body1">Polygon Union</Typography>
            <Switch
              checked={watch.polygon_union}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue("polygon_union", event.target.checked);
                if (!event.target.checked) {
                  setValue("polygon_difference", false);
                }
              }}
              // {...register()}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body1">Polygon Difference</Typography>
            <Switch
              disabled={!watch.polygon_union}
              checked={watch.polygon_difference}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue("polygon_difference", event.target.checked);
              }}
              // {...register()}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default BufferSettings;
