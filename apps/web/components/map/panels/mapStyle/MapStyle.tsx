import Container from "@/components/map/panels/Container";
import {
  Button,
  CardContent,
  CardMedia,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Tab,
  Tabs,
  Card,
  IconButton,
  useTheme,
  Checkbox,
  Select,
  Box,
  MenuItem,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import { saveStyles, setTabValue } from "@/lib/store/styling/slice";
import type { MapSidebarItem } from "@/components/map/Sidebar";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import React from "react";
import SelectStrokeOptionFill from "@/components/map/panels/mapStyle/SelectStrokeOptionFill";
import ColorOptionFill from "@/components/map/panels/mapStyle/ColorOptionFill";
import ColorOptionLine from "@/components/map/panels/mapStyle/ColorOptionLine";
import StrokeOptionLine from "@/components/map/panels/mapStyle/StrokeOptionLine";
import MarkerOptionSymbol from "@/components/map/panels/mapStyle/MarkerOptionSymbol";
import { fetchLayerData } from "@/lib/store/styling/actions";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import ColorOptionSymbol from "@/components/map/panels/mapStyle/ColorOptionSymbol";
import StrokeOptionSymbol from "@/components/map/panels/mapStyle/StrokeOptionSymbol";
import SizeOptionSymbol from "@/components/map/panels/mapStyle/SizeOptionSymbol";
import { selectMapLayer } from "@/lib/store/styling/selectors";
import { v4 } from "uuid";

interface MapStyleProps {
  setActiveRight: (item: MapSidebarItem | undefined) => void;
  projectId: string;
}

const layerTypes = [
  {
    label: "@column_label",
    value: "@column_label",
  },
  {
    label: "@column_label1",
    value: "@column_label1",
  },
];

const MapStylePanel = ({ setActiveRight, projectId }: MapStyleProps) => {
  const { tabValue } = useSelector((state: IStore) => state.styling);
  const mapLayer = useSelector(selectMapLayer);

  const dispatch = useAppDispatch();

  const theme = useTheme();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    dispatch(setTabValue(newValue));
  };

  const resetStylesHandler = () => {
    if (projectId) {
      dispatch(fetchLayerData(projectId));
    }
  };

  const saveStylesHandler = () => {
    dispatch(saveStyles());
  };

  return (
    <Container
      header={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Icon
            iconName={ICON_NAME.CHEVRON_RIGHT}
            htmlColor={theme.palette.primary.main}
            fontSize="small"
            onClick={() => setActiveRight(undefined)}
          />
          <Typography color={theme.palette.primary.main} variant="body1">
            Layer design
          </Typography>
        </Box>
      }
      body={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "24px",
          }}
        >
          <Card sx={{ paddingLeft: theme.spacing(2) }}>
            <RadioGroup aria-label="options" name="options">
              <FormControlLabel
                value="@content_label"
                sx={{
                  span: {
                    fontSize: "12px",
                    fontStyle: "italic",
                  },
                }}
                control={
                  <Radio
                    color="default"
                    icon={
                      <Icon
                        iconName={ICON_NAME.STAR}
                        htmlColor={theme.palette.primary.dark}
                        fontSize="small"
                      />
                    }
                    checkedIcon={
                      <Icon
                        iconName={ICON_NAME.STAR}
                        htmlColor={theme.palette.primary.main}
                        fontSize="small"
                      />
                    }
                  />
                }
                label="@content_label"
              />
            </RadioGroup>
          </Card>
          <Box>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="SIMPLE"
                sx={{
                  width: "50%",
                }}
              />
              <Tab
                label="SMART"
                sx={{
                  width: "50%",
                }}
              />
            </Tabs>
          </Box>
          {tabValue === 0 ? (
            <>
              <Card>
                <CardMedia
                  sx={{
                    height: "42px",
                    backgroundColor: theme.palette.secondary.main,
                    border: "none",
                  }}
                  component="div"
                />
                <CardContent
                  sx={{
                    display: "flex",
                    columnGap: "6px",
                    padding: "8px 16px",
                  }}
                >
                  <IconButton type="submit" sx={{ alignSelf: "flex-start" }}>
                    <Icon iconName={ICON_NAME.CIRCLEINFO} fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    Location (single symbol)
                  </Typography>
                  <Checkbox />
                </CardContent>
              </Card>
              {mapLayer?.type === "line" ? (
                <>
                  <ColorOptionLine />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <StrokeOptionLine />
                </>
              ) : null}
              {mapLayer?.type === "fill" ? (
                <>
                  <ColorOptionFill />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <SelectStrokeOptionFill />
                </>
              ) : null}
              {mapLayer?.type === "symbol" ? (
                <>
                  <MarkerOptionSymbol />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <ColorOptionSymbol />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <StrokeOptionSymbol />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <SizeOptionSymbol />
                </>
              ) : null}
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "8px",
                  width: "100%",
                }}
              >
                <Typography variant="body2">Attribute</Typography>
                <Select label="Browser layer attributes">
                  {layerTypes.map((type) => (
                    <MenuItem key={v4()} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography
                  color="secondary"
                  variant="subtitle2"
                  sx={{
                    fontStyle: "italic",
                    margin: "0 8px",
                  }}
                >
                  Style your map according to the values of a specific attribute
                  or column in the dataset, using techniques such as color
                  coding or symbol size variation for categorical and numerical
                  data.
                </Typography>
              </Box>
            </>
          )}
        </Box>
      }
      action={
        <Box
          sx={{
            minWidth: "266px",
            display: "flex",
            columnGap: "16px",
          }}
        >
          <Button
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              fontSize: "14px",
              width: "50%",
              "&:disabled": {
                border: "1px solid #ccc",
                color: theme.palette.secondary.dark,
              },
            }}
            color="secondary"
            variant="outlined"
            onClick={resetStylesHandler}
          >
            Reset
          </Button>
          <Button
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              fontSize: "14px",
              width: "50%",
              "&:disabled": {
                border: "1px solid #ccc",
                color: theme.palette.secondary.dark,
              },
            }}
            color="primary"
            variant="outlined"
            onClick={saveStylesHandler}
            endIcon={
              <Icon iconName={ICON_NAME.CHEVRON_DOWN} fontSize="small" />
            }
          >
            Save As
          </Button>
        </Box>
      }
    />
  );
};

export default MapStylePanel;
