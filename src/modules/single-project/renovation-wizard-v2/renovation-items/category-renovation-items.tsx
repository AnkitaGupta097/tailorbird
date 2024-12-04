import React, { useState } from "react";
import { Box, Collapse, Stack, Typography } from "@mui/material";
import { IRenovation } from "stores/projects/details/budgeting/base-scope";
import BaseButton from "components/base-button";
import ComponentRenovationItems from "./component-renovation-items";
import ConfirmationDialog from "../common/confirmation-dialog";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import ReplayIcon from "@mui/icons-material/Replay";
// import { useParams } from "react-router-dom";

type CategoryRenovationItemsProps = {
    categoryName: string;
    categoryRenovationItems: {
        // [key: string]: any[];
        [key: string]: IRenovation[];
    };
    readOnly?: boolean;
};

const CategoryRenovationItems = ({
    categoryName,
    categoryRenovationItems,
    readOnly,
}: CategoryRenovationItemsProps) => {
    // const { projectId } = useParams();
    const dispatch = useDispatch();
    const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState<boolean>(false);
    const [showRestoreCategoryModal, setShowRestoreCategoryModal] = useState<boolean>(false);
    const [showCategoryItems, setShowCategoryItems] = useState<boolean>(true);

    const toggleDeleteCategoryModal = () => {
        setShowDeleteCategoryModal(!showDeleteCategoryModal);
    };

    let allCategoryItemsStatus: any = [];
    Object.values(categoryRenovationItems).forEach((componentRenovationItems) => {
        allCategoryItemsStatus = [
            ...allCategoryItemsStatus,
            ...componentRenovationItems.map((cri) => {
                return cri.is_active;
            }),
        ];
    });
    const hasActiveItems = allCategoryItemsStatus.filter(Boolean).length > 0;

    const deleteCategory = () => {
        let deleteRenoItemsPayload: any = [];
        Object.values(categoryRenovationItems).forEach((componentRenovationItems) => {
            deleteRenoItemsPayload = [
                ...deleteRenoItemsPayload,
                ...componentRenovationItems.map((cri) => {
                    return {
                        reno_id: cri.id,
                        is_active: false,
                    };
                }),
            ];
        });
        dispatch(actions.singleProject.updateRenovationItemsStart(deleteRenoItemsPayload));
        toggleDeleteCategoryModal();
    };

    const toggleRestoreCategoryModal = () => {
        setShowRestoreCategoryModal(!showRestoreCategoryModal);
    };

    const restoreCategory = () => {
        let restoreRenoItemsPayload: any = [];
        Object.values(categoryRenovationItems).forEach((componentRenovationItems) => {
            restoreRenoItemsPayload = [
                ...restoreRenoItemsPayload,
                ...componentRenovationItems.map((cri) => {
                    return {
                        reno_id: cri.id,
                        is_active: true,
                    };
                }),
            ];
        });
        dispatch(actions.singleProject.updateRenovationItemsStart(restoreRenoItemsPayload));
        toggleRestoreCategoryModal();
    };

    const toggleShowCategoryItems = () => {
        setShowCategoryItems(!showCategoryItems);
    };

    return (
        <Stack style={{ marginBottom: 10, borderRadius: 5 }} id={`category-${categoryName}`}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                style={
                    hasActiveItems
                        ? { background: "#004D71" }
                        : {
                              background: "#A6A6A6",
                          }
                }
                paddingLeft={2}
                paddingY={1}
                color="white"
            >
                <Box display="flex" alignItems="center" onClick={toggleShowCategoryItems}>
                    <Typography>{categoryName}</Typography>
                    {hasActiveItems &&
                        (showCategoryItems ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                </Box>

                {!readOnly &&
                    (hasActiveItems ? (
                        <BaseButton
                            variant="text"
                            label="Delete Category"
                            onClick={toggleDeleteCategoryModal}
                            style={{ color: "white" }}
                            endIcon={<DeleteOutlineIcon />}
                        />
                    ) : (
                        <BaseButton
                            variant="text"
                            label="Restore Category"
                            onClick={toggleRestoreCategoryModal}
                            style={{ color: "white" }}
                            endIcon={<ReplayIcon />}
                        />
                    ))}
            </Box>
            {hasActiveItems && (
                <Collapse in={showCategoryItems}>
                    <Box>
                        {Object.keys(categoryRenovationItems).map((criKey) => (
                            <ComponentRenovationItems
                                key={criKey}
                                componentName={criKey === "undefined" ? categoryName : criKey}
                                componentRenovationItems={categoryRenovationItems[criKey]}
                                readOnly={readOnly}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}

            {showDeleteCategoryModal && (
                <ConfirmationDialog
                    title="Delete Category"
                    content="Are you sure that you would like to delete this category?"
                    open={showDeleteCategoryModal}
                    onCancel={toggleDeleteCategoryModal}
                    onDone={deleteCategory}
                />
            )}

            {showRestoreCategoryModal && (
                <ConfirmationDialog
                    title="Restore Category"
                    content="Would you like to restore this category? It would be restored to its former state."
                    open={showRestoreCategoryModal}
                    onCancel={toggleRestoreCategoryModal}
                    onDone={restoreCategory}
                />
            )}
        </Stack>
    );
};

export default CategoryRenovationItems;
