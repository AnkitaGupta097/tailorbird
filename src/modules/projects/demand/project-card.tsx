/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Typography, Card, Box, Button } from "@mui/material";
import { PROJECT_STATUS_LIST, PROJECT_TYPE } from "./constants";
import { useNavigate } from "react-router-dom";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { productionTabUrl } from "components/production/constants";
import { useFeature } from "@growthbook/growthbook-react";

interface IProjectCard {
    project: any;
}

const ProjectCard = ({ project }: IProjectCard) => {
    const navigate = useNavigate();
    const productionSoftwareEnabled = useFeature("production_2").on;
    // const dispatch = useAppDispatch();
    const { id, name, city, state, street_address, ownership_group_name, project_type, status } =
        project;
    return (
        <Box marginRight="16px" marginBottom="16px" width="360px" mt={2.5}>
            <Card
                sx={{
                    borderRadius: "5px",
                    background: "#FFF",
                    boxShadow: "0px 0px 21px 0px rgba(0, 0, 0, 0.11)",
                    padding: "12px 11px 8px 11px",
                    height: "150px",
                }}
                onClick={() => {
                    //MIXPANEL : Event tracking for clik project card
                    mixpanel.track(`PROJECT DASHBOARD : Navigated to project ${name}`, {
                        eventId: "navigated_to_project",
                        ...getUserDetails(),
                        ...getUserOrgDetails(),
                        project_name: name,
                    });
                    navigate(`/consumer/projects/${id}`);
                }}
            >
                <Box mt={0} pl={1}>
                    <Box mt={0}>
                        <Typography variant="text_14_semibold" width="68%" display="inline-block">
                            <Typography
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    "-webkit-line-clamp": "2",
                                    "-webkit-box-orient": "vertical",
                                }}
                            >
                                {name}
                            </Typography>
                        </Typography>
                        <Typography
                            variant="text_14_regular"
                            sx={{
                                float: "right",
                                padding: "2px 8px",
                                borderRadius: "2.842px",
                                color: PROJECT_TYPE[project_type]?.["text_color"],
                                backgroundColor: PROJECT_TYPE[project_type]?.["background_color"],
                            }}
                        >
                            {PROJECT_TYPE[project_type]["label"]}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "150px 1fr",
                            width: "100%",
                        }}
                    >
                        <Box mt={0} paddingBottom="12px">
                            <Typography variant="text_12_regular" color="#757575" lineHeight="12px">
                                {street_address || "address not available"}
                                <br />
                                {city || "city NA"}, {state || "state NA"}
                            </Typography>
                            <br />
                            <Typography
                                component="div"
                                variant="text_10_regular"
                                color="#00344D"
                                borderColor="#00344D"
                                borderRadius="2.842px"
                                border="1px solid"
                                padding="3.14px 11.4px"
                                marginTop="2px"
                                display="inline-block"
                            >
                                {ownership_group_name}
                            </Typography>
                        </Box>
                        <Box mt={0} paddingBottom="0px">
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    width: "100%",
                                    height: "100%",
                                    alignItems: "center",
                                }}
                            >
                                {/* <Typography
                                    variant="text_10_regular"
                                    color="#757575"
                                    lineHeight="12px"
                                >
                                    Project Start Date
                                    <br />
                                    <Typography variant="text_12_regular" color="#232323">
                                        --/--/----
                                    </Typography>
                                </Typography>
                                <Typography
                                    variant="text_10_regular"
                                    color="#757575"
                                    lineHeight="12px"
                                >
                                    Project End Date
                                    <br />
                                    <Typography variant="text_12_regular" color="#232323">
                                        --/--/----
                                    </Typography>
                                </Typography> */}
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        mt="20px"
                        display="flex"
                        alignItems="flex-end"
                        justifyContent="space-between"
                        position="sticky"
                        sx={{ bottom: "2px" }}
                    >
                        <Typography
                            variant="text_14_regular"
                            sx={{
                                ...PROJECT_STATUS_LIST[status],
                                padding: "2px 8px",
                                borderRadius: "2.842px",
                            }}
                        >
                            {status}
                            {/* <ArrowDropDownIcon sx={{ marginBottom: "-6px" }} /> */}
                        </Typography>
                        {productionSoftwareEnabled && (
                            <Button
                                variant="text"
                                color="primary"
                                onClick={(event: React.SyntheticEvent) => {
                                    event.stopPropagation();
                                    navigate(productionTabUrl(id));
                                }}
                                endIcon={
                                    <ArrowForwardIosIcon
                                        fontSize={"small"}
                                        sx={{ width: "15px", height: "15px" }}
                                    />
                                }
                            >
                                Production
                            </Button>
                        )}
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default ProjectCard;
