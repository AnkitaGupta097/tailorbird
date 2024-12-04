import * as React from "react";
import Header from "components/header";
import ServiceUnavilableSvg from "assets/icons/not-found.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Button from "@mui/material/Button";
// import { Navigate } from "react-router-dom";
interface Props {
    children?: React.ReactNode;
    routesInfo?: any;
    hasError?: boolean;
    setHasError?: any;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(error: any) {
        console.log("error111,", error);

        return { hasError: true };
    }

    componentDidUpdate(prevProps: Props) {
        if (!this.props.hasError && prevProps.hasError) {
            this.setState({ hasError: false });
        }
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.log("error,", error, errorInfo);
        // You can also log the error to an error reporting service here
        console.error(error, JSON.stringify(errorInfo));
        this.props.setHasError(true);
    }

    render() {
        const { routesInfo } = this.props;
        const role = localStorage.getItem("role");

        if (this.state.hasError) {
            return (
                <>
                    <Header
                        routesInfo={routesInfo.filter(
                            (route: { showInHeader: boolean; path: string }) =>
                                route.showInHeader === true &&
                                !(route.path === "/rfp" && role === "admin"),
                        )}
                    />
                    <div style={{ textAlign: "center", height: "92vh" }}>
                        <img src={ServiceUnavilableSvg} alt="internal server error" />
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
                            Ouch!{" "}
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
                            Looks like we lost our speed there.
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
                            <div
                                style={{
                                    display: "grid",
                                    justifyContent: "center",
                                    gridAutoFlow: "column",
                                    columnGap: "6px",
                                    marginTop: "10px",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        window.history.back();
                                    }}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        backgroundColor: "#57B6B2",
                                        "&:hover": {
                                            backgroundColor: "#00344D",
                                        },
                                    }}
                                >
                                    Go back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        localStorage.setItem("originUrl", "/");
                                        window.location.pathname = "/callback";
                                    }}
                                    startIcon={<HomeOutlinedIcon />}
                                    sx={{
                                        backgroundColor: "#57B6B2",
                                        "&:hover": {
                                            backgroundColor: "#00344D",
                                        },
                                    }}
                                >
                                    Home
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
