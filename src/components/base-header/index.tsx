import React, { MouseEventHandler, ReactElement, useEffect, useRef, useState } from "react";
import {
    AppBar,
    Avatar,
    Box,
    Grid,
    IconButton,
    Popover,
    Toolbar,
    Typography,
    MenuList,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Help as HelpIcon, Settings as SettingsIcon } from "@mui/icons-material";
import logo from "../../assets/icons/logo.svg";
import profile from "../../assets/icons/profile.svg";
import SearchField from "components/search";
import DataSyncStatus from "components/data-sync-status";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import {
    DATA_SYNC_COMPLETED,
    DATA_SYNC_FAILED,
    DATA_SYNC_IN_PROGRESS,
    DEFAULT,
} from "components/data-sync-status/constants";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import AppTheme from "styles/theme";
import { ActiveRouteLink, RouteLink, RouterBox } from "components/header";
import { DRAWER_WIDTH } from "modules/projects/details/budgeting/constants";
import SideDrawer from "components/side-drawer/SideDrawer";
import {
    KnockFeedProvider,
    NotificationIconButton,
    NotificationFeedPopover,
} from "@knocklabs/react-notification-feed";
import "@knocklabs/react-notification-feed/dist/index.css";
import mixpanel from "mixpanel-browser";

interface IBaseHeader {
    dropDownItems?: Array<IDrawerItem>;
    notifications?: Array<any>;
    showDataSyncStatus: boolean;
    dataSyncStatus?: string;
    routesInfo?: any;
    onNotificationClick: any;
}

interface IDrawerItem {
    label: string;
    path: string;
    onClick: () => void;
    //eslint-disable-next-line
    iconPath?: any;
}

interface IUser {
    picture: string | null;
    id: string;
}

interface IconList {
    name: string;
    hideIcon: boolean;
    iconComponent: ReactElement<any>;
    onClickFn: MouseEventHandler<HTMLButtonElement>;
}

