import {
  Alert,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import DarkModeSwitch from "@p4b/ui/components/DarkModeSwitch";
import LanguageDropdown from "@p4b/ui/components/LanguageDropdown";
import type { I18n } from "./i18n";
import { ColorModeContext, type KcContext } from "./kcContext";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useContext } from "react";
export default function Template(props: TemplateProps<KcContext, I18n>) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const {
    displayInfo = false,
    displayMessage = true,
    headerNode,
    infoNode = null,
    kcContext,
    i18n,
    children,
  } = props;
  const { realm, locale, message, isAppInitiatedAction } = kcContext;
  const {
    msgStr,
    changeLocale,
    labelBySupportedLanguageTag,
    currentLanguageTag,
  } = i18n;
  return (
    <div>
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: "1 1 auto",
        }}
      >
        <Grid
          container
          sx={{
            flex: "1 1 auto",
          }}
        >
          <Grid
            xs={12}
            lg={6}
            sx={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              component="header"
              sx={{
                left: 0,
                p: 3,
                position: "fixed",
                top: 0,
                width: "100%",
              }}
            >
              <Box
                component="a"
                href="https://www.plan4better.de/"
                target="_blank"
                sx={{
                  display: "inline-flex",
                  width: 160,
                }}
              >
                <img
                  width="100%"
                  src={`https://assets.plan4better.de/img/logo/plan4better_${
                    theme.palette.mode === "light" ? "standard" : "white"
                  }.svg`}
                  alt="Plan4Better Logo"
                />
              </Box>
            </Box>
            <Box
              component="div"
              sx={{
                flex: "1 1 auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                sx={{
                  width: 490,
                  height: "fit-content",
                  marginBottom: theme.spacing(4),
                }}
              >
                <CardContent>
                  {/* Header */}
                  <Stack
                    spacing={theme.spacing(4)}
                    sx={{
                      mb: theme.spacing(4),
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      id="kc-page-title"
                      sx={{
                        pb: theme.spacing(4),
                      }}
                    >
                      {headerNode}
                    </Typography>
                    {displayMessage &&
                      message !== undefined &&
                      (message.type !== "warning" || !isAppInitiatedAction) && (
                        <Alert severity={message.type}>{message.summary}</Alert>
                      )}
                  </Stack>
                  {/* Pages */}
                  {children}
                  {/* Footer */}
                  {displayInfo && (
                    <Stack
                      spacing={theme.spacing(2)}
                      sx={{
                        mt: theme.spacing(4),
                        textAlign: "left",
                      }}
                    >
                      {infoNode}
                    </Stack>
                  )}
                </CardContent>
                {/* Language and Theme Toggle Mode */}
                {["register-user-profile.ftl", "login.ftl"].includes(
                  kcContext.pageId,
                ) && (
                  <Stack
                    justifyContent="flex-end"
                    direction="row"
                    spacing={theme.spacing(2)}
                    sx={{
                      pb: theme.spacing(2),
                      px: theme.spacing(4),
                    }}
                  >
                    {realm.internationalizationEnabled &&
                      locale &&
                      locale.supported.length > 1 && (
                        <LanguageDropdown
                          toolTipProps={{
                            title: msgStr("changeLanguage"),
                            placement: "top",
                          }}
                          languages={labelBySupportedLanguageTag}
                          selected={currentLanguageTag}
                          onLanguageChange={changeLocale}
                        />
                      )}
                    <DarkModeSwitch
                      sx={{
                        ml: theme.spacing(2),
                      }}
                      size="small"
                      onClick={() => {
                        colorMode.toggleColorMode();
                      }}
                      toolTipProps={{
                        title: msgStr("changeTheme"),
                        placement: "top",
                      }}
                      isDarkModeEnabled={theme.palette.mode === "dark"}
                    />
                  </Stack>
                )}
              </Card>
            </Box>
          </Grid>
          <Grid
            xs={12}
            lg={6}
            sx={{
              alignItems: "center",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(40,54,72,0.8) 0%, rgba(40,54,72,0.9) 100%), url(https://assets.plan4better.de/img/login/artwork_1.png) no-repeat center",
              backgroundSize: "cover",
              display: "flex",
              justifyContent: "center",
              "& img": {
                maxWidth: "100%",
              },
            }}
          >
            <Box sx={{ p: 3, width: 350 }} component="div">
              <img
                width="100%"
                src="https://assets.plan4better.de/img/logo/goat_white.svg"
                alt="Plan4Better Logo"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
