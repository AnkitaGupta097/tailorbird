import React, { useState, useEffect, useCallback } from "react";
import { filter, isNull, map, debounce, isEmpty, find } from "lodash";
import {
    Box,
    Paper,
    Grid,
    InputBase,
    styled,
    MenuItem,
    Select,
    Typography,
    Card,
    Divider,
    Button,
} from "@mui/material";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { growthbook } from "utils/growthbook";
import "./projects-overview.css";
import AddIcon from "../../../../assets/icons/icon-add.svg";
import { useAppSelector, useAppDispatch } from "../../../../stores/hooks";
import actions from "../../../../stores/actions";
import FileUploadModal from "./file-upload-modal";
import { useNavigate, useParams } from "react-router-dom";
import { PROPERTY_DATA, PROPERTY_TYPE } from "../../constant";
import OwnerShip from "../../../../components/ownership-dropdown";
import { IOrg } from "../../../package-manager/interfaces";
import RentRollModal from "./modal/rent-roll-modal";
import ColumnMapModal from "./modal/column-map-modal";
import AppTheme from "../../../../styles/theme";
import { ReactComponent as DownLoad } from "../../../../assets/icons/download-icon.svg";
import { ReactComponent as Cross } from "../../../../assets/icons/cross-icon.svg";
import { useSnackbar } from "notistack";
import BaseLoader from "../../../../components/base-loading";
import BaseSnackbar from "../../../../components/base-snackbar";
import ConfirmationModal from "../../../../components/confirmation-modal";
// import { useFeature } from "@growthbook/growthbook-react";
// import { FeatureFlagConstants } from "utils/constants";
import PropertySearchDialog from "./entrata-map-modal";
import FileUploadBox from "./file-upload-box";
import ImportRentRollButton from "./import-rent-roll-button";

const SInput = styled(InputBase)(({ theme }) => ({
    "& .MuiInputBase-input": {
        borderRadius: 5,
        backgroundColor: "#fcfcfb",
        border: "1px solid #CCCCCC",
        fontSize: 16,
        marginTop: 10,
        padding: "10px 12px",
        marginRight: "15px",
        transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    },
}));

