import { AssessmentOutlined, Star } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import { GENERATE_SITEWALK_REPORT, GET_PROJECT_FINALISTS, SELECT_AS_FINALIST } from "./constants";
import { CircularProgress } from "@mui/material";

interface ISelectAsFinalistProps {
    showInMenu: boolean;
    contractorId: string;
    projectId: string;
    contractorName: string;
    onSiteWalkInvite: Function;
}

const SelectAsFinalist: React.FC<ISelectAsFinalistProps> = ({
    showInMenu,
    contractorId,
    projectId,
    contractorName,
    onSiteWalkInvite,
}) => {
    const [isFinalist, setIsFinalist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const checkIsFinalist = async () => {
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
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        checkIsFinalist();
        // eslint-disable-next-line
    }, []);
    const markFinalist = async () => {
        setIsLoading(true);
        try {
            await graphQLClient.mutate("SelectAsProjectFinalist", SELECT_AS_FINALIST, {
                projectId,
                organizationId: contractorId,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const inviteToSitewalkApp = () => {
        onSiteWalkInvite({
            organization_id: contractorId,
            project_id: projectId,
            organization_name: contractorName,
            isOpen: true,
        });
    };

    async function generateSitewalkReport() {
        setIsLoading(true);
        try {
            await graphQLClient.mutate("SelectAsProjectFinalist", GENERATE_SITEWALK_REPORT, {
                projectId,
                organizationId: contractorId,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <GridActionsCellItem
                placeholder=""
                icon={<CircularProgress size={12} />}
                label="..."
                onClick={() => {}}
                showInMenu={showInMenu}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
            />
        );
    }
    if (!isFinalist) {
        return (
            <GridActionsCellItem
                placeholder=""
                icon={<Star htmlColor="#57B6B2" />}
                label="Select as Finalist"
                onClick={markFinalist}
                showInMenu={showInMenu}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
            />
        );
    }

    return (
        <>
            <GridActionsCellItem
                placeholder=""
                icon={<Star htmlColor="#57B6B2" />}
                label="Invite to Sitewalk App"
                onClick={inviteToSitewalkApp}
                showInMenu={showInMenu}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
            />
            <GridActionsCellItem
                placeholder=""
                icon={<AssessmentOutlined htmlColor="#57B6B2" />}
                label="Generate Sitewalk Report"
                onClick={generateSitewalkReport}
                showInMenu={showInMenu}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
            />
        </>
    );
};

export default SelectAsFinalist;
