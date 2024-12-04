import { Autocomplete, Divider, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { AddNewSKUModalConstants } from "modules/package-manager/constants";
import React, { FC, useState, useEffect } from "react";
import { CustomTextField } from ".";
import LabelTextField from "../common/labeltext-field";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "stores/hooks";
import {
    ICreateSKUState,
    ISubCategoryTile,
    ISubcategoryPair,
} from "modules/package-manager/interfaces";
import { Stack } from "@mui/system";
import { Delete } from "@mui/icons-material";

//eslint-disable-next-line
const SubCategoryTile: FC<ISubCategoryTile> = ({
    subcategoryPairs,
    index,
    inputs,
    setInputs,
    inputErrors,
    onDelete,
}) => {
    const uniqueSubcategoryPairs: any = {};
    subcategoryPairs.forEach((item: any) => {
        uniqueSubcategoryPairs[item.category] = uniqueSubcategoryPairs[item.category] || item;
    });
    const uniqueSubcategoryPairsList: Array<ISubcategoryPair> =
        Object.values(uniqueSubcategoryPairs);

    const [subcategoryValue, setSubcategoryValue] = useState<Array<string>>([]);
    const [categoryOptions, setCategoryOptions] = useState<ISubcategoryPair>();

    useEffect(() => {
        if (categoryOptions) {
            const filteredSubcategories = subcategoryPairs
                .filter((item) => item.category === categoryOptions.category)
                .map((item) => item.subcategory);
            setSubcategoryValue(filteredSubcategories);
        }
    }, [categoryOptions, subcategoryPairs]);

    const theme = useTheme();
    const { loading } = useAppSelector((state) => {
        return {
            loading: state.mdm.materials.loading,
        };
    }, shallowEqual);
    return (
        <React.Fragment>
            <Grid container direction="column">
                {index !== 0 ? (
                    <Grid item xs>
                        <Stack
                            direction="row"
                            width="100%"
                            justifyContent="center"
                            alignItems="center"
                            spacing={4}
                        >
                            <Typography variant="body1">{index + 1}</Typography>
                            <Divider flexItem sx={{ width: "95%", translate: "0 -1.1rem" }} />
                            <IconButton
                                sx={{
                                    color: theme.buttons.primary,
                                }}
                                onClick={() => onDelete(index)}
                            >
                                <Delete />
                            </IconButton>
                        </Stack>
                    </Grid>
                ) : null}
                <Grid item>
                    <LabelTextField
                        label={AddNewSKUModalConstants.CATEGORY}
                        dropDownMenu={
                            <React.Fragment>
                                <Autocomplete
                                    disabled={loading}
                                    getOptionLabel={(uniqueSubcategoryPairsList) =>
                                        uniqueSubcategoryPairsList.category
                                    }
                                    options={uniqueSubcategoryPairsList}
                                    fullWidth
                                    onChange={(e, value) => {
                                        setCategoryOptions(value as ISubcategoryPair);
                                        setInputs((prevInput: ICreateSKUState) => {
                                            const categories = [...prevInput.Category];
                                            categories[index] = value?.category ?? "";
                                            return {
                                                ...prevInput,
                                                ["Category"]: categories,
                                            };
                                        });
                                    }}
                                    popupIcon={<KeyboardArrowDownIcon />}
                                    renderInput={(params) => (
                                        <CustomTextField
                                            placeholder={AddNewSKUModalConstants.CATEGORY}
                                            {...params}
                                            variant="outlined"
                                            helperText={
                                                inputErrors["Category"]?.error
                                                    ? inputErrors["Category"]?.errMsg
                                                    : undefined
                                            }
                                            error={!!inputErrors["Category"]?.error[index] ?? false}
                                        />
                                    )}
                                />
                            </React.Fragment>
                        }
                    />
                </Grid>
                <Grid
                    item
                    xs
                    style={{
                        marginBottom: "1.00rem",
                        marginTop: "1.00rem",
                    }}
                ></Grid>
                <Grid item>
                    <LabelTextField
                        label={AddNewSKUModalConstants.SUB_CATEGORY}
                        dropDownMenu={
                            <React.Fragment>
                                <Autocomplete
                                    disabled={loading}
                                    getOptionLabel={(option: string) => option}
                                    fullWidth
                                    onChange={(e, value) => {
                                        setInputs((prevInput: ICreateSKUState) => {
                                            let subCategories = [...prevInput.Subcategory];
                                            subCategories[index] = value ?? "";
                                            return {
                                                ...prevInput,
                                                ["Subcategory"]: subCategories,
                                            };
                                        });
                                    }}
                                    popupIcon={<KeyboardArrowDownIcon />}
                                    options={subcategoryValue}
                                    renderInput={(params) => (
                                        <CustomTextField
                                            placeholder={AddNewSKUModalConstants.SUB_CATEGORY}
                                            {...params}
                                            variant="outlined"
                                            helperText={
                                                inputErrors["Subcategory"]?.error
                                                    ? inputErrors["Subcategory"]?.errMsg
                                                    : undefined
                                            }
                                            error={
                                                !!inputErrors["Subcategory"]?.error[index] ?? false
                                            }
                                        />
                                    )}
                                />
                            </React.Fragment>
                        }
                    />
                </Grid>
                <Grid
                    item
                    style={{
                        marginBottom: "1.23rem",
                        marginTop: "1.23rem",
                    }}
                >
                    <LabelTextField
                        label={AddNewSKUModalConstants.DESC}
                        textFieldProps={{
                            placeholder: AddNewSKUModalConstants.DESC,
                            fullWidth: true,
                            onChange: (e) => {
                                setInputs((prevInput: ICreateSKUState) => {
                                    let desc = [...prevInput.Description];
                                    desc[index] = e.target.value ?? "";
                                    return {
                                        ...prevInput,
                                        [AddNewSKUModalConstants.DESC]: desc,
                                    };
                                });
                            },
                            value: inputs[AddNewSKUModalConstants.DESC as keyof typeof inputs][
                                index
                            ],
                            helperText: inputErrors["Description"].error
                                ? inputErrors["Description"].errMsg
                                : null,
                            error: !!inputErrors["Description"]?.error[index] ?? false,
                        }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default SubCategoryTile;