const PropertiesOverview = () => {
    const {
        organization,
        propertyDetails,
        // allUsers,
        loading,
        isRentRollLoading,
        rentRollDb,
        isDeleteStatus,
        rentRollDetail,
        importingRentRoll,
        floorplans,
        featureFlags,
        snackbarState,
    } = useAppSelector((state) => {
        return {
            organization: state.tpsm.organization,
            propertyDetails: state.propertyDetails.data,
            // allUsers: state.tpsm.all_User,
            rentRollDb: state.projectOverview.rentRollDb,
            loading: state.propertyDetails.loading,
            isRentRollLoading: state.projectOverview.loading,
            isDeleteStatus: state.projectOverview.rentRollDb.isDeleteStatus,
            rentRollDetail: state.projectDetails.data?.rentRoll ?? {},
            importingRentRoll: state.propertyDetails.importingRentRoll,
            floorplans: state.propertyDetails.data?.floorplans,
            featureFlags: state.common.featureFlags.data,
            snackbarState: state.common.snackbar,
        };
    });

    const {
        status: rentRollStatus,
        remoteFileReference,
        downloadLink: rentRollDownloadLink,
    } = rentRollDetail;
    const { status, data } = rentRollDb;
    const navigate = useNavigate();

    const floorplansWithEntrataRefId = filter(floorplans, (fp) => !isNull(fp.entrata_ref_id));
    const isRentRollImportedFromEntrata =
        floorplansWithEntrataRefId?.length > 0 && rentRollStatus !== "success";

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const { propertyId } = useParams();
    const [isUploadModal, setUploadModal] = useState(false);
    const [isEntrataDialogOpen, openEntrataDialog] = useState(false);
    const [propertyData, setPropertyData] = useState(PROPERTY_DATA);
    const [openRentRoll, setRentRoll] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [openColumnMap, setColumnMap] = useState(false);
    const [alert, setAlert] = useState<any>({ variant: "", title: "" });

    // console.log(propertyDetails, "??");

    useEffect(() => {
        growthbook.setFeatures(featureFlags);
        growthbook.setAttributes({ project_id: propertyId });
    }, [propertyId, featureFlags]);

    useEffect(() => {
        if (!isEmpty(alert.variant)) {
            enqueueSnackbar("", {
                variant: alert.variant,
                action: <BaseSnackbar variant={alert.variant} title={alert.title} />,
            });
            setTimeout(() => {
                setAlert({ variant: "", title: "" });
            }, 200);
        }

        // eslint-disable-next-line
    }, [alert]);

    useEffect(() => {
        dispatch(actions.projectOverview.initStateUpdate(""));
        dispatch(actions.propertyDetails.fetchFloorPlansStart({ projectId: propertyId }));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setAlert({
            variant: status,
            title:
                status == "success"
                    ? "Rent-roll column updated Successfully."
                    : "Unable to updated Rent-roll column .",
        });
    }, [status]);
    useEffect(() => {
        if (data?.error && data?.column == null) {
            setAlert({
                variant: "error",
                title: data.error,
            });
        }
    }, [data]);

    useEffect(() => {
        setAlert({
            variant: isDeleteStatus,
            title:
                isDeleteStatus == "success"
                    ? "Rent-roll file deleted Successfully."
                    : "Unable to delete Rent-roll file.",
        });
        // eslint-disable-next-line
    }, [isDeleteStatus]);

    useEffect(() => {
        // console.log(propertyDetails, "fdfd");
        if (!isEmpty(propertyDetails)) {
            setPropertyData({
                ownership_group_id: propertyDetails?.ownershipGroupId,
                name: propertyDetails.name,
                type: propertyDetails.type,
                address: propertyDetails.address,
                city: propertyDetails?.city,
                state: propertyDetails?.state,
                zipcode: propertyDetails?.zipcode,
                operator_id: propertyDetails?.operatorId,
                property_url: propertyDetails?.propertyUrl,
                external_property_id: propertyDetails?.externalPropertyId,
                msa: propertyDetails?.msa,
                autodesk_url: propertyDetails.autodesk_url,
            });
        }
        // eslint-disable-next-line
    }, [propertyDetails]);

    useEffect(() => {
        const { open, variant, message } = snackbarState;
        open &&
            enqueueSnackbar("", {
                variant: variant,
                action: <BaseSnackbar variant={variant} title={message?.toString() ?? ""} />,
                onClose: () => {
                    dispatch(actions.common.closeSnack());
                },
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snackbarState.open]);

    // eslint-disable-next-line
    const updatePropertyInfo = useCallback(
        debounce((key: string, data: any) => {
            dispatch(
                actions.propertyDetails.updatePropertyStart({
                    property_id: propertyId,
                    input: { [key]: data },
                }),
            );
        }, 600),
        [],
    );

    const updatePropertyData = (key: string, data: any) => {
        let val = data;
        setPropertyData({ ...propertyData, [key]: val });
        updatePropertyInfo(key, data);
    };

    const deleteRentRoll = () => {
        setConfirm(false);
        dispatch(
            actions.projectOverview.deleteRentRollStart(
                propertyDetails.projects.find((elm: any) => elm.type === "DEFAULT").id,
            ),
        );
    };

    const downloadRentRollFile = async () => {
        window.open(rentRollDownloadLink);
    };

    const importRentRollFromEntrata = () => {
        dispatch(
            actions.propertyDetails.importRentRollFromEntrataStart({
                projectId: propertyId,
            }),
        );
    };

    const rentRollFileName = remoteFileReference && remoteFileReference.split("/").pop();
    const rentRollFeatureEnabled = true;
    // useFeature(FeatureFlagConstants.RENT_ROLL).on &&
    // projectDetails.projectType == PROJECT_TYPE[0].value;

    return (
        <GrowthBookProvider growthbook={growthbook}>
            <Box mx={6} my={3} className="Projects-overview">
                {(loading || isRentRollLoading) && <BaseLoader />}
                <Paper elevation={3}>
                    <Grid container style={{ padding: "25px" }}>
                        <Grid item md={12} style={{ marginBottom: "20px" }}>
                            <span className="label">Property Details</span>
                        </Grid>
                        <Grid item md={4} style={{ paddingRight: "15px" }}>
                            {/* <IfFeatureEnabled feature=""> */}
                            <span className="input-label">Ownership Group</span>
                            {/* </IfFeatureEnabled> */}
                            <OwnerShip
                                options={organization}
                                value={
                                    find(organization, {
                                        id: propertyData.ownership_group_id,
                                    }) ?? null
                                }
                                setState={(val?: IOrg) => {
                                    updatePropertyData("ownership_group_id", val?.id);
                                }}
                                refetchOrgFunc={() => {
                                    dispatch(actions.tpsm.fetchOrganizationStart({}));
                                }}
                                autocompleteSx={{
                                    ".MuiInputBase-input": {
                                        height: "0.85rem",
                                        marginRight: "0.5rem",
                                    },
                                    marginTop: ".5rem",
                                }}
                            />
                        </Grid>
                        <Grid item md={4}>
                            <span className="input-label">Property Name</span>
                            <SInput
                                fullWidth
                                value={propertyData.name}
                                onChange={(e) => updatePropertyData("name", e.target.value)}
                                inputProps={{ "aria-label": "search" }}
                            />
                        </Grid>
                        <Grid item md={4}>
                            <span className="input-label">Property Type</span>
                            <Box style={{ marginRight: ".5rem" }}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    fullWidth
                                    value={propertyData?.type}
                                    onChange={(e) => updatePropertyData("type", e.target.value)}
                                    placeholder="Project-type"
                                    sx={{
                                        height: "44px",
                                        marginTop: ".7rem",
                                        ".css-1kn7y0p-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                            {
                                                "-webkitTextFillColor": "#000000!important",
                                            },
                                    }}
                                >
                                    {map(PROPERTY_TYPE, (property) => (
                                        <MenuItem key={property.value} value={property.value}>
                                            {property.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Grid>
                        <Grid container mt={8}>
                            <Grid item md={4}>
                                <span className="input-label">Street Address</span>
                                <SInput
                                    fullWidth
                                    value={propertyData.address}
                                    onChange={(e) => updatePropertyData("address", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">City</span>
                                <SInput
                                    fullWidth
                                    value={propertyData?.city}
                                    onChange={(e) => updatePropertyData("city", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">State</span>
                                <SInput
                                    fullWidth
                                    value={propertyData?.state}
                                    onChange={(e) => updatePropertyData("state", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container mt={8}>
                            <Grid item md={4}>
                                <span className="input-label">Zipcode</span>
                                <SInput
                                    fullWidth
                                    type="number"
                                    value={propertyData?.zipcode}
                                    onChange={(e) => updatePropertyData("zipcode", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4} pr={4}>
                                {/* <IfFeatureEnabled feature=""> */}
                                <span className="input-label">Operator</span>
                                {/* </IfFeatureEnabled> */}
                                <OwnerShip
                                    options={organization}
                                    value={
                                        find(organization, {
                                            id: propertyData.operator_id,
                                        }) ?? null
                                    }
                                    setState={(val?: IOrg) => {
                                        updatePropertyData("operator_id", val?.id);
                                    }}
                                    refetchOrgFunc={() => {
                                        dispatch(actions.tpsm.fetchOrganizationStart({}));
                                    }}
                                    autocompleteSx={{
                                        ".MuiInputBase-input": {
                                            height: "0.85rem",
                                            marginRight: "0.5rem",
                                        },
                                        marginTop: ".5rem",
                                    }}
                                    org_type="OPERATOR"
                                />
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">MSA</span>
                                <SInput
                                    fullWidth
                                    value={propertyData?.msa}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container mt={8}>
                            <Grid item md={4}>
                                <span className="input-label">Property ID</span>
                                <SInput
                                    fullWidth
                                    value={propertyData?.external_property_id}
                                    onChange={(e) =>
                                        updatePropertyData("external_property_id", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">Property URL (optional)</span>
                                <SInput
                                    fullWidth
                                    value={propertyData?.property_url}
                                    onChange={(e) =>
                                        updatePropertyData("property_url", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">Autodesk URL</span>
                                <SInput
                                    fullWidth
                                    value={propertyData?.autodesk_url}
                                    onChange={(e) =>
                                        updatePropertyData("autodesk_url", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "autodesk_url" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container mt={8}>
                            <Grid item md={4}>
                                <span className="input-label">Offering Memo (optional)</span>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        disabled={true}
                                        startIcon={<img src={AddIcon} alt="add new Project" />}
                                        style={{ height: "100%" }}
                                    >
                                        Upload
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">Rent Roll</span>
                                <Box mt={2}>
                                    {rentRollStatus == "success" ? (
                                        <Card
                                            sx={{ boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.11)" }}
                                        >
                                            <Grid container py={3} px={6}>
                                                <Grid item md={8}>
                                                    <Typography
                                                        variant="text_16_medium"
                                                        color={AppTheme.scopeHeader.label}
                                                    >
                                                        {rentRollFileName}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    md={4}
                                                    display="flex"
                                                    justifyContent="flex-end"
                                                >
                                                    <Divider orientation="vertical" />
                                                    <Box
                                                        ml={3}
                                                        onClick={downloadRentRollFile}
                                                        sx={{ cursor: "pointer" }}
                                                    >
                                                        <DownLoad />
                                                    </Box>
                                                    <Box
                                                        ml={3}
                                                        onClick={() => setConfirm(true)}
                                                        sx={{ cursor: "pointer" }}
                                                    >
                                                        <Cross />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    ) : (
                                        <Grid container columnGap={4}>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    disabled={
                                                        !rentRollFeatureEnabled ||
                                                        isRentRollImportedFromEntrata
                                                    }
                                                    onClick={() => setRentRoll(true)}
                                                    startIcon={
                                                        <img src={AddIcon} alt="add new Project" />
                                                    }
                                                    style={{ height: "100%" }}
                                                >
                                                    Upload
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <ImportRentRollButton
                                                    disabled={
                                                        !propertyDetails?.property_id_mappings ||
                                                        !propertyDetails?.property_id_mappings.find(
                                                            (f: any) => f.type === "entrata",
                                                        )
                                                    }
                                                    onClick={() => importRentRollFromEntrata()}
                                                    importing={importingRentRoll}
                                                    isRentRollImportedFromEntrata={
                                                        isRentRollImportedFromEntrata
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={4}>
                                {/* <span className="input-label">Map to Entrata</span> */}
                                <Box mt={3}>
                                    <Button
                                        variant="contained"
                                        startIcon={<img src={AddIcon} alt="Map to Entrata" />}
                                        style={{ height: "100%" }}
                                        onClick={() => openEntrataDialog(true)}
                                    >
                                        Map Property to Entrata
                                    </Button>
                                    {propertyDetails?.property_id_mappings?.length > 0 &&
                                        propertyDetails?.property_id_mappings.map(
                                            (m: any, idx: number) => {
                                                if (m.type === "entrata")
                                                    return (
                                                        <Typography key={idx}>
                                                            Currently mapped to: {m.mapping_name}
                                                        </Typography>
                                                    );
                                            },
                                        )}
                                </Box>
                                <Box mt={3}>
                                    <Button
                                        variant="contained"
                                        startIcon={<img src={AddIcon} alt="Map to Entrata" />}
                                        style={{ height: "100%" }}
                                        onClick={() =>
                                            navigate(`/admin-properties/${propertyId}/vendor-map`)
                                        }
                                        disabled={
                                            !propertyDetails?.property_id_mappings ||
                                            !propertyDetails?.property_id_mappings.find(
                                                (f: any) => f.type === "entrata",
                                            )
                                        }
                                    >
                                        Map Vendors to Entrata
                                    </Button>
                                </Box>
                                <Box mt={3}>
                                    <Button
                                        variant="contained"
                                        startIcon={<img src={AddIcon} alt="Map Job phase" />}
                                        style={{ height: "100%" }}
                                        onClick={() =>
                                            navigate(`/admin-properties/${propertyId}/job-map`)
                                        }
                                        disabled={
                                            !propertyDetails?.property_id_mappings ||
                                            !propertyDetails?.property_id_mappings.find(
                                                (f: any) => f.type === "entrata",
                                            )
                                        }
                                    >
                                        Map Job phases
                                    </Button>
                                </Box>
                                <Box mt={3}>
                                    <Button
                                        variant="contained"
                                        startIcon={<img src={AddIcon} alt="Map Floorplans" />}
                                        style={{ height: "100%" }}
                                        onClick={() =>
                                            navigate(
                                                `/admin-properties/${propertyId}/overview/floorplan-map`,
                                            )
                                        }
                                        disabled={
                                            !propertyDetails?.property_id_mappings ||
                                            !propertyDetails?.property_id_mappings.find(
                                                (f: any) => f.type === "entrata",
                                            )
                                        }
                                    >
                                        Map Floorplans
                                    </Button>
                                </Box>
                                <Box mt={3}>
                                    <Button
                                        variant="contained"
                                        startIcon={<img src={AddIcon} alt="Map Units" />}
                                        style={{ height: "100%" }}
                                        onClick={() =>
                                            navigate(
                                                `/admin-properties/${propertyId}/overview/unit-map`,
                                            )
                                        }
                                        disabled={
                                            !propertyDetails?.property_id_mappings ||
                                            !propertyDetails?.property_id_mappings.find(
                                                (f: any) => f.type === "entrata",
                                            )
                                        }
                                    >
                                        Map Units
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
                <FileUploadModal
                    isModal={isUploadModal}
                    handleClose={() => setUploadModal(false)}
                />
                <PropertySearchDialog
                    open={isEntrataDialogOpen}
                    onClose={() => {
                        dispatch(actions.propertyDetails.fetchPropertyDetailsStart(propertyId));
                        openEntrataDialog(false);
                    }}
                    property={propertyDetails}
                />
                {openRentRoll && (
                    <RentRollModal
                        isOpen={openRentRoll}
                        handleClose={() => setRentRoll(false)}
                        setColumnMap={() => setColumnMap(true)}
                    />
                )}
                <ConfirmationModal
                    text="Are you sure you want to delete the Rent Roll file?"
                    onCancel={() => setConfirm(false)}
                    onProceed={deleteRentRoll}
                    open={confirm}
                    variant="deletion"
                    actionText="Delete"
                />
                <ColumnMapModal isOpen={openColumnMap} handleClose={() => setColumnMap(false)} />
            </Box>
            <FileUploadBox file_type={"COVER_IMAGE"} projectId={propertyDetails.id} />
        </GrowthBookProvider>
    );
};

export default PropertiesOverview;
