import { Grid, Typography, Box, Divider, FormControlLabel, Paper } from "@mui/material";
import BaseButton from "components/button";
import React, { useState } from "react";
import { IAgreementMetaData } from "./new-agreement";
import { graphQLClient } from "utils/gql-client";
import {
    ASSIGN_PROJECT,
    CREATE_BID_REQUEST,
} from "stores/projects/details/rfp-manager/rfp-manager-queries";
import { GET_BID_REQUEST_BY_ID } from "stores/rfp/projects/project-queries";
import actions from "stores/actions";
import { shallowEqual, useDispatch } from "react-redux";
import CommonDialog from "modules/admin-portal/common/dialog";
import { useNavigate } from "react-router-dom";
import BaseCheckbox from "components/checkbox";
import AutoComplete from "components/auto-complete";
import { productionTabUrl } from "../constants";
import { useAppSelector } from "stores/hooks";
import { useProductionContext } from "context/production-context";
import { GET_LATEST_RENOVATION_VERSION } from "modules/projects/details/budgeting/bidbook-v2/actions/mutation-contsants";

type IFloorPlans = {
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    allFloorplanGroups: any[];
    selectedContractor: {
        id: string;
        name: string;
    };
    agreementMetadata: IAgreementMetaData;
    setAgreementMetadata: React.Dispatch<React.SetStateAction<IAgreementMetaData>>;
    projectId: string;
};

