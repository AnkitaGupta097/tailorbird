import React, { forwardRef, useImperativeHandle } from "react";
import { useTimer } from "react-timer-hook";

interface ITimer {
    startTimer?: boolean;
    expiryInSeconds: number;
    expiryTimestamp?: any;
    preText?: string;
    postText?: string;
}

interface Restart {
    restartTimer(): void;
}

const timerTextSx: React.CSSProperties = {
    fontFamily: "Roboto, Sans-Serif",
    fontWeight: 500,
    fontSize: "12px",
    color: "#B98900",
    marginRight: "0.5rem",
    marginLeft: "0.5rem",
};

const MyTimer: React.ForwardRefRenderFunction<Restart, ITimer> = (
    { expiryInSeconds, preText, postText },
    ref,
) => {
    let time = new Date();
    time.setSeconds(time.getSeconds() + expiryInSeconds);
    const { seconds, minutes, restart } = useTimer({
        expiryTimestamp: time,
        onExpire: () => console.warn("onExpire called"),
    });

    useImperativeHandle(ref, () => ({
        restartTimer() {
            let newTime = new Date();
            newTime.setSeconds(time.getSeconds() + 120);
            restart(newTime);
        },
    }));

    return (
        <div style={timerTextSx}>
            <span>{`${preText} `}</span>
            <span>{minutes}</span>:<span>{seconds}</span>
            <span>{"(timer)"}</span>
            <span>{` ${postText}`}</span>
        </div>
    );
};

export default forwardRef(MyTimer);
