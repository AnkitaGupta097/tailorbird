/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Typography,
    Card,
    Box,
    Divider,
    Chip,
    Collapse,
    Autocomplete,
    TextField,
    styled,
    lighten,
    darken,
} from "@mui/material";
import appTheme from "styles/theme";
import { ReactComponent as SaveIcon } from "../../../assets/icons/save.svg";
import { ReactComponent as CrossIcon } from "../../../assets/icons/cross-icon.svg";
import { map, cloneDeep, uniq, isEmpty, omit, sortBy } from "lodash";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

interface Prop {
    pl: string;
    defaultFilter: filter;
}
type filter = {
    values: (string | undefined)[];
    name: string;
};
const ProjectFilter = ({ pl, defaultFilter }: Prop) => {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const { filters } = useAppSelector((state) => ({
        filters: state.projectsDemand.filters,
    }));
    const [collapsedFilters, setCollapsedFilters] = useState<string[]>([]);
    const [allFilters, setAllFilters] = useState<any[]>([]);

    useEffect(() => {
        let allFilters: any = [];
        map(filters, (filterValue, key) => {
            allFilters.push(
                ...filterValue.map((x: any) => ({ ...x, key, keyText: key.replace("_", " ") })),
            );
        });
        setAllFilters(allFilters);
    }, []);

    const [localSearch, setLocalSearch] = useState<any>(
        JSON.parse(localStorage.getItem("project_filter") || "{}"),
    );

    const collapseFilter = (key: string) => {
        if (!collapsedFilters.includes(key)) setCollapsedFilters([...collapsedFilters, key]);
        else setCollapsedFilters(collapsedFilters.filter((x) => x !== key));
    };

    useEffect(() => {
        let filters: any[] = cloneDeep(localSearch);
        filters = map(filters, (filterValue, key) => {
            return {
                values: filterValue,
                name: key,
            };
        });
        if (defaultFilter) filters.push(defaultFilter);
        dispatch(
            actions.projectDemand.fetchAllProjectsStart({
                filters: filters,
            }),
        );
    }, [localSearch]);

    const applyFilter = (filterKey: any, value: any) => {
        let filterArray = cloneDeep(localSearch[filterKey]);
        if (filterArray) {
            filterArray = [...filterArray, value];
        } else {
            filterArray = [value];
        }
        setLocalSearch({ ...localSearch, [filterKey]: uniq(filterArray) });
    };

    const onDeletefilter = (filterKey: any, value: any) => {
        let filterArray = cloneDeep(localSearch[filterKey]);
        let filters = cloneDeep(localSearch);
        filterArray = filterArray.filter((item: any) => item !== value);
        if (isEmpty(filterArray)) {
            filters = omit(filters, filterKey);
        } else {
            filters = { ...localSearch, [filterKey]: uniq(filterArray) };
        }
        setLocalSearch(filters);
    };

    const saveSearch = () => {
        localStorage.setItem("project_filter", JSON.stringify(localSearch));
        //MIXPANEL : Event tracking for add new project filter requests
        mixpanel.track(`PROJECT DETAIL : New Project Filter Saved `, {
            eventId: "new_project_filter_saved",
            ...getUserDetails(),
            ...getUserOrgDetails(),
            saved_filter: JSON.stringify(localSearch),
        });
        enqueueSnackbar("", {
            variant: "success",
            action: <BaseSnackbar variant="success" title="Your search is saved Successfully." />,
        });
    };

    const removeAllSearch = () => {
        localStorage.removeItem("project_filter");
        setLocalSearch({});
    };

    const GroupHeader = styled("div")(({ theme }) => ({
        position: "sticky",
        top: "-8px",
        padding: "4px 10px",
        color: theme.palette.primary.main,
        backgroundColor:
            theme.palette.mode === "light"
                ? lighten(theme.palette.primary.light, 0.85)
                : darken(theme.palette.primary.main, 0.8),
    }));

    const GroupItems = styled("ul")({
        padding: 0,
    });

    return (
        <Box pl={pl} width={0.2} mt={2.5}>
            <Card
                sx={{
                    width: "100%",
                    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.10)",
                }}
            >
                <Box p={5}>
                    <Autocomplete
                        id="grouped-demo"
                        options={allFilters}
                        groupBy={(option) => option.keyText}
                        getOptionLabel={(option) => `${option.value} (${option.count || 0})`}
                        size="small"
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Enter your search" />
                        )}
                        renderGroup={(params) => (
                            <li key={params.key}>
                                <GroupHeader>{params.group}</GroupHeader>
                                <GroupItems>{params.children}</GroupItems>
                            </li>
                        )}
                        onChange={(e, value) => {
                            if (value) {
                                applyFilter(value.key, value.value);
                            }
                        }}
                    />
                </Box>
                <Box p={5}>
                    {!isEmpty(localSearch) && (
                        <>
                            <Box display="flex" alignItems="center" mb={1} pb={1}>
                                <SaveIcon />
                                <Typography
                                    variant="text_10_regular"
                                    color={appTheme.scopeHeader.label}
                                    style={{ cursor: "pointer" }}
                                    onClick={saveSearch}
                                >
                                    &nbsp; Save my search
                                </Typography>
                            </Box>
                            {map(localSearch, (filterValue, key) => {
                                return map(filterValue, (value) => {
                                    return (
                                        <Chip
                                            label={
                                                <Typography
                                                    variant="text_10_regular"
                                                    color={appTheme.scopeHeader.label}
                                                >
                                                    {value}
                                                </Typography>
                                            }
                                            sx={{ margin: "2px" }}
                                            onDelete={() => onDeletefilter(key, value)}
                                        />
                                    );
                                });
                            })}
                            <Box display="flex" alignItems="center" mb={4} pt={1}>
                                <CrossIcon />
                                <Typography
                                    variant="text_10_regular"
                                    color={appTheme.scopeHeader.label}
                                    style={{ cursor: "pointer" }}
                                    onClick={removeAllSearch}
                                >
                                    &nbsp;Clear All Filters
                                </Typography>
                            </Box>
                            <Divider />
                        </>
                    )}
                    {filters &&
                        map(filters, (filterValue, key) => {
                            return (
                                <>
                                    <Box my={4} key={key}>
                                        <Box
                                            display="flex"
                                            flexWrap="nowrap"
                                            alignItems="center"
                                            sx={{ cursor: "pointer" }}
                                            onClick={() => collapseFilter(key)}
                                        >
                                            <Typography
                                                variant="text_14_semibold"
                                                color={appTheme.scopeHeader.label}
                                                textTransform={
                                                    key === "msa" ? "uppercase" : "capitalize"
                                                }
                                            >
                                                {key.replace("_", " ")}
                                            </Typography>

                                            {collapsedFilters.includes(key) ? (
                                                <ArrowDropDownIcon color="primary" />
                                            ) : (
                                                <ArrowDropUpIcon color="primary" />
                                            )}
                                        </Box>
                                        <Collapse in={!collapsedFilters.includes(key)}>
                                            <Box pl={4}>
                                                {map(
                                                    sortBy(filterValue, (x) => {
                                                        if (key === "project_type") return -x.count;
                                                        return x.value.trim().toLowerCase();
                                                    }),
                                                    (name: any) => {
                                                        return (
                                                            <Box
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    marginBottom: "5px",
                                                                }}
                                                                onClick={() =>
                                                                    applyFilter(key, name.value)
                                                                }
                                                            >
                                                                <Typography
                                                                    variant={
                                                                        localSearch[key]?.includes(
                                                                            name.value,
                                                                        )
                                                                            ? "text_12_bold"
                                                                            : "text_12_regular"
                                                                    }
                                                                    lineHeight="10px"
                                                                    paddingBottom="4px"
                                                                    textTransform={
                                                                        name.value.length > 2
                                                                            ? "capitalize"
                                                                            : "uppercase"
                                                                    }
                                                                >{`${name.value
                                                                    .toLowerCase()
                                                                    .replace("_", " ")} (${
                                                                    name.count || 0
                                                                })`}</Typography>
                                                            </Box>
                                                        );
                                                    },
                                                )}
                                            </Box>
                                        </Collapse>
                                    </Box>
                                    {!["state", "city"].includes(key) && <Divider />}
                                </>
                            );
                        })}
                </Box>
            </Card>
        </Box>
    );
};
ProjectFilter.defaultProps = {
    pl: "3rem",
    defaultFilter: null,
};

export default ProjectFilter;