const BaseHeader: React.FC<IBaseHeader> = ({
    // notifications,
    showDataSyncStatus,
    routesInfo,
    onNotificationClick,
}) => {
    const { responseError, responseSuccess, isSaving } = useAppSelector((state: any) => ({
        responseError: state.biddingPortal.responseError,
        responseSuccess: state.biddingPortal.responseSuccess,
        isSaving: state.biddingPortal.isSaving,
    }));
    const [currentSyncState, setCurrentSyncState] = useState<string>();
    const [showSearch] = useState<boolean>(false);
    const navigate = useNavigate();
    const { logout } = useAuth0();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const handleDrawerToggle = () => {
        setOpenDrawer(!openDrawer);
    };
    const [searchVisibility, setSearchVisibility] = useState<boolean>(false);
    const [isNotificationFeedVisible, setIsNotificationFeedVisible] = useState(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [show, setShow] = React.useState(false);
    const anchorRef = React.useRef(null);
    const role = localStorage.getItem("role") || "";
    const userDetails: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const notifButtonRef = useRef(null);

    useEffect(() => {
        if (!responseError && !responseSuccess && isSaving) {
            // Saving ...
            setCurrentSyncState(DATA_SYNC_IN_PROGRESS);
        } else if (!responseError && responseSuccess && !isSaving) {
            // Saved
            setCurrentSyncState(DATA_SYNC_COMPLETED);
        } else if (responseError && !responseSuccess && !isSaving) {
            //Not saved, error
            setCurrentSyncState(DATA_SYNC_FAILED);
        } else {
            setCurrentSyncState(DEFAULT);
        }
    }, [responseError, responseSuccess, isSaving]);
    const logoutHandler = () => {
        logout({ returnTo: process.env.REACT_APP_BASE_URL });
        mixpanel.reset();
        // Remove script tags
        const scriptElements = document.querySelectorAll(
            'script[src^="https://cdn.botpress.cloud/webchat/v1"]',
        );
        scriptElements.forEach((script: any) => {
            script.parentNode.removeChild(script);
        });
        localStorage.clear();
    };

    const handleToggle = () => {
        setShow(!show);
    };

    const headerIcons: IconList[] = [
        {
            name: "notification",
            hideIcon: false,
            iconComponent: (
                <NotificationIconButton
                    ref={notifButtonRef}
                    onClick={() => setIsNotificationFeedVisible(!isNotificationFeedVisible)}
                />
            ),
            onClickFn: () => {},
        },
        {
            name: "help",
            hideIcon: true,
            iconComponent: <HelpIcon />,
            onClickFn: () => {},
        },
        {
            name: "settings",
            hideIcon: true,
            iconComponent: <SettingsIcon />,
            onClickFn: () => {},
        },
        {
            name: "avatar",
            hideIcon: false,
            iconComponent: (
                <Box>
                    <Avatar
                        alt="Remy Sharp"
                        aria-describedby="logout"
                        ref={anchorRef}
                        style={{ cursor: "pointer", height: "32px", width: "32px" }}
                        onClick={handleToggle}
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
                            <MenuItem onClick={() => logoutHandler()}>Logout</MenuItem>
                        </MenuList>
                    </Popover>
                </Box>
            ),
            onClickFn: () => {},
        },
    ];

    const isActive = (currentLink: string) => {
        let paths = pathname.split("/");

        const isRfpProductionActive = paths.includes("rfp") && paths.includes("production");
        return currentLink === "production" ? isRfpProductionActive : !isRfpProductionActive;
    };

    const getPath = (url: string) => {
        if (url.includes(":role") && url.includes(":userID")) {
            return url.replace(":role", role).replace(":userID", userDetails.id);
        }
        return url;
    };

    return (
        <>
            <Grid sx={{ display: "flex", height: "4.5rem" }}>
                <AppBar
                    position="fixed"
                    sx={{
                        boxSizing: "border-box",
                        margin: 0,
                        padding: 0,
                        zIndex: 100,
                        backgroundColor: AppTheme.palette.secondary.light,
                        color: AppTheme.palette.text.primary,
                    }}
                >
                    <Toolbar
                        sx={{ maxHeight: "5.3125rem", marginRight: "1.8rem", marginLeft: "2.2rem" }}
                    >
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
                            onClick={() => {
                                dispatch(actions.biddingPortal.updateSyncTimerStatesStart({}));
                                navigate("/rfp");
                            }}
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
                        <DataSyncStatus
                            visible={showDataSyncStatus}
                            currentState={currentSyncState}
                        />
                        <Box
                            display={"flex"}
                            alignItems="center"
                            sx={{
                                "& .headerTab": {
                                    marginBottom: "auto",
                                    marginLeft: "auto",
                                    alignSelf: "flex-end",
                                    marginTop: "1.5rem",
                                },
                                display: { xs: "none", sm: "block" },
                                flexGrow: 1,
                            }}
                        >
                            <RouterBox>
                                {routesInfo.map((item: any) => {
                                    return isActive(item.Name?.toLowerCase()) ? (
                                        <ActiveRouteLink to={getPath(item.path)} key={item.Name}>
                                            <Typography variant="activeTab">{item.Name}</Typography>
                                        </ActiveRouteLink>
                                    ) : (
                                        <RouteLink to={getPath(item.path)} key={item.Name}>
                                            <Typography variant="tab">{item.Name}</Typography>
                                        </RouteLink>
                                    );
                                })}
                            </RouterBox>
                        </Box>
                        <Typography component="div" sx={{ marginLeft: "auto" }}>
                            {showSearch && (
                                <SearchField
                                    open={searchVisibility}
                                    onClick={() => !searchVisibility && setSearchVisibility(true)}
                                    onClose={() =>
                                        searchValue.length === 0 && setSearchVisibility(false)
                                    }
                                    onSearch={(text) => setSearchValue(text.trim())}
                                    placeholder="Search goes here..."
                                    size="medium"
                                    textFieldSx={{ borderRadius: "50px" }}
                                />
                            )}
                            <KnockFeedProvider
                                apiKey={process.env.REACT_APP_KNOCK_PUBLIC_API_KEY || ""}
                                feedId={process.env.REACT_APP_KNOCK_FEED_CHANNEL_ID || ""}
                                userId={userDetails.id}
                            >
                                <>
                                    <Box display={"flex"} alignItems="center" gap={3}>
                                        {headerIcons.map(
                                            ({ name, hideIcon, iconComponent, onClickFn }) =>
                                                !hideIcon &&
                                                (name === "notification" ? (
                                                    iconComponent
                                                ) : (
                                                    <IconButton
                                                        key={name}
                                                        onClick={onClickFn}
                                                        style={{ padding: 0 }}
                                                    >
                                                        {iconComponent}
                                                    </IconButton>
                                                )),
                                        )}
                                    </Box>
                                    <NotificationFeedPopover
                                        onNotificationClick={(feedData: any) => {
                                            setIsNotificationFeedVisible(false);
                                            onNotificationClick(feedData);
                                        }}
                                        buttonRef={notifButtonRef}
                                        isVisible={isNotificationFeedVisible}
                                        onClose={() => setIsNotificationFeedVisible(false)}
                                    />
                                </>
                            </KnockFeedProvider>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <SideDrawer
                    isOpen={openDrawer}
                    handleDrawerToggle={handleDrawerToggle}
                    drawerWidth={DRAWER_WIDTH}
                    isActive={isActive}
                    routesInfo={routesInfo}
                />
            </Grid>
        </>
    );
};

export default BaseHeader;
