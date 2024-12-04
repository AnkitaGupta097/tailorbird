/* eslint-disable no-unused-vars */
import React from "react";
import PageNotFoundSvg from "assets/icons/not-found.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BaseButton from "components/button";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();
    return (
        <div style={{ textAlign: "center", height: "92vh" }}>
            <img src={PageNotFoundSvg} alt="Page not found" />
            <div
                style={{
                    height: "72px",
                    fontFamily: "IBM Plex Sans",
                    fontSize: "60px",
                    fontWeight: "300",
                    lineHeight: "72px",
                    letterSpacing: "-0.5px",
                    textAlign: "center",
                }}
            >
                Oh no!{" "}
            </div>
            <div
                style={{
                    fontFamily: "IBM Plex Sans",
                    fontSize: "18px",
                    fontWeight: "300",
                    lineHeight: "27px",
                    letterSpacing: " 0.15000000596046448px",
                    textAlign: "center",
                }}
            >
                Looks like some renovation is needed here.
            </div>
            <div
                style={{
                    display: "grid",
                    justifyContent: "center",
                    gridAutoFlow: "column",
                    columnGap: "6px",
                    marginTop: "10px",
                }}
            >
                <BaseButton
                    classes="secondary default"
                    onClick={() => history.back()}
                    label={"Go back"}
                    startIcon={<ArrowBackIcon />}
                />
                <BaseButton
                    classes="secondary default"
                    onClick={() => navigate("/")}
                    label={"Home"}
                    startIcon={<HomeOutlinedIcon />}
                />
            </div>
        </div>
    );
};

export default PageNotFound;
