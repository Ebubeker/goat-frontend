import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  debounce,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
  MenuList,
  IconButton,
} from "@mui/material";
import CustomMenu from "@/components/common/CustomMenu";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import { useParams } from "next/navigation";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";
import { v4 } from "uuid";
import { comparerModes } from "@/public/assets/data/comparers_filter";
import {
  TextOption,
  NumberOption,
  SelectOption,
  DualNumberOption,
} from "@/components/map/panels/filter/nonuse/FilterOption";
import { useUniqueValues } from "@/lib/api/layers";
import LayerFieldSelector from "@/components/common/form-inputs/LayerFieldSelector";

import type { Expression as ExpressionType } from "@/lib/validations/filter";
import type { SelectChangeEvent } from "@mui/material";

interface ExpressionProps {
  expression: ExpressionType;
  modifyExpression: (
    expression: ExpressionType,
    key: string,
    value: string | string[] | number,
  ) => void;
  deleteOneExpression: (expression: ExpressionType) => void;
  duplicateExpression: (expression: ExpressionType) => void;
}

const Expression = React.memo(function Expression(props: ExpressionProps) {
  const {
    expression,
    modifyExpression,
    deleteOneExpression,
    duplicateExpression,
  } = props;
  const { projectId } = useParams();

  const [expressionValue, setExpressionValue] = useState(expression.value);
  const [anchorEl, setAnchorEl] = React.useState<boolean>(false);
  const [statisticsPage, setStatisticsPage] = React.useState<number>(1);
  const [statisticsData, setStatisticsData] = React.useState<string[]>([]);

  const { t } = useTranslation("maps");
  const { activeLayer } = useActiveLayer(projectId as string);
  const open = Boolean(anchorEl);

  const theme = useTheme();

  const { data } = useUniqueValues(
    activeLayer ? activeLayer.layer_id : "",
    expression.attribute,
    statisticsPage,
  );

  useEffect(() => {
    if (data && Object.keys(data) !== statisticsData) {
      setStatisticsData([...statisticsData, ...Object.keys(data)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const optionsStatistic = statisticsData.map((option) => ({
    value: option,
    label: option,
  }));

  const debounceEffect = (
    expression: ExpressionType,
    key: string,
    value: string,
  ) => {
    setExpressionValue(value);
    debounce(() => {
      modifyExpression(expression, key, value);
    }, 500)();
  };

  const getValueCollector = () => {
    switch (expression.expression) {
      case "is":
      case "is_not":
        if (attributeType === "string") {
          return (
            <TextOption
              value={expressionValue as string}
              setChange={(value: string) => {
                debounceEffect(expression, "value", value);
              }}
              options={optionsStatistic}
              fetchMoreData={() => {
                setStatisticsPage(statisticsPage + 1);
              }}
            />
          );
        } else {
          return (
            <NumberOption
              value={expression.value as string}
              setChange={(value: string) => {
                modifyExpression(expression, "value", parseFloat(value));
              }}
              options={optionsStatistic}
              fetchMoreData={() => {
                setStatisticsPage(statisticsPage + 1);
              }}
            />
          );
        }
      case "starts_with":
      case "ends_with":
      case "contains_the_text":
      case "does_not_contains_the_text":
        return (
          <TextOption
            value={expression.value as string}
            setChange={(value: string) =>
              modifyExpression(expression, "value", value)
            }
            options={optionsStatistic}
            fetchMoreData={() => {
              setStatisticsPage(statisticsPage + 1);
            }}
          />
        );
        break;
      case "includes":
      case "excludes":
        return (
          <SelectOption
            value={
              (typeof expression.value === "string"
                ? expression.value.split(",")
                : expression.value) as string[]
            }
            fetchMoreData={() => {
              setStatisticsPage(statisticsPage + 1);
            }}
            setChange={(value: string[]) => {
              modifyExpression(expression, "value", value);
            }}
            options={optionsStatistic}
          />
        );
      case "is_at_least":
      case "is_less_than":
      case "is_at_most":
      case "is_greater_than":
        return (
          <NumberOption
            value={expression.value as string}
            setChange={(value: string) =>
              modifyExpression(expression, "value", parseFloat(value))
            }
            options={optionsStatistic}
            fetchMoreData={() => {
              setStatisticsPage(statisticsPage + 1);
            }}
          />
        );
      case "is_between":
        return (
          <DualNumberOption
            options={optionsStatistic}
            fetchMoreData={() => {
              setStatisticsPage(statisticsPage + 1);
            }}
            value1={
              typeof expression.value === "string"
                ? expression.value.split("-")[0]
                : "0"
            }
            setChange1={(value: string) =>
              modifyExpression(
                expression,
                "value",
                `${value.length ? value : "0"}-${
                  typeof expression.value === "string" &&
                  expression.value.split("-").length > 1
                    ? expression.value.split("-")[1]
                    : "0"
                }`,
              )
            }
            value2={
              typeof expression.value === "string"
                ? expression.value.split("-")[1]
                : "0"
            }
            setChange2={(value: string) =>
              modifyExpression(
                expression,
                "value",
                `${
                  typeof expression.value === "string" &&
                  expression.value.split("-").length > 1
                    ? expression.value.split("-")[0]
                    : "0"
                }-${value.length ? value : "0"}`,
              )
            }
          />
        );
      default:
        return null;
    }
  };

  const layerAttributes = useGetLayerKeys(
    `user_data.${(activeLayer ? activeLayer.layer_id : "")
      .split("-")
      .join("")}`,
  );

  const attributeType = layerAttributes.keys.filter(
    (attrib) => attrib.name === expression.attribute,
  ).length
    ? layerAttributes.keys.filter(
        (attrib) => attrib.name === expression.attribute,
      )[0].type
    : undefined;

  function toggleMorePopover() {
    setAnchorEl(!anchorEl);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          fontWeight="bold"
          color={theme.palette.secondary.dark}
          sx={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}
        >
          <Icon iconName={ICON_NAME.EDITPEN} sx={{ fontSize: "18px" }} />
          {t("panels.filter.expression")}
        </Typography>
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={toggleMorePopover}
            sx={{ padding: theme.spacing(1), width: "fit-content" }}
          >
            <Icon iconName={ICON_NAME.ELLIPSIS} />
          </IconButton>
          {open ? (
            <CustomMenu close={toggleMorePopover}>
              <MenuList>
                <MenuItem onClick={() => deleteOneExpression(expression)}>
                  {t("panels.filter.delete_expression")}
                </MenuItem>
                <MenuItem onClick={() => duplicateExpression(expression)}>
                  {t("panels.filter.duplicate")}
                </MenuItem>
              </MenuList>
            </CustomMenu>
          ) : null}
        </Box>
      </Box>
      <LayerFieldSelector
        label="Target Field"
        selectedField={
          layerAttributes.keys.filter(
            (key) => key.name === expression.attribute,
          )[0]
        }
        setSelectedField={(field: {
          type: "string" | "number";
          name: string;
        }) => {
          if (field) {
            modifyExpression(expression, "attribute", field.name);
            // setValue("target_field", field.name);
          } else {
            modifyExpression(expression, "attribute", "");
          }
          setStatisticsData([]);
          setExpressionValue("");
        }}
        fields={layerAttributes.keys}
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {t("panels.filter.select_an_expression")}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={expression.expression}
          label={t("panels.filter.select_an_expression")}
          onChange={(event: SelectChangeEvent) => {
            modifyExpression(expression, "expression", event.target.value);
            setExpressionValue("");
            setStatisticsData([]);
          }}
        >
          {attributeType
            ? comparerModes[attributeType].map((attr) => (
                <MenuItem key={v4()} value={attr.value}>
                  {attr.label}
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>
      {getValueCollector()}
    </Box>
  );
});

export default Expression;
