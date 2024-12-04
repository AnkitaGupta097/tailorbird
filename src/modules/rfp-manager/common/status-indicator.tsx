import React, { FC, useEffect } from "react";
import LockIcon from "@mui/icons-material/Lock";
import { Link, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import IdleTimer from "./idle-timer";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import { BIDS_STATUSES, STATUS_INDICATOR_CONSTANTS } from "./constants";
import { isUndefined } from "lodash";

const StatusIndicator: FC<{
    bidResponseItem: any[];
    bidStatus: string | undefined;
    organization_id?: string;
}> = ({ bidStatus, organization_id }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userID, projectId } = useParams();
    const { isEditable, currentEditingUser, isIdle, isOffline, syncTimeout } = useAppSelector(
        (state) => ({
            isEditable: state.biddingPortal.isEditable,
            selectedVersion: state.biddingPortal.selectedVersion,
            currentEditingUser: state.biddingPortal.currentEditingUser,
            isIdle: state.biddingPortal.isIdle,
            isOffline: state.biddingPortal.isOffline,
            syncTimeout: state.biddingPortal.syncTimeout,
        }),
    );
    useEffect(() => {
        //* Action Causing all tabs to go offline if one goes offline
        const offlineAction = () => {
            if (!navigator.onLine) dispatch(actions.biddingPortal.markOffline({}));
        };

        const onlineAction = () => {
            dispatch(actions.biddingPortal.markOnline({}));
            dispatch(
                actions.biddingPortal.lockProjectForEditingStart({
                    userId: userID,
                    projectId,
                    organization_id,
                }),
            );
        };

        //* first time when page render it has to invoke because event listener won't trigger every time
        if (
            !isUndefined(bidStatus) &&
            bidStatus?.toLowerCase() !== "submitted" &&
            isUndefined(isEditable)
        ) {
            onlineAction();
        }

        window.addEventListener("offline", offlineAction);
        window.addEventListener("online", onlineAction);

        return () => {
            window.removeEventListener("offline", offlineAction);
            window.removeEventListener("online", onlineAction);
        };
        //eslint-disable-next-line
    }, [bidStatus]);

    return (
        <>
            {!isEditable && !isIdle && !isOffline ? (
                <Stack
                    width="100%"
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    color="#916A00"
                    p="1.15rem 0rem 0.75rem 0rem"
                    sx={{
                        backgroundColor: "#FFD79D",
                        position: "fixed",
                        zIndex: 100,
                    }}
                >
                    <LockIcon fontSize="small" htmlColor="#916A00" />
                    <Typography variant="text_14_regular">
                        <span
                            style={{
                                fontWeight: "600",
                            }}
                        >
                            {STATUS_INDICATOR_CONSTANTS.READ_ONLY}
                        </span>
                        {currentEditingUser ? (
                            <>
                                {STATUS_INDICATOR_CONSTANTS.EDITING_BY(currentEditingUser)}
                                <Link
                                    onClick={() => navigate(0)}
                                    sx={{
                                        "&:hover": {
                                            cursor: "pointer",
                                        },
                                        padding: "0 0.25rem",
                                        margin: 0,
                                    }}
                                    color="#916A00"
                                >
                                    {STATUS_INDICATOR_CONSTANTS.REFRESH}
                                </Link>
                                {STATUS_INDICATOR_CONSTANTS.AFTER_CLOSED_PROJECT}
                            </>
                        ) : /* TODO: Add more conditions to display appropriate text */
                        bidStatus === BIDS_STATUSES.SUBMITTED ? (
                            "The bid for this project has already been submitted and cannot be edited anymore"
                        ) : (
                            ""
                        )}
                    </Typography>
                </Stack>
            ) : null}
            {isEditable && !isOffline ? (
                <IdleTimer
                    onIdle={() =>
                        dispatch(
                            actions.biddingPortal.unlockProjectForEditingStart({
                                userId: userID,
                                projectId,
                                organization_id,
                            }),
                        )
                    }
                />
            ) : null}
            {isOffline ? (
                <Stack
                    width="100%"
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    color="#D72C0D"
                    p="1.15rem 0rem 0.75rem 0rem"
                    sx={{
                        backgroundColor: "#FED3D1",
                        position: "fixed",
                        zIndex: 100,
                    }}
                >
                    <CloudOffIcon fontSize="small" htmlColor="#D72C0D" />
                    <Typography variant="text_14_regular">
                        <span
                            style={{
                                fontWeight: "600",
                                padding: "0 .25rem",
                            }}
                        >
                            {STATUS_INDICATOR_CONSTANTS.OFFLINE}
                        </span>
                        {STATUS_INDICATOR_CONSTANTS.CHECKING_FOR_INTERNET}
                        {STATUS_INDICATOR_CONSTANTS.ALSO_TRY_TO}
                        <Link
                            onClick={() => window.location.reload()}
                            sx={{
                                "&:hover": {
                                    cursor: "pointer",
                                },
                                padding: "0 0.25rem",
                                margin: 0,
                            }}
                            color="#D72C0D"
                        >
                            {STATUS_INDICATOR_CONSTANTS.RELOAD}
                        </Link>
                        {STATUS_INDICATOR_CONSTANTS.WHEN_ONLINE}
                    </Typography>
                </Stack>
            ) : null}
            {syncTimeout ? (
                <Stack
                    width="100%"
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    color="#D72C0D"
                    p="1.15rem 0rem 0.75rem 0rem"
                    sx={{
                        backgroundColor: "#FED3D1",
                        position: "fixed",
                        zIndex: 100,
                    }}
                >
                    <SyncDisabledIcon fontSize="small" htmlColor="#D72C0D" />
                    <Typography variant="text_14_regular">
                        <span
                            style={{
                                fontWeight: "600",
                                padding: "0 .25rem",
                            }}
                        >
                            {STATUS_INDICATOR_CONSTANTS.CANT_SYNC}
                        </span>
                        {STATUS_INDICATOR_CONSTANTS.CONTACT_TAILORBIRD}
                    </Typography>
                </Stack>
            ) : null}
        </>
    );
};

export default StatusIndicator;
