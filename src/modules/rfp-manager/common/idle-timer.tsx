import AvTimerIcon from "@mui/icons-material/AvTimer";
import { Stack, Typography, Link } from "@mui/material";
import React from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { IIdleTimer } from "./interfaces";
import { IDLE_MODE_CONSTANTS } from "./constants";

const IdleTimer: React.FC<IIdleTimer> = ({ onIdle }) => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const { isIdle } = useAppSelector((state) => ({
        isIdle: state.biddingPortal.isIdle,
    }));
    const navigate = useNavigate();
    const { getRemainingTime } = useIdleTimer({
        crossTab: true,
        timeout: 1000 * 60 * 15,
        syncTimers: 50,
        name: projectId,
        onIdle: () => onIdle,
    });
    React.useEffect(() => {
        const interval = isIdle
            ? undefined
            : setInterval(() => {
                  if (Math.ceil(getRemainingTime() / 1000) === 0) {
                      dispatch(actions.biddingPortal.enableIdleMode({}));
                  }
              }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    return isIdle ? (
        <>
            <Stack
                width="100%"
                direction="row"
                alignItems="center"
                justifyContent="center"
                color="#1F7A76"
                p="1rem 0rem .75rem 0rem"
                sx={{
                    backgroundColor: "#A4E8F2",
                    position: "fixed",
                    zIndex: 100,
                }}
            >
                <AvTimerIcon fontSize="small" htmlColor="#1F7A76" /> &nbsp;
                <Typography variant="text_14_regular">
                    <span
                        style={{
                            fontWeight: "600",
                        }}
                    >
                        {IDLE_MODE_CONSTANTS.IDLE_MODE} &nbsp;
                    </span>
                    {IDLE_MODE_CONSTANTS.AWAY_FOR_SOMETIMTE}
                    <Link
                        onClick={() => navigate(0)}
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                            },
                            padding: "0 0.25rem",
                            margin: 0,
                        }}
                        color="#1F7A76"
                    >
                        {IDLE_MODE_CONSTANTS.REFRESH}
                    </Link>
                    {IDLE_MODE_CONSTANTS.CONTINUE_EDITING}
                </Typography>
            </Stack>
        </>
    ) : null;
};

export default IdleTimer;
