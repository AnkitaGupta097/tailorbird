import React from "react";
import { Badge } from "@mui/material";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { TypeIcon } from "./TypeIcon";
import styles from "./MultipleDragPreview.module.css";

type Props = {
    dragSources: NodeModel[];
};

export const MultipleDragPreview: React.FC<Props> = (props) => {
    return (
        <Badge
            classes={{ badge: styles.badge }}
            color="error"
            badgeContent={props.dragSources.length}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <div className={styles.root} data-testid="custom-drag-preview">
                {props.dragSources.map((node) => (
                    <div key={node.id} className={styles.item}>
                        <div className={styles.icon}>
                            <TypeIcon droppable={node.droppable || false} />
                        </div>
                        <div className={styles.label}>{node.text}</div>
                    </div>
                ))}
            </div>
        </Badge>
    );
};
