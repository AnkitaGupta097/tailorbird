/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
    Grid,
    Dialog,
    DialogActions,
    Typography,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme,
    Divider,
} from "@mui/material";

import BaseButton from "components/button";
import BaseCheckbox from "components/checkbox";
import BaseAutoComplete from "components/auto-complete";
import ConfirmationModal from "components/confirmation-modal";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
interface IAddScope {
    open: boolean;
    setOpen: any;
    categoriesList: any;
    labourRollUpOptions: any;
    scopeRollupOptions: any;
    setRollupConfigDetails: any;
    rollupConfigDetails?: any;
    saveRollUpConfig?: any;
    isFromInventory?: any;
}

const ConfigurationRollUp = ({
    open,
    setOpen,
    categoriesList,
    labourRollUpOptions,
    scopeRollupOptions,
    setRollupConfigDetails,
    rollupConfigDetails,
    saveRollUpConfig,
    isFromInventory,
}: IAddScope) => {
    const theme = useTheme();
    const LabourRollupRules: any = {
        "Demo Existing": "Install New",
        "Remove and Store": "Reinstall Existing",
        "Install New": "Demo Existing",
        "Reinstall Existing": "Remove and Store",
    };
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [checkedScopeRollups, setCheckedScopeRollups] = React.useState<string[]>([]);
    const [checkedLabourRollups, setCheckedLabourRollups] = React.useState<string[]>([]);

    const [openDailog, setOpenDailog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const handleClose = () => {
        setOpenDailog(false);
    };

    const handleConfirm = () => {
        saveRollUpConfig();
        setOpenDailog(false);
    };
    const handleChangeScopeRollups = (e: any) => {
        const { checked, name } = e.target;
        const selectedScopeRollupNames = name
            .split("&")
            .map((item: any) => item.trim())
            .flat();
        // Find the labour merge that matches the selected scope option names
        const selectedDepLabourMerge: any = checkedLabourRollups.find((LM: any) =>
            selectedScopeRollupNames.includes(LM),
        );
        const dependantMergeItem = LabourRollupRules[selectedDepLabourMerge];
        if (!checked) {
            setCheckedScopeRollups((prevCheckedIds: any) =>
                prevCheckedIds.filter((c: any) => c !== name),
            );
        } else {
            setCheckedScopeRollups((state) => {
                let result: string[] = [];
                result = [...state, name];
                return result || [];
            });
            if (dependantMergeItem) {
                setCheckedLabourRollups((prevCheckedIds) => [
                    ...prevCheckedIds,
                    dependantMergeItem,
                ]);
            }
        }
    };

    const handleChangeLabourRollups = (e: any) => {
        const { checked, name } = e.target;
        const dependantRollupItem = LabourRollupRules[name];

        // Extract the names of selected scope rollups
        const selectedScopeRollupNames = checkedScopeRollups
            .map((scopeElement: any) => scopeElement?.split("&").map((item: any) => item.trim()))
            .flat();

        if (!checked) {
            // Handle case when the checkbox is unchecked
            if (selectedScopeRollupNames.includes(name)) {
                // If the unchecked item is included in selectedScopeRollupNames, filter it and its dependantRollupItem
                setCheckedLabourRollups((prevCheckedIds) =>
                    prevCheckedIds.filter((c: any) => c !== name && c !== dependantRollupItem),
                );
            } else {
                // Otherwise, only filter the unchecked item
                setCheckedLabourRollups((prevCheckedIds: any) =>
                    prevCheckedIds.filter((c: any) => c !== name),
                );
            }
        } else {
            // Handle case when the checkbox is checked
            if (selectedScopeRollupNames.includes(name)) {
                // If the checked item is included in selectedScopeRollupNames, add it and its dependantRollupItem
                setCheckedLabourRollups((state: any) => [...state, name, dependantRollupItem]);
            } else {
                // Otherwise, only add the checked item
                setCheckedLabourRollups((state: any) => [...state, name]);
            }
        }
    };

    React.useEffect(() => {
        return () => {
            setCheckedScopeRollups([]);
            setCheckedLabourRollups([]);
        };
    }, []);
    React.useEffect(() => {
        setRollupConfigDetails((config: any) => {
            let rollUpTypesSelected = [];
            checkedScopeRollups?.length > 0 && rollUpTypesSelected.push("scope_merge");
            checkedLabourRollups?.length > 0 && rollUpTypesSelected.push("labour_merge");
            return {
                ...config,
                scope_merge: checkedScopeRollups,
                labour_merge: checkedLabourRollups,
                rollUpTypesSelected: rollUpTypesSelected,
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedScopeRollups, checkedLabourRollups]);
    const handleSave = () => {
        if (
            rollupConfigDetails?.category &&
            rollupConfigDetails?.category?.length > 0 &&
            rollupConfigDetails?.rollUpTypesSelected?.length > 0
        ) {
            setOpenDailog(true);
        } else {
            enqueueSnackbar("", {
                variant: "error",
                action: (
                    <BaseSnackbar
                        variant="error"
                        title="Error"
                        description={
                            rollupConfigDetails?.category?.length == 0 ||
                            rollupConfigDetails?.category == undefined
                                ? "Please select category"
                                : rollupConfigDetails?.rollUpTypesSelected?.length == 0
                                ? "Please select at least one merge option"
                                : ""
                        }
                    />
                ),
            });
        }
    };
    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="responsive-dialog-title"
                fullWidth={true}
                sx={{ display: openDailog ? "none" : "" }}
            >
                <DialogTitle id="responsive-dialog-title">
                    <Typography variant="text_16_semibold">{"Merge Configuration"}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid>
                        <div style={{ marginBottom: "13px", lineHeight: "18.2px" }}>
                            <Typography variant="text_14_regular">{"Category *"}</Typography>
                        </div>
                        <BaseAutoComplete
                            variant={"outlined"}
                            options={categoriesList}
                            placeholder={"Select Category"}
                            onChange={(event: any, newValue: any) => {
                                setRollupConfigDetails((state: any) => {
                                    // console.log("event", event.target, newValue);
                                    // if (newValue == "Select all") {
                                    //     if (state?.category?.length == categoriesList?.length) {
                                    //         return { ...state, category: [] };
                                    //     } else return { ...state, category: [] };
                                    // } else
                                    return { ...state, category: newValue };
                                });
                            }}
                            size="small"
                            multiple
                            disableCloseOnSelect={true}
                            value={rollupConfigDetails?.category || []}
                        />
                        <div
                            style={{
                                marginBottom: "13px",
                                lineHeight: "18.2px",
                                marginTop: "20px",
                            }}
                        >
                            <Typography variant="text_14_medium">{"Scope merges"}</Typography>
                        </div>
                        <Grid
                            sx={{
                                display: "grid",
                                gridGap: "1rem",
                            }}
                        >
                            {scopeRollupOptions.map((option: any) => (
                                <div
                                    key={`${option.name}-${option.id}`}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "max-content",
                                        columnGap: "11px",
                                    }}
                                >
                                    <BaseCheckbox
                                        onChange={(e: any) => handleChangeScopeRollups(e)}
                                        id={option?.id}
                                        value={option?.name}
                                        name={option?.name}
                                        //  checked={checkedScopeRollups?.includes((option as any).name)}
                                    />
                                    <Typography variant="text_14_regular">
                                        {" "}
                                        {option?.name}
                                    </Typography>
                                </div>
                            ))}
                        </Grid>
                        <Divider sx={{ marginTop: "20px" }} />
                        <div
                            style={{
                                marginBottom: "13px",
                                lineHeight: "18.2px",
                                marginTop: "20px",
                            }}
                        >
                            <Typography variant="text_14_medium">{"Labor merges"}</Typography>
                        </div>
                        <Grid
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                gridGap: "1rem",
                            }}
                        >
                            {labourRollUpOptions.map((option: any) => (
                                <div
                                    key={`${option.name}-${option.id}`}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "max-content",
                                        columnGap: "11px",
                                    }}
                                >
                                    <BaseCheckbox
                                        onChange={(e: any) => handleChangeLabourRollups(e)}
                                        id={option?.id}
                                        value={option?.name}
                                        name={option?.name}
                                        checked={checkedLabourRollups?.includes(option?.name)}
                                    />
                                    <Typography variant="text_14_regular">
                                        {" "}
                                        {option?.name}
                                    </Typography>
                                </div>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ marginBottom: "12px" }}>
                    <BaseButton
                        onClick={() => {
                            setOpen(false),
                                setCheckedLabourRollups([]),
                                setCheckedScopeRollups([]),
                                setRollupConfigDetails({});
                        }}
                        label={"Cancel"}
                        classes="grey default spaced"
                        variant={"text_14_regular"}
                        sx={{ width: "146px" }}
                    />
                    <BaseButton
                        onClick={() => handleSave()}
                        label={"Save"}
                        classes="primary default spaced"
                        variant={"text_16_semibold"}
                        sx={{ width: "146px" }}
                    />
                </DialogActions>
            </Dialog>
            <ConfirmationModal
                text={
                    !isFromInventory
                        ? "The changes you have made will be saved on organisation level. "
                        : "The changes you have made will be saved on project level. "
                }
                onCancel={() => handleClose()}
                onProceed={() => handleConfirm()}
                open={openDailog}
                actionText="Confirm"
                cancelText={"Cancel"}
                variant="warning"
            />
        </>
    );
};
export default ConfigurationRollUp;
