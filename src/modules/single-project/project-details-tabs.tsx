/* eslint-disable no-unused-vars */
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { overviewTabs } from "./contants";
import { CircularProgress, styled } from "@mui/material";
// import RenovationWizard from "./renovation-wizard/index"; Commented as not required on staging
import DesignDocument from "./renovation-wizard/design-documents";

import ProductionDetails from "./production";
import RFPDetails from "./RFP";
import ProjectAnalytics from "./project-analytics";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { graphQLClient } from "utils/gql-client";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
import {
    GET_ORGANIZATION_SITEWALK_STATUS,
    GET_PROJECT_FINALISTS,
} from "components/invite-to-sitewalk/constants";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import { cloneDeep, filter } from "lodash";
import RenovationWizardV2 from "./renovation-wizard-v2";

const AntTabs = styled(Tabs)({
    borderBottom: "1px solid #e8e8e8",
    "& .MuiTabs-indicator": {
        backgroundColor: "#1890ff",
    },
});

const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
        minWidth: 0,
    },
    marginRight: theme.spacing(1),
    color: "#004D71",
    fontFamily: "Roboto",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "20px",
    "&:hover": {
        color: "#000",
        opacity: 1,
    },
    "&.Mui-selected": {
        color: "#000",
    },
    "&.Mui-focusVisible": {
        backgroundColor: "#d1eaff",
    },
}));

interface StyledTabProps {
    label: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function ProjectDetailsTabs(props: any) {
    const [value, setValue] = React.useState(0);
    const renoWizard_enabled = useFeature(FeatureFlagConstants.RENO_WIZARD_CONSUMER).on;
    // const renoWizard_enabled = true;
    const {
        RFP,
        loading,
        production,
        renovationWizard,
        allUsers,
        organizations,
        project,
        projectDetails,
    } = useAppSelector((state) => ({
        RFP: state.singleProject.RFP,
        keyPeople: state.singleProject.keyPeople,
        loading: state.singleProject.loading || false,
        production: state.singleProject.production,
        projectDetails: state.singleProject.projectDetails,
        renovationWizard: state.singleProject.renovationWizard,
        allUsers: state.tpsm.all_User?.users || [],
        organizations: state.tpsm.organization || [],
        project: state.projectDetails.data,
    }));
    const { projectId } = useParams();
    const [bidStatusData, setBidStatusData]: any = useState([]);
    const [projectTabs, setProjectTabs]: any = useState([]);
    useEffect(() => {
        const tabs = cloneDeep(overviewTabs);
        if (renoWizard_enabled) {
            props.setRenoTab(true);
            setProjectTabs(overviewTabs);
        } else {
            setProjectTabs(filter(tabs, (tab) => tab !== "Renovation Wizard"));
        } // eslint-disable-next-line
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue == 0 && renoWizard_enabled) {
            props.setRenoTab(true);
        } else props.setRenoTab(false);
        //MIXPANEL : Event tracking for visiting project detail page
        mixpanel.track(`PROJECT DETAIL :Clicked ${overviewTabs[newValue]} `, {
            eventId: `visited_project_${overviewTabs[newValue]}`,
            ...getUserDetails(),
            ...getUserOrgDetails(),
            project_name: project.name,
            project_id: projectId,
        });
        setValue(newValue);
    };
    const getUploaderName = (userId: any) => {
        return allUsers.find((item: any) => item.id == userId)?.name || "NA";
    };

    const getOrgName = async (organization_id: any) => {
        let companyDetails = await organizations?.find((item: any) => item.id == organization_id);
        return companyDetails?.name;
    };

    async function getSitewalkStatus(contractorId: any) {
        try {
            const response = await graphQLClient.query(
                "getOrganizationSitewalkStatus",
                GET_ORGANIZATION_SITEWALK_STATUS,
                {
                    projectId,
                    organizationId: contractorId,
                },
            );
            const { getOrganizationSitewalkStatus } = response;
            return getOrganizationSitewalkStatus;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    async function getProjectFinalistStatus(contractorId: any) {
        try {
            const response = await graphQLClient.query(
                "getProjectFinalist",
                GET_PROJECT_FINALISTS,
                {
                    projectId,
                    organizationId: contractorId,
                },
            );
            const { getProjectFinalist } = response;
            return !!getProjectFinalist;
        } catch (error) {
            console.error(error);
            return false; // Return a default value in case of error
        }
    }
    const memoizedBidStatistics = useMemo(() => RFP.bidStatistics, [RFP.bidStatistics]);
    const memoizedOrganizations = useMemo(() => organizations, [organizations]);

    useEffect(() => {
        const updateFinalistStatus = async () => {
            const updatedBidStatistics = await Promise.all(
                RFP.bidStatistics.map(async (item: any) => {
                    const isFinalist = await getProjectFinalistStatus(item.organization_id);
                    const sitewalkDetils = await getSitewalkStatus(item.organization_id);
                    const orgName = await getOrgName(item.organization_id);
                    return {
                        orgName,
                        sitewalkDetils,
                        isFinalist,
                        ...item,
                    };
                }),
            );
            // Here you can set the updatedBidStatistics to your state or wherever you want to use it
            setBidStatusData(updatedBidStatistics);
        };

        updateFinalistStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memoizedBidStatistics, memoizedOrganizations]);

    if (!projectDetails.id) {
        return (
            <Box width={1} display="flex" justifyContent="center">
                <CircularProgress />;
            </Box>
        );
    }
    return (
        <Box sx={{ minHeight: "400px", paddingBottom: "10px" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <AntTabs value={value} onChange={handleChange} aria-label="Project details tabs">
                    {projectTabs.map((tab: any, index: number) => (
                        <AntTab key={`${tab}-${index}`} label={tab} {...a11yProps(index)} />
                    ))}
                </AntTabs>
            </Box>
            <CustomTabPanel value={value} index={renoWizard_enabled ? 0 : -1}>
                <RenovationWizardV2 />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={renoWizard_enabled ? 1 : 0}>
                <DesignDocument
                    {...renovationWizard}
                    loading={loading}
                    getUploaderName={getUploaderName}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={renoWizard_enabled ? 2 : 1}>
                <RFPDetails
                    {...RFP}
                    getUploaderName={getUploaderName}
                    bidStatusData={bidStatusData}
                    project={project}
                    organizations={organizations}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={renoWizard_enabled ? 3 : 2}>
                <ProductionDetails {...production} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={renoWizard_enabled ? 4 : 3}>
                <ProjectAnalytics project={project} />
            </CustomTabPanel>
        </Box>
    );
}
