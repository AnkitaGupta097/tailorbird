import { Grid, Stack } from "@mui/material";
import { chain } from "lodash";
import ZeroStateComponent from "components/zero-state-component";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AgreementFilters from "./agreement-filters";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchBar from "./search-bar";
import AgreementCard from "./agreement-card";
import { graphQLClient } from "utils/gql-client";
import { GET_ALL_ORGANIZATIONS } from "stores/ims/queries";
import { formatDate } from "utils/date-time-convertor";
import { GET_BID_REQUEST_BY_PROJECT } from "stores/rfp/projects/project-queries";
import { productionTabUrl } from "../constants";
import { useProductionContext } from "context/production-context";
import TrackerUtil from "utils/tracker";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";

const Agreements = () => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isRFPProject } = useProductionContext();

    const [agreementList, setAgreementList] = useState<any[]>([]);
    const [filteredList, setFilteredList] = useState<any[]>([]);
    const [contractors, setContractors] = useState<any[]>([]);
    const [filter, setFilter] = useState<any>(undefined);
    const [liveAgreementTotalCost, setLiveAgreementTotalCost] = useState<any>(undefined);

    const { projectDetails, liveAgreement, liveAgreementLoading } = useAppSelector(
        (state) => ({
            projectDetails: state.singleProject.projectDetails,
            liveAgreement: state.agreementState.liveAgreement,
            liveAgreementLoading: state.agreementState.loading,
        }),
        shallowEqual,
    );

    async function getBidRequestByProject() {
        try {
            const response = await graphQLClient.query(
                "getBidRequestByProject",
                GET_BID_REQUEST_BY_PROJECT,
                {
                    projectId,
                    type: "agreement",
                },
            );
            //const response = bidRequestByProject;
            setAgreementList(response?.getBidRequestByProject);
            //setLoading(false);
        } catch (error) {
            //setError(true);
            //setLoading(false);
        }
    }
    async function fetchContractorList() {
        try {
            const response = await graphQLClient.query(
                "getAllOrganizations",
                GET_ALL_ORGANIZATIONS,
                {
                    input: "Contractor",
                },
            );
            setContractors(response?.getAllOrganizations);
            //setLoading(false);
        } catch (error) {
            //setError(true);
            //setLoading(false);
        }
    }

    useEffect(() => {
        if (liveAgreement) {
            setLiveAgreementTotalCost(
                chain(liveAgreement.floor_plans).flatMap("scopes").sumBy("price").value(),
            );
        }
    }, [liveAgreement]);

    useEffect(() => {
        TrackerUtil.event("PRODUCTION_AGREEMENTS_SCREEN", {
            projectId,
            projectName: projectDetails?.name,
        });
        if (agreementList?.length === 0) getBidRequestByProject();
        if (contractors?.length === 0) fetchContractorList();

        dispatch(
            actions.production.agreements.fetchLiveAgreementStart({
                projectId,
            }),
        );
        //eslint-disable-next-line
    }, []);

    const groupedAgreementList = useMemo(() => {
        if (agreementList?.length > 0 && contractors?.length > 0) {
            // Create a Map to store the latest saved_at date for each contractor_org_id
            const latestAgreementMap = new Map<string, any>();
            agreementList.forEach((agreement) => {
                //find contractor_ord_id in list of contractors
                const contractorDetails = contractors?.find(
                    (contractor) => contractor?.id === agreement?.contractor_org_id,
                );
                let updatedAgreement = {
                    ...agreement,
                    contractor_name: contractorDetails?.name ? contractorDetails?.name : "",
                    contractor_email: contractorDetails?.google_workspace_email
                        ? contractorDetails?.google_workspace_email
                        : "",
                    contractor_contact: contractorDetails?.contact_number
                        ? contractorDetails?.contact_number
                        : "",
                };
                const { contractor_org_id, saved_at } = updatedAgreement;

                // Check if the agreement is the latest for the contractor_org_id
                if (!latestAgreementMap.has(contractor_org_id)) {
                    latestAgreementMap.set(contractor_org_id, updatedAgreement);
                } else {
                    const existingAgreement = latestAgreementMap.get(contractor_org_id);

                    // Check if the existing agreement has saved_at as null or if saved_at is later
                    if (
                        existingAgreement.saved_at !== null &&
                        (saved_at === null || saved_at > existingAgreement.saved_at)
                    ) {
                        latestAgreementMap.set(contractor_org_id, updatedAgreement);
                    }
                }
            });

            // Extract the values (latest agreement objects) from the Map
            const uniqueAgreements: any[] = Array.from(latestAgreementMap.values());
            setFilteredList(uniqueAgreements);
            return uniqueAgreements;
        }
    }, [agreementList, contractors]);

    const AgreementCards = () => {
        return projectId ? (
            <>
                {filteredList?.map((agreement) => {
                    return (
                        <Grid item key={agreement?.id}>
                            <AgreementCard
                                isSavedAgreement={true}
                                contractorName={agreement?.contractor_name}
                                savedAt={
                                    agreement?.saved_at !== null && agreement?.saved_at
                                        ? formatDate(agreement?.saved_at)
                                        : agreement?.saved_at
                                }
                                contractorEmail={agreement?.contractor_email}
                                contractorContact={agreement?.contractor_contact}
                                agreementAmount={
                                    agreement?.agreement_metadata?.total_agreement_cost
                                }
                                categories={agreement?.agreement_metadata?.categories.join()}
                                contractorId={agreement?.contractor_org_id}
                                projectId={projectId}
                                agreementId={agreement?.id}
                                projectName={projectDetails?.name}
                            />
                        </Grid>
                    );
                })}
            </>
        ) : null;
    };

    const LiveAgreementCard = () => {
        return !filter || filter === "live" ? (
            <Grid item>
                <AgreementCard
                    isSavedAgreement={false}
                    contractorName={"Live Agreement"}
                    onClick={() => {
                        TrackerUtil.event("CLICKED_LIVE_AGREEMENT", {
                            projectName: projectDetails?.name,
                        });
                        navigate(
                            `${productionTabUrl(
                                projectId,
                                isRFPProject,
                            )}/agreements/live_agreement`,
                        );
                    }}
                    contractorEmail={""}
                    contractorContact={""}
                    agreementAmount={
                        liveAgreementTotalCost ? liveAgreementTotalCost.toString() : "-"
                    }
                    contractorId={""}
                    projectId={projectId}
                    agreementId={""}
                    isLiveAgreementLoading={liveAgreementLoading}
                />
            </Grid>
        ) : null;
    };

    const ZeroState = () => {
        return (
            <Grid item xs={12}>
                <Grid
                    container
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        padding: "68px 512px",
                        background: "#FFFFFF",
                        gap: "20px",
                    }}
                >
                    <Grid item>
                        <ZeroStateComponent label="No existing agreements" />
                    </Grid>
                    {/* <Grid item>
                        <BaseButton
                            onClick={() => {
                                setNewAgreement(true);
                            }}
                            label={"New Agreement"}
                            classes="primary default"
                            startIcon={<AddIcon />}
                        />
                    </Grid> */}
                </Grid>
            </Grid>
        );
    };

    // const [newAgreement, setNewAgreement] = useState<boolean>(false);
    return (
        <Grid container sx={{ marginTop: "32px", height: "100%" }}>
            <Grid container gap={"16px"}>
                <Grid item flex={1}>
                    <AgreementFilters
                        agreementList={groupedAgreementList ?? []}
                        setFilteredList={setFilteredList}
                        setFilter={setFilter}
                    />
                </Grid>
                <Grid item flex={5}>
                    <Grid container flexDirection="column">
                        <Grid item>
                            <Grid
                                container
                                direction="row"
                                sx={{
                                    display: "flex",
                                    paddingRight: "0px",
                                    alignItems: "flex-start",
                                    alignSelf: "stretch",
                                    gap: "20px",
                                }}
                            >
                                <Grid item xs={9}>
                                    <Stack
                                        direction={"row"}
                                        sx={{
                                            display: "flex",
                                            paddingLeft: "0px",
                                            alignItems: "center",
                                            gap: "12px",
                                            flex: "1 0 0",
                                        }}
                                    >
                                        <FilterListIcon
                                            htmlColor="#004D71"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        />
                                        <SearchBar
                                            agreementList={groupedAgreementList ?? []}
                                            setFilteredList={setFilteredList}
                                        />
                                    </Stack>
                                </Grid>
                                {/* <Grid
                                    item
                                    xs={2}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <BaseButton
                                        classes={"primary default"}
                                        onClick={() => {
                                            setNewAgreement(true);
                                        }}
                                        label={"New Agreement"}
                                        startIcon={<AddIcon />}
                                    />
                                </Grid> */}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container gap={"20px"}>
                                {!filter ? (
                                    <>
                                        <AgreementCards />
                                        <LiveAgreementCard />
                                    </>
                                ) : filter === "live" ? (
                                    <LiveAgreementCard />
                                ) : groupedAgreementList && groupedAgreementList?.length > 0 ? (
                                    <AgreementCards />
                                ) : (
                                    <ZeroState />
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Agreements;
