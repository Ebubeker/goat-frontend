import {
  Box,
  Typography,
  // Select,
  // FormControl,
  // InputLabel,
  // MenuItem,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import React from "react";
// import { v4 } from "uuid";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";
import { useProjectLayers } from "@/lib/api/projects";
import { useParams } from "next/navigation";
import { getLayerStringIdById } from "@/lib/utils/helpers";
// import LayerFieldSelector from "@/components/common/form-inputs/LayerFieldSelector";
import LayerFieldSelector from "@/components/map/panels/style/classification/LayerFieldSelector";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { PostJoin } from "@/lib/validations/tools";

interface FieldsToMatchProps {
  register: UseFormRegister<PostJoin>;
  watch: PostJoin;
  errors: FieldErrors<PostJoin>;
  setValue: UseFormSetValue<PostJoin>;
}

const FieldsToMatch = (props: FieldsToMatchProps) => {
  const { watch, setValue } = props;
  const { t } = useTranslation("maps");

  const theme = useTheme();

  const { projectId } = useParams();

  const { layers } = useProjectLayers(projectId as string);

  const firstLayerKeys = useGetLayerKeys(
    `user_data.${getLayerStringIdById(
      layers ? layers : [],
      watch.target_layer_project_id,
    )
      .split("-")
      .join("")}`,
  );
  const secondLayerKeys = useGetLayerKeys(
    `user_data.${getLayerStringIdById(
      layers ? layers : [],
      watch.join_layer_project_id,
    )
      .split("-")
      .join("")}`,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
      }}
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
          iconName={ICON_NAME.CIRCLE}
          htmlColor={theme.palette.grey[700]}
          sx={{ fontSize: "18px" }}
        />
        {t("panels.tools.join.set_field_to_match")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2, mb: 4 }}>
        <Box sx={{ height: "100%" }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack
          sx={{ px: 3, py: 4, flexGrow: 1, marginTop: theme.spacing(2)}}
        >
          <Box>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {t("panels.tools.join.field_to_match_text")}
            </Typography>
            <Box sx={{ width: "100%", mt: 2 }}>
              <LayerFieldSelector
                label={t("panels.tools.join.target_field")}
                selectedField={
                  firstLayerKeys.keys.filter(
                    (key) => key.name === watch.target_field,
                  )[0]
                }
                setSelectedField={(field: {
                  type: "string" | "number";
                  name: string;
                }) => {
                  if(field){
                    setValue("target_field", field.name);
                  }else {
                    setValue("target_field", "");
                  }
                }}
                fields={firstLayerKeys.keys}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              sx={{
                margin: `${theme.spacing(2)} 0px`,
              }}
            >
              <Icon
                iconName={ICON_NAME.REVERSE}
                htmlColor={theme.palette.primary.main}
              />
            </Box>
            <Box>
              <LayerFieldSelector
                label={t("panels.tools.join.join_field")}
                selectedField={
                  secondLayerKeys.keys.filter(
                    (key) => key.name === watch.join_field,
                  )[0]
                }
                setSelectedField={(field: {
                  type: "string" | "number";
                  name: string;
                }) => {
                  if(field){
                    setValue("join_field", field.name);
                  }else {
                    setValue("join_field", "");
                  }
                }}
                fields={secondLayerKeys.keys}
              />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FieldsToMatch;
