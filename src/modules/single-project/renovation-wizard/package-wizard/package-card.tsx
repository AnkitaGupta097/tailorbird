/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Typography, Box } from "@mui/material";
import appTheme from "styles/theme";
import { ReactComponent as ProjectCurated } from "assets/icons/project-curated.svg";
import { ReactComponent as OrganizationCurated } from "assets/icons/organization-curated.svg";
import moment from "moment";

interface IPackageCard {
    tbPackage: any;
    isblur: boolean;
}

const PackageCard = ({ tbPackage, isblur }: IPackageCard) => {
    return (
        <Box p={3} width="200px" style={{ filter: `blur(${isblur ? "3px" : "0px"}) ` }}>
            {tbPackage.curated == "ORGANIZATION" ? (
                <OrganizationCurated width="100px" height="100px" style={{ marginLeft: "50px" }} />
            ) : (
                <ProjectCurated width="100px" height="100px" style={{ marginLeft: "50px" }} />
            )}
            <Box mt={3} pl={1}>
                <Typography variant="text_16_medium">
                    {tbPackage.curated == "ORGANIZATION"
                        ? "Organization Curated Package"
                        : "Project Curated Package"}
                </Typography>
                <br />
                <Typography variant="text_12_regular" color={appTheme.border.medium}>
                    name : {tbPackage.name}
                </Typography>
                <Box lineHeight={0.4}>
                    <Typography variant="text_12_regular" color={appTheme.border.medium}>
                        Updated by {tbPackage.created_by}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="text_12_regular" color={appTheme.border.medium}>
                        Uploaded on {moment(tbPackage.created_at).format("L")}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default PackageCard;
