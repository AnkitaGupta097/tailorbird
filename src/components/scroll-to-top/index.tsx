import { Button, SxProps } from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import upArrow from "../../assets/icons/arrow_upward.svg";

interface IScrollToTopItems {
    icon?: ReactElement<any>;
    label?: string;
    styling?: SxProps;
    visibleAfter?: number;
}

const ScrollToTop: React.FC<IScrollToTopItems> = ({ label, icon, styling, visibleAfter }) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const handleVisibility = () => {
            document.documentElement.scrollTop > (visibleAfter ?? 100)
                ? setVisible(true)
                : setVisible(false);
        };

        window.addEventListener("scroll", handleVisibility);

        return () => window.removeEventListener("scroll", handleVisibility);
    }, [visibleAfter]);

    const scrollTop = () =>
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    return visible ? (
        <Button disableFocusRipple onClick={scrollTop} sx={styling}>
            {icon}
            {label ?? label}
        </Button>
    ) : (
        <></>
    );
};

ScrollToTop.defaultProps = {
    icon: <img src={upArrow} alt="up" />,
    styling: {
        position: "fixed",
        minWidth: "48px",
        bottom: "40px",
        height: "48px",
        left: "90%",
        zIndex: 1,
        bgcolor: "#004D71",
        "&:hover": {
            bgcolor: "#004D71",
        },
    },
};

export default ScrollToTop;
