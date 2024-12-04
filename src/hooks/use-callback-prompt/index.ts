import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBlocker } from "../use-blocker";

export const useCallbackPrompt = (when: boolean) => {
    //Navigation
    const navigate = useNavigate();
    const location = useLocation();

    //States
    const [showPrompt, setShowPrompt] = useState(false);
    const [lastLocation, setLastLocation] = useState<any>(null);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);

    const cancelNavigation = useCallback(() => {
        setShowPrompt(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handle blocking when user click on another route prompt will be shown
    const handleBlockedNavigation = useCallback(
        (nextLocation: { location: { pathname: string; state: string } }) => {
            // in if condition we are checking next location and current location are equals or not
            if (
                !confirmedNavigation &&
                nextLocation.location.pathname !== location.pathname &&
                nextLocation.location.state !== "no warning"
            ) {
                setShowPrompt(true);
                setLastLocation(nextLocation);
                return false;
            }
            return true;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [confirmedNavigation],
    );

    const confirmNavigation = useCallback(() => {
        setShowPrompt(false);
        setConfirmedNavigation(true);
    }, []);

    useEffect(() => {
        if (confirmedNavigation && lastLocation) {
            navigate(lastLocation.location.pathname);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirmedNavigation, lastLocation]);

    //@ts-ignore
    useBlocker(handleBlockedNavigation, when);

    return [showPrompt, confirmNavigation, cancelNavigation];
};
