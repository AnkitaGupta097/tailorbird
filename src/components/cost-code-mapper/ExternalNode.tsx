import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import Typography from "@mui/material/Typography";
import { TypeIcon } from "./TypeIcon";
import styles from "./ExternalNode.module.css";

export const ExternalNode = (props: any) => {
    const { droppable } = props.node;
    const [, drag, dragPreview] = useDrag({
        type: "EXTERNAL_NODE",
        item: props.node,
    });

    useEffect(() => {
        dragPreview(getEmptyImage(), { captureDraggingState: true });
    }, [dragPreview]);

    return (
        <div ref={drag} className={styles.root}>
            <div className={styles.filetype}>
                <TypeIcon droppable={droppable || false} />
            </div>
            <div className={styles.label}>
                <Typography variant="body2">{props.node.text}</Typography>
            </div>
        </div>
    );
};
