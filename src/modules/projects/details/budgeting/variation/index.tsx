/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
    Grid,
    styled,
    Typography,
    Dialog,
    DialogTitle,
    CircularProgress as Loader,
} from "@mui/material";
import { useParams } from "react-router-dom";
import VariationTable from "./variation-table";
import VariationContent from "./variation-content";
import actions from "../../../../../stores/actions";
import BaseButton from "../../../../../components/base-button";
import BaseIconButton from "../../../../../components/base-icon-button";
import { useAppDispatch, useAppSelector } from "../../../../../stores/hooks";
import CloseIcon from "../../../../../assets/icons/icon-close.svg";
import TakeoffIcon from "../../../../../assets/icons/icon-takeoff.svg";
import BaseSelectionCard from "../../../../../components/base-selection-card";
import EllipseIcon from "../../../../../assets/icons/icon-ellipses.svg";
import { GridProps } from "@mui/system";
import {
    VARIATION_HEADER,
    VARIATION_TABLE_HEADER,
} from "modules/projects/details/budgeting/constants";
import { FETCH_USER_DETAILS } from "modules/projects/constant";

const defaultVariationDetail = {
    item: "",
    category: "",
    count: null,
    floorplans: [],
};

const VariationHeader = styled(Grid)<GridProps>(() => ({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

const Variation = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const [isEdit, setIsEdit] = useState(false);

    const { variations, vDetails, loading, tableLoading } = useAppSelector((state) => ({
        variations: state.budgeting.details.variations.items,
        vDetails: state.budgeting.details.variations.details,
        loading: state.budgeting.details.variations.items.loading,
        tableLoading: isEdit
            ? state.budgeting.details.variations.baseFloorplans.loading ||
              state.budgeting.details.variations.details.loading
            : state.budgeting.details.variations.baseFloorplans.loading,
    }));

    const [open, setOpen] = useState(false);
    const [confirmation, setConfirmation] = useState({ open: false, id: null });
    const [showTable, setShowTable] = useState(false);
    const [variationDetail, setVariationDetail] = useState<any>(defaultVariationDetail);
    const [hasError, setHasError] = React.useState(false);
    const [locNameError, sesLocNameEError] = React.useState(false);
    useEffect(() => {
        if (vDetails.data?.item && open) {
            setVariationDetail({
                ...variationDetail,
                ...vDetails.data,
                count: vDetails.data?.floorplans?.[0]?.locations.length,
            });
            setVariationDetail((state: any) => {
                const stateCopy = JSON.parse(JSON.stringify(state));
                for (let index = 0; index < stateCopy["floorplans"].length; index++) {
                    stateCopy["floorplans"][index]["fpCurrentQty"] = Number(
                        stateCopy["floorplans"][index]["locations"]
                            ?.map((item: any) => item.takeOff)
                            ?.reduce((prev: any, next: any) => Number(prev) + Number(next))
                            ?.toFixed(2),
                    );
                    stateCopy["floorplans"][index]["hasError"] =
                        Number(
                            Math.abs(
                                stateCopy["floorplans"][index]["fpTotalQty"]?.toFixed(2) -
                                    stateCopy["floorplans"][index]["fpCurrentQty"]?.toFixed(2),
                            ),
                        ) !== 0;
                }
                return stateCopy;
            });
        }
        // eslint-disable-next-line
    }, [vDetails]);

    useEffect(() => {
        if (!open) {
            setShowTable(false);
            setIsEdit(false);
            setVariationDetail(defaultVariationDetail);
        }
        // eslint-disable-next-line
    }, [open]);

    useEffect(() => {
        return () => {
            setVariationDetail(defaultVariationDetail);
        };
    }, []);

    useEffect(() => {
        setHasError(variationDetail?.floorplans?.some((v: any) => v.hasError == true));
        if (
            variationDetail?.floorplans &&
            variationDetail?.floorplans?.length > 0 &&
            variationDetail?.floorplans[0].locations &&
            variationDetail?.floorplans[0].locations?.length > 0
        ) {
            for (
                let index = 0;
                index < variationDetail?.floorplans[0]?.locations?.length;
                index++
            ) {
                let element = variationDetail?.floorplans[0].locations[index];
                if (element.name == "") {
                    sesLocNameEError(true);
                    return;
                } else {
                    sesLocNameEError(false);
                }
            }
        }

        // eslint-disable-next-line
    }, [variationDetail]);

    const Header = () => {
        const closeModal = () => {
            setOpen(!open);
        };
        return showTable ? (
            <VariationHeader className="Variation-header" sx={{ padding: "0 0.2rem" }}>
                <Typography
                    variant="heading"
                    className="Variation-header-title"
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                    <img
                        src={TakeoffIcon}
                        alt="takeoff icon"
                        className="Variation-header-title-icon"
                    />
                    {VARIATION_TABLE_HEADER} {variationDetail?.item}
                </Typography>
                <BaseIconButton
                    icon={CloseIcon}
                    classes="Variation-header-close-icon"
                    onClick={closeModal}
                    sx={{ marginRight: 0 }}
                />
            </VariationHeader>
        ) : (
            <VariationHeader className="Variation-header">
                <Typography variant="heading" className="Variation-header">
                    {VARIATION_HEADER}
                </Typography>
                <BaseIconButton
                    icon={CloseIcon}
                    classes="Variation-header-close-icon"
                    onClick={closeModal}
                    sx={{ marginRight: 0 }}
                />
            </VariationHeader>
        );
    };
    const addItem = () => {
        dispatch(
            actions.budgeting.fetchFloorplansStart({
                projectCodexId: variationDetail?.projectCodexId,
            }),
        );
        setShowTable(true);
    };

    const editVariation = (id: string) => {
        dispatch(actions.budgeting.fetchVariationDetailsStart({ id }));
        setVariationDetail({
            ...variationDetail,
            id,
            count: variations.data.find((v) => v.id === id)?.variationCount,
        });

        dispatch(
            actions.budgeting.fetchFloorplansStart({
                projectCodexId: variationDetail?.projectCodexId,
            }),
        );

        setIsEdit(true);
        setShowTable(true);
        setOpen(true);
    };

    const createVariation = () => {
        setOpen(false);

        dispatch(
            actions.budgeting.createVariationDetailsStart({
                createVariationInput: {
                    ...variationDetail,
                    projectId: params.projectId,
                    createdBy: FETCH_USER_DETAILS().id || "user",
                },
            }),
        );
    };

    const deleteVariation = () => {
        dispatch(
            actions.budgeting.deleteVariationsStart({
                id: confirmation.id,
                projectId: params.projectId,
            }),
        );
        setConfirmation({ open: false, id: null });
    };

    const updateVariation = () => {
        setOpen(false);

        dispatch(
            actions.budgeting.updateVariationDetailsStart({
                updateVariationInput: {
                    id: variationDetail.id,
                    floorplans: variationDetail.floorplans,
                    updatedBy: FETCH_USER_DETAILS().id || "user",
                },
                projectId: params.projectId,
            }),
        );
    };

    const Actions = () => (
        <Grid sx={{ width: "100%" }}>
            {showTable ? (
                <BaseButton
                    label={isEdit ? "Update" : "Save"}
                    onClick={isEdit ? updateVariation : createVariation}
                    classes={`Variation-actions ${
                        hasError || locNameError ? "disabled" : "active"
                    }`}
                    sx={{ marginLeft: "1.2rem" }}
                    disabled={hasError || locNameError}
                />
            ) : (
                <BaseButton
                    label="Add"
                    onClick={addItem}
                    classes="Variation-actions active"
                    sx={{ marginLeft: "1rem" }}
                />
            )}
        </Grid>
    );

    const ConfirmationDialog = () => {
        return (
            <Dialog
                open={confirmation.open}
                onClose={() => setConfirmation({ open: false, id: null })}
            >
                <DialogTitle
                    sx={{
                        padding: "1rem",
                        paddingBottom: "0",
                        marginLeft: "2.5rem",
                        marginBottom: "1rem",
                    }}
                >
                    <Typography variant="dialogHeader">Delete Variation</Typography>
                </DialogTitle>
                <Grid container sx={{ padding: "1.5rem", paddingTop: "0" }}>
                    <Grid item md={12} sx={{ marginBottom: "2rem", marginLeft: "2rem" }}>
                        <Typography variant="dialogContent">
                            Are you sure you want to delete this variation.
                        </Typography>
                    </Grid>
                    <Grid container>
                        <Grid item md={6}>
                            <BaseButton
                                label="Cancel"
                                type="active"
                                onClick={() => setConfirmation({ open: false, id: null })}
                                sx={{ marginLeft: "2rem" }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <BaseButton
                                label="Delete"
                                type="danger"
                                onClick={deleteVariation}
                                sx={{ marginLeft: "12rem" }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
        );
    };

    const minWidth = 44;
    const minHeight = showTable || isEdit ? "17.588rem" : "11.375rem";
    console.log("loading", loading, showTable, isEdit);

    return (
        <div className="Variation-container">
            <BaseSelectionCard
                label={`Variation ${variations.data?.length ? `(${variations.data.length})` : ""}`}
                content={
                    loading ? (
                        <Grid>
                            <Loader />
                        </Grid>
                    ) : showTable || isEdit ? (
                        <VariationTable
                            variationDetail={variationDetail}
                            setVariationDetail={setVariationDetail}
                            loading={tableLoading}
                        />
                    ) : (
                        <VariationContent setItem={setVariationDetail} item={variationDetail} />
                    )
                }
                actions={<Actions />}
                header={<Header />}
                selections={variations.data?.length ? variations.data : []}
                menuActions={{
                    Edit: { action: editVariation },
                    Remove: { action: (id: any) => setConfirmation({ open: true, id }) },
                }}
                open={open}
                setOpen={setOpen}
                parentClassName={"Budgeting"}
                icon={{ show: true, menuIcon: EllipseIcon }}
                isLoading={loading}
                dialogSx={{
                    ".MuiPaper-root": { minWidth: `${minWidth}rem`, minHeight, maxwidth: "100%" },
                }}
            />
            <ConfirmationDialog />
        </div>
    );
};

export default React.memo(Variation);
