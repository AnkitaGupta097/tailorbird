/* eslint-disable no-unused-vars */
import React from "react";
import {
    Accordion,
    AccordionSummary,
    Stack,
    Typography,
    AccordionDetails,
    Box,
    Divider,
} from "@mui/material";

import { IProduction } from "stores/single-project/interfaces";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LaunchIcon from "@mui/icons-material/Launch";
import Button from "components/button";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
import { useParams } from "react-router-dom";

const ProductionDetails = (production: IProduction) => {
    const [expanded, setExpanded] = React.useState<string | false>("production-content");

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const { projectId } = useParams();
    return (
        <Box sx={Styles.rectangleCard}>
            <Accordion
                elevation={0}
                expanded={expanded === "production-content"}
                onChange={handleChange("production-content")}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="production-content"
                    id="production-header"
                    sx={{ borderBottom: expanded ? "1px solid #C9CCCF" : "none" }}
                >
                    <Typography variant="text_18_semibold" color={"#232323"}>
                        Tailorbird Production
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    {production.haveAccessToProduction ? (
                        <Stack direction={"column"} gap={"2rem"}>
                            <Typography
                                variant="text_14_bold"
                                color="#00B779"
                                style={{ lineHeight: "20px" }}
                            >
                                You have access to Tailorbird Production.
                            </Typography>
                            <Typography
                                variant="text_14_regular"
                                color="#232323"
                                style={{ lineHeight: "20px" }}
                            >
                                Please click the button below to view the application in a separate
                                tab.
                            </Typography>
                            <Button
                                classes="primary default"
                                onClick={() =>
                                    //MIXPANEL : Event tracking for  production button click
                                    mixpanel.track(`PROJECT DETAILS :Production button Clicked`, {
                                        eventId: `project_production_button_clicked`,
                                        ...getUserDetails(),
                                        ...getUserOrgDetails(),
                                        project_id: projectId,
                                    })
                                }
                                label={"Tailorbird Production"}
                                endIcon={<LaunchIcon />}
                                style={{ width: "fit-content" }}
                            />
                        </Stack>
                    ) : (
                        <Stack direction={"column"} gap={"2rem"}>
                            <Typography
                                variant="text_14_bold"
                                color="#916A00"
                                style={{ lineHeight: "20px" }}
                            >
                                You do not have access to Tailorbird Production.
                            </Typography>
                            <Typography
                                variant="text_14_regular"
                                color="#232323"
                                style={{ lineHeight: "20px" }}
                            >
                                Please email &nbsp;
                                <a href={`mailto:${production.supportEmail}`}>
                                    {`${production.supportEmail}`}
                                </a>
                                &nbsp;for assistance.
                            </Typography>
                        </Stack>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};
export default ProductionDetails;
const Styles = {
    rectangleCard: {
        padding: "16px 20px",
        gap: "10px",
        borderRadius: "4px",
        border: "1px solid #C9CCCF",
        background: "#FFF",
    },
};
