import {
    Box,
    Divider,
    Drawer,
    LinkProps,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    styled,
} from "@mui/material";
import React from "react";
import AppTheme from "../../styles/theme";
import logo from "../../assets/icons/logo.svg";
import { Link } from "react-router-dom";

interface ISideDrawer {
    container?: any;
    isOpen: boolean;
    handleDrawerToggle: () => void;
    drawerWidth: number;
    // eslint-disable-next-line no-unused-vars
    isActive: (tabName: string) => boolean;
    routesInfo: any;
}

const RouteLink = styled(Link)<LinkProps>(() => ({
    textDecoration: "none",
    color: AppTheme.palette.text.primary,
}));

const SideDrawer: React.FC<ISideDrawer> = ({
    container,
    isOpen,
    handleDrawerToggle,
    drawerWidth,
    isActive,
    routesInfo,
}) => {
    const getPath = (url: string) => {
        if (url.includes(":role") && url.includes(":userID")) {
            const role = localStorage.getItem("role") || "";
            const userID = localStorage.getItem("user_id") || "";

            return url.replace(":role", role).replace(":userID", userID);
        }
        return url;
    };

    return (
        <Box component="nav" sx={{ marginBottom: "2.5rem" }}>
            <Drawer
                container={container}
                variant="temporary"
                open={isOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                }}
            >
                <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        <img src={logo} className="app-logo" alt="app logo" />
                    </Typography>
                    <Divider />
                    <List>
                        {routesInfo.map((item: any) => (
                            <ListItem key={item.Name} disablePadding>
                                <ListItemButton sx={{ textAlign: "center" }}>
                                    <ListItemText
                                        primary={
                                            <RouteLink to={getPath(item.path)} key={item.Name}>
                                                <Typography
                                                    variant={`${
                                                        isActive(item.Name?.toLowerCase())
                                                            ? "activeTab"
                                                            : "tab"
                                                    }`}
                                                >
                                                    {item.Name}
                                                </Typography>
                                            </RouteLink>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};
export default SideDrawer;
