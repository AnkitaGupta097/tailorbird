import React, { ChangeEvent, useEffect } from "react";
import { Grid, CircularProgress as Loader, Typography, styled, GridProps } from "@mui/material";
import AddIcon from "../../../../../assets/icons/icon-add.svg";
import MinusIcon from "../../../../../assets/icons/icon-minus.svg";
import BaseIconButton from "../../../../../components/base-icon-button";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../stores/hooks";
import actions from "../../../../../stores/actions";
import { useParams } from "react-router-dom";
import { VARIATION_COUNT_FIELD_LABEL, VARIATION_ITEM_FIELD_LABEL } from "../constants";

interface IVariationContent {
    item: any;
    // eslint-disable-next-line
    setItem: (v: any) => void;
}

const StyledGrid = styled(Grid)<GridProps>(() => ({
    marginTop: "0.625rem",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
}));

const VariationContent = ({ setItem, item }: IVariationContent) => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { items, loading } = useAppSelector((state) => ({
        items: state.budgeting.details.variations.initItems,
        loading: state.budgeting.details.variations.initItems.loading,
    }));

    useEffect(() => {
        dispatch(actions.budgeting.fetchVariationInitItemsStart({ id: params.projectId }));
        // eslint-disable-next-line
    }, [params.projectId]);

    const selectVariation = (e: any, newVal: any) => {
        newVal &&
            setItem({
                ...item,
                ...newVal,
                count: 2,
            });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (/^[0-9]+$/.test(e.target.value)) {
            setItem({
                ...item,
                count: Number(e.target.value),
            });
        }
    };

    const increaseCount = () =>
        setItem({
            ...item,
            count: item.count + 1,
        });

    const decreaseCount = () =>
        setItem({
            ...item,
            count: item.count > 2 ? item.count - 1 : 2,
        });

    return loading ? (
        <Loader sx={{ margin: "auto", width: "100%" }} />
    ) : (
        <Grid container className="Variation-content" sx={{ width: "100%", display: "block" }}>
            {items.data?.length ? (
                <React.Fragment>
                    <Typography variant="labelText" className="Variation-content-text-header">
                        {VARIATION_ITEM_FIELD_LABEL}
                    </Typography>
                    <Autocomplete
                        id="VariationAutoFeild"
                        className="Variation-auto-feild"
                        sx={{
                            width: "41rem",
                            marginTop: "0.625rem",
                        }}
                        options={items.data}
                        autoHighlight
                        getOptionLabel={(option: any) => `${option.category} - ${option.item}`}
                        isOptionEqualToValue={(option: any, value) => option.item === value.item}
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                {`${option.category} - ${option.item}`}
                            </Box>
                        )}
                        onChange={selectVariation}
                        value={item}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    inputProps={{
                                        ...params.inputProps,
                                    }}
                                    className="Variation-auto-text-feild"
                                />
                            );
                        }}
                        size="small"
                    />
                    {item.item ? (
                        <Grid
                            item
                            md={12}
                            className="Variation-sku-count-container"
                            marginTop={4}
                            style={{ gap: "10px" }}
                        >
                            <Typography variant="labelText" className="Variation-sku-count-label">
                                {VARIATION_COUNT_FIELD_LABEL}
                            </Typography>
                            <StyledGrid item md={12} className="Variation-sku-count-field">
                                <Box
                                    component="span"
                                    onClick={decreaseCount}
                                    role="presentation"
                                    sx={{
                                        "& .MuiButton-root": {
                                            marginLeft: "0px",
                                        },
                                    }}
                                >
                                    <BaseIconButton
                                        icon={MinusIcon}
                                        classes={`Variation-item-icon-button ${
                                            item.count === 2 ? "disabled" : ""
                                        }`}
                                    />
                                </Box>
                                <TextField
                                    id="VariationSkuField"
                                    className="Variation-sku-field"
                                    variant="outlined"
                                    onChange={handleInputChange}
                                    value={item.count}
                                    sx={{
                                        width: "3rem",
                                    }}
                                    size="small"
                                />
                                <Box component="span" onClick={increaseCount} role="presentation">
                                    <BaseIconButton
                                        icon={AddIcon}
                                        classes="Variation-item-icon-button"
                                    />
                                </Box>
                            </StyledGrid>
                        </Grid>
                    ) : null}
                </React.Fragment>
            ) : null}
        </Grid>
    );
};

export default React.memo(VariationContent);
