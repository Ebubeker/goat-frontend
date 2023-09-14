"use client";

import UserInfoMenu from "@/components/UserInfoMenu";
import {
  AppBar,
  Box,
  Chip,
  Stack,
  Toolbar,
  useTheme,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";

import { GOATLogoIconOnlyGreen } from "@p4b/ui/assets/svg/GOATLogoIconOnlyGreen";

export type MapToolbarProps = {
  projectTitle: string;
  lastSaved: string;
  tags: string[];
  height?: number;
};

export function MapToolbar(props: MapToolbarProps) {
  const theme = useTheme();
  const { tags, projectTitle, lastSaved } = props;

  return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
      <Toolbar
        variant="dense"
        sx={{ minHeight: props.height, height: props.height }}
      >
        <GOATLogoIconOnlyGreen
          style={{ width: "30px", height: "30px", cursor: "pointer" }}
        />
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mx: theme.spacing(2),
          }}
        >
          <Typography variant="h5">{projectTitle}</Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2">Last saved: {lastSaved}</Typography>
          {tags &&
            tags.map((tag) => (
              <Chip
                variant="outlined"
                label={tag}
                key={tag}
                sx={{
                  mx: theme.spacing(1),
                }}
              />
            ))}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <UserInfoMenu />
      </Toolbar>
    </AppBar>
  );
}
