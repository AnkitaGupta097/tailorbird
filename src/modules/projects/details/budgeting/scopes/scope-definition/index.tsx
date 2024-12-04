import React, { useState, useEffect } from "react";
import {
    Grid,
    Checkbox,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Radio,
    Switch,
    Typography,
    Card,
    ListItem,
    styled,
    ListItemProps,
    CardProps,
    TypographyProps,
    SwitchProps,
} from "@mui/material";
import AppTheme from "../../../../../../styles/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dispatchActions from "stores/actions";
import { useAppDispatch } from "stores/hooks";
import { getCategoryIcon } from "../../category-icons";
interface IScopeDefinition {
    scopeItems: any;
    setScopeItems: any;
    scopeLabel?: string;
}

const StyledListItem = styled(ListItem)<ListItemProps>(({ theme }) => ({
    borderBottom: `1px solid ${theme.border.divider}`,
    height: "3.75rem",
    cursor: "pointer",
    "&.active": {
        backgroundColor: "#F2F2F2",
    },
    alignItems: "center",
}));

const StyledCard = styled(Card)<CardProps>(() => ({
    width: "27rem",
    height: "25rem",
    overflowY: "scroll",
}));

const StyledSwitch = styled(Switch)<SwitchProps>(() => ({
    height: "3rem",
    width: "4.4rem",
    "& .MuiSwitch-track": {
        borderRadius: "2rem",
        marginTop: "-4px",
    },
    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
        marginLeft: "5px",
    },
}));

const StyledRadioLabel = styled(Typography)<TypographyProps>(({ theme }) => ({
    padding: "0.3rem 0.625rem",
    borderRadius: "1rem",
    "&.selected": { background: theme.palette.primary.main, color: theme.palette.text.secondary },
    "&.default": { background: theme.palette.secondary.main, color: theme.palette.text.primary },
}));

