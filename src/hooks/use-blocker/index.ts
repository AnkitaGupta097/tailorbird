import React from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";
import type { History, Blocker, Transition } from "history";

export const useBlocker = (blocker: Blocker, when = true) => {
    //Navigation
    const navigator = React.useContext(UNSAFE_NavigationContext).navigator as History;

    React.useEffect(() => {
        if (!when) return;
        const unblock = navigator.block((tx: Transition) => {
            const autoUnblockingTx = {
                ...tx,
                retry() {
                    unblock();
                    tx.retry();
                },
            };
            blocker(autoUnblockingTx);
        });

        return unblock;
    }, [navigator, blocker, when]);
};
