import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BaseButton from "components/button";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import moment from "moment";
import CommonDialog from "modules/admin-portal/common/dialog";
import { useAppSelector } from "stores/hooks";
import BaseChip from "components/chip";
import { ReactComponent as CheckCircle } from "../../../assets/icons/check_circle.svg";
import { graphQLClient } from "utils/gql-client";
import { GET_BID_REQUEST_BY_ID } from "stores/rfp/projects/project-queries";
import { useParams, useSearchParams } from "react-router-dom";

interface IRequestRevision {
    requestRevisions: any;
    projectId: string | undefined;
    organization_id: string;
    selectedVersion: string;
    bidResponseItem: any[];
    bidRequestItem: any[];
    setLoadingBidItems: React.Dispatch<React.SetStateAction<boolean>>;
    setBidItemsFailed: React.Dispatch<React.SetStateAction<boolean>>;
    setCreateBidItemsFailed: React.Dispatch<React.SetStateAction<boolean>>;
}

const RequestRevision = ({
    requestRevisions,
    projectId,
    organization_id,
    bidResponseItem,
    selectedVersion,
    setLoadingBidItems,
    bidRequestItem,
    setBidItemsFailed,
    setCreateBidItemsFailed,
}: IRequestRevision) => {
    const dispatch = useDispatch();
    const { userID } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const userRole = localStorage.getItem("role");
    const handleAcceptance = () => {
        try {
            setLoadingBidItems(true);
            dispatch(
                actions.rfpService.acceptBidRequestByIdStart({
                    Id: requestRevisions?.id,
                    respondedBy: userID,
                    projectId: projectId,
                    contractorOrgId: organization_id,
                    bid_response_id: bidResponseItem?.filter(
                        (item) => item?.version === selectedVersion,
                    )?.[0]?.bid_response_id,
                    renovationVersion: requestRevisions?.reno_item_version,
                }),
            );
            let statusInterval = setInterval(async () => {
                let response = await graphQLClient.query(
                    "getBidRequestById",
                    GET_BID_REQUEST_BY_ID,
                    {
                        id: requestRevisions?.id,
                    },
                );

                let status = response?.getBidRequestById?.bid_items_status;
                let reno_version = response?.getBidRequestById?.reno_item_version;
                if (status === "in_progress" || status === "pending") {
                    response = await graphQLClient.query(
                        "getBidRequestById",
                        GET_BID_REQUEST_BY_ID,
                        {
                            id: requestRevisions?.id,
                        },
                    );
                } else if (status === "completed") {
                    dispatch(
                        actions.biddingPortal.setSelectedVersion(
                            `Version ${requestRevisions.revision_version}`,
                        ),
                    );
                    if (userRole === "admin") {
                        let search: Record<string, string> = {};
                        searchParams.forEach((val: string, key: string) => {
                            search[key] = val;
                        });
                        setSearchParams({
                            ...search,
                            version: requestRevisions.revision_version,
                            isLatest: "true",
                        });
                    }
                    dispatch(
                        actions.rfpService.fetchProjectDetailsStart({
                            user_id: userID,
                            organization_id: organization_id,
                        }),
                    );
                    dispatch(
                        actions.biddingPortal.fetchBidItemsStart({
                            projectId: projectId,
                            contractorOrgId: organization_id,
                            renovationVersion: reno_version,
                        }),
                    );
                    //TODO: remove reno version from here and add condition based on version
                    if (reno_version && reno_version != 1) {
                        dispatch(
                            actions.biddingPortal.fetchDiffFromRenovationVersionStart({
                                projectId: projectId,
                                renovationVersion: reno_version,
                                bidResponse: bidRequestItem?.find(
                                    (val: any) =>
                                        val.revision_version ===
                                        parseInt(
                                            (parseInt(selectedVersion, 10) - 1).toFixed(0),
                                            10,
                                        ),
                                ),
                                contractor_org_id: organization_id,
                            }),
                        );
                    }
                    setLoadingBidItems(false);
                    setCreateBidItemsFailed(false);
                    clearInterval(statusInterval);
                } else if (status === "failed") {
                    clearInterval(statusInterval);
                    setLoadingBidItems(false);
                    setBidItemsFailed(true);
                    setCreateBidItemsFailed(true);
                }
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    const { loading } = useAppSelector((state) => ({
        loading: state.rfpService.project.loading,
    }));

    return (
        <>
            <CommonDialog
                open={loading ?? false}
                onClose={() => {}}
                loading={loading}
                loaderText={"Please wait. Acknowledgment is being captured."}
                width="40rem"
                minHeight="26rem"
            />
            <Accordion
                defaultExpanded={requestRevisions?.is_accepted ? false : true}
                sx={{
                    border: requestRevisions?.is_accepted ? "1px solid #CCC" : "1px solid #916A00",
                    borderRadius: "4px",
                    background: requestRevisions?.is_accepted ? "#FFF" : "#FFF5EA",
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Stack direction="row" gap={4}>
                        <Typography
                            variant={"text_18_medium"}
                            sx={{ color: requestRevisions?.is_accepted ? "#232323" : "#916A00" }}
                        >{`REVISION REQUEST ${(
                            requestRevisions?.revision_version ?? 0
                        ).toLocaleString("en-us")}`}</Typography>
                        {requestRevisions?.is_accepted && (
                            <BaseChip
                                icon={<CheckCircle />}
                                label={"Acknowledged"}
                                bgcolor={"#AEE9D1"}
                                textColor={"#00B779"}
                                sx={{ fontSize: "14px", fontWeight: 500, fontFamily: "Roboto" }}
                            />
                        )}
                    </Stack>
                </AccordionSummary>
                <Divider
                    sx={{
                        borderColor: requestRevisions?.is_accepted ? "#CCC" : "#916A00",
                        marginLeft: "8px",
                        marginRight: "8px",
                    }}
                />
                <AccordionDetails>
                    <Stack gap={4}>
                        <Typography
                            variant={"text_14_regular"}
                            sx={{ marginTop: "4px" }}
                        >{`${requestRevisions?.description}`}</Typography>
                        <Typography
                            variant={"text_14_regular"}
                            sx={{ color: "#757575" }}
                        >{`Comment added ${moment(requestRevisions?.created_at).format(
                            "MM/DD/YYYY",
                        )} by ${requestRevisions?.created_by}`}</Typography>
                        {requestRevisions?.is_accepted !== true && (
                            <BaseButton
                                classes={"primary default"}
                                onClick={handleAcceptance}
                                label={"Mark as Acknowledged "}
                                sx={{ width: "196px" }}
                            />
                        )}
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default RequestRevision;
