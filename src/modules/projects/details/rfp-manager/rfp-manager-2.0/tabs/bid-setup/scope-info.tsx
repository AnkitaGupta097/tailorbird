import {
    Card,
    CardProps,
    Grid,
    ListItem,
    ListItemProps,
    Paper,
    Stack,
    styled,
    Typography,
} from "@mui/material";
import Button from "components/button";
import BaseCheckbox from "components/checkbox";
import { StyledTextArea } from "components/text-area/style";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import React, { useState } from "react";
import { SET_DESCRIPTIONS } from "stores/projects/details/rfp-manager/rfp-manager-queries";
import { graphQLClient } from "utils/gql-client";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
interface ScopeInfoProps {
    activeStep: any;
    setActiveStep: any;
    category: any;
    setCategory: any;
    projectId: string;
    descriptions: any;
    setDescriptions: any;
}

const StyledCard = styled(Card)<CardProps>(() => ({
    height: "25rem",
    overflowY: "scroll",
    borderRadius: "5px 0px 0px 0px",
}));

const StyledListItem = styled(ListItem)<ListItemProps>(() => ({
    border: `1px solid #BCBCBB`,
    height: "3.75rem",
    cursor: "pointer",
    "&.active": {
        backgroundColor: "#EEEEEE",
    },
    alignItems: "center",
}));

const ScopeInfo = ({
    activeStep,
    setActiveStep,
    category,
    setCategory,
    projectId,
    descriptions,
    setDescriptions,
}: ScopeInfoProps) => {
    const userId = localStorage.getItem("user_id");
    const [show, setShow] = useState<any>(true);

    const onChangeShowAll = (e: any) => {
        setCategory((state: any) => {
            let stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy = stateCopy.map((item: any) => {
                return {
                    ...item,
                    isSelected: e?.target?.checked,
                };
            });
            return stateCopy;
        });
        setShow(e?.target?.checked);
    };

    const handleChange = (e: any, category: any) => {
        setCategory((state: any) => {
            let stateCopy = JSON.parse(JSON.stringify(state));
            let stateCopyUpdated = stateCopy.map((cat: any) => {
                if (cat.name === category.name) {
                    cat.isSelected = e.target.checked;
                }
                return cat;
            });
            return stateCopyUpdated;
        });
    };

    const onChangeDescription = (event: any, id: string) => {
        //if resource exist in description
        let index = descriptions?.findIndex(
            (desc: { resource_id: string }) => desc?.resource_id === id,
        );
        if (index !== -1) {
            descriptions[index].description = event?.target?.value;
        } else {
            descriptions = [
                ...descriptions,
                {
                    resource_type: "category",
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

    return (
        <Grid container direction={"row"} gap={2}>
            {category?.length > 0 && (
                <Grid item sm={3} md={3} lg={3} xl={2}>
                    <Grid container>
                        <Grid item>
                            <Grid container direction={"row"} gap={2}>
                                <Grid item>
                                    <BaseCheckbox
                                        onChange={(e: any) => onChangeShowAll(e)}
                                        checked={show}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography>{"Show / hide all on right"}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <StyledCard>
                                {category?.map((category: any, idx: number) => (
                                    <StyledListItem
                                        key={idx}
                                        sx={{
                                            backgroundColor: category?.isSelected
                                                ? " #EEEEEE"
                                                : "#FFFFFF",
                                        }}
                                    >
                                        <BaseCheckbox
                                            onChange={(e: any) => handleChange(e, category)}
                                            id={idx}
                                            checked={category?.isSelected}
                                            style={{ marginRight: "1rem" }}
                                        />
                                        <img
                                            src={getCategoryIcon(category?.name)}
                                            width={30}
                                            height={30}
                                            alt={`${category?.name} icon`}
                                            style={{
                                                marginRight: "1rem",
                                                opacity: category?.isSelected ? 1 : 0.3,
                                            }}
                                        />
                                        <Typography
                                            variant={"text_14_semibold"}
                                            color={category?.isSelected ? "#000000" : "#CCCCCC"}
                                        >
                                            {category?.name}
                                        </Typography>
                                    </StyledListItem>
                                ))}
                            </StyledCard>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <Grid
                item
                sm={7}
                md={7}
                lg={7}
                xl={8}
                style={{ flexBasis: 0, flexGrow: 1, maxWidth: "none" }}
            >
                <Paper elevation={3} sx={{ padding: "24px" }}>
                    {category?.length === 0 && (
                        <Stack
                            direction={"row"}
                            alignItems="center"
                            spacing={2}
                            marginBottom={"16px"}
                        >
                            <ErrorOutlineOutlined htmlColor="#410099" />
                            <Typography sx={{ color: "#410099" }}>
                                {"No scope added to the project."}
                            </Typography>
                        </Stack>
                    )}
                    <Grid container gap={2} sx={{ padding: "24px" }}>
                        {category?.length > 0 && (
                            <Grid item xs={12} mb={2}>
                                <Typography variant="text_16_medium">
                                    {"Scope descriptions (optional)"}
                                </Typography>
                            </Grid>
                        )}
                        {category?.map(
                            (
                                data: {
                                    id: string;
                                    isSelected: boolean;
                                    name: string;
                                },
                                index: React.Key | null | undefined,
                            ) => {
                                let descIndex = descriptions?.findIndex(
                                    (desc: { resource_id: string }) =>
                                        desc?.resource_id === data?.id,
                                );
                                return (
                                    <>
                                        {data?.isSelected && (
                                            <Grid container gap={2} key={index}>
                                                <Grid item xs={12}>
                                                    <Typography
                                                        variant="text_16_regular"
                                                        color={"#757575"}
                                                    >
                                                        {data?.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <StyledTextArea
                                                        value={
                                                            descIndex !== -1
                                                                ? descriptions?.[descIndex]
                                                                      ?.description
                                                                : ""
                                                        }
                                                        onChange={(e: any) =>
                                                            onChangeDescription(e, data?.id)
                                                        }
                                                        style={{ width: "100%", minHeight: "2em" }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </>
                                );
                            },
                        )}
                        <Grid item xs={12} mt={2}>
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
            </Grid>
        </Grid>
    );
};

export default ScopeInfo;
