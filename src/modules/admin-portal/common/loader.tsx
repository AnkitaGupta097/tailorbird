import React from "react";
import { Box } from "@mui/material";
import loaderProgress from "assets/icons/blink-loader.gif";

const Loader = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            width="100%"
            height="100%"
            alignItems="center"
            mt={5}
        >
            <div>
                <img
                    src={loaderProgress}
                    alt="loading"
                    style={{
                        width: "44px",
                        height: "44px",
                        paddingTop: "20px",
                    }}
                />
            </div>
        </Box>
    );
};

export default Loader;