const ScopeDefinition = ({ scopeItems, setScopeItems, scopeLabel }: IScopeDefinition) => {
    const [selectedCategory, setSelectedCategory] = useState<any>();
    const [expanded, setExpanded] = React.useState<string[]>(["panel-0"]);
    const dispatch = useAppDispatch();

    const handleChange = (e: any, panel: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (expanded.includes(panel)) {
            setExpanded([...expanded.filter((e) => e !== panel)]);
        } else {
            setExpanded([...expanded, panel]);
        }
    };

    const onCategoryClick = (e: any, category: any) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedCategory(category);
    };

    const setSubCatselected = (e: any, category: any, subCat: any, idx: any) => {
        setScopeItems((state: any) => {
            const stateCopy = JSON.parse(JSON.stringify(state));
            const cat = stateCopy.find(
                (cat: any) => cat.name.toLowerCase() === category.name.toLowerCase(),
            );

            const subcategory = cat.items.find(
                (item: any) => item.name && item.name.toLowerCase() === subCat.name.toLowerCase(),
            );
            if (subcategory.isSelected) {
                subcategory.isSelected = false;
                subcategory.scopes = subcategory.scopes.map((sc: any) => ({
                    ...sc,
                    isSelected: false,
                    isAltSku: false,
                }));
            } else {
                subcategory.isSelected = true;
                subcategory.scopes = subcategory.scopes.map((sc: any) => {
                    return { ...sc, isSelected: true, isAltSku: !!sc.baseInventory };
                });
            }

            const panel = `panel-${idx}`;
            if (!subcategory.isSelected) {
                setExpanded([...expanded.filter((e) => e !== panel)]);
            } else {
                setExpanded([...expanded, panel]);
            }
            return stateCopy;
        });
    };

    const onScopeSelected = (e: any, category: any, subCat: any, scope: any) => {
        setScopeItems((state: any) => {
            const stateCopy = JSON.parse(JSON.stringify(state));
            const group = stateCopy.find((cat: any) => cat.name === category.name);
            const item = group.items.find((subC: any) => subC.name === subCat.name);
            item.scopes = item.scopes.map((sc: any) => {
                if (sc.name.toLowerCase() === scope.name.toLowerCase()) {
                    sc.isAltSku = !!sc.baseInventory;
                    sc.isSelected = !sc.isSelected;
                }
                return sc;
            });
            group.isSelected = item.scopes.some((sc: any) => sc.isSelected);
            item.isSelected = item.scopes.some((sc: any) => sc.isSelected);
            return stateCopy;
        });
    };

    const handleAltSkuChange = (e: any, category: any, subCat: any) => {
        setScopeItems((state: any) => {
            const stateCopy = JSON.parse(JSON.stringify(state));
            const group = stateCopy.find((cat: any) => cat.name === category.name);
            const item = group.items.find((subC: any) => subC.name === subCat.name);
            item.scopes = item.scopes.map((sc: any) => {
                if (sc.isAltSku) {
                    return { ...sc, isAltSku: false };
                }
                return { ...sc, isAltSku: true };
            });
            return stateCopy;
        });
    };

    useEffect(
        () => () => {
            setScopeItems([]);
            dispatch(dispatchActions.budgeting.clearCreateOrUpdateAltScope());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        if (selectedCategory?.name) {
            setSelectedCategory(scopeItems?.find((cat: any) => cat.name === selectedCategory.name));
        } else {
            setSelectedCategory(scopeItems?.[0]);
        }
    }, [scopeItems, selectedCategory]);

    return (
        <Grid container marginTop={4} marginBottom={2} className="Scope-definition-container">
            {/* <Grid item md={12}>
                <FormControl fullWidth={true}>
                    {scopeLabel?.toLowerCase() !== "alt-scope" ? (
                        <Typography variant="labelText" className="Scope-definition-search-label">
                            Search for Items
                        </Typography>
                    ) : null}
                    <TextField
                        className="Scope-definition-search-field"
                        variant="outlined"
                        label={
                            scopeLabel?.toLowerCase() === "alt-scope" ? (
                                <Typography variant="labelText">Search for items</Typography>
                            ) : null
                        }
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                    />
                </FormControl>
            </Grid> */}
            {/* <Grid item md={12}>
                <FormControlLabel
                    value=""
                    control={
                        <Checkbox checked={false} sx={{ color: AppTheme.palette.primary.main }} />
                    }
                    label="Show/Hide all"
                    labelPlacement="end"
                />
            </Grid> */}
            <Grid container marginTop={2} className="Scope-definition-inventories-container">
                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Grid item marginRight={8}>
                        <StyledCard>
                            {scopeItems?.map((category: any, idx: number) => (
                                <StyledListItem
                                    key={idx}
                                    className={
                                        selectedCategory?.name === category.name ? "active" : ""
                                    }
                                    onClick={(e) => onCategoryClick(e, category)}
                                >
                                    <img
                                        src={getCategoryIcon(category.name)}
                                        width={30}
                                        height={30}
                                        alt={`${category.name} icon`}
                                        className="Scope-table-reno-category-image"
                                        style={{ marginRight: "1rem" }}
                                    />
                                    <Typography
                                        variant={`${
                                            selectedCategory?.name === category.name
                                                ? "scopeDefinitionActiveLabel"
                                                : "scopeDefinitionLabel"
                                        }`}
                                        className="Scope-definition-category-item-label"
                                    >
                                        {category.name}
                                    </Typography>
                                </StyledListItem>
                            ))}
                        </StyledCard>
                    </Grid>
                    <Grid item>
                        <StyledCard>
                            {selectedCategory &&
                                selectedCategory.items.map((subCat: any, idx: number) => {
                                    return (
                                        <Accordion
                                            expanded={expanded.includes(`panel-${idx}`)}
                                            key={`subcat-panel-${idx}`}
                                            disableGutters={true}
                                        >
                                            <AccordionSummary
                                                expandIcon={
                                                    <ExpandMoreIcon
                                                        onClick={(e) =>
                                                            handleChange(e, `panel-${idx}`)
                                                        }
                                                    />
                                                }
                                                aria-controls={`panel-${idx}d-content`}
                                                id={`panel-${idx}d-header`}
                                                className="Scope-definition-items-header"
                                                sx={{
                                                    justifyContent: "space-between",
                                                    div: { justifyContent: "space-between" },
                                                }}
                                            >
                                                <FormControlLabel
                                                    value={subCat.isSelected}
                                                    control={
                                                        <Checkbox
                                                            checked={subCat.isSelected}
                                                            onClick={(e) =>
                                                                setSubCatselected(
                                                                    e,
                                                                    selectedCategory,
                                                                    subCat,
                                                                    idx,
                                                                )
                                                            }
                                                            sx={{
                                                                color: AppTheme.palette.primary
                                                                    .main,
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography
                                                            variant={
                                                                subCat.isSelected
                                                                    ? "scopeDefinitionActiveLabel"
                                                                    : "scopeDefinitionLabel"
                                                            }
                                                            onClick={(e) =>
                                                                handleChange(e, `panel-${idx}`)
                                                            }
                                                            sx={{
                                                                width: "100%",
                                                                height: "100%",
                                                                display: "flex",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            {subCat.name}
                                                        </Typography>
                                                    }
                                                    labelPlacement="end"
                                                    sx={{ width: "100%" }}
                                                />
                                                {scopeLabel === "alt-scope" ? (
                                                    <React.Fragment>
                                                        <FormControlLabel
                                                            control={
                                                                <StyledSwitch
                                                                    color="info"
                                                                    checked={subCat.scopes.some(
                                                                        (scope: any) =>
                                                                            scope.isAltSku,
                                                                    )}
                                                                    onChange={(e) =>
                                                                        handleAltSkuChange(
                                                                            e,
                                                                            selectedCategory,
                                                                            subCat,
                                                                        )
                                                                    }
                                                                />
                                                            }
                                                            label={
                                                                <Typography variant="labelText">
                                                                    SKU Change
                                                                </Typography>
                                                            }
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                            labelPlacement="start"
                                                        />
                                                    </React.Fragment>
                                                ) : null}
                                            </AccordionSummary>
                                            <AccordionDetails className="Scope-definition-scopes-container">
                                                {subCat?.scopes?.map((scope: any, idx: any) => (
                                                    <Grid key={`${scope.name}-${idx}`}>
                                                        <FormControlLabel
                                                            control={
                                                                <Radio
                                                                    checked={scope.isSelected}
                                                                    onClick={(e) =>
                                                                        onScopeSelected(
                                                                            e,
                                                                            selectedCategory,
                                                                            subCat,
                                                                            scope,
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        color: AppTheme.palette
                                                                            .primary.main,
                                                                    }}
                                                                />
                                                            }
                                                            label={
                                                                <StyledRadioLabel
                                                                    variant="scopeDefinitionLabel"
                                                                    className={`Scope-definition-items-radio-label  ${
                                                                        scope.isSelected
                                                                            ? "selected"
                                                                            : "default"
                                                                    }`}
                                                                >
                                                                    {scope.name}
                                                                </StyledRadioLabel>
                                                            }
                                                            className={`Scope-definition-items-radio`}
                                                        />
                                                        {scopeLabel === "alt-scope" ? (
                                                            scope.baseInventory ? (
                                                                <Typography
                                                                    className="Scope-definition-base"
                                                                    sx={{
                                                                        display: "inline-flex",
                                                                        color: "#57B6B2",
                                                                    }}
                                                                >
                                                                    {scope.baseInventory}
                                                                </Typography>
                                                            ) : null
                                                        ) : null}
                                                    </Grid>
                                                ))}
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                        </StyledCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default React.memo(ScopeDefinition);
