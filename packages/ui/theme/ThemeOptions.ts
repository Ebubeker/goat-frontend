// ** MUI Theme Provider
import { deepmerge } from "@mui/utils";
import type { ThemeOptions } from "@mui/material";

// ** Theme Override Imports
import palette from "./palette";
import spacing from "./spacing";
import shadows from "./shadows";
import breakpoints from "./breakpoints";
import type { Settings } from "./types";

const themeOptions = (settings: Settings): ThemeOptions => {
  // ** Vars
  const { mode, themeColor = "primary" } = settings;

  const themeConfig = {
    palette: palette(mode, themeColor),
    typography: {
      fontFamily: [
        '"Mulish"',
        "Inter",
        "sans-serif",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    shadows: shadows(mode),
    ...spacing,
    breakpoints: breakpoints(),
    shape: {
      borderRadius: 6,
    },
    mixins: {
      toolbar: {
        minHeight: 64,
      },
    },
  };

  return deepmerge(themeConfig, {
    palette: {
      primary: {
        ...themeConfig.palette[themeColor],
      },
    },
  });
};

export default themeOptions;
