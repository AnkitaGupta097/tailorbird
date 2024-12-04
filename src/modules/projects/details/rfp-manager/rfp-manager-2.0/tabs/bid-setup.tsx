import { Avatar, Grid, Link, Stack, Typography } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import React, { useEffect, useState } from "react";
import ProjectInfo from "./bid-setup/project-info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InventoryInfo from "./bid-setup/inventory-info";
import ScopeInfo from "./bid-setup/scope-info";
import BidInfo from "./bid-setup/bid-info";
import SetupCompletion from "./bid-setup/setup-completion";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { graphQLClient } from "utils/gql-client";
import { GET_DESCRIPTIONS } from "stores/projects/details/rfp-manager/rfp-manager-queries";
import { CONTAINER_CATEGORY_QUERY } from "components/container-admin-interface/constants";
import { isEmpty } from "lodash";
import actions from "stores/actions";

const BidSetupSteps = [
    "Project information",
    "Inventory information",
    "Scope information",
    "Bid information",
];

interface IBidSetup {
    setIsBidSetup: React.Dispatch<React.SetStateAction<boolean>>;
}

const BidSetup = ({ setIsBidSetup }: IBidSetup) => {
    const [activeStep, setActiveStep] = useState(1);
    let [descriptions, setDescriptions] = useState<
        {
            resource_type: string;
            resource_id: string;
            description: string;
        }[]
    >([]);
    const {
        organization,
        projectDetails,
        allUsers,
        floorplans,
        subgroups,
        inventories,
        baseScope,
        altScope,
        flooringScope,
        imageFiles,
    } = useAppSelector((state: any) => {
        return {
            organization: state.tpsm.organization,
            projectDetails: state.projectDetails.data,
            allUsers: state.tpsm.all_User?.users,
            floorplans: state.projectFloorplans.floorplans,
            subgroups: state.projectFloorplans.floorplanSplits?.subGroups,
            inventories: state.projectFloorplans.inventories,
            baseScope: state.budgeting?.details?.baseScope?.renovations,
            altScope: state.budgeting?.details?.altScope?.renovations,
            flooringScope: state.budgeting?.details?.flooringScope?.renovations,
            imageFiles: state?.fileUtility?.imageFiles,
        };
    });
    const dispatch = useAppDispatch();
    const [category, setCategory] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<{ id: string; category: string }[]>([]);
    const [projectImageFiles, setProjectImageFiles] = useState<any[]>([]);

    const getScopeDescriptions = async () => {
        try {
            const response = await graphQLClient.query("getDescriptions", GET_DESCRIPTIONS, {
                project_id: projectDetails?.id,
            });

            let descriptions = response?.getDescriptions?.map(
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

    const getCategoryData = async () => {
        const res = await graphQLClient.query("getCategoryData", CONTAINER_CATEGORY_QUERY);
        setCategoryData(res.getCategories);
    };

    useEffect(() => {
        if (isEmpty(floorplans.data)) {
            dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectDetails?.id }));
        }
        getScopeDescriptions();
        getCategoryData();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        setProjectImageFiles(imageFiles);
    }, [imageFiles]);
    useEffect(() => {
        let scopes = [...baseScope.data, ...altScope.data, ...flooringScope.data];
        if (scopes?.length > 0) {
            scopes?.map((scope: { category: any }) => {
                if (!category?.some((item) => item?.name === scope?.category)) {
                    let index = categoryData?.findIndex(
                        (data) => data?.category === scope?.category,
                    );
                    //if scope category exist in container category only then push data
                    if (index !== -1) {
                        category?.push({
                            id: categoryData?.[index]?.id,
                            name: scope?.category,
                            isSelected: true,
                        });
                        setCategory(category);
                    }
                }
            });
        }
        //eslint-disable-next-line
    }, [baseScope?.data, altScope?.data, flooringScope?.data, categoryData]);

    return (
        <Grid container>
            <Grid item sx={{ marginBottom: "24px" }} direction={"row"} xs={12}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={10} lg={10}>
                        <Grid container alignItems={"center"}>
                            {BidSetupSteps.map((step, index) => {
                                return (
                                    <Stack key={index} direction={"row"} alignItems="center">
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
                                                if (projectImageFiles?.length > 0)
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
                                        {index != BidSetupSteps.length - 1 && (
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
                    <ProjectInfo
                        activeStep={activeStep}
                        setActiveStep={setActiveStep}
                        projectDetails={projectDetails}
                        organization={organization}
                        allUsers={allUsers}
                        projectImageFiles={projectImageFiles}
                        setIsBidSetup={setIsBidSetup}
                    />
                )}
                {activeStep === 2 && (
                    <InventoryInfo
                        activeStep={activeStep}
                        setActiveStep={setActiveStep}
                        floorplans={floorplans}
                        inventories={inventories}
                        subgroups={subgroups}
                        descriptions={descriptions}
                        setDescriptions={setDescriptions}
                        projectId={projectDetails?.id}
                        projectType={projectDetails?.projectType}
                    />
                )}
                {activeStep === 3 && (
                    <ScopeInfo
                        activeStep={activeStep}
                        setActiveStep={setActiveStep}
                        category={category}
                        setCategory={setCategory}
                        projectId={projectDetails?.id}
                        descriptions={descriptions}
                        setDescriptions={setDescriptions}
                    />
                )}
                {activeStep === 4 && (
                    <BidInfo
                        activeStep={activeStep}
                        setActiveStep={setActiveStep}
                        setIsBidSetup={setIsBidSetup}
                        projectType={projectDetails?.projectType}
                    />
                )}
                {activeStep === 5 && (
                    <SetupCompletion activeStep={activeStep} setActiveStep={setActiveStep} />
                )}
            </Grid>
        </Grid>
    );
};

export default BidSetup;
