/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Box, Button, Typography, Grid, styled, Autocomplete, TextField } from "@mui/material";
import { ReactComponent as FlipToFront } from "assets/icons/flip-to-front.svg";
import RenoHeader from "../common/reno-header";
import appTheme from "styles/theme";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useParams } from "react-router-dom";
import actions from "../../../stores/actions";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import { STEPS_NAME } from "../contants";
import ConfirmationModal from "components/confirmation-modal";
import moment from "moment";
import { filter, isEmpty, map } from "lodash";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import BaseTextField from "components/text-field";
import { graphQLClient } from "utils/gql-client";
import { CLONE_INVENTORY } from "stores/single-project/queries";
import { UPDATE_INVENTORY_DETAILS } from "modules/projects/details/budgeting/bidbook-v2/actions/mutation-contsants";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const SInput = styled(BaseTextField)(() => ({
    "& .MuiInputBase-root": {
        height: "30px",
    },
}));

const sxValue = {
    ".MuiOutlinedInput-root": {
        padding: "0px",
        ".MuiAutocomplete-input": {
            padding: "0px",
            paddingBottom: "5px",
            "::placeholder": {
                color: appTheme.text.info,
                opacity: 1,
                fontWeight: "500",
            },
        },
        fieldset: {
            borderTop: "none",
            borderRight: "none",
            borderLeft: "none",
            borderRadius: "0px",
        },
    },
};

