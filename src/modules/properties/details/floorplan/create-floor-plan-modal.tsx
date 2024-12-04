import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    // InputBase,
    // styled,
    // InputAdornment,
    Dialog,
    Typography,
    DialogContent,
    // TextField,
    Button,
    // InputLabel,
    // FormHelperText,
    // FormControl,
    // DialogActions,
    DialogTitle,
    CircularProgress as Loader,
} from "@mui/material";
import BaseTextField from "components/text-field";
import { useAppSelector, useAppDispatch } from "../../../../stores/hooks";
import { isEmpty, cloneDeep } from "lodash";
import actions from "../../../../stores/actions";
import { FLOOR_PLAN_DATA } from "../../constant";
// import { useNavigate } from "react-router-dom";
import CommonDialog from "modules/admin-portal/common/dialog";
import BaseCheckbox from "components/checkbox";

// import { useFeature } from "@growthbook/growthbook-react";
// import { FeatureFlagConstants } from "utils/constants";

// const SInput = styled(BaseTextField)(({ theme }) => ({
//     "& .MuiInputBase-input": {
//         borderRadius: 5,
//         backgroundColor: "#fcfcfb",
//         border: "1px solid #CCCCCC",
//         fontSize: 16,
//         marginTop: 10,
//         padding: "10px 12px",
//         marginRight: "15px",
//         transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
//     },
// }));
// const STextField = styled(TextField)(({ theme }) => ({
//     "& .MuiInputBase-root": {
//         borderRadius: 5,
//         backgroundColor: "#fcfcfb",
//         fontSize: 16,
//         marginTop: 10,
//         height: "45px",
//         transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
//     },
// }));

interface IFloorplanModal {
    /* eslint-disable-next-line */
    setFloorplanModal: (val: boolean) => void;
    openModal: boolean;
    takeOffType: string;
    floorplan: any;
    clearLoadedFPData?: any;
}

