import { Grid } from "@mui/material";
import ScrollToTop from "components/scroll-to-top";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import actions from "stores/actions";
import { useAppSelector } from "stores/hooks";
import { GET_DESCRIPTIONS } from "stores/projects/details/rfp-manager/rfp-manager-queries";
import { graphQLClient } from "utils/gql-client";
import useIsAgreement from "../pricing-entry-table/hooks/useIsAgreement";
import CategoryTable from "./category-table";

const FloorplanPriceEntry = () => {
    const { state } = useLocation() as any;
    const dispatch = useDispatch();
    let { projectId, role, userID } = useParams();
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const isAgreement = useIsAgreement(state?.isAgreement, state?.bidRequestItem);
    const [currentRenoversion, setCurrentRenoversion] = React.useState();
    const orgId = state?.organization_id
        ? state?.organization_id
        : (state as any)?.org_id ?? role == "admin"
        ? localStorage.getItem("contractor_org_id") ?? undefined
        : localStorage.getItem("organization_id") ?? undefined;
    const [orgContainerId, setOrgContainerId] = React.useState(null);
    const [projectDetails, setProjectDetails] = useState<(typeof projects)[0] | null>();
    const [descriptions, setDescriptions] = useState<
        {
            resource_type: string;
            resource_id: string;
            description: string;
        }[]
    >([]);
    const { groupedBidItems, bidItemsUpdated, projects, project, floorplans } = useAppSelector(
        (state: any) => ({
            groupedBidItems: state.biddingPortal.groupedBidItems,
            bidItemsUpdated: state.biddingPortal.bidItemsUpdated,
            projects: state.rfpService.project.projectDetails,
            project: state?.projectDetails?.data,
            floorplans: state?.projectFloorplans?.floorplans?.data,
        }),
    );

    const getDescriptions = async () => {
        try {
            const response = await graphQLClient.query("getDescriptions", GET_DESCRIPTIONS, {
                project_id: projectId,
            });

            const descriptions = response?.getDescriptions?.map(
                (des: { description: any; resource_id: any; resource_type: any }) => {
                    return {
                        description: des.description,
                        resource_id: des.resource_id,
                        resource_type: des.resource_type,
                    };
                },
            );

            setDescriptions(descriptions);
        } catch (error) {
            console.error(error);
        }
    };

    const getDescriptionById = (id: string): string => {
        return descriptions?.length > 0
            ? descriptions.find(({ resource_id }: { resource_id: string }) => resource_id === id)
                  ?.description ?? "Further Details in Project Documents"
            : "Further Details in Project Documents";
    };
    useEffect(() => {
        if (floorplans?.length === 0) {
            dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectId }));
        }
        if (projects.length === 0) {
            isAgreement
                ? dispatch(
                      actions.rfpService.fetchProjectDetailsStart({
                          organization_id: orgId,
                      }),
                  )
                : dispatch(
                      actions.rfpService.fetchProjectDetailsStart({
                          user_id: userID,
                      }),
                  );
        }
        dispatch(actions.projectDetails.fetchProjectDetailsStart(projectId));
        //Get latest bid items from last acceptef bid request reno version
        let acceptedRequest = state?.bidRequestItem?.filter(
            (request: { is_accepted: boolean }) => request?.is_accepted === true,
        );
        let agreementRequest = state?.bidRequestItem?.filter(
            (request: { type: string }) => request?.type === "agreement",
        );
        let renoVersion = isAgreement
            ? agreementRequest?.[agreementRequest?.length - 1]?.reno_item_version
            : acceptedRequest?.[acceptedRequest?.length - 1]?.reno_item_version;
        if (!groupedBidItems || groupedBidItems?.length === 0) {
            //Get latest bid items from last accepted bid request reno version
            dispatch(
                actions.biddingPortal.fetchBidItemsStart({
                    projectId: projectId,
                    contractorOrgId: orgId,
                    renovationVersion: renoVersion,
                }),
            );
        }
        setCurrentRenoversion(renoVersion);
        getDescriptions();
        //eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (project?.organisation_container_id) {
            setOrgContainerId(project?.organisation_container_id);
        }
        //eslint-disable-next-line
    }, [project]);
    useEffect(() => {
        if (projects?.length > 0) {
            setProjectDetails(projects.find((project: any) => project.project_id == projectId));
        }
        //eslint-disable-next-line
    }, [projects]);
    return (
        <Grid container direction="column" p="2.75rem 7.5rem" gap="1.25rem">
            {state?.categories?.map(({ category }: { category: string }, idx: number) => (
                <CategoryTable
                    key={idx}
                    category={category}
                    idx={idx}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    groupedBidItems={groupedBidItems}
                    projectDetails={projectDetails}
                    getDescriptionById={getDescriptionById}
                    orgContainerId={orgContainerId}
                    bidItemsUpdated={bidItemsUpdated}
                    currentRenoversion={currentRenoversion}
                />
            ))}
            <ScrollToTop />
        </Grid>
    );
};

export default FloorplanPriceEntry;
