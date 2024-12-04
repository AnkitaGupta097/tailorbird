import React, { useState } from "react";
import {
    Box,
    Grid,
    Dialog,
    Typography,
    DialogContent,
    Button,
    DialogTitle,
    CircularProgress as Loader,
    MenuItem,
    Select,
} from "@mui/material";
import BaseTextField from "components/text-field";
// import CommonDialog from "modules/admin-portal/common/dialog";
import AddIcon from "@mui/icons-material/Add";
import { graphQLClient } from "utils/gql-client";
import { CREATE_PROPERTY_UNIT } from "./property-unit.graphql";
import CommonDialog from "modules/admin-portal/common/dialog";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";

const CreateUnit = ({
    projectId,
    floorPlanId,
    rentRollId,
    refetchUnits,
}: {
    projectId: string;
    floorPlanId: string;
    rentRollId: string;
    refetchUnits: () => void;
}) => {
    const dispatch = useAppDispatch();
    const { propertyDetails } = useAppSelector((state) => {
        return {
            floorplans: state.projectFloorplans.floorplans,
            propertyDetails: state.propertyDetails.data,
        };
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState({
        unitNumber: "",
        unitArea: "",
        isOnGroundFloor: "",
        renoScope: "",
    });
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [unitData, setUnitData] = useState({
        unitNumber: "",
        unitArea: "",
        isOnGroundFloor: 0,
        renoScope: "",
    });
    const [errorText, setErrorText] = useState<string>("");
    const [isLoaderModalOpen, setIsLoaderModalOpen] = useState<boolean>(false);
    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };
    const createUnit = async () => {
        setIsLoading(true);
        setIsSuccess(false);
        try {
            let isErrored = false;
            if (!unitData.unitNumber) {
                isErrored = true;
                setError((prev) => ({
                    ...prev,
                    unitNumber: "Unit Number is required!",
                }));
            } else if (!unitData.unitArea) {
                isErrored = true;
                setError((prev) => ({
                    ...prev,
                    unitNumber: "Unit Area is required!",
                }));
            } else if (!unitData.renoScope) {
                isErrored = true;
                setError((prev) => ({
                    ...prev,
                    unitNumber: "Reno Scope is required!",
                }));
            }
            if (isErrored) {
                return;
            } else {
                setIsLoaderModalOpen(true);
                setIsModalOpen(false);

                await graphQLClient.mutate("createPropertyUnit", CREATE_PROPERTY_UNIT, {
                    projectId,
                    unitName: unitData.unitNumber,
                    floorPlanId: floorPlanId,
                    rentRollId: rentRollId,
                    renoScope: unitData.renoScope,
                    area: Number(unitData.unitArea),
                    floor: unitData.isOnGroundFloor === 0 ? "ground" : "upper",
                });
                setUnitData({
                    unitNumber: "",
                    unitArea: "",
                    isOnGroundFloor: 0,
                    renoScope: "",
                });
                refetchUnits();
                dispatch(
                    actions.projectFloorplans.fetchFloorplanDataStart({
                        id: propertyDetails.projects?.find((elm: any) => elm.type === "DEFAULT")
                            ?.id,
                    }),
                );
                setError({
                    unitNumber: "",
                    unitArea: "",
                    isOnGroundFloor: "",
                    renoScope: "",
                });
                setIsSuccess(true);
            }
        } catch (error) {
            // @ts-ignore
            setErrorText(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const toggleLoaderModal = () => {
        setIsLoaderModalOpen((prev) => !prev);
    };
    return (
        <>
            <Button
                onClick={toggleModal}
                sx={{ height: "2rem" }}
                startIcon={<AddIcon />}
                variant="outlined"
            >
                Unit
            </Button>
            <CommonDialog
                open={isLoaderModalOpen}
                onClose={toggleLoaderModal}
                loading={loading}
                //@ts-ignore
                error={errorText}
                loaderText={"Creating new unit!"}
                errorText={"Some error occured while trying to create unit!"}
                saved={isSuccess}
                savedText={"Unit created successfully"}
                width="40rem"
                minHeight="26rem"
                errorName={`Creation error: `}
            />
            <Dialog
                open={isModalOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClose={toggleModal}
                className="create-project-modal"
            >
                <DialogTitle
                    style={{
                        border: "1px solid #DEDEDE",
                        paddingTop: "20px",
                        fontFamily: "IBM Plex Sans",
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: "16px",
                        lineHeight: "21px",
                        color: "#000000",
                    }}
                >
                    Add Unit
                </DialogTitle>

                <DialogContent sx={{ "align-self": "center" }}>
                    {loading ? (
                        <Loader />
                    ) : (
                        <Box mb={1} className="Projects-overview Projects-create-container">
                            <Grid container style={{ padding: "25px" }}>
                                <Grid item md={4} pr={4}>
                                    <Typography variant="text_14_regular">Unit Number</Typography>
                                    <BaseTextField
                                        fullWidth
                                        error={error.unitNumber}
                                        placeholder="Enter Unit Number"
                                        id="filled-error-helper-text"
                                        helperText="Unit Number required*"
                                        value={unitData.unitNumber}
                                        onChange={(e: any) =>
                                            setUnitData((prev) => ({
                                                ...prev,
                                                unitNumber: e.target.value,
                                            }))
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Grid>

                                <Grid item md={4} pr={4}>
                                    <Typography variant="text_14_regular">
                                        Unit Area (Sq ft)
                                    </Typography>
                                    <BaseTextField
                                        error={error.unitArea}
                                        fullWidth
                                        placeholder="Enter Unit Area"
                                        id="filled-error-helper-text"
                                        value={unitData.unitArea}
                                        onChange={(e: any) =>
                                            setUnitData((prev) => ({
                                                ...prev,
                                                unitArea: e.target.value,
                                            }))
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                        helperText={"Unit Area is required"}
                                    />
                                </Grid>
                                <Grid
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "center",
                                        gap: "2px",
                                        marginTop: "-25px",
                                    }}
                                    item
                                    md={4}
                                >
                                    <Typography variant="text_14_regular">
                                        Unit on Ground Floor
                                    </Typography>
                                    <Select
                                        value={unitData.isOnGroundFloor}
                                        /*@ts-ignore*/
                                        onChange={(e: { target: { value: number } }) => {
                                            setUnitData((prev) => ({
                                                ...prev,
                                                isOnGroundFloor: e.target.value,
                                            }));
                                        }}
                                        sx={{
                                            width: "100%",
                                            height: "2.8rem",
                                            borderRadius: "0.25rem",
                                            backgroundColor: "#fff",
                                            color: "#000",
                                            textAlign: "center",
                                        }}
                                        variant="outlined"
                                    >
                                        <MenuItem value={0}>
                                            <Typography variant="tableData">Yes</Typography>
                                        </MenuItem>
                                        <MenuItem value={1}>
                                            <Typography variant="tableData">No</Typography>
                                        </MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item md={4} pr={4}>
                                    <Typography variant="text_14_regular">Reno Scope*</Typography>
                                    <BaseTextField
                                        error={error.renoScope}
                                        fullWidth
                                        placeholder="Reno Scope"
                                        id="filled-error-helper-text"
                                        value={unitData.renoScope}
                                        onChange={(e: any) =>
                                            setUnitData((prev) => ({
                                                ...prev,
                                                renoScope: e.target.value,
                                            }))
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                        helperText={"Reno Scope is required"}
                                    />
                                </Grid>
                                <Grid container style={{ justifyContent: "end" }}>
                                    <Grid item md={4.3} style={{ paddingTop: "30px" }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            style={{
                                                width: "146px",
                                                height: "50px",
                                                left: "0px",
                                                bottom: "0px",
                                                background: "#EEEEEE",
                                                borderRadius: "5px",
                                            }}
                                            onClick={toggleModal}
                                        >
                                            <Typography
                                                style={{
                                                    position: "absolute",
                                                    width: "44px",
                                                    height: "18px",
                                                    left: "57px",
                                                    bottom: "17px",
                                                    fontFamily: "IBM Plex Sans",
                                                    fontStyle: "normal",
                                                    fontWeight: "500",
                                                    fontSize: "14px",
                                                    lineHeight: "18px",
                                                }}
                                            >
                                                {" "}
                                                Cancel
                                            </Typography>
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={createUnit}
                                            style={{
                                                marginLeft: "10px",
                                                height: "50px",
                                                width: "146px",
                                                bottom: "0px",
                                                background: "#004D71",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            <Typography
                                                style={{
                                                    width: "31px",
                                                    height: "18px",
                                                    left: "220px",
                                                    bottom: "18px",
                                                    fontFamily: "'IBM Plex Sans'",
                                                    fontStyle: "normal",
                                                    fontWeight: "500",
                                                    fontSize: "14px",
                                                    lineHeight: "18px",
                                                    textAlign: "center",

                                                    color: "#FFFFFF",
                                                }}
                                            >
                                                Save
                                            </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateUnit;
