"use client";

import Container from "@/components/map/panels/Container";
import { useState } from "react";

import { makeStyles } from "@p4b/ui/lib/ThemeProvider";
import { useGetKeys } from "@/hooks/map/FilteringHooks";

import { Card, CardMedia } from "@p4b/ui/components/Surfaces";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { Icon } from "@p4b/ui/components/Icon";
import { useTheme } from "@/lib/theme";
import { Text } from "@/lib/theme";
import { Box } from "@mui/material";
import { Button } from "@p4b/ui/components/theme";
import Exppression from "./Exppression";
import { SelectField } from "@p4b/ui/components/Inputs";
import { useDispatch, useSelector } from "react-redux";
import {
  setLogicalOperator,
  setFilters,
  addExpression,
  clearExpression
} from "@/lib/store/mapFilters/slice";
import { v4 } from "uuid";
import type { IStore } from "@/types/store";

const FilterPanel = () => {
  const dispatch = useDispatch();
  const { expressions } = useSelector((state: IStore) => state.mapFilters);
  const [logicalOperator, setLogicalOperatorVal] = useState<string>(
    "match_all_expressions",
  );
  const sampleLayerID = "user_data.8c4ad0c86a2d4e60b42ad6fb8760a76e";

  const { keys } = useGetKeys({ layer_id: sampleLayerID });
  const theme = useTheme();
  const { classes } = useStyles();

  const logicalOperatorOptions: { label: React.ReactNode; value: string }[] = [
    {
      label: "Match all expressions",
      value: "match_all_expressions",
    },
    {
      label: "Match at least one expression",
      value: "match_at_least_one_expression",
    },
  ];

  function createExpression() {
    dispatch(setLogicalOperator("match_all_expressions"));
    dispatch(
      addExpression({
        id: v4(),
        attribute: null,
        expression: null,
        value: null,
        firstInput: "",
        secondInput: "",
      }),
    );
  }

  function handleOperatorChange(value: string) {
    setLogicalOperatorVal(value);
    dispatch(setLogicalOperator(value));
  }

  function cleanExpressions() {
    dispatch(clearExpression());
    dispatch(setFilters({}));
  }

  return (
    <Container
      header={<Text typo="page heading">Filter</Text>}
      body={
        <>
          <div>
            <Card noHover={true}>
              <div className={classes.ContentHeader}>
                <Icon
                  iconName={ICON_NAME.STAR}
                  htmlColor={`${theme.colors.palette.focus.main}4D`}
                />
                <Text typo="body 2" className={classes.headerText}>
                  @content_label
                </Text>
              </div>
            </Card>

            {expressions && expressions.length > 1 ? (
              <>
                <Text typo="body 2" className={classes.label}>
                  Filter
                </Text>
                <SelectField
                  className={classes.fields}
                  options={logicalOperatorOptions.map((key) => ({
                    name: key.label,
                    value: key.value,
                  }))}
                  label="Select attribute"
                  size="small"
                  defaultValue={logicalOperator ? logicalOperator : ""}
                  updateChange={handleOperatorChange}
                />
              </>
            ) : null}

            {expressions ? (
              expressions.map((expression, indx) => (
                // <>
                <Exppression
                  isLast={indx + 1 !== expressions.length}
                  logicalOperator={logicalOperator}
                  id={`${indx + 1}`}
                  expression={expression}
                  key={v4()}
                  keys={keys}
                />
              ))
            ) : (
              <Box sx={{ marginTop: `${theme.spacing(4)}px` }}>
                <Card
                  noHover={true}
                  aboveDivider={
                    <CardMedia
                      className={classes.cardMediaImage}
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy9x3wyV5OWYWA8XxBJKMlH2QvuSSOIdOItRK1jgXSQ&s"
                    />
                  }
                >
                  <div className={classes.CardWrapper}>
                    <Text typo="body 1">Filter your data</Text>
                    <Text className={classes.CardDescription} typo="label 2">
                      Perform targeted data analysis. Filter layers, apply an
                      expression and narrow down data displayed. Sort data and
                      hide data that does not match your criteria. Learn more
                    </Text>
                  </div>
                </Card>
              </Box>
            )}
            <Button
              className={classes.expressionButton}
              onClick={createExpression}
            >
              Add Expression
            </Button>
          </div>
          {expressions && expressions.length ? (
            <Button
              variant="secondary"
              className={classes.expressionButton}
              onClick={cleanExpressions}
            >
              Clear Filter
            </Button>
          ) : null}
        </>
      }
    />
  );
};

const useStyles = makeStyles({ name: { FilterPanel } })((theme) => ({
  ContentHeader: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
  headerText: {
    width: "fit-content",
  },
  cardMediaImage: {
    height: "56px",
  },
  CardDescription: {
    fontSize: "11px",
    lineHeight: "175%",
    fontStyle: "italic",
    color: theme.colors.palette.light.greyVariant3,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  CardWrapper: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
  expressionButton: {
    width: "100%",
    marginTop: theme.spacing(4),
  },
  expressionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(4),
    padding: "9.5px",
  },
  andExpression: {
    display: "flex",
    justifyContent: "center",
    margin: `${theme.spacing(4)}px 0`,
  },
  fields: {
    margin: `${theme.spacing(2)}px 0`,
  },
  label: {
    marginTop: "24px",
    color: theme.colors.palette.dark.main,
    fontWeight: "600",
  },
}));

export default FilterPanel;
