import React from "react";
import { Box } from "@mui/material";
import BidStatusGrid from "./bid-status-grid";
import BidLevelSheets from "./bid-level-sheets";
import Contract from "./contract";
import { IRFP } from "stores/single-project/interfaces";
export interface IRFPProps extends IRFP {
    getUploaderName: any;
    bidStatusData: any;
    project: any;
    organizations: any;
}
const RFPDetails = (RFP: IRFPProps) => {
    return (
        <>
            <Box sx={Styles.rectangleCard} key={"bidstatus"}>
                <BidStatusGrid {...RFP} />
            </Box>
            <Box sx={Styles.rectangleCard} key={"bidlevel"}>
                <BidLevelSheets {...RFP} />
            </Box>
            <Box sx={Styles.rectangleCard} key={"bidstatus"}>
                <Contract {...RFP} />
            </Box>
        </>
    );
};
export default RFPDetails;
const Styles = {
    rectangleCard: {
        padding: "16px 20px",
        gap: "10px",
        borderRadius: "4px",
        border: "1px solid #C9CCCF",
        background: "#FFF",
        marginBottom: "20px",
    },
};
