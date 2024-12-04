import { Grid, Paper, Stack, Typography } from "@mui/material";
import Button from "components/button";
import BaseTextArea from "components/text-area";
import React, { useEffect, useState } from "react";
import { SET_DESCRIPTIONS } from "stores/projects/details/rfp-manager/rfp-manager-queries";
import { graphQLClient } from "utils/gql-client";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";

interface InventoryInfoProps {
    activeStep: any;
    setActiveStep: any;
    floorplans: any;
    inventories: any;
    subgroups: any;
    descriptions: any;
    setDescriptions: any;
    projectId: string;
    projectType: string;
}

const InventoryInfo = ({
    activeStep,
    setActiveStep,
    floorplans,
    inventories,
    subgroups,
    descriptions,
    setDescriptions,
    projectId,
    projectType,
}: InventoryInfoProps) => {
    const userId = localStorage.getItem("user_id");
    const [floorPlanData, setFloorPlanData] = useState<any>();
    const [inventoryData, setInventoryData] = useState<any>();
    const [subgroupData, setSubgroupData] = useState<any>();

    const onChangeDescription = (event: any, id: string, type: string) => {
        //if resource exist in description
        let index = descriptions?.findIndex(
            (desc: { resource_id: string }) => desc?.resource_id === id,
        );
        if (index !== -1) {
            descriptions[index] = {
                ...descriptions[index],
                description: event?.target?.value,
            };
        } else {
            descriptions = [
                ...descriptions,
                {
                    resource_type: type,
                    resource_id: id,
                    description: event?.target?.value,
                },
            ];
        }
        setDescriptions(descriptions);
    };

    const handleSetDescription = async () => {
        try {
            await graphQLClient.mutate("setDescriptions", SET_DESCRIPTIONS, {
                input: {
                    project_id: projectId,
                    added_by: userId,
                    descriptions: descriptions,
                },
            });
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        setFloorPlanData(floorplans?.data);
        setInventoryData(inventories?.data);
        setSubgroupData(subgroups);
        // eslint-disable-next-line
    }, [floorplans, inventories, subgroups]);
    //Get Inventory
    return (
        <Paper elevation={3} sx={{ padding: "24px" }}>
            {floorPlanData?.length == 0 &&
                inventoryData?.length === 0 &&
                subgroupData?.length === 0 && (
                    <Stack direction={"row"} alignItems="center" spacing={2} marginBottom={"16px"}>
                        <ErrorOutlineOutlined htmlColor="#410099" />
                        <Typography sx={{ color: "#410099" }}>
                            {`No ${
                                projectType?.toLocaleLowerCase() === "interior"
                                    ? "Floorplans"
                                    : "Areas"
                            }/Inventory/Subgroup added to the project.`}
                        </Typography>
                    </Stack>
                )}
            <Grid container rowSpacing={3} columnSpacing={4}>
                {floorPlanData?.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="text_16_medium">
                            {`${
                                projectType?.toLocaleLowerCase() === "interior"
                                    ? "Floorplan"
                                    : "Area"
                            } descriptions (optional)`}
                        </Typography>
                    </Grid>
                )}
                {floorPlanData?.map((floorplan: any) => {
                    let descIndex = descriptions?.findIndex(
                        (desc: { resource_id: string }) => desc?.resource_id === floorplan?.id,
                    );
                    return (
                        <>
                            <Grid item xs={12}>
                                <Typography variant="text_16_regular" color={"#757575"}>
                                    {floorplan?.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <BaseTextArea
                                    value={
                                        descIndex !== -1
                                            ? descriptions?.[descIndex]?.description
                                            : ""
                                    }
                                    onChange={(e: any) => {
                                        onChangeDescription(e, floorplan?.id, "floorplan");
                                    }}
                                    style={{ width: "100%", minHeight: "2em" }}
                                />
                            </Grid>
                        </>
                    );
                })}
                {inventoryData?.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="text_16_medium">
                            {"Inventory descriptions (optional)"}
                        </Typography>
                    </Grid>
                )}
                {inventoryData?.map((inventory: any) => {
                    let descIndex = descriptions?.findIndex(
                        (desc: { resource_id: string }) => desc?.resource_id === inventory?.id,
                    );
                    return (
                        <>
                            <Grid item xs={12}>
                                <Typography variant="text_16_regular" color={"#757575"}>
                                    {inventory?.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <BaseTextArea
                                    value={
                                        descIndex !== -1
                                            ? descriptions?.[descIndex]?.description
                                            : ""
                                    }
                                    onChange={(e: any) => {
                                        onChangeDescription(e, inventory?.id, "inventory");
                                    }}
                                    style={{ width: "100%", minHeight: "2em" }}
                                />
                            </Grid>
                        </>
                    );
                })}
                {subgroupData?.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="text_16_medium">
                            {"Subgroup descriptions (optional)"}
                        </Typography>
                    </Grid>
                )}
                {subgroupData?.map((subgroup: any) => {
                    let descIndex = descriptions?.findIndex(
                        (desc: { resource_id: string }) => desc?.resource_id === subgroup?.id,
                    );
                    return (
                        <>
                            <Grid item xs={12}>
                                <Typography variant="text_16_regular" color={"#757575"}>
                                    {subgroup?.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <BaseTextArea
                                    value={
                                        descIndex !== -1
                                            ? descriptions?.[descIndex]?.description
                                            : ""
                                    }
                                    onChange={(e: any) => {
                                        onChangeDescription(e, subgroup?.id, "floorplansubgroup");
                                    }}
                                    style={{ width: "100%", minHeight: "2em" }}
                                />
                            </Grid>
                        </>
                    );
                })}

                <Grid item xs={12}>
                    <Grid container gap={2}>
                        <Grid item>
                            <Button
                                classes="grey default"
                                onClick={() => setActiveStep(activeStep - 1)}
                                label={"Previous"}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                classes="primary default"
                                onClick={() => {
                                    handleSetDescription();
                                    setActiveStep(activeStep + 1);
                                }}
                                label={"Next"}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default InventoryInfo;
