import React, { Fragment } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Divider, Typography, AccordionDetails, AccordionSummary, Accordion } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { InfoMessages } from "../contants";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
const KeyPeople = ({ keyPeople }: any) => {
    const [expanded, setExpanded] = React.useState<string | false>("keypeople-content");

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        //MIXPANEL : Event tracking for add new project Detail Key people Minimise/maximise
        mixpanel.track(`PROJECT DETAILS : Key people ${isExpanded ? "Maximised" : "Minimised"} `, {
            eventId: `key_people_${isExpanded ? "maximised" : "minimised"} `,
            ...getUserDetails(),
            ...getUserOrgDetails(),
        });
        setExpanded(isExpanded ? panel : false);
    };

    function getInitials(fullName: string) {
        const names = fullName?.split(" ")?.splice(0, 2);
        const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
        return initials;
    }

    return (
        <Accordion
            sx={Styles.rectangleCard}
            expanded={expanded === "keypeople-content"}
            onChange={handleChange("keypeople-content")}
        >
            <AccordionSummary
                expandIcon={<RemoveIcon />}
                aria-controls="keypeople-content"
                id="keypeople-header"
                sx={{ padding: "0px 12px 0px 20px" }}
                aria-expanded
            >
                <Stack direction={"row"} gap={"2rem"}>
                    <PersonSearchIcon />
                    <Typography>Key People</Typography>
                </Stack>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
                <Stack direction="column" spacing={1}>
                    {keyPeople?.map((item: any) => (
                        <Fragment key={item.id}>
                            <Stack sx={Styles.personCard}>
                                <Avatar
                                    alt={item.name}
                                    src={item.image}
                                    sx={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "#BCDFEF",
                                    }}
                                >
                                    {!item.image && getInitials(item.name || "")}
                                </Avatar>
                                <Stack direction={"column"} gap={"0.3rem"}>
                                    <Typography variant="text_16_regular" color="#232323">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="text_14_regular" color="#757575">
                                        {item.companyName}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Divider />
                        </Fragment>
                    ))}
                    <Typography
                        variant="text_14_light"
                        color="#757575"
                        sx={{ padding: "20px 11px 14px 24px" }}
                    >
                        {InfoMessages.keyPeople}
                    </Typography>
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
};
export default KeyPeople;

const Styles = {
    rectangleCard: {
        borderRadius: "8px",
        border: "1px solid #C9CCCF",
        background: "#FFF",
        boxShadow: "0px 2px 0px 0px #C9CCCF",
        height: "max-content",
    },
    personCard: {
        display: "flex",
        padding: "6px 12px",
        alignItems: "center",
        gap: "12px",
        flexDirection: "row",
    },
};
