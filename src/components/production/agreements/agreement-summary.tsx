import BaseButton from "components/button";
import DialogBox from "modules/rfp-manager/common/warning-dialog";
import React, { useEffect, useState } from "react";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import { shallowEqual, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import actions from "stores/actions";
import { CREATE_BID_RESPONSE, GET_BID_REQUEST_BY_ID } from "stores/rfp/projects/project-queries";
import { graphQLClient } from "utils/gql-client";
import AddIcon from "@mui/icons-material/Add";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { CREATE_BID_REQUEST } from "stores/projects/details/rfp-manager/rfp-manager-queries";
import CommonDialog from "modules/admin-portal/common/dialog";
import { useAppSelector } from "stores/hooks";
import BaseChip from "components/chip";
import { ReactComponent as EventIcon } from "../../../assets/icons/event.svg";
import { formatDate } from "utils/date-time-convertor";
import { GET_LATEST_RENOVATION_VERSION } from "modules/projects/details/budgeting/bidbook-v2/actions/mutation-contsants";
import { isEmpty } from "lodash";

type IAgreementSummary = {
    disableSubmit: boolean;
};

const AgreementSummary = ({ disableSubmit }: IAgreementSummary) => {
    const { bidRequest, bidResponse, groupedBidItems, selectedVersion } = useAppSelector(
        (state) => ({
            bidRequest: state.rfpService.project.bidRequest,
            bidResponse: state.rfpService.project.bidResponse,
            groupedBidItems: state.biddingPortal.groupedBidItems,
            selectedVersion: state.biddingPortal.selectedVersion,
        }),
        shallowEqual,
    ) as any;

    const [bidRequestItems, setBidRequestItems] = useState<any>([]);
    const [bidResponseItems, setBidResponseItems] = useState<any>([]);
    const [totalProjectCost, setTotalProjectCost] = useState<number | string>("To be Computed");
    const { projectId, agreementId, contractorId } = useParams();
    const userID = localStorage.getItem("user_id");
    const [submitDialog, setSubmitDialog] = useState<boolean>(false);
    const [loadingBidItems, setLoadingBidItems] = useState<boolean>(false);
    const [BidItemsFailed, setBidItemsFailed] = useState<boolean>(false);
    const dispatch = useDispatch();
    const handleSubmitBid = async (): Promise<void> => {
        // We will always submit bid on the latest version
        // Latest version comes from last bid request
        try {
            setSubmitDialog(false);
            await graphQLClient.mutate("createBidResponse", CREATE_BID_RESPONSE, {
                input: {
                    bid_request_id: agreementId,
                    submitted_by: userID,
                    is_submitted: true,
                    total_agreement_cost: totalProjectCost,
                },
            });
            dispatch(
                actions.biddingPortal.unlockProjectForEditingStart({
                    projectId,
                    organization_id: contractorId,
                }),
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleNewVersion = async () => {
        try {
            setLoadingBidItems(true);
            let agreementRequest = bidRequestItems?.filter(
                (request: { type: string }) => request?.type === "agreement",
            );
            //step 1: get latest renovation version
            const res = await graphQLClient.query(
                "LatestRenovationVersion",
                GET_LATEST_RENOVATION_VERSION,
                {
                    projectId: projectId,
                },
            );

            const renovation_version = res?.latestRenovationVersion?.renovation_version ?? 1;

            //step 2 : create bid request
            let data = await graphQLClient.mutate("createBidRequest", CREATE_BID_REQUEST, {
                input: {
                    project_id: projectId,
                    contractor_org_ids: [contractorId],
                    created_by: userID ?? "",
                    reno_item_version: renovation_version,
                    description: "",
                    type: "agreement",
                    agreement_metadata: agreementRequest?.[0]?.agreement_metadata,
                },
                project_id: projectId,
                rfpProjectVersion: "2.0",
            });
            //step 3: poll for the bid item creation status
            let statusInterval = setInterval(async () => {
                let response = await graphQLClient.query(
                    "getBidRequestById",
                    GET_BID_REQUEST_BY_ID,
                    {
                        id: data?.[0]?.id,
                    },
                );

                let status = response?.getbidRequestItemsById?.bid_items_status;
                let reno_version = response?.getbidRequestItemsById?.reno_item_version;
                if (status === "in_progress" || status === "pending") {
                    response = await graphQLClient.query(
                        "getBidRequestById",
                        GET_BID_REQUEST_BY_ID,
                        {
                            id: data?.[0]?.id,
                        },
                    );
                } else if (status === "completed") {
                    // dispatch(
                    //     actions.rfpService.fetchProjectDetailsStart({
                    //         user_id: user_id,
                    //         organization_id: selectedContractor?.id,
                    //     }),
                    // );
                    actions.biddingPortal.setSelectedVersion(
                        `Version ${response?.getbidRequestItemsById?.revision_version}`,
                    ),
                        dispatch(
                            actions.biddingPortal.fetchBidItemsStart({
                                projectId: projectId,
                                contractorOrgId: contractorId,
                                renovationVersion: reno_version,
                            }),
                        );
                    dispatch(
                        actions.biddingPortal.lockProjectForEditingStart({
                            userId: userID,
                            projectId,
                            organization_id: contractorId,
                        }),
                    );
                    dispatch(
                        actions.rfpService.getBidRequestByProjectStart({
                            projectId: projectId,
                            contractorOrgId: contractorId,
                        }),
                    );
                    setLoadingBidItems(false);
                    clearInterval(statusInterval);
                } else if (status === "failed") {
                    clearInterval(statusInterval);
                    setLoadingBidItems(false);
                    setBidItemsFailed(true);
                }
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        dispatch(
            actions.rfpService.getBidRequestByProjectStart({
                projectId: projectId,
                contractorOrgId: contractorId,
            }),
        );
        dispatch(
            actions?.rfpService.getBidResponseStart({
                projectId: projectId,
                contractorOrgId: contractorId,
            }),
        );
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (bidRequest?.length > 0) {
            setBidRequestItems(bidRequest);
            if (isEmpty(selectedVersion)) {
                let newVersion = bidRequest?.[bidRequest?.length - 1]?.revision_version;
                dispatch(actions.biddingPortal.setSelectedVersion(`Version ${newVersion}`));
                handleSelectedVersion(`Version ${newVersion}`);
            }
        }
        //eslint-disable-next-line
    }, [bidRequest]);

    useEffect(() => {
        if (bidResponse?.length > 0) {
            setBidResponseItems(bidResponse);
        }
        //eslint-disable-next-line
    }, [bidResponse]);

    useEffect(() => {
        if (groupedBidItems?.length > 0) {
            let row = groupedBidItems?.[0];
            let totalSum = 0;
            row?.categories.every((category: any) => {
                if (category.totalSum === 0) {
                    totalSum = 0;
                    return false;
                } else {
                    totalSum += category.totalSum;
                    return true;
                }
            });
            setTotalProjectCost(totalSum > 0 ? totalSum : "Not completed");
        }
    }, [groupedBidItems]);

    const handleSelectedVersion = (newValue: any) => {
        dispatch(actions.biddingPortal.setSelectedVersion(newValue));
        let latestVersion = 1;
        let acceptedRequest = bidRequest?.filter(
            (request: { type: string; is_accepted: boolean }) =>
                request?.type !== "bid_request" && request?.is_accepted === true,
        );
        if (acceptedRequest?.length > 0) {
            latestVersion = acceptedRequest?.[acceptedRequest?.length - 1]?.revision_version;
        }
        if (
            newValue !== `Version ${latestVersion}` &&
            !isEmpty(newValue) &&
            bidResponse &&
            bidResponse?.length > 0
        ) {
            dispatch(
                actions.biddingPortal.fetchBidItemsHistoryStart({
                    projectId: projectId,
                    bid_request_id: bidRequestItems?.filter(
                        (item: { version: string }) => `Version ${item?.version}` === newValue,
                    )?.[0]?.id,
                }),
            );
        }
        if (
            newValue === `Version ${latestVersion}` &&
            !isEmpty(newValue) &&
            bidRequest?.length > 0
        ) {
            //Get latest bid items from last bid request reno version
            let acceptedRequest = bidRequest?.filter(
                (request: { is_accepted: boolean }) => request?.is_accepted === true,
            );
            let renoVersion = acceptedRequest?.[acceptedRequest?.length - 1]?.reno_item_version;
            dispatch(
                actions.biddingPortal.fetchBidItemsStart({
                    projectId: projectId,
                    contractorOrgId: contractorId,
                    renovationVersion: renoVersion,
                }),
            );
        }
    };

    return (
        <>
            <CommonDialog
                open={loadingBidItems || BidItemsFailed}
                onClose={() => {
                    setLoadingBidItems(false);
                    setBidItemsFailed(false);
                }}
                loading={loadingBidItems}
                loaderText={"Please wait. Creating bid items..."}
                width="40rem"
                minHeight="26rem"
                error={BidItemsFailed}
                errorText={"Create bid items failed"}
            />
            <DialogBox
                variant="Submit"
                showDialog={submitDialog}
                setShowDialog={setSubmitDialog}
                handleSave={handleSubmitBid}
            />
            <Stack direction={"row"} gap={"20px"}>
                {bidRequestItems[bidRequestItems?.length - 1]?.saved_at && (
                    <>
                        <HandshakeOutlinedIcon sx={{ color: "#004D71" }} />
                        <Typography
                            variant="text_14_regular"
                            color="#757575"
                            sx={{ marginRight: "700px" }}
                        >{`Agreement Amount: $${totalProjectCost}`}</Typography>
                        <BaseChip
                            avatar={<EventIcon />}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                borderRadius: "4px",
                            }}
                            textColor="#00344D"
                            bgcolor="#BCDFEF"
                            label={`Agreement Saved on ${formatDate(
                                bidRequestItems[bidRequestItems?.length - 1]?.saved_at,
                            )}`}
                        />
                    </>
                )}
                {bidResponseItems?.length > 0 && (
                    <Autocomplete
                        sx={{ width: "154px" }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                        disableClearable
                        defaultValue={selectedVersion}
                        //@ts-ignore
                        options={bidResponseItems?.map((item) => {
                            return `Version ${item.version}`;
                        })}
                        onChange={(event: any, newValue: any) => {
                            //@ts-ignore
                            handleSelectedVersion?.(newValue);
                        }}
                    />
                )}
                <BaseButton
                    label={"Save"}
                    classes={`primary ${
                        disableSubmit || bidRequestItems[bidRequestItems?.length - 1]?.saved_at
                            ? "disabled"
                            : "default"
                    }`}
                    onClick={() => setSubmitDialog(true)}
                />
                <BaseButton
                    label={"New version"}
                    classes={`primary default`}
                    onClick={handleNewVersion}
                    startIcon={<AddIcon />}
                />
            </Stack>
        </>
    );
};

export default AgreementSummary;
