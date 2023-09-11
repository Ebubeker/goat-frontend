import type { Theme } from "@mui/material/styles";

import MuiAvatar from "./avatar";
import Button from "./button";
import Card from "./card";
import Chip from "./chip";
import Tooltip from "./tooltip";
import MuiTabs from './tabs'
import MuiInput from './input'
import MuiPaper from './paper'
import MuiAlerts from './alerts'
import MuiDialog from './dialog'
import MuiSelect from './select'
import MuiDivider from './divider'
import MuiSnackbar from './snackbar'
import MuiSwitches from './switches'
import MuiTypography from './typography'
import MuiDateTimePicker from './dateTimePicker'
import Link from "./link";
const Overrides = (theme: Theme) => {
  return {
    ...MuiAvatar(theme),
    ...Button(theme),
    ...Card(theme),
    ...Chip(theme),
    ...Tooltip(theme),
    ...MuiTabs(theme),
    ...MuiInput(theme),
    ...MuiPaper(theme),
    ...MuiAlerts(theme),
    ...MuiDialog(theme),
    ...MuiSelect(theme),
    ...MuiDivider(theme),
    ...MuiSnackbar(theme),
    ...MuiSwitches(theme),
    ...MuiTypography(theme),
    ...MuiDateTimePicker(theme),
    ...Link(),
  };
};

export default Overrides;
