import * as React from "react";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    MenuList,
    Popover,
    Avatar,
    Typography,
    BoxProps,
    MenuItem,
    styled,
    Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { APP_PAGE_ROUTES, DRAWER_WIDTH } from "../../modules/projects/details/budgeting/constants";
import AppTheme from "../../styles/theme";
import logo from "../../assets/icons/logo.svg";
import profile from "../../assets/icons/profile.svg";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, LinkProps, useLocation } from "react-router-dom";
import { useAppSelector } from "stores/hooks";
import SideDrawer from "components/side-drawer/SideDrawer";
import {
    KnockFeedProvider,
    NotificationIconButton,
    NotificationFeedPopover,
} from "@knocklabs/react-notification-feed";
import "@knocklabs/react-notification-feed/dist/index.css";
import mixpanel from "mixpanel-browser";

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    routesInfo?: any;
    onNotificationClick?: any;
}

interface IUser {
    picture: string | null;
    id: string;
}

export const RouterBox = styled(Box)<BoxProps>(() => ({
    display: "flex",
    gap: "1.2rem",
    height: "4.3rem",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    marginLeft: "1rem",
    color: AppTheme.palette.text.primary,
}));

export const ActiveRouteLink = styled(Link)<LinkProps>(() => ({
    "::after": {
        content: `""`,
        position: "relative",
        display: "block",
        top: "1.4rem",
        borderTop: "0.188rem solid #57b6b2",
    },
    textDecoration: "none",
    color: AppTheme.palette.text.primary,
}));

export const RouteLink = styled(Link)<LinkProps>(() => ({
    textDecoration: "none",
    color: AppTheme.palette.text.primary,
}));

const getAllowedAppPagesNRoutes = (permissions: any) => {
    let ALLOWED_APP_PAGE_ROUTES: { [key: string]: string } = Object.keys(APP_PAGE_ROUTES)
        // eslint-disable-next-line no-prototype-builtins
        .filter((key) => permissions.hasOwnProperty(key))
        .reduce((cur, key) => {
            return Object.assign(cur, { [key]: APP_PAGE_ROUTES[key] });
        }, {});
    return { ALLOWED_APP_PAGE_ROUTES };
};

