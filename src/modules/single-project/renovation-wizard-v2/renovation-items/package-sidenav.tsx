import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import checkIcon from "assets/icons/check_circle.svg";
import { useAppSelector } from "stores/hooks";
import { cloneDeep, groupBy } from "lodash";
import warningIcon from "assets/icons/warning-amber.svg";
import { EXCLUDED_RENO_ITEMS_CATEGORIES } from "../constants";

const PackageSideNav = ({ scrollToSection }: any) => {
    const { renovationItems } = useAppSelector((state) => ({
        renovationItems: state.singleProject.renovationWizardV2.renovationItems.data,
    }));

    const groupedRenovationItems = useMemo(() => {
        let filteredRenovationItems = cloneDeep(renovationItems);
        filteredRenovationItems = filteredRenovationItems.filter(
            (renoItems) => !EXCLUDED_RENO_ITEMS_CATEGORIES.includes(renoItems.category),
        );
        let groupedItems: any = groupBy(filteredRenovationItems, "category");
        Object.keys(groupedItems).map((giKey) => {
            groupedItems[giKey] = groupBy(groupedItems[giKey], "component");
        });
        return groupedItems;
    }, [renovationItems]);

    return (
        <Box>
            <Box pb={4}>
                <Typography variant="text_16_medium">Package</Typography>
            </Box>
            <Box>
                {Object.keys(groupedRenovationItems).map((categoryName) => {
                    let allCategoryItemsStatus: any = [];
                    Object.values(groupedRenovationItems[categoryName]).forEach(
                        (componentRenovationItems: any) => {
                            allCategoryItemsStatus = [
                                ...allCategoryItemsStatus,
                                ...componentRenovationItems.map((cri: any) => {
                                    return cri.is_active;
                                }),
                            ];
                        },
                    );
                    const hasActiveItems = allCategoryItemsStatus.filter(Boolean).length > 0;
                    return (
                        <Box key={categoryName} pb={3}>
                            <Box
                                style={{ cursor: "pointer" }}
                                onClick={() => scrollToSection(`category-${categoryName}`)}
                            >
                                <Typography variant="text_14_medium">{categoryName}</Typography>
                            </Box>
                            {hasActiveItems && (
                                <Box pl={4}>
                                    {Object.keys(groupedRenovationItems[categoryName]).map(
                                        (componentName) => {
                                            let hasIncompleteItems = groupedRenovationItems[
                                                categoryName
                                            ][componentName].some((item: any) => {
                                                if (!item.is_active) return false;
                                                else if (!(!!item.scope && !!item.location)) {
                                                    return true;
                                                }
                                            });

                                            componentName =
                                                componentName === "undefined"
                                                    ? categoryName
                                                    : componentName;
                                            return (
                                                <Box
                                                    key={componentName}
                                                    display="flex"
                                                    alignItems="center"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() =>
                                                        scrollToSection(
                                                            `component-${componentName}`,
                                                        )
                                                    }
                                                >
                                                    {hasIncompleteItems ? (
                                                        <img
                                                            src={warningIcon}
                                                            alt=""
                                                            width={15}
                                                            style={{ paddingRight: 8 }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={checkIcon}
                                                            alt=""
                                                            width={15}
                                                            style={{ paddingRight: 8 }}
                                                        />
                                                    )}
                                                    <Typography variant="text_14_regular">
                                                        {componentName}
                                                    </Typography>
                                                </Box>
                                            );
                                        },
                                    )}
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default PackageSideNav;
