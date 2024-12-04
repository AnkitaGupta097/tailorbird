import React, { useEffect, useState, Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import { Grid, Snackbar, Alert, Typography, styled, Box } from "@mui/material";
import { generateTableData } from "./service";
import actions from "../../../../stores/actions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FloorplanTable from "./floorplan-table";
import { PROJECT_TYPE } from "../../constant";
import BaseLoader from "../../../../components/base-loading";
import Icon from "assets/icons/icon-exclamation.svg";
import UnitMix from "./unit-mix";
import { isEmpty } from "lodash";

const DefaultFloorplanSection = styled(Box)(({ theme }) => ({
    display: "flex",
    background: theme.palette.secondary.light,
    border: `1px solid ${theme.border.outer}`,
    borderRadius: "5px",
    width: "97%",
    minHeight: "480px",
    height: "100%",
    marginTop: "20px",
    marginLeft: "20px",
    justifyContent: "center",
    verticalAlign: "middle",
    alignItems: "center",
    flexDirection: "column",
}));
const ProjectsFloorplans = () => {
    const { projectId } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        floorplans,
        isLoading,
        subGroups,
        subGroupMappers,
        inventories,
        inventoryMixes,
        snackbar,
        unitMix,
        projectDetails,
    } = useAppSelector((state: any) => ({
        floorplans: state.projectFloorplans.floorplans,
        isLoading:
            state.projectFloorplans.floorplans.loading && state.projectFloorplans.unitMix.loading,
        subGroups: state.projectFloorplans.floorplanSplits.subGroups,
        subGroupMappers: state.projectFloorplans.floorplanSplits.subGroupMappers,
        inventories: state.projectFloorplans.inventories,
        inventoryMixes: state.projectFloorplans.inventoryMixes,
        snackbar: state.common.snackbar,
        unitMix: state.projectFloorplans.unitMix,
        projectDetails: state.projectDetails.data,
    }));

    const rentRollFeatureEnabled = projectDetails.projectType == PROJECT_TYPE[0].value;

    const [floorplansCopy, setFloorplansCopy] = useState<any>(
        generateTableData(floorplans.data, "floorplans", projectDetails.projectType),
    );

    const [defaultFloorplanSplit, setDefaultFloorplanSplit] = useState(
        generateTableData(
            floorplans.data,
            "floorplanSplit",
            projectDetails.projectType,
            subGroupMappers,
            subGroups,
        ),
    );
    const [floorplanSplitCopy, setFloorplanSplitCopy] = useState<any>(defaultFloorplanSplit);

    const [inventoryMixCopy, setInventoryMixCopy] = useState<any>(
        generateTableData(
            floorplans.data,
            "inventoryMix",
            projectDetails.projectType,
            inventoryMixes.data,
            inventories.data,
        ),
    );
    const [isFloorPlanUndefined, setIsFloorPlanUndefined] = useState(false);

    useEffect(() => {
        if (isEmpty(floorplans.data)) {
            dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectId }));
        }
        if (rentRollFeatureEnabled && isEmpty(unitMix.projectFloorPlan)) {
            dispatch(actions.projectFloorplans.fetchUnitMixDataStart(projectId));
        }
        // eslint-disable-next-line
    }, []);

    //// checking the data length of each and if no data considering floorplan related files are not uploaded
    useEffect(() => {
        if (
            floorplanSplitCopy?.data?.length == 0 &&
            inventoryMixCopy?.data?.length == 0 &&
            floorplansCopy?.data?.length == 0
        ) {
            setIsFloorPlanUndefined(true);
        } else {
            setIsFloorPlanUndefined(false);
        }
    }, [floorplanSplitCopy, inventoryMixCopy, floorplansCopy]);

    useEffect(() => {
        setFloorplansCopy(
            generateTableData(floorplans.data, "floorplans", projectDetails.projectType),
        );
        // eslint-disable-next-line
    }, [floorplans.data]);

    //Navigate function to overview tab
    const navigeteToOverview = (newValue: string) => {
        const path = `/${newValue}`;
        if (pathname.split("/").length === 3) {
            navigate(pathname.substring(0, pathname.length) + path);
        } else {
            navigate(pathname.substring(0, pathname.lastIndexOf("/")) + path);
        }
    };

    useEffect(() => {
        let floorplanSplitValue = generateTableData(
            floorplans.data,
            "floorplanSplit",
            projectDetails.projectType,
            subGroupMappers,
            subGroups,
        );
        setDefaultFloorplanSplit(floorplanSplitValue);
        setFloorplanSplitCopy(floorplanSplitValue);
        // eslint-disable-next-line
    }, [floorplans.data, subGroups, subGroupMappers]);

    useEffect(() => {
        setInventoryMixCopy(
            generateTableData(
                floorplans.data,
                "inventoryMix",
                projectDetails.projectType,
                inventoryMixes.data,
                inventories.data,
            ),
        );
        // eslint-disable-next-line
    }, [floorplans.data, inventories.data, inventoryMixes.data]);
    return (
        <React.Fragment>
            {isLoading && <BaseLoader />}
            <Snackbar
                open={snackbar.open}
                onClose={() => dispatch(actions.common.closeSnack())}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={3000}
            >
                <Alert
                    onClose={() => dispatch(actions.common.closeSnack())}
                    severity={snackbar.variant}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {isFloorPlanUndefined && (
                <DefaultFloorplanSection>
                    {/* <DefaultTableSection item md={12} className="Scope-table-no-data"> */}
                    <img src={Icon} alt="exclamation icon" />
                    <Typography variant="warningText" sx={{ display: "block" }}>
                        <Fragment>
                            {`${
                                projectDetails.projectType == PROJECT_TYPE[0].value
                                    ? "Rent roll has"
                                    : "Summary sheets have"
                            } not been uploaded yet.`}
                        </Fragment>
                    </Typography>
                    <Typography
                        variant="warningText"
                        sx={{ display: "block", textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => navigeteToOverview("overview")}
                    >
                        <Fragment>{"You can upload them in the Overview tab."}</Fragment>
                    </Typography>
                    {/* </DefaultTableSection> */}
                </DefaultFloorplanSection>
            )}
            {!isFloorPlanUndefined && (
                <Grid container marginTop={8} marginBottom={8}>
                    {rentRollFeatureEnabled && (
                        <Grid container marginBottom={4}>
                            <UnitMix
                                unitsEditable={projectDetails.version != "2.0"}
                                projectId={projectId}
                            />
                        </Grid>
                    )}
                    {!rentRollFeatureEnabled && (
                        <Grid container marginBottom={4}>
                            <FloorplanTable
                                planData={floorplansCopy}
                                setPlanData={setFloorplansCopy}
                                title={
                                    projectDetails.projectType == PROJECT_TYPE[0].value
                                        ? "Floorplans"
                                        : "Building/Area"
                                }
                                type={"floorplans"}
                            />
                        </Grid>
                    )}
                    {projectDetails.projectType === PROJECT_TYPE[0].value && (
                        <Grid container marginBottom={4}>
                            <FloorplanTable
                                planData={floorplanSplitCopy}
                                setPlanData={setFloorplanSplitCopy}
                                title="Floor Split"
                                type="floorplanSplit"
                                defaultPlanData={defaultFloorplanSplit}
                            />
                        </Grid>
                    )}
                    {!rentRollFeatureEnabled && (
                        <Grid container>
                            <FloorplanTable
                                planData={inventoryMixCopy}
                                setPlanData={setInventoryMixCopy}
                                title={"Inventory Mix"}
                                type={"inventoryMix"}
                            />
                        </Grid>
                    )}
                </Grid>
            )}
        </React.Fragment>
    );
};

export default React.memo(ProjectsFloorplans);
