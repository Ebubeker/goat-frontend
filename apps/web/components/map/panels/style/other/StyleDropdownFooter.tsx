import { useTranslation } from "@/i18n/client";
import { Box, Button, Stack, Typography } from "@mui/material";

type StyleDropdownFooterProps = {
  isValid: boolean;
  onCancel: () => void;
  onApply: () => void;
};

const StyleDropdownFooter = (props: StyleDropdownFooterProps) => {
  const { t } = useTranslation(["common", "map"]);
  return (
    <>
      <Box sx={{ px: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ px: 2 }}
          spacing={1}
        >
          <Button
            variant="text"
            size="small"
            sx={{ borderRadius: 0 }}
            onClick={props.onCancel}
          >
            <Typography variant="body2" fontWeight="bold">
              {t("common:cancel")}
            </Typography>
          </Button>
          <Button
            variant="text"
            size="small"
            color="primary"
            disabled={!props.isValid}
            sx={{ borderRadius: 0 }}
            onClick={props.onApply}
          >
            <Typography variant="body2" fontWeight="bold" color="inherit">
              {t("common:apply")}
            </Typography>
          </Button>
        </Stack>
      </Box>
    </>
  );
};
export default StyleDropdownFooter;