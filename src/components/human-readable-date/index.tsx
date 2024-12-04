import moment from "moment";
import React, { ComponentProps, useEffect, useState } from "react";
import TrackerUtil from "utils/tracker";

type HumanReadableDataProps = ComponentProps<"div"> & { dateString: string };

const HumanReadableData = ({ dateString, ...props }: HumanReadableDataProps) => {
    const [formattedDate, setFormattedDate] = useState("");
    useEffect(() => {
        try {
            dateString
                ? setFormattedDate(moment.parseZone(dateString).local().format("MM/DD/YYYY"))
                : setFormattedDate("-");
        } catch (error) {
            console.error("HumanReadableData parse error");
            TrackerUtil.error(error, {});
        }
    }, [dateString]);
    return <div {...props}>{formattedDate}</div>;
};

export default HumanReadableData;
