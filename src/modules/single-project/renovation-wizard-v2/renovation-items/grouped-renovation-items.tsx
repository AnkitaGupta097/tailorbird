import React, { useEffect, useRef, useState } from "react";
import { Box, InputBase, Typography, styled } from "@mui/material";
import BaseButton from "components/base-button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
import CategoryRenovationItems from "./category-renovation-items";
import warningIcon from "assets/icons/warning-amber.svg";
import { cloneDeep, groupBy } from "lodash";
import { useAppSelector } from "stores/hooks";
import { IRenovation } from "stores/projects/details/budgeting/base-scope";
import { EXCLUDED_RENO_ITEMS_CATEGORIES } from "../constants";
import { useDispatch } from "react-redux";
import actions from "stores/actions";

const SInput = styled(InputBase)(({ theme }) => ({
    "& .MuiInputBase-input": {
        borderRadius: 5,
        backgroundColor: "#fcfcfb",
        border: "1px solid #CCCCCC",
        fontSize: 16,
        // marginTop: 10,
        paddingLeft: "10px",
        marginRight: "5px",
        transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    },
}));

type GroupedRenovationItemsProps = {
    readOnly?: boolean;
};

const GroupedRenovationItems = ({ readOnly = false }: GroupedRenovationItemsProps) => {
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement>();
    const [searchText, setSearchText] = useState<string>();
    const [incompleteRenoItemCount, setIncompleteRenoItemCount] = useState<number>(0);
    const [allowToProceed, setAllowToProceed] = useState<boolean>(false);
    const [showOnlyIncompleteItems, setShowOnlyIncompleteItems] = useState<boolean>(false);
    const { renovationItems } = useAppSelector((state) => ({
        renovationItems: state.singleProject.renovationWizardV2.renovationItems.data,
    }));
    const LEAVE_AS_IS = "Leave as is";

    const [groupedRenovationItems, setGroupedRenovationItems] = useState<any>({});

    const getGroupedRenovationItems = (renovationItems: IRenovation[]) => {
        let groupedItems: any = groupBy(renovationItems, "category");
        Object.keys(groupedItems).map((giKey) => {
            groupedItems[giKey] = groupBy(groupedItems[giKey], "component");
        });
        return groupedItems;
    };

    useEffect(() => {
        let groupedItems = getGroupedRenovationItems(renovationItems);
        setGroupedRenovationItems(groupedItems);
    }, [renovationItems]);

    useEffect(() => {
        // dont include inactive(deleted) and General Conditions + Profit "& Overhead" items
        let incompleteRenoItems = renovationItems.filter((ri) => {
            if (!EXCLUDED_RENO_ITEMS_CATEGORIES.includes(ri.category)) {
                if (!ri.is_active) return false;
                else if (!(!!ri.scope && !!ri.location)) {
                    return true;
                }
            }
            return false;
        });

        setIncompleteRenoItemCount(incompleteRenoItems.length);

        if (incompleteRenoItems.length === 0) setAllowToProceed(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renovationItems]);

    useEffect(() => {
        let filteredRenovationItems = cloneDeep(renovationItems);
        if (showOnlyIncompleteItems) {
            filteredRenovationItems = filteredRenovationItems.filter(
                (ri) => ri.is_active && !(ri.scope && ri.location),
            );
        }
        if (searchText) {
            filteredRenovationItems = filteredRenovationItems.filter((ri) => {
                if (ri.item?.toLowerCase().includes(searchText?.toLowerCase())) {
                    return true;
                }
                // if hidden, scope will be "Leave as is" in the dropdown, we should match with that.
                if (ri.is_hidden) {
                    if (LEAVE_AS_IS.toLowerCase().includes(searchText?.toLowerCase())) return true;
                    return false;
                } else if (ri.scope?.toLowerCase().includes(searchText?.toLowerCase())) {
                    return true;
                }
                return false;
            });
        }
        let groupedItems = getGroupedRenovationItems(filteredRenovationItems);
        setGroupedRenovationItems(groupedItems);
    }, [showOnlyIncompleteItems, searchText, renovationItems]);

    return (
        <Box>
            <Box
                pt={9}
                display="flex"
                justifyContent="space-between"
                alignItems="end"
                paddingBottom={8}
            >
                <Box>
                    <Typography>Search for an item or action.</Typography>
                    <Box display="flex" alignItems="center">
                        <SInput
                            inputRef={inputRef}
                            fullWidth
                            inputProps={{ "aria-label": "search" }}
                            placeholder="Enter text here"
                        />
                        <Box>
                            <BaseButton
                                sx={{ margin: 0 }}
                                label="Search"
                                variant="contained"
                                type="active"
                                onClick={() => setSearchText(inputRef.current?.value)}
                                endIcon={<SearchIcon />}
                            />
                        </Box>
                    </Box>
                </Box>
                {!readOnly && (
                    <Box>
                        {allowToProceed ? (
                            <BaseButton
                                sx={{ margin: 0 }}
                                label="Continue to Next Step"
                                variant="contained"
                                onClick={() =>
                                    dispatch(actions.singleProject.incRenoWizardV2CurrentStep({}))
                                }
                                endIcon={<ArrowForwardIosIcon />}
                            />
                        ) : showOnlyIncompleteItems ? (
                            <BaseButton
                                sx={{ margin: 0 }}
                                label="Return to Full View"
                                variant="outlined"
                                onClick={() => setShowOnlyIncompleteItems(false)}
                            />
                        ) : (
                            <Box
                                display="flex"
                                p={2}
                                style={{
                                    border: "solid 2px #FFAB00",
                                    background: "#FFF5EA",
                                    cursor: "pointer",
                                }}
                                onClick={() => setShowOnlyIncompleteItems(true)}
                            >
                                <Box pr={1}>
                                    <img src={warningIcon} alt="alert" />
                                </Box>
                                <Box>
                                    {incompleteRenoItemCount}{" "}
                                    {incompleteRenoItemCount > 1
                                        ? "items require"
                                        : "item requires"}{" "}
                                    your <br />
                                    attention. <strong> Click to see</strong>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
            {Object.keys(groupedRenovationItems).length === 0 ? (
                <Box p={8} sx={{ border: "solid 2px #ddd", minHeight: 300 }}>
                    <Typography variant="text_18_light">No results found</Typography>
                </Box>
            ) : (
                Object.keys(groupedRenovationItems).map((griKey: string) => {
                    if (EXCLUDED_RENO_ITEMS_CATEGORIES.includes(griKey)) return <></>;
                    return (
                        <Box key={griKey}>
                            <CategoryRenovationItems
                                categoryName={griKey}
                                categoryRenovationItems={groupedRenovationItems[griKey]}
                                readOnly={readOnly}
                            />
                        </Box>
                    );
                })
            )}
        </Box>
    );
};

export default GroupedRenovationItems;