const CreateFloorplan = ({
    takeOffType,
    setFloorplanModal,
    openModal,
    floorplan,
    clearLoadedFPData,
}: IFloorplanModal) => {
    // const navigate = useNavigate();

    const { isFloorPlanCreated, propertyDetails, error, floorplans } = useAppSelector((state) => {
        return {
            isFloorPlanCreated: state.projectFloorplans.floorplan.loading,
            propertyDetails: state.propertyDetails.data,
            error: state.projectFloorplans.floorplan.error,
            floorplans: state.projectFloorplans.floorplans.data,
        };
    });
    const dispatch = useAppDispatch();
    const [floorPlanData, setFloorplanData] = useState(FLOOR_PLAN_DATA);
    const [dataSetInitialy, setDataSetInitialy] = useState(false);
    const [validateField, setValidation] = useState({
        name: false,
        commercial_name: false,
        reno_units: false,
        area: false,
        unit_type: false,
        name_exists: false,
        autodesk_url: false,
    });

    useEffect(() => {
        console.log("useeffevt FP", floorPlanData);
        if (floorplan?.id && (!dataSetInitialy || floorplan?.id !== floorPlanData?.id)) {
            setFloorplanData({
                id: floorplan.id,
                unit_type: floorplan.unit_type,
                commercial_name: floorplan.commercial_name,
                name: floorplan.name,
                type: floorplan.type,
                area: floorplan.area,
                reno_units: floorplan.renoUnits,
                total_units: floorplan.totalUnits,
                autodesk_url: floorplan.autodesk_url,
                isHavingMissingInfo: floorplan.isHavingMissingInfo,
            });
            setDataSetInitialy(true);
        }
        //eslint-disable-next-line
    }, [floorplan]);

    const updateFloorplanData = (key: string, data: any) => {
        let val = data;
        let obj = {};

        if (key === "commercial_name") {
            setValidation({ ...validateField, commercial_name: false });
        }
        if (key === "name") {
            // let data = floorplans.filter((elm: any) => elm.takeOffType === takeOffType);
            // let element = data.find((elm) => elm.name === floorPlanData.name);
            // if (element) {
            //     validateField.name_exists = true;
            //     return false;
            // }

            setValidation({ ...validateField, name_exists: false, name: false });
        }
        if (key === "unit_type") {
            setValidation({ ...validateField, unit_type: false });
        }
        if (key === "reno_units") {
            setValidation({ ...validateField, reno_units: false });
        }
        if (key === "area") {
            setValidation({ ...validateField, area: false });
        }

        setFloorplanData({ ...floorPlanData, [key]: val, ...obj });
    };

    const createNewFloorplan = () => {
        const validation = cloneDeep(validateField);

        let data;

        if (floorPlanData.id) {
            data = floorplans.filter(
                (elm: any) => elm.takeOffType === takeOffType && elm.id !== floorPlanData.id,
            );
        } else {
            data = floorplans.filter((elm: any) => elm.takeOffType === takeOffType);
        }

        let element = data.find((elm) => elm.name === floorPlanData.name);

        if (element) {
            validation.name_exists = true;
        }

        if (takeOffType === "FLOORPLAN") {
            if (
                isEmpty(floorPlanData.commercial_name) ||
                isEmpty(floorPlanData.name) ||
                isEmpty(floorPlanData.unit_type) ||
                !floorPlanData.area ||
                validation.name_exists
            ) {
                if (isEmpty(floorPlanData.commercial_name)) {
                    validation.commercial_name = true;
                }
                if (isEmpty(floorPlanData.name)) {
                    validation.name = true;
                }
                if (isEmpty(floorPlanData.unit_type)) {
                    validation.unit_type = true;
                }
                if (!floorPlanData.area || Number(floorPlanData.area) === 0) {
                    validation.area = true;
                }
                setValidation(validation);
                return false;
            } else {
                if (floorPlanData.id) {
                    dispatch(
                        actions.projectFloorplans.updateFloorPlanStart({
                            id: floorPlanData.id,
                            name: floorPlanData.name,
                            type: floorPlanData.type,
                            commercial_name: floorPlanData.commercial_name,
                            unit_type: floorPlanData.unit_type,
                            area: floorPlanData.area ? Number(floorPlanData.area) : 0,
                            total_units: floorPlanData.total_units,
                            reno_units: floorPlanData.reno_units
                                ? Number(floorPlanData.reno_units)
                                : 0,
                            autodesk_url: floorPlanData.autodesk_url,
                            is_missing_info: floorPlanData.isHavingMissingInfo,
                        }),
                    );
                } else {
                    dispatch(
                        actions.projectFloorplans.createFloorPlanStart({
                            project_id: propertyDetails.projects.find(
                                (elm: any) => elm.type === "DEFAULT",
                            ).id,
                            name: floorPlanData.name,
                            commercial_name: floorPlanData.commercial_name,
                            unit_type: floorPlanData.unit_type,
                            type: floorPlanData.type,
                            area: floorPlanData.area ? Number(floorPlanData.area) : 0,
                            reno_units: floorPlanData.reno_units
                                ? Number(floorPlanData.reno_units)
                                : 0,
                            take_off_type: takeOffType,
                            autodesk_url: floorPlanData.autodesk_url,
                            is_missing_info: floorPlanData.isHavingMissingInfo,
                        }),
                    );
                }
                const validation = cloneDeep(validateField);
                setValidation(validation);
                setFloorplanModal(false);
                resetValues();
            }
        } else {
            if (isEmpty(floorPlanData.name) || validation.name_exists || !floorPlanData.area) {
                if (isEmpty(floorPlanData.name)) {
                    validation.name = true;
                }
                if (!floorPlanData.area || Number(floorPlanData.area) === 0) {
                    validation.area = true;
                }
                setValidation(validation);
                return false;
            } else {
                if (takeOffType === "SITE") {
                    dispatch(
                        actions.propertyDetails.updatePropertyStart({
                            property_id: propertyDetails.id,
                            input: {
                                autodeskUrl: floorPlanData.autodesk_url,
                                //    to be uncommented again after adding area on property
                                // area: floorPlanData.area ? Number(floorPlanData.area) : 0,
                                name: floorPlanData.name,
                                is_missing_info: floorPlanData.isHavingMissingInfo,
                            },
                        }),
                    );
                } else {
                    if (floorPlanData.id) {
                        dispatch(
                            actions.projectFloorplans.updateFloorPlanStart({
                                id: floorPlanData.id,
                                name: floorPlanData.name,
                                area: floorPlanData.area ? Number(floorPlanData.area) : 0,
                                autodesk_url: floorPlanData.autodesk_url,
                                is_missing_info: floorPlanData.isHavingMissingInfo,
                            }),
                        );
                    } else {
                        dispatch(
                            actions.projectFloorplans.createFloorPlanStart({
                                // commercial_floorplan_name: floorPlanData.commercial_floorplan_name,
                                project_id: propertyDetails.projects.find(
                                    (elm: any) => elm.type === "DEFAULT",
                                ).id,
                                name: floorPlanData.name,
                                // unit_type: floorPlanData.unit_type,
                                // type: floorPlanData.type,
                                area: floorPlanData.area ? Number(floorPlanData.area) : 0,
                                // total_units: floorPlanData.total_units,
                                // reno_units: floorPlanData.reno_units,
                                take_off_type: takeOffType,
                                autodesk_url: floorPlanData.autodesk_url,
                                is_missing_info: floorPlanData.isHavingMissingInfo,
                            }),
                        );
                    }
                }
                setFloorplanModal(false);
                const validation = cloneDeep(validateField);
                setValidation(validation);
                setFloorplanModal(false);
                resetValues();
            }
        }
    };

    const resetValues = () => {
        setFloorplanData(FLOOR_PLAN_DATA);
    };
    const onCancel = () => {
        setFloorplanModal(false);
        clearLoadedFPData && clearLoadedFPData();
        resetValues();
    };
    const getTakeOffTypeInfo = (takeOffType: string, floorPlanData: any) => {
        let typeText = "";
        let typeName = "";

        switch (takeOffType) {
            case "FLOORPLAN":
                typeText = "floorplan";
                typeName = "Floorplan";
                break;
            case "BUILDING":
                typeText = "building";
                typeName = "Building";
                break;
            case "SITE":
                typeText = "Site";
                typeName = "Site";
                break;
            default:
                typeText = "common area";
                typeName = "Common Area";
        }

        const actionText = floorPlanData.id ? "updated" : "added";
        const loaderText = `Please wait while ${typeText} is being ${actionText}`;

        return { typeName, loaderText };
    };
    const { typeName, loaderText } = getTakeOffTypeInfo(takeOffType, floorPlanData);
    return (
        <>
            <CommonDialog
                open={isFloorPlanCreated}
                onClose={resetValues}
                loading={isFloorPlanCreated}
                //@ts-ignore
                error={error}
                loaderText={loaderText}
                errorText={"Some error occured while trying to add floorplan"}
                saved={!isFloorPlanCreated && !error}
                savedText={"Saved successfully"}
                width="40rem"
                minHeight="26rem"
                errorName={`${floorPlanData.id ? "Creation" : "Updation"} error: `}
            />
            {/* <CommonDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                loading={loading}
                error={error}
                loaderText={ContractorDialogConstants.LOADER_EDIT_TEXT}
                errorText={ContractorDialogConstants.ERROR_TEXT}
                saved={saved}
                savedText={ContractorDialogConstants.SAVED_EDIT_TEXT}
                width="40rem"
                minHeight="26rem"
            /> */}
            <Dialog
                open={openModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClose={() => onCancel()}
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
                    {floorPlanData.id ? "Edit " : "Add "}
                    {typeName}
                </DialogTitle>

                <DialogContent sx={{ "align-self": "center" }}>
                    {isFloorPlanCreated ? (
                        <Loader />
                    ) : (
                        <Box mb={1} className="Projects-overview Projects-create-container">
                            {takeOffType === "FLOORPLAN" ? (
                                <Grid container style={{ padding: "25px" }}>
                                    <Grid item md={4} pr={4}>
                                        <Typography variant="text_14_regular">
                                            Commercial Floorplan Name*
                                        </Typography>
                                        <BaseTextField
                                            fullWidth
                                            placeholder="Commercial Floorplan Name"
                                            // error={validateField.name}
                                            id="filled-error-helper-text"
                                            helperText="Commercial floorplan name required*"
                                            value={floorPlanData.commercial_name}
                                            onChange={(e: any) =>
                                                updateFloorplanData(
                                                    "commercial_name",
                                                    e.target.value,
                                                )
                                            }
                                            inputProps={{ "aria-label": "search" }}
                                        />
                                    </Grid>
                                    <Grid item md={4} pr={4}>
                                        <Typography variant="text_14_regular">
                                            Floorplan Name*
                                        </Typography>
                                        <BaseTextField
                                            fullWidth
                                            placeholder="Floorplan Name"
                                            error={validateField.name || validateField.name_exists}
                                            id="filled-error-helper-text"
                                            helperText={
                                                validateField.name
                                                    ? "Floorplan name required*"
                                                    : "Floorplan name exists"
                                            }
                                            value={floorPlanData.name}
                                            onChange={(e: any) =>
                                                updateFloorplanData("name", e.target.value)
                                            }
                                            inputProps={{ "aria-label": "search" }}
                                        />
                                    </Grid>
                                    <Grid item md={4} pr={4}>
                                        <Typography variant="text_14_regular">
                                            Unit Type*
                                        </Typography>
                                        <BaseTextField
                                            fullWidth
                                            placeholder="Unit Type"
                                            error={validateField.unit_type}
                                            id="filled-error-helper-text"
                                            helperText="Unit type required*"
                                            value={floorPlanData.unit_type}
                                            onChange={(e: any) =>
                                                updateFloorplanData("unit_type", e.target.value)
                                            }
                                            inputProps={{ "aria-label": "search" }}
                                        />
                                    </Grid>
                                    <Grid item md={4} pr={4}>
                                        <Typography variant="text_14_regular">
                                            Floorplan Type
                                        </Typography>
                                        <BaseTextField
                                            fullWidth
                                            // error={validateField.type}
                                            placeholder="Floorplan Type"
                                            id="filled-error-helper-text"
                                            // helperText="Floorplan type required*"
                                            value={floorPlanData.type}
                                            onChange={(e: any) =>
                                                updateFloorplanData("type", e.target.value)
                                            }
                                            inputProps={{ "aria-label": "search" }}
                                        />
                                    </Grid>
                                    <Grid item md={4} pr={4}>
                                        <Typography variant="text_14_regular">
                                            Standard Area (Sq ft)
                                        </Typography>
                                        <BaseTextField
                                            fullWidth
                                            placeholder="Standard Area (Sq ft)"
                                            error={validateField.area}
                                            type="number"
                                            helperText="Area required*"
                                            id="filled-error-helper-text"
                                            value={floorPlanData.area}
                                            aria-valuemin={1}
                                            onChange={(e: any) =>
                                                updateFloorplanData("area", e.target.value)
                                            }
                                            inputProps={{ "aria-label": "search" }}
                                        />
                                    </Grid>
                                    {/* <Grid item md={4} pr={4}>
                                        <Typography variant="text_14_regular">
                                            Total Units*
                                        </Typography>
                                        <InputLabel id="filled-error-helper-text"></InputLabel>
                                      
                                       
                                        <BaseTextField
                                            fullWidth
                                            placeholder="Total Units"
                                            onChange={(e: any) =>
                                                updateFloorplanData("total_units", e.target.value)
                                            }
                                            type="number"
                                            value={floorPlanData.total_units}
                                            min={0}
                                            error={validateField.total_units}
                                            helperText={"Total Units is required"}
                                        />
                                    </Grid> */}
                                    <Grid item md={4} pr={4}>
                                        <Typography variant="text_14_regular">
                                            Autodesk URL
                                        </Typography>
                                        <BaseTextField
                                            fullWidth
                                            placeholder="autodesk url"
                                            error={validateField.autodesk_url}
                                            type="text"
                                            id="filled-error-helper-text"
                                            value={floorPlanData.autodesk_url}
                                            onChange={(e: any) =>
                                                updateFloorplanData("autodesk_url", e.target.value)
                                            }
                                            inputProps={{ "aria-label": "autodesk_url" }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        md={6}
                                        pt={4}
                                        justifyContent={"flex-start"}
                                        alignItems={"center"}
                                        display={"grid"}
                                        columnGap={"0.5rem"}
                                        gridAutoFlow={"column"}
                                    >
                                        <BaseCheckbox
                                            size="small"
                                            sx={{ marginRight: "4px" }}
                                            checked={floorPlanData.isHavingMissingInfo}
                                            onChange={(e: any) =>
                                                updateFloorplanData(
                                                    "isHavingMissingInfo",
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <Typography variant="text_14_regular">
                                            Check if there is missing info that needs to be added
                                        </Typography>
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
                                                onClick={() => onCancel()}
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
                                                onClick={() => createNewFloorplan()}
                                                style={{
                                                    marginLeft: "10px",
                                                    height: "50px",
                                                    // position: "absolute",
                                                    width: "146px",
                                                    // height: "50px",
                                                    // left: "162px",
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
                            ) : (
                                <Grid container style={{ padding: "25px" }}>
                                    <Grid container style={{ justifyContent: "start" }}>
                                        <Grid item md={4} pr={4}>
                                            <Typography variant="text_14_regular">
                                                {`${typeName} Name`}
                                            </Typography>
                                            <BaseTextField
                                                fullWidth
                                                error={
                                                    validateField.name || validateField.name_exists
                                                }
                                                id="filled-error-helper-text"
                                                helperText={
                                                    validateField.name
                                                        ? `${typeName} Name required*`
                                                        : `${typeName} already exists`
                                                }
                                                value={floorPlanData.name}
                                                onChange={(e: any) =>
                                                    updateFloorplanData("name", e.target.value)
                                                }
                                                inputProps={{ "aria-label": "name" }}
                                            />
                                        </Grid>
                                        <Grid item md={4} pr={4}>
                                            <Typography variant="text_14_regular">
                                                {`${typeName} area required*`}
                                            </Typography>
                                            <BaseTextField
                                                fullWidth
                                                error={validateField.area}
                                                type="number"
                                                id="filled-error-helper-text"
                                                helperText="Area required*"
                                                value={floorPlanData.area}
                                                onChange={(e: any) =>
                                                    updateFloorplanData("area", e.target.value)
                                                }
                                                inputProps={{ "aria-label": "area" }}
                                            />
                                        </Grid>
                                        <Grid item md={4} pr={4}>
                                            <Typography variant="text_14_regular">
                                                Autodesk URL
                                            </Typography>
                                            <BaseTextField
                                                fullWidth
                                                placeholder="autodesk url"
                                                error={validateField.autodesk_url}
                                                type="text"
                                                id="filled-error-helper-text"
                                                value={floorPlanData.autodesk_url}
                                                onChange={(e: any) =>
                                                    updateFloorplanData(
                                                        "autodesk_url",
                                                        e.target.value,
                                                    )
                                                }
                                                inputProps={{ "aria-label": "autodesk_url" }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={8}
                                            pr={4}
                                            alignItems={"center"}
                                            display={"grid"}
                                            gridAutoFlow={"column"}
                                            columnGap={"0.5rem"}
                                            justifyContent={"flex-start"}
                                        >
                                            <BaseCheckbox
                                                size="small"
                                                sx={{ marginRight: "4px" }}
                                                checked={floorPlanData.isHavingMissingInfo}
                                                onChange={(e: any) =>
                                                    updateFloorplanData(
                                                        "isHavingMissingInfo",
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                            <Typography variant="text_14_regular">
                                                Check if there is missing info that needs to be
                                                added
                                            </Typography>
                                        </Grid>
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
                                                onClick={() => onCancel()}
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
                                                onClick={() => createNewFloorplan()}
                                                style={{
                                                    marginLeft: "10px",
                                                    height: "50px",
                                                    // position: "absolute",
                                                    width: "146px",
                                                    // height: "50px",
                                                    // left: "162px",
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
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateFloorplan;