const FloorPlans = ({
    allFloorplanGroups,
    selectedContractor,
    agreementMetadata,
    setAgreementMetadata,
    projectId,
}: IFloorPlans) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isRFPProject } = useProductionContext();

    const { projectDetails } = useAppSelector((state) => {
        return {
            projectDetails: state.singleProject.projectDetails,
        };
    }, shallowEqual);
    const user_id = localStorage.getItem("user_id");
    //eslint-disable-next-line
    const [loadingBidItems, setLoadingBidItems] = useState<boolean>(false);
    const [BidItemsFailed, setBidItemsFailed] = useState<boolean>(false);
    const [errorText, setErrorText] = useState("");

    type Option = (typeof allFloorplanGroups)[number];
    const [columns, setColumns] = useState<Option[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [options, setOptions] = useState<Option[]>(allFloorplanGroups ?? []);

    const handleToggleSelectAll = () => {
        setSelectAll((prev) => {
            if (!prev) {
                let updatedList = allFloorplanGroups?.map((group) => {
                    let item = group?.[0];
                    return {
                        id: `${item?.property_unit_floor_plan_id}:${item?.inventory_id}:${item?.sub_group_id}`,
                        name: `${item?.floorplan_name}:${item?.inventory_name}:${item?.floor}`,
                    };
                });
                setColumns([...updatedList]);
            } else setColumns([]);
            return !prev;
        });
    };
    async function assignProjectToContractor() {
        try {
            await graphQLClient.mutate("assignProjectsToContractorOrEstimator", ASSIGN_PROJECT, {
                input: {
                    add_organization: true,
                    contractors: [
                        {
                            contractor_id: "",
                            organization_id: selectedContractor?.id,
                        },
                    ],
                    project_id: projectId,
                    rfp_project_version: "2.0",
                    is_demand_side: false,
                },
            });
        } catch (error) {
            console.error("Failed to add contractor");
        }
    }
    // const updateSelectedFloorplanGroup = (fp_group: { id: string; name: string }) => {
    //     if (selectedFloorplanGroups?.some((selected) => selected?.id === fp_group?.id)) {
    //         // Create a new array without the type (material or labor) item
    //         const updatedGroup = selectedFloorplanGroups?.filter(
    //             (selected) => selected?.id !== fp_group?.id,
    //         );
    //         setSelectedFloorplanGroups(updatedGroup);
    //     } else {
    //         // Create a new array with the type (material or labor) added
    //         const updatedGroup = [...selectedFloorplanGroups, fp_group];
    //         setSelectedFloorplanGroups(updatedGroup);
    //     }
    // }
    const handleCreateAgreement = async () => {
        try {
            setLoadingBidItems(true);
            const updatedAgreementMetadata = {
                ...agreementMetadata,
                floor_inv_subgroups: columns?.map((group) => group?.id),
            };
            setAgreementMetadata(updatedAgreementMetadata);
            //make call to add new contractor
            await assignProjectToContractor();

            //step 1: get latest renovation version
            const res = await graphQLClient.query(
                "LatestRenovationVersion",
                GET_LATEST_RENOVATION_VERSION,
                {
                    projectId: projectId,
                },
            );

            if (!res?.latestRenovationVersion?.renovation_version) {
                setErrorText("Create bid items failed. Bid Setup is Pending!");
                setBidItemsFailed(true);
                setLoadingBidItems(false);
                return;
            }

            const renovation_version = res?.latestRenovationVersion?.renovation_version ?? 1;

            //step 2 : create bid request
            const agreementInfo = await graphQLClient.mutate(
                "createBidRequest",
                CREATE_BID_REQUEST,
                {
                    input: {
                        //To-do: get this from url
                        project_id: projectDetails?.id,
                        contractor_org_ids: [selectedContractor?.id],
                        created_by: user_id ?? "",
                        reno_item_version: renovation_version,
                        description: "",
                        type: "agreement",
                        agreement_metadata: updatedAgreementMetadata,
                    },
                    project_id: projectDetails?.id,
                    rfpProjectVersion: "2.0",
                },
            );
            //step 3: poll for the bid item creation status
            let statusInterval = setInterval(async () => {
                let response = await graphQLClient.query(
                    "getBidRequestById",
                    GET_BID_REQUEST_BY_ID,
                    {
                        id: agreementInfo?.[0]?.id,
                    },
                );

                let status = response?.getBidRequestById?.bid_items_status;
                let reno_version = response?.getBidRequestById?.reno_item_version;
                if (status === "in_progress" || status === "pending") {
                    response = await graphQLClient.query(
                        "getBidRequestById",
                        GET_BID_REQUEST_BY_ID,
                        {
                            id: agreementInfo?.[0]?.id,
                        },
                    );
                } else if (status === "completed") {
                    // dispatch(
                    //     actions.rfpService.fetchProjectDetailsStart({
                    //         user_id: user_id,
                    //         organization_id: selectedContractor?.id,
                    //     }),
                    // );
                    dispatch(
                        actions.biddingPortal.fetchBidItemsStart({
                            projectId: projectId,
                            contractorOrgId: selectedContractor?.id,
                            renovationVersion: reno_version,
                        }),
                    );
                    dispatch(
                        actions.biddingPortal.lockProjectForEditingStart({
                            userId: user_id,
                            projectId,
                            organization_id: selectedContractor?.id,
                        }),
                    );
                    dispatch(
                        actions.rfpService.getBidRequestByProjectStart({
                            projectId: projectId,
                            contractorOrgId: selectedContractor?.id,
                        }),
                    );
                    setLoadingBidItems(false);
                    clearInterval(statusInterval);
                    //step 3: if success return bid items or else show error loader
                    navigate(
                        `${productionTabUrl(projectId, isRFPProject)}/agreements/${
                            agreementInfo?.[0]?.id
                        }/${selectedContractor?.id}/${selectedContractor?.name}`,
                    );
                } else if (status === "failed") {
                    clearInterval(statusInterval);
                    setLoadingBidItems(false);
                    setBidItemsFailed(true);
                }
            }, 1000);
        } catch (error) {
            setBidItemsFailed(true);
            setLoadingBidItems(false);
            console.log(error);
        }
    };
    return (
        <>
            <CommonDialog
                open={loadingBidItems || BidItemsFailed}
                onClose={() => {
                    setLoadingBidItems(false);
                    setBidItemsFailed(false);
                    setErrorText("");
                }}
                loading={loadingBidItems}
                loaderText={"Please wait. Creating bid items..."}
                width="40rem"
                minHeight="26rem"
                error={BidItemsFailed}
                errorText={errorText || "Create bid items failed"}
            />
            <Grid
                container
                direction={"column"}
                justifyContent="center"
                alignItems={"center"}
                gap={10}
                alignSelf="stretch"
            >
                <Grid item>
                    {
                        <Typography variant="text_16_medium" sx={{ color: "#757575" }}>
                            {"Which floor plans will this contractor be working with?"}
                        </Typography>
                    }
                </Grid>
                <Grid item>
                    <Grid
                        container
                        sx={{ display: "inline-flex", alignItems: "center", gap: "16px" }}
                    >
                        <Grid item>
                            <AutoComplete
                                sx={{ width: "900px" }}
                                labelComponent={
                                    <div style={{ marginBottom: "4px" }}>
                                        <Typography variant="text_14_medium" color="#202223">
                                            {"Floorplan:inventory:subgroup"}
                                        </Typography>
                                    </div>
                                }
                                id={"autocomplete_with_select_all"}
                                multiple
                                options={options}
                                fullWidth
                                disableCloseOnSelect
                                filterSelectedOptions
                                freeSolo={false}
                                value={columns?.map((column) => column?.name)}
                                renderOption={(props: any, option: any) => {
                                    return (
                                        <li {...props} key={option?.[0]?.id}>
                                            {`${option?.[0]?.floorplan_name}:${option?.[0]?.inventory_name}:${option?.[0]?.floor}`}
                                        </li>
                                    );
                                }}
                                onChange={(_e: any, value: any, reason: any) => {
                                    if (reason === "clear" || reason === "removeOption") {
                                        setSelectAll(false);
                                        // let item = value[value?.length - 1];
                                        // let id = `${item?.[0]?.property_unit_floor_plan_id}:${item?.[0]?.inventory_id}:${item?.[0]?.sub_group_id}`;
                                        // const updatedGroup = columns?.filter(
                                        //     (selected: any) => selected?.id !== id,
                                        // );
                                        let updatedColumns =
                                            value?.length === 0
                                                ? value
                                                : columns?.filter(
                                                      (column) => column?.name != value?.[0],
                                                  );
                                        setColumns(updatedColumns);
                                    }

                                    if (reason === "selectOption") {
                                        if (value?.length === allFloorplanGroups?.length) {
                                            setSelectAll(true);
                                        }
                                        if (value[value?.length - 1] !== undefined) {
                                            let item = value[value?.length - 1];
                                            setColumns([
                                                ...columns,
                                                {
                                                    id: `${item?.[0]?.property_unit_floor_plan_id}:${item?.[0]?.inventory_id}:${item?.[0]?.sub_group_id}`,
                                                    name: `${item?.[0]?.floorplan_name}:${item?.[0]?.inventory_name}:${item?.[0]?.floor}`,
                                                },
                                            ]);
                                        }
                                        setOptions(options);
                                    }
                                    //setColumns(value);
                                }}
                                // renderInput={(params: any) => (
                                //     <TextField {...params} />
                                // )}
                                PaperComponent={(paperProps: any) => {
                                    const { children, ...restPaperProps } = paperProps;
                                    return (
                                        <Paper {...restPaperProps}>
                                            <Box
                                                onMouseDown={(e) => e.preventDefault()} // prevent blur
                                                pl={1.5}
                                                py={0.5}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <FormControlLabel
                                                    onClick={(e) => {
                                                        e.preventDefault(); // prevent blur
                                                        handleToggleSelectAll();
                                                    }}
                                                    label="Select all"
                                                    control={
                                                        <BaseCheckbox
                                                            id="select-all-checkbox"
                                                            checked={selectAll}
                                                            sx={{ marginRight: "10px" }}
                                                        />
                                                    }
                                                />
                                            </Box>
                                            <Divider />
                                            {children}
                                        </Paper>
                                    );
                                }}
                                variant={"filled"}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <BaseButton
                        classes={columns?.length > 0 ? "primary default" : "primary disabled"}
                        label="Create Agreement"
                        onClick={handleCreateAgreement}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default FloorPlans;