export default function DrawerAppBar(props: Props) {
    //eslint-disable-next-line
    const { ALLOWED_APP_PAGE_ROUTES } = getAllowedAppPagesNRoutes(props.routesInfo);

    const { logout } = useAuth0();
    // const navigate = useNavigate();, isAuthenticated
    const { pathname } = useLocation();
    const role = localStorage.getItem("role");
    const anchorRef = React.useRef(null);
    const [show, setShow] = React.useState(false);
    const isActive = (currentLink: string) => {
        let paths = pathname.split("/");
        // When navigating to RFP projects for TB admin.
        // Mark project link as inactive because RFP projects != TB Projects
        if (
            currentLink === "projects" &&
            paths.includes("projects") &&
            paths.includes("consumer")
        ) {
            return true;
        }
        const isRfpProject =
            paths.includes("rfp") &&
            paths.includes("projects") &&
            role === "admin" &&
            currentLink === "bids";
        return pathname.startsWith(`/${currentLink}`) && !isRfpProject;
    };
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isNotificationFeedVisible, setIsNotificationFeedVisible] = React.useState(false);
    const notifButtonRef = React.useRef(null);
    const { syncTimeout, responseError, responseSuccess } = useAppSelector((state: any) => ({
        syncTimeout: state.biddingPortal.syncTimeout,
        responseError: state.biddingPortal.responseError,
        responseSuccess: state.biddingPortal.responseSuccess,
    }));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    // React.useEffect(() => {
    //     if (isAuthenticated) {
    //         if (pathname == "/") {
    //             navigate("/projects/active");
    //         }
    //     }
    //     // eslint-disable-next-line
    // }, [isAuthenticated]);

    const userDetails: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");

    const handleToggle = () => {
        setShow((prevshow) => !prevshow);
    };
    const logoutHandler = () => {
        logout({ returnTo: process.env.REACT_APP_BASE_URL });
        mixpanel.reset();
        localStorage.clear();
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Grid sx={{ display: "flex", height: "4rem" }}>
            <AppBar
                component="nav"
                style={{
                    backgroundColor: AppTheme.palette.secondary.light,
                    color: AppTheme.palette.text.primary,
                }}
            >
                <Toolbar sx={{ marginRight: "1.8rem", marginLeft: "2.2rem" }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            display: { xs: "none", sm: "block" },
                            marginRight: "1rem",
                            marginTop: "1.5rem",
                        }}
                    >
                        <img src={logo} className="app-logo" alt="app logo" />
                    </Typography>
                    {responseError && !syncTimeout && (
                        <>
                            <Typography display={"flex"} alignItems="center" gap={"6.5px"}>
                                <CloudSyncIcon htmlColor="#8C9196" />
                            </Typography>
                            <Typography
                                display={"flex"}
                                alignItems="center"
                                width={"54px"}
                                height={"16px"}
                                color={AppTheme.text.medium}
                                fontStyle={"Roboto"}
                                lineHeight={"16px"}
                                variant="text_12_medium"
                                sx={{
                                    display: { xs: "none", sm: "block" },
                                    marginRight: "1rem",
                                    marginLeft: "6.5px",
                                }}
                            >
                                {"Saving..."}
                            </Typography>
                        </>
                    )}
                    {responseSuccess && (
                        <>
                            <Typography display={"flex"} alignItems="center" gap={"6.5px"}>
                                <CloudDoneOutlinedIcon htmlColor="#8C9196" />
                            </Typography>
                            <Typography
                                display={"flex"}
                                alignItems="center"
                                color={AppTheme.text.medium}
                                fontStyle={"Roboto"}
                                variant="text_12_medium"
                                lineHeight={"16px"}
                                height={"16px"}
                                width={"54px"}
                                sx={{
                                    display: { xs: "none", sm: "block" },
                                    marginRight: "1rem",
                                    marginLeft: "6.5px",
                                }}
                            >
                                {"Saved"}
                            </Typography>
                        </>
                    )}
                    {responseError && syncTimeout && (
                        <Typography display={"flex"} alignItems="center" gap={"6.5px"}>
                            <SyncProblemIcon htmlColor="#8C9196" />
                        </Typography>
                    )}
                    {responseError && syncTimeout && (
                        <Typography
                            display={"flex"}
                            alignItems="center"
                            width={"60px"}
                            height={"16px"}
                            color={AppTheme.text.medium}
                            fontStyle={"Roboto"}
                            lineHeight={"16px"}
                            variant="text_12_medium"
                            sx={{
                                display: { xs: "none", sm: "block" },
                                marginRight: "1rem",
                                marginLeft: "6.5px",
                            }}
                        >
                            <span style={{}}>{"Not saved"}</span>
                        </Typography>
                    )}
                    <Box sx={{ display: { xs: "none", sm: "block" }, flexGrow: 1 }}>
                        <Box
                            display={"flex"}
                            alignItems="center"
                            justifyContent={"space-between"}
                            gap={"30px"}
                            sx={{
                                "& .headerTab": {
                                    marginBottom: "auto",
                                    marginLeft: "auto",
                                    alignSelf: "flex-end",
                                    marginTop: "1.5rem",
                                },
                            }}
                        >
                            <RouterBox>
                                {props.routesInfo.map((item: any) => {
                                    return isActive(item.Name?.toLowerCase()) ? (
                                        <ActiveRouteLink
                                            className={
                                                item.Name?.toLowerCase() === "admin"
                                                    ? "headerTab"
                                                    : ""
                                            }
                                            to={item.path}
                                            key={item.Name}
                                        >
                                            <Typography variant="activeTab">{item.Name}</Typography>
                                        </ActiveRouteLink>
                                    ) : (
                                        <RouteLink
                                            to={item.path}
                                            className={
                                                item.Name?.toLowerCase() === "admin"
                                                    ? "headerTab"
                                                    : ""
                                            }
                                            key={item.Name}
                                        >
                                            <Typography variant="tab">{item.Name}</Typography>
                                        </RouteLink>
                                    );
                                })}
                            </RouterBox>
                            <Box display={"flex"} alignItems="center" gap={3}>
                                <Box>
                                    <KnockFeedProvider
                                        apiKey={process.env.REACT_APP_KNOCK_PUBLIC_API_KEY || ""}
                                        feedId={process.env.REACT_APP_KNOCK_FEED_CHANNEL_ID || ""}
                                        userId={userDetails.id}
                                    >
                                        <>
                                            <NotificationIconButton
                                                ref={notifButtonRef}
                                                onClick={() =>
                                                    setIsNotificationFeedVisible(
                                                        !isNotificationFeedVisible,
                                                    )
                                                }
                                            />
                                            <NotificationFeedPopover
                                                onNotificationClick={
                                                    props.onNotificationClick
                                                        ? (feedData: any) => {
                                                              setIsNotificationFeedVisible(false);
                                                              props.onNotificationClick(feedData);
                                                          }
                                                        : undefined
                                                }
                                                buttonRef={notifButtonRef}
                                                isVisible={isNotificationFeedVisible}
                                                onClose={() => setIsNotificationFeedVisible(false)}
                                            />
                                        </>
                                    </KnockFeedProvider>
                                </Box>
                                <Box>
                                    <Avatar
                                        alt="Remy Sharp"
                                        aria-describedby="logout"
                                        ref={anchorRef}
                                        style={{ cursor: "pointer", marginRight: ".5rem" }}
                                        onClick={() => handleToggle()}
                                        src={userDetails.picture ? userDetails.picture : profile}
                                    />
                                    <Popover
                                        id="logout"
                                        open={show}
                                        anchorEl={anchorRef.current}
                                        onClose={handleToggle}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "left",
                                        }}
                                    >
                                        <MenuList autoFocusItem={show}>
                                            <MenuItem onClick={() => logoutHandler()}>
                                                Logout
                                            </MenuItem>
                                            {/* <MenuItem className={classes.paper} onClick={handleHide}>Logout</MenuItem> */}
                                        </MenuList>
                                    </Popover>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <SideDrawer
                container={container}
                isOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                drawerWidth={DRAWER_WIDTH}
                isActive={isActive}
                routesInfo={props.routesInfo}
            />
        </Grid>
    );
}
