import React, { useState } from "react";
import { comparerModes } from "@/public/assets/data/comparers_filter";
import type { ComparerMode } from "@/types/map/filtering";

import { SelectField } from "@p4b/ui/components/Inputs";

import FilterOptionField from "./FilterOptionField";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { Icon } from "@p4b/ui/components/Icon";
import { Text } from "@/lib/theme";
import { Box } from "@mui/material";
import { v4 } from "uuid";
import { Chip } from "@/components/common/Chip";
import { makeStyles } from "@/lib/theme";
import { Button, Menu, MenuItem } from "@mui/material";
import type { Expression } from "@/types/map/filtering";
import { useDispatch } from "react-redux";
import { addExpression, removeFilter } from "@/lib/store/mapFilters/slice";
import type { LayerPropsMode } from "@/types/map/filtering";

interface ExpressionProps {
  isLast: boolean;
  expression: Expression;
  logicalOperator: string;
  id: string;
  keys: LayerPropsMode[];
}

const Exppression = (props: ExpressionProps) => {
  const { isLast, expression, logicalOperator, id, keys } = props;
  const [attributeSelected, setAttributeSelected] = useState<string | string[]>(
    expression.attribute ? expression.attribute.name : "",
  );
  const [comparerSelected, setComparerSelected] = useState<string | string[]>(
    expression.expression ? expression.expression.value : "",
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { classes } = useStyles();

  const dispatch = useDispatch();

  function getFeatureAttribute(type: string | string[]) {
    const valueToFilter = keys.filter((key) => key.name === type);
    if (valueToFilter[0].type === "string") {
      return "text";
    }
    return valueToFilter[0].type;
  }

  function handleAttributeSelect(value: string) {
    const newExpression = { ...expression };
    newExpression.attribute = {
      type: getFeatureAttribute(value),
      name: value,
    };
    setAttributeSelected(value);
    dispatch(addExpression(newExpression));
  }

  function handleComparerSelect(value: string) {
    const newExpression = { ...expression };
    newExpression.expression = getComparer(value)[0];
    newExpression.firstInput = "";
    newExpression.secondInput = "";
    setComparerSelected(value);
    dispatch(addExpression(newExpression));
    dispatch(removeFilter(newExpression.id));
  }

  function getComparer(type: string | string[]) {
    return comparerModes[getFeatureAttribute(attributeSelected)].filter(
      (compAttribute) => type === compAttribute.value,
    );
  }

  function openMorePopover(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box key={v4()}>
        <Box className={classes.expressionHeader}>
          <Text typo="body 2" className={classes.label}>
            Expression
          </Text>
          <Box>
            <Button onClick={openMorePopover}>
              <Icon iconName={ICON_NAME.ELLIPSIS} />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose}>Delete expression</MenuItem>
              <MenuItem onClick={handleClose}>Duplicate</MenuItem>
            </Menu>
          </Box>
        </Box>
        <SelectField
          className={classes.fields}
          options={keys.map((key) => ({ name: key.name, value: key.name }))}
          label="Select attribute"
          size="small"
          defaultValue={attributeSelected ? attributeSelected : ""}
          updateChange={handleAttributeSelect}
        />
        <SelectField
          className={classes.fields}
          options={
            attributeSelected.length
              ? comparerModes[getFeatureAttribute(attributeSelected)].map(
                  (attr: ComparerMode) => ({
                    name: attr.label,
                    value: attr.value,
                  }),
                )
              : [
                  {
                    name: "",
                    value: "",
                  },
                ]
          }
          label="Select an expression"
          defaultValue={comparerSelected ? comparerSelected : ""}
          size="small"
          disabled={attributeSelected.length ? false : true}
          updateChange={handleComparerSelect}
        />
        {attributeSelected.length ? (
          <>
            {comparerSelected.length ? (
              <FilterOptionField
                comparer={
                  attributeSelected.length
                    ? [...getComparer(comparerSelected)][0]
                    : null
                }
                prop={
                  typeof attributeSelected === "string" ? attributeSelected : ""
                }
                expressionId={id}
                expression={expression}
              />
            ) : null}
          </>
        ) : null}
      </Box>
      {isLast ? (
        <Box className={classes.andExpression}>
          <Chip
            label={logicalOperator === "match_all_expressions" ? "And" : "Or"}
          />
        </Box>
      ) : null}
    </>
  );
};

const useStyles = makeStyles({ name: { Exppression } })((theme) => ({
  expressionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(4),
    padding: "9.5px 0",
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
    color: theme.colors.palette.dark.main,
    fontWeight: "600",
  },
}));

export default Exppression;
