/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Typography, Card, Box, Button } from "@mui/material";
import appTheme from "styles/theme";
import propertyAsset from "../../assets/icons/property-asset.png";
import { useAppSelector } from "stores/hooks";
import { PROPERTY_TYPE } from "./constants";
// import actions from "../../stores/actions";
import { useNavigate } from "react-router-dom";
import { getColor } from "./helper";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
interface IPropertyCard {
    property: any;
}

const PropertyCard = ({ property }: IPropertyCard) => {
    const navigate = useNavigate();
    // const dispatch = useAppDispatch();
    const { organization } = useAppSelector((state) => {
        return {
            organization: state.tpsm.organization,
        };
    });
    const {
        name,
        address,
        city,
        state,
        ownership_group_id,
        type,
        id,
        unit_count,
        active_project_count,
        cover_picture,
    } = property;
    const organizationMap =
        organization && new Map(organization.map((org: any) => [org.id, org.name]));

    return (
        <Box pl={5} width="200px" height="300px" mt={2.5} marginBottom="30px">
            <Card
                sx={{
                    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.10)",
                    padding: "8px",
                    cursor: "pointer",
                    height: "100%",
                }}
                onClick={() => {
                    //MIXPANEL : Event tracking for clik property card
                    mixpanel.track(`PROPERTY : Navigated to Property ${name}`, {
                        eventId: "navigated_to_property",
                        ...getUserDetails(),
                        ...getUserOrgDetails(),
                        property_name: name,
                    });
                    navigate(`/properties-consumer/${id}`);
                }}
            >
                <Box sx={{ maxHeight: "101px", minHeight: "101px", overflow: "hidden" }}>
                    <img src={cover_picture || propertyAsset} alt="property-asset" width={"100%"} />
                </Box>
                <Box mt={3} pl={1}>
                    <Typography
                        variant="text_16_medium"
                        height="44px"
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
                    <Typography variant="text_12_regular" color={appTheme.border.medium}>
                        <Typography
                            variant="text_12_regular"
                            color={appTheme.border.medium}
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                "-webkit-line-clamp": "1",
                                "-webkit-box-orient": "vertical",
                            }}
                        >
                            {address || "address"}
                        </Typography>
                        {city || "city"}, {state || "state"}
                    </Typography>
                    <br />
                    <Button
                        variant="outlined"
                        style={{
                            marginTop: "8px",
                            borderColor: getColor("MID RISE"),
                            paddingRight: "8px",
                            paddingLeft: "8px",
                        }}
                    >
                        <Typography variant="text_10_regular" color={getColor("MID RISE")}>
                            {organizationMap?.get(ownership_group_id)}
                        </Typography>
                    </Button>
                    <Box mt={5} display="flex" alignItems="flex-end" justifyContent="space-between">
                        <Box>
                            <Typography variant="text_12_regular" color={appTheme.border.medium}>
                                {active_project_count || 0} Active Projects
                            </Typography>
                            <br />
                            <Typography variant="text_12_regular" color={appTheme.border.medium}>
                                {unit_count || 0} Units
                            </Typography>
                        </Box>
                        <Box>
                            <Button
                                variant="outlined"
                                style={{
                                    borderColor: getColor(type),
                                    paddingRight: "8px",
                                    paddingLeft: "8px",
                                }}
                            >
                                <Typography variant="text_10_regular" color={getColor(type)}>
                                    {PROPERTY_TYPE[type]}
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default PropertyCard;
