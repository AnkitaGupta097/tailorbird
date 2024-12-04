import { Avatar, Divider, Grid, Link, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { AGREEMENT_STEPS } from "../constants";
import AddContractor from "./add-contractor";
import WorkType from "./work-type";
import { graphQLClient } from "utils/gql-client";
import Categories from "./categories";
import { CONTAINER_CATEGORY_QUERY } from "components/container-admin-interface/constants";
import FloorPlans from "./floor-plans";
import { GET_UNIT_MIXES } from "stores/projects/details/floor-plans/floor-plans-queries";
import { useParams } from "react-router-dom";

export type IAgreementMetaData = {
    work_type: string[];
    categories: any[];
    floor_inv_subgroups: string[];
};

export type INewAgreement = {
    contractors: any[];
};

const NewAgreement = ({ contractors }: INewAgreement) => {
    const { projectId } = useParams();
    const [activeStep, setActiveStep] = useState(1);
    const [containerCategories, setContainerCategories] = useState<any[]>([]);
    const [selectedContractor, setSelectedContractor] = useState<any>({
        id: "",
        name: "",
    });
    const [selectedType, setSelectedType] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [unitMixes, setUnitMixes] = useState<{
        getUnitMixes: any[];
        getFloorPlanSubGroup: any[];
    }>({
        getUnitMixes: [],
        getFloorPlanSubGroup: [],
    });
    const [agreementMetadata, setAgreementMetadata] = useState<IAgreementMetaData>({
        work_type: [],
        categories: [],
        floor_inv_subgroups: [],
    });
    async function getContainerCategories() {
        const containerCategories: {
            getCategories: any[];
        } = await graphQLClient.query("getCategories", CONTAINER_CATEGORY_QUERY);
        setContainerCategories(containerCategories?.getCategories);
    }
    async function getUnitMix() {
        const unitMixes: {
            getUnitMixes: any[];
            getFloorPlanSubGroup: any[];
        } = await graphQLClient.query("getUnitMixes", GET_UNIT_MIXES, {
            projectId: projectId,
        });

        setUnitMixes(unitMixes);
    }

    const allFloorplanGroups = useMemo(() => {
        const floorMap = new Map<string, string>();
        unitMixes?.getFloorPlanSubGroup?.forEach((item) => {
            floorMap.set(item.name?.toLowerCase(), item.id);
        });

        const updatedUnitMixes = unitMixes?.getUnitMixes?.map((item) => ({
            ...item,
            sub_group_id: floorMap.get(item.floor),
        }));
        //get all floorplans + inventory + sub and group them
        const groupedData = updatedUnitMixes?.reduce((groups, item) => {
            const key = `${item.inventory_id}-${item.property_unit_floor_plan_id}-${item.sub_group_id}`;

            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(item);
            return groups;
        }, {});
        return Object.values(groupedData);
    }, [unitMixes?.getFloorPlanSubGroup, unitMixes?.getUnitMixes]);

    useEffect(() => {
        if (containerCategories?.length === 0) getContainerCategories();
        getUnitMix();
        //eslint-disable-next-line
    }, []);

    return (
        <Grid container direction={"column"} gap={"20px"} height="100%">
            <Grid item>
                <Typography variant="text_24_medium">{"New Agreement"}</Typography>
            </Grid>
            <Grid item>
                <Divider />
            </Grid>
            <Grid
                item
                sx={{
                    display: "flex",
                    padding: "20px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "48px",
                    flexShrink: 0,
                    borderRadius: "4px",
                    border: "1px solid #C9CCCF",
                }}
            >
                <Grid container>
                    <Grid item sx={{ marginBottom: "24px" }} direction={"row"} xs={12}>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={10} lg={10}>
                                <Grid container alignItems={"center"}>
                                    {AGREEMENT_STEPS?.map((step, index) => {
                                        return (
                                            <Stack
                                                key={index}
                                                direction={"row"}
                                                alignItems="center"
                                            >
                                                {activeStep <= index + 1 ? (
                                                    <Avatar
                                                        style={{
                                                            backgroundColor:
                                                                activeStep === index + 1
                                                                    ? "#004D71"
                                                                    : "#FFFFFF",
                                                            width: "32px",
                                                            height: "32px",
                                                            fontSize: 14,
                                                            fontWeight: 500,
                                                            color:
                                                                activeStep === index + 1
                                                                    ? "#FFFFFF"
                                                                    : "#757575",
                                                            border:
                                                                activeStep === index + 1
                                                                    ? "1.5px solid #004D71"
                                                                    : "1.5px solid #757575",
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Avatar>
                                                ) : (
                                                    <CheckCircleIcon htmlColor="#00B779" />
                                                )}
                                                <Link
                                                    onClick={() => {
                                                        setActiveStep(index + 1);
                                                    }}
                                                    underline="none"
                                                >
                                                    <Typography
                                                        variant="text_14_bold"
                                                        sx={{
                                                            color:
                                                                activeStep === index + 1
                                                                    ? "#004D71"
                                                                    : "#757575",
                                                        }}
                                                    >
                                                        {step}
                                                    </Typography>
                                                </Link>
                                                {index != AGREEMENT_STEPS?.length - 1 && (
                                                    <ArrowForwardIosRoundedIcon
                                                        htmlColor="#757575"
                                                        sx={{ paddingRight: "6px" }}
                                                    />
                                                )}
                                            </Stack>
                                            // </Grid>
                                        );
                                    })}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {activeStep === 1 && (
                            <AddContractor
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                contractors={contractors}
                                selectedContractor={selectedContractor}
                                setSelectedContractor={setSelectedContractor}
                            />
                        )}
                        {activeStep === 2 && (
                            <WorkType
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                selectedType={selectedType}
                                setSelectedType={setSelectedType}
                                agreementMetadata={agreementMetadata}
                                setAgreementMetadata={setAgreementMetadata}
                            />
                        )}
                        {activeStep === 3 && (
                            <Categories
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                containerCategories={containerCategories}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                agreementMetadata={agreementMetadata}
                                setAgreementMetadata={setAgreementMetadata}
                            />
                        )}
                        {activeStep === 4 && projectId && (
                            <FloorPlans
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                allFloorplanGroups={allFloorplanGroups}
                                selectedContractor={selectedContractor}
                                agreementMetadata={agreementMetadata}
                                setAgreementMetadata={setAgreementMetadata}
                                projectId={projectId}
                            />
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default NewAgreement;
