import { CheckCircleOutline, DoNotDisturb, Star } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import { GET_ORGANIZATION_SITEWALK_STATUS, GET_PROJECT_FINALISTS } from "./constants";

interface ISitewaInviteStatusProps {
    projectId: string;
    contractorId: string;
}

interface ISitewalkPendingChipProps {
    status: string;
}

interface ICustomButtonProps {
    label: string;
    color: string;
    icon: React.ReactNode;
}

const CustomChip: React.FC<ICustomButtonProps> = ({ label, color, icon }) => {
    return (
        <Button
            disabled={true}
            style={{ color: color, borderColor: color }}
            variant="outlined"
            startIcon={icon}
        >
            {label}
        </Button>
    );
};

const SitewalkPendingChip: React.FC<ISitewalkPendingChipProps> = ({ status }) => {
    switch (status.toLowerCase()) {
        case "pending":
            return <CustomChip label="Sitewalk App" color="#D72B0C" icon={<DoNotDisturb />} />;
        case "invited to sitewalk":
            return (
                <CustomChip label="Sitewalk App" color="#0088C7" icon={<CheckCircleOutline />} />
            );
        case "inprogress":
            return (
                <CustomChip label="Sitewalk App" color="#0088C7" icon={<CheckCircleOutline />} />
            );
        case "completed":
            return (
                <CustomChip label="Sitewalk Done" color="#0F845C" icon={<CheckCircleOutline />} />
            );
        default:
            return <></>;
    }
};

const SitewalkInviteStatus: React.FC<ISitewaInviteStatusProps> = ({ projectId, contractorId }) => {
    const [isFinalist, setIsFinalist] = useState(false);
    const [sitewalkStatus, setSitewalkStatus] = useState("PENDING" as string);
    useEffect(() => {
        getProjectFinalistStatus();
        getSitewalkStatus();
    });

    async function getProjectFinalistStatus() {
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
            setIsFinalist(!!getProjectFinalist);
        } catch (error) {
            console.error(error);
        }
    }

    async function getSitewalkStatus() {
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
            const { status } = getOrganizationSitewalkStatus;
            setSitewalkStatus(status ?? "PENDING");
        } catch (error) {
            console.error(error);
            setSitewalkStatus("PENDING");
        }
    }

    return (
        <Grid container direction="column" gap={2} mb={1}>
            <Grid item>
                {isFinalist && <CustomChip icon={<Star />} color="#916A00" label="Finalist" />}
            </Grid>
            <Grid item>{isFinalist && <SitewalkPendingChip status={sitewalkStatus} />}</Grid>
        </Grid>
    );
};

export default SitewalkInviteStatus;
