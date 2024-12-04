import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RfpManager = () => {
    const locationInfo = useLocation();
    const { pathname } = locationInfo;
    const navigate = useNavigate();
    useEffect(() => {
        if (pathname == "/rfp") {
            let role = localStorage.getItem("role");
            let user_id = localStorage.getItem("user_id");
            navigate(`/rfp/${role}/${user_id}/projects`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationInfo]);
    return <Typography>This is RFP Manager</Typography>;
};

export default RfpManager;
