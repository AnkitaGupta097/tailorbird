import React, { useState, useRef, useEffect } from "react";
import {
    CONTACT_TAILORBIRD_PART1,
    CONTACT_TAILORBIRD_PART2,
    DATA_SAVED_TO_DEVICE,
    DATA_SYNC_COMPLETED,
    DATA_SYNC_FAILED,
    DATA_SYNC_IN_PROGRESS,
    DONOT_EDIT_PAGE,
    USER_OFFLINE,
    DEFAULT,
} from "./constants";
import offlineLogo from "../../assets/icons/offline.svg";
import savedToDevice from "../../assets/icons/saved-to-device.svg";
import saveInProgress from "../../assets/icons/save-in-progress.svg";
import savedToCloud from "../../assets/icons/saved-to-cloud.svg";
import saveFailed from "../../assets/icons/not-saved.svg";
import { Typography } from "@mui/material";
import AppTheme from "styles/theme";
import MyTimer from "components/timer/timer";
import { useAppSelector } from "stores/hooks";

interface IDataStates {
    visible: boolean;
    currentState?: string;
}

const dataSyncStatusImgSx: React.CSSProperties = {
    width: "16.67px",
    height: "13.33px",
    margin: `0 5.67px -2px 0`,
    opacity: 0.5,
};

const dataSyncTextSx: React.CSSProperties = {
    display: "flex",
    fontFamily: "Roboto, Sans-Serif",
    fontWeight: 500,
    color: AppTheme.text.medium,
    marginRight: "0.5rem",
};

const DataSyncStates: { [index: string]: { icon: string; msg: string; altText: string } } = {
    [DATA_SAVED_TO_DEVICE]: {
        icon: savedToDevice,
        msg: "Saved to this device",
        altText: "saved to device icon",
    },
    [DATA_SYNC_COMPLETED]: {
        icon: savedToCloud,
        msg: "Saved",
        altText: "saved icon",
    },
    [DATA_SYNC_FAILED]: {
        icon: saveFailed,
        msg: "Not Saved",
        altText: "not saved icon",
    },
    [DATA_SYNC_IN_PROGRESS]: {
        icon: saveInProgress,
        msg: "Saving...",
        altText: "saving icon",
    },
    [USER_OFFLINE]: {
        icon: offlineLogo,
        msg: "Offline",
        altText: "offline icon",
    },
    [DEFAULT]: {
        icon: "",
        msg: "",
        altText: "",
    },
};

type RestartTimer = React.ElementRef<typeof MyTimer>;

const DataSyncStatus: React.FC<IDataStates> = ({ visible, currentState }) => {
    const { responseError } = useAppSelector((state: any) => ({
        responseError: state.biddingPortal.responseError,
    }));
    const [startTimer, setStartTimer] = useState(false);
    const [expiryInSeconds, setExpiryInSeconds] = useState(120);
    const timerRef = useRef<RestartTimer>(null);

    useEffect(() => {
        setStartTimer(responseError);
        setExpiryInSeconds(120);
        timerRef.current?.restartTimer();
    }, [startTimer, responseError]);

    if (visible && currentState) {
        const { icon, msg, altText } = DataSyncStates[currentState];
        return (
            <>
                <Typography variant="text_12_regular" sx={dataSyncTextSx}>
                    <img src={icon} alt={altText} style={dataSyncStatusImgSx} />
                    <span>{msg}</span>
                </Typography>
                {startTimer && (
                    <MyTimer
                        ref={timerRef}
                        expiryInSeconds={expiryInSeconds}
                        preText={`${DONOT_EDIT_PAGE} ${CONTACT_TAILORBIRD_PART1}`}
                        postText={CONTACT_TAILORBIRD_PART2}
                    />
                )}
            </>
        );
    }

    return <></>;
};

export default DataSyncStatus;
