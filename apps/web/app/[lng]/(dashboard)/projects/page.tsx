"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useEffect, useState } from "react";
import { useProjects } from "@/lib/api/projects";
import TileGrid from "@/components/dashboard/common/TileGrid";
import type { SelectedFolder } from "@/components/dashboard/common/FoldersTreeView";
import FoldersTreeView from "@/components/dashboard/common/FoldersTreeView";
import type { GetContentQueryParams } from "@/lib/validations/common";
import { debounce } from "@mui/material/utils";

const Projects = () => {
  const [queryParams, setQueryParams] = useState<GetContentQueryParams>({
    order: "descendent",
    order_by: "updated_at",
  });

  const {
    projects,
    isLoading: isProjectLoading,
    isError: _isProjectError,
  } = useProjects(queryParams);

  const [view, setView] = useState<"list" | "grid">("grid");
  const handleViewToggle = () => {
    const newView = view === "list" ? "grid" : "list";
    setView(newView);
  };
  const [selectedFolder, setSelectedFolder] = useState<SelectedFolder>({
    type: "folder",
    id: "0",
    name: "Home",
  });

  useEffect(() => {
    if (selectedFolder.id !== "0" && selectedFolder.type === "folder") {
      setQueryParams({
        ...queryParams,
        folder_id: selectedFolder.id,
      });
    } else {
      const { folder_id: _, ...rest } = queryParams;
      setQueryParams({
        ...rest,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFolder]);

  return (
    <Container sx={{ py: 10, px: 10 }} maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 8,
        }}
      >
        <Typography variant="h6">Projects</Typography>
        <Button
          disableElevation={true}
          startIcon={
            <Icon iconName={ICON_NAME.PLUS} style={{ fontSize: 12 }} />
          }
          href="/projects"
        >
          New project
        </Button>
      </Box>
      <Grid container justifyContent="space-between" spacing={4}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Paper
              component="form"
              elevation={3}
              sx={{
                py: 1,
                px: 4,
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* Search bar */}
              <Icon iconName={ICON_NAME.SEARCH} style={{ fontSize: 17 }} />
              <InputBase
                sx={{ ml: 3, flex: 1 }}
                placeholder="Search Projects"
                inputProps={{ "aria-label": "search projects" }}
                onChange={(e) =>
                  debounce(() => {
                    setQueryParams({
                      ...queryParams,
                      search: e.target.value,
                    });
                  }, 500)()
                }
              />
              <Divider orientation="vertical" flexItem />
              <IconButton
                sx={{
                  mx: 2,
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Icon iconName={ICON_NAME.FILTER} fontSize="small" />
              </IconButton>
              <Divider orientation="vertical" flexItem />

              <IconButton
                onClick={handleViewToggle}
                sx={{
                  ml: 2,
                  p: 2,
                  borderRadius: 1,
                }}
              >
                {view === "list" ? (
                  <GridViewIcon />
                ) : (
                  <FormatListBulletedIcon />
                )}
              </IconButton>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ backgroundImage: "none" }}>
            <FoldersTreeView
              selectedFolder={selectedFolder}
              onFolderSelect={setSelectedFolder}
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <TileGrid
            view={view}
            items={projects?.items ?? []}
            isLoading={isProjectLoading}
            type="project"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Projects;