const RenoSummary = () => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const userId = localStorage.getItem("user_id") || "";

    const { inventoryList, packageList } = useAppSelector((state) => ({
        inventoryList: state.singleProject.renovationWizard.inventoryList.data,
        packageList: state.singleProject.renovationWizard.packageList.data,
    }));

    const [isModal, setIsModal] = useState<any>({ delete: false, copy: false });
    const [selectedInventory, setSelectedInventory] = useState<any>({});
    const [copiedInventory, setCopiedInventory] = useState<any>({});

    const updateInventoryCall = async (payload: any) => {
        try {
            const res = await graphQLClient.mutate(
                "updateInventoryDetails",
                UPDATE_INVENTORY_DETAILS,
                {
                    payload: {
                        updated_by: userId,
                        ...payload,
                    },
                },
            );
            return res;
        } catch (error) {
            console.log(error);
        }
    };

    const deleteInventory = async () => {
        const res = await updateInventoryCall({ id: selectedInventory.id, is_delete: true });
        if (res?.id) {
            dispatch(actions.singleProject.deleteInventory(res.id));
        }
        setSelectedInventory({});
        setIsModal(false);
    };

    const updateInventory = async (e: any, key: string, index: any, inventory: any) => {
        if (e.key === "Enter") {
            dispatch(
                actions.singleProject.updateInventoryDetail({
                    key,
                    index,
                }),
            );
            const res = await updateInventoryCall({ id: inventory.id, [key]: inventory[key] });
            if (!res?.[key]) {
                dispatch(actions.singleProject.fetchInventoryListStart(projectId));
            }
        }
    };

    const getScopeByCloning = async () => {
        setSelectedInventory({});
        setCopiedInventory({});
        setIsModal({ ...isModal, copy: false });
        try {
            const res = await graphQLClient.mutate("cloneInventory", CLONE_INVENTORY, {
                payload: {
                    copy_to_inventory_id: copiedInventory.id,
                    copy_from_inventory_id: selectedInventory.id,
                },
            });
            return res;
        } catch (error) {
            console.log(error);
        }
    };

    const getScopeData = (inventory: any) => {
        const { scope_status, package_id } = inventory;
        switch (scope_status) {
            case "not_started":
                return (
                    <Box flexGrow={1} sx={{ cursor: "pointer" }}>
                        <Typography
                            variant="text_16_medium"
                            color={appTheme.text.info}
                            onClick={() => {
                                dispatch(
                                    actions.singleProject.changeStep(
                                        isEmpty(package_id) ? STEPS_NAME.PACKAGE : STEPS_NAME.ROOMS,
                                    ),
                                );

                                dispatch(actions.singleProject.updateCurrentInventory(inventory));
                            }}
                        >
                            Create New Scope
                        </Typography>
                        <Autocomplete
                            sx={sxValue}
                            options={filter(
                                inventoryList,
                                (i: any) =>
                                    i.scope_status == "in_progress" ||
                                    i.scope_status == "completed",
                            )}
                            fullWidth
                            getOptionLabel={(option: any) => option.name}
                            selectOnFocus
                            onChange={(event, newValue: any) => {
                                setCopiedInventory(newValue);
                                setSelectedInventory(inventory);
                                setIsModal({ ...isModal, copy: true });
                            }}
                            popupIcon={<ArrowDropDownOutlinedIcon color="primary" />}
                            forcePopupIcon
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Copy from Another Program"
                                />
                            )}
                        />
                    </Box>
                );
            case "in_progress":
                return (
                    <Box sx={{ cursor: "pointer" }}>
                        <Typography
                            variant="text_16_medium"
                            color={appTheme.text.info}
                            onClick={() => {
                                dispatch(
                                    actions.singleProject.changeStep(STEPS_NAME.CATEGORY_QUESTIONS),
                                );
                                dispatch(
                                    actions.singleProject.updateCurrentInventory({ ...inventory }),
                                );
                            }}
                        >
                            Continue Scope Creation
                        </Typography>
                        <br />
                        <Typography
                            variant="text_16_medium"
                            color={appTheme.text.info}
                            onClick={() => {
                                dispatch(
                                    actions.singleProject.changeStep(STEPS_NAME.SCOPE_SUMMARY),
                                );
                                dispatch(
                                    actions.singleProject.updateCurrentInventory({
                                        ...inventory,
                                    }),
                                );
                                dispatch(
                                    actions.singleProject.fetchRenoItemsStart({
                                        inventoryId: inventory.id,
                                        projectId,
                                    }),
                                );
                            }}
                        >
                            See Scope Summary
                        </Typography>
                    </Box>
                );
            case "completed":
                return (
                    <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                            dispatch(actions.singleProject.changeStep(STEPS_NAME.SCOPE_SUMMARY));
                            dispatch(
                                actions.singleProject.updateCurrentInventory({
                                    ...inventory,
                                }),
                            );
                            dispatch(
                                actions.singleProject.fetchRenoItemsStart({
                                    inventoryId: inventory.id,
                                    projectId,
                                }),
                            );
                        }}
                    >
                        <Typography variant="text_16_medium" color={appTheme.text.info}>
                            See Scope Summary
                        </Typography>
                    </Box>
                );
        }
    };

    const packageListMap: any = new Map(packageList.map((pkg: any) => [pkg.id, pkg]));
    return (
        <Box>
            <Box display="flex" justifyContent="space-between">
                <RenoHeader title="Project Summary" />
                <Button
                    variant="outlined"
                    component="label"
                    style={{ marginTop: "10px", height: "40px", width: "260px" }}
                    endIcon={<FlipToFront stroke={appTheme.text.info} />}
                    onClick={() => dispatch(actions.singleProject.changeStep(STEPS_NAME.INVENTORY))}
                >
                    <Typography variant="text_16_medium">Create New Program</Typography>
                </Button>
            </Box>
            <Box mt={10} mx={5}>
                <Grid container>
                    <Grid item md={2}>
                        <Typography variant="text_16_medium">Program Title</Typography>
                    </Grid>
                    <Grid item md={4}>
                        <Typography variant="text_16_medium">Program Description</Typography>
                    </Grid>
                    <Grid item md={3}>
                        <Typography variant="text_16_medium">Package</Typography>
                    </Grid>
                    <Grid item md={3}>
                        <Typography variant="text_16_medium">Scope Selection</Typography>
                    </Grid>
                </Grid>
            </Box>
            {map(inventoryList, (inventory, index) => {
                const { name, description, package_id, isEdit, scope_status } = inventory;
                const pkg = package_id ? packageListMap?.get(package_id) : {};
                return (
                    <Box mt={2} p={5} border={`1px solid ${appTheme.border.textarea}`}>
                        <Grid container alignItems="center">
                            <Grid item md={2} pr={3} alignItems="center" display="flex">
                                {scope_status == "completed" ? (
                                    <CheckCircleIcon
                                        style={{ fill: appTheme.text.success, marginRight: "5px" }}
                                    />
                                ) : (
                                    <ErrorIcon
                                        style={{ fill: appTheme.buttons.error, marginRight: "5px" }}
                                    />
                                )}
                                {!isEdit.name ? (
                                    <Typography
                                        variant="text_16_medium"
                                        style={{ position: "relative" }}
                                    >
                                        {name}
                                        <EditOutlinedIcon
                                            fontSize="small"
                                            style={{
                                                position: "absolute",
                                                bottom: "-1",
                                                width: "16px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                dispatch(
                                                    actions.singleProject.updateInventoryDetail({
                                                        key: "name",
                                                        index,
                                                    }),
                                                );
                                            }}
                                        />
                                    </Typography>
                                ) : (
                                    <SInput
                                        value={name}
                                        onKeyDown={(e: any) =>
                                            updateInventory(e, "name", index, inventory)
                                        }
                                        onChange={(e: any) =>
                                            dispatch(
                                                actions.singleProject.updateInventoryDetail({
                                                    key: "name",
                                                    index,
                                                    value: e.target.value,
                                                }),
                                            )
                                        }
                                    />
                                )}
                            </Grid>
                            <Grid item md={4} pr={10}>
                                {!isEdit.description ? (
                                    <Typography
                                        variant="text_14_regular"
                                        style={{ position: "relative" }}
                                    >
                                        {description}
                                        <EditOutlinedIcon
                                            fontSize="small"
                                            style={{
                                                position: "absolute",
                                                bottom: "-1",
                                                width: "16px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                dispatch(
                                                    actions.singleProject.updateInventoryDetail({
                                                        key: "description",
                                                        index,
                                                    }),
                                                );
                                            }}
                                        />
                                    </Typography>
                                ) : (
                                    <SInput
                                        value={description}
                                        onKeyDown={(e: any) =>
                                            updateInventory(e, "description", index, inventory)
                                        }
                                        onChange={(e: any) => {
                                            dispatch(
                                                actions.singleProject.updateInventoryDetail({
                                                    key: "description",
                                                    index,
                                                    value: e.target.value,
                                                }),
                                            );
                                        }}
                                    />
                                )}
                            </Grid>
                            <Grid item md={3} pr={2}>
                                <Box display="flex" alignItems="flex-start">
                                    {isEmpty(pkg) ? (
                                        <CloseOutlinedIcon
                                            color="primary"
                                            style={{ paddingRight: "5px", marginLeft: "-30px" }}
                                        />
                                    ) : (
                                        <HomeWorkOutlinedIcon
                                            color="primary"
                                            style={{ paddingRight: "5px", marginLeft: "-30px" }}
                                        />
                                    )}
                                    <Typography variant="text_16_medium">
                                        {isEmpty(pkg)
                                            ? "Package not selected"
                                            : pkg?.curated == "ORGANIZATION"
                                            ? "Organization-Curated Package"
                                            : "Project-Curated Package"}
                                    </Typography>
                                </Box>
                                {!isEmpty(pkg) && (
                                    <>
                                        <Typography
                                            variant="text_12_regular"
                                            color={appTheme.border.medium}
                                        >
                                            name : {pkg?.name}
                                        </Typography>
                                        <Box lineHeight={0.4}>
                                            <Typography
                                                variant="text_12_regular"
                                                color={appTheme.border.medium}
                                            >
                                                Updated by {pkg?.created_by}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                variant="text_12_regular"
                                                color={appTheme.border.medium}
                                            >
                                                Uploaded on {moment(pkg?.created_at).format("L")}
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Grid>
                            <Grid item md={3}>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent={scope_status ? "space-between" : "flex-end"}
                                >
                                    {getScopeData(inventory)}
                                    <DeleteOutlineOutlinedIcon
                                        sx={{ cursor: "pointer", paddingLeft: "8px" }}
                                        color="primary"
                                        onClick={() => {
                                            setSelectedInventory(inventory);
                                            setIsModal({ ...isModal, delete: true });
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                );
            })}

            {isModal.delete && (
                <ConfirmationModal
                    text="Are you sure you want to delete this Program? All of your scopes would be also deleted. This action is not reversible and you would not be able to retrieve your work."
                    onCancel={() => {
                        setSelectedInventory({});
                        setIsModal({ ...isModal, delete: false });
                    }}
                    onProceed={deleteInventory}
                    open={isModal.delete}
                    variant="deletion"
                    actionText="Yes, Delete Program Forever"
                    cancelText="Cancel"
                    stackWidth="500px"
                />
            )}

            {isModal.copy && (
                <ConfirmationModal
                    text="Copying from another Program allows you to take the same Scope Selections, but you will need to choose Specs and SKUs from your own package."
                    onCancel={() => {
                        setSelectedInventory({});
                        setCopiedInventory({});
                        setIsModal({ ...isModal, copy: false });
                    }}
                    title={`Copy from ${selectedInventory.name}`}
                    onProceed={getScopeByCloning}
                    open={isModal.copy}
                    variant="CREATION"
                    actionText={`Copy to ${copiedInventory.name}`}
                    cancelText="Cancel"
                    stackWidth="500px"
                    icon={<></>}
                />
            )}
        </Box>
    );
};

export default RenoSummary;
