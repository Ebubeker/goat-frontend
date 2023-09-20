"use client";

import React from "react";
import { Box } from "@mui/material";
import { v4 } from "uuid";
import { TextField, Grid, Button, useTheme, Card } from "@mui/material";

interface tempProfileInfoType {
  label: string;
  value: string;
  editable: boolean;
}

const Profile = () => {
  const theme = useTheme();

  const informatoryData: tempProfileInfoType[] = [
    {
      label: "First Name",
      value: "User",
      editable: true,
    },
    {
      label: "Last Name",
      value: "Costumer",
      editable: true,
    },
    {
      label: "Email",
      value: "user@gmail.com",
      editable: true,
    },
    {
      label: "Phone Number",
      value: "User",
      editable: true,
    },
    {
      label: "Country",
      value: "Germany",
      editable: true,
    },
    {
      label: "Timezone",
      value: "(GMT-12:00) International Date Line West",
      editable: true,
    },
    {
      label: "Participant in organizations",
      value: "LocalMapping, GOAT, Map4Ci...",
      editable: true,
    },
  ];

  return (
    <Box sx={{marginBottom: "100px" }}>
      <Card sx={{padding: `${theme.spacing(6)} ${theme.spacing(3)}`}}>
        <Grid container spacing={2}>
          {informatoryData.map((infoData) => (
            <Grid key={v4()} item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(5),
                  margin: `${theme.spacing(3)} ${theme.spacing(3)}`,
                }}
              >
                <TextField
                  label={infoData.label}
                  sx={{ width: "100%" }}
                  value={infoData.value}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        </Card>
        <Box
          sx={{
            margin: `0px ${theme.spacing(3)}px`,
            marginTop: "100px",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            sx={{
              display: "block",
              width: "100%",
              padding: "10px",
              borderRadius: 1,
              margin: `${theme.spacing(3)} 0px`,
            }}
          >
            Deactivate
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              display: "block",
              width: "100%",
              padding: "10px",
              margin: `${theme.spacing(3)} 0px`,
              borderRadius: 1,
            }}
          >
            Delete
          </Button>
        </Box>
    </Box>
  );
};

export default Profile;
