/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { useNavigate } from "react-router-dom";
import ConfirmationModal from "components/confirmation-modal";

export default function InviteRedirectConfirmation() {
    const { isAuthenticated, logout } = useAuth0();
    const [openDailog, setOpenDailog] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) setOpenDailog(true);
        else setOpenDailog(false);
    }, [isAuthenticated]);

    const handleClose = () => {
        setOpenDailog(false);
        navigate("/");
    };

    const logoutHandler = () => {
        logout({ returnTo: process.env.REACT_APP_BASE_URL });
        localStorage.clear();
        setOpenDailog(false);
    };

    return (
        <ConfirmationModal
            text="Looks like you already have an active session on this device!
            Please choose how you'd like to proceed."
            onCancel={() => handleClose()}
            onProceed={logoutHandler}
            open={openDailog}
            actionText="Log out and create new session"
            cancelText={"Remain in active session"}
        />
    );
}
