import {
    Checkbox,
    Grid,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Radio,
    RadioProps,
    TextField,
    TextFieldProps,
    Typography,
    TypographyPropsVariantOverrides,
} from "@mui/material";
import PercentIcon from "@mui/icons-material/PercentRounded";
import { Variant } from "@mui/material/styles/createTypography";
import { OverridableStringUnion } from "@mui/types";
import React, { Dispatch, FC, SetStateAction } from "react";
import { IItem, IRfpResponseItems } from "stores/bidding-portal/bidding-portal-models";

interface ICustomTypography {
    text: string;
    variant: OverridableStringUnion<"inherit" | Variant, TypographyPropsVariantOverrides>;
}

interface IRadioOptionProps {
    value: number;
    label: string;
    isEditable: boolean;
    valueSetter: Dispatch<SetStateAction<number>>;
    uom: string;
}

interface IChildItemList {
    items: any[];
    handleToggle: Function;
    checkedItems: string[];
    disabled: boolean;
}

const commonTextFieldProps: Partial<TextFieldProps> = {
    sx: {
        width: "6rem",
        "input::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "input::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "input[type=number]": {
            "-moz-appearance": "textfield",
        },
    },
    size: "small",
    onFocus: (e) =>
        e.target.addEventListener("wheel", (e) => e.preventDefault(), {
            passive: false,
        }),
};

const getUOM = (uom: string): string => (uom.toLowerCase() === "count" ? "" : uom);

export const CustomTypography: FC<ICustomTypography> = ({ text, variant }) => (
    <Typography variant={variant} textAlign="center" mb="1rem">
        {text}
    </Typography>
);

const PercentageAdornment = () => (
    <InputAdornment position="end" sx={{ width: "0.5rem", opacity: "0.7" }}>
        <PercentIcon fontSize="small" htmlColor="inherit" />
    </InputAdornment>
);

export const RadioOptionRenderer: FC<IRadioOptionProps> = ({
    label,
    value,
    isEditable,
    valueSetter,
    uom,
}) => (
    <Grid container direction="row" gap={10} marginTop="0.2rem">
        <Grid item sx={{ width: "20rem", marginTop: "0.35rem" }}>
            <CustomTypography text={label} variant="text_16_regular" />
        </Grid>
        <Grid item>
            <TextField
                type="text"
                disabled={!isEditable}
                value={`${Number.isInteger(value) ? value : value.toFixed(2)} ${uom}`}
                title={String(`${value} ${uom}`)}
                InputProps={{
                    ...(isEditable && {
                        endAdornment: <PercentageAdornment />,
                    }),
                    style: { fontSize: "14px" },
                }}
                onChange={(e) => valueSetter(parseInt(e.target.value, 10))}
                {...commonTextFieldProps}
            />
        </Grid>
    </Grid>
);

export const CustomRadio: FC<RadioProps> = (props) => <Radio {...props} sx={{ color: "black" }} />;

export const ChildItemList: FC<IChildItemList> = ({
    items,
    handleToggle,
    checkedItems,
    disabled,
}) => (
    <List sx={{ opacity: disabled ? 0.5 : 1, padding: 0, margin: 0 }}>
        {(items as IRfpResponseItems[]).map(
            ({ subcategory, quantity, specific_uom, uom, specific_quantity, id }) => {
                const value = specific_quantity
                    ? `${
                          Number.isInteger(specific_quantity)
                              ? specific_quantity
                              : specific_quantity.toFixed(2)
                      } ${getUOM(specific_uom)}`
                    : `${Number.isInteger(quantity) ? quantity : quantity.toFixed(2)} ${getUOM(
                          uom,
                      )}`;

                return (
                    <ListItem
                        key={id}
                        sx={{ height: "3rem" }}
                        secondaryAction={
                            <TextField
                                disabled
                                title={value}
                                value={value}
                                InputProps={{ style: { fontSize: "14px" } }}
                                {...commonTextFieldProps}
                            />
                        }
                    >
                        <ListItemButton
                            disableRipple
                            disableGutters
                            onClick={() => {
                                if (!disabled) handleToggle(id);
                            }}
                            style={{ backgroundColor: "transparent" }}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checkedItems.indexOf(id) !== -1}
                                    sx={{ color: "black" }}
                                />
                            </ListItemIcon>
                            <ListItemText primary={subcategory} />
                        </ListItemButton>
                    </ListItem>
                );
            },
        )}
    </List>
);
export const checkIfAllSameUOM = (items: any[]): boolean => {
    const referenceUOM = items?.[0]?.specific_uom || items?.[0]?.uom;
    return items?.every(({ specific_uom, uom }: IItem) =>
        specific_uom ? specific_uom === referenceUOM : uom === referenceUOM,
    );
};

export const checkIfPercentageApplicable = (items: any[]): boolean => {
    const belowTheLineCategories = ["tax", "general conditions", "profit & overhead"];
    return items?.every(({ l1_name, category }: IRfpResponseItems) =>
        l1_name
            ? belowTheLineCategories.includes(l1_name?.toLowerCase())
            : belowTheLineCategories.includes(category?.toLowerCase()),
    );
};
