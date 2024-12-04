import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "./TypeIcon";
import styles from "./CustomNode.module.css";
import { Box, Card, IconButton } from "@mui/material";
import { useDragOver } from "@minoru/react-dnd-treeview";
import { Delete } from "@mui/icons-material";

export const CustomNode = (props: any) => {
    const { droppable, id } = props.node;
    const indent = props.depth * 24;
    const [hover, setHover] = useState<boolean>(false);

    const handleToggle = (e: any) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    };

    const handleClick = (e: React.MouseEvent) => {
        props.onClick && props.onClick(e, props.node);
    };

    if (props.isSelected) {
        props.containerRef.current?.classList.add(styles.selected);
    } else {
        props.containerRef.current?.classList.remove(styles.selected);
    }

    if (props.isDragging) {
        props.containerRef.current?.classList.add(styles.dragging);
    } else {
        props.containerRef.current?.classList.remove(styles.dragging);
    }

    const dragOverProps = useDragOver(props.node.id, props.isOpen, props.onToggle);

    if (!droppable) {
        let backgroundColor = "";
        if (props.node.work_type?.toLowerCase() == "labor") {
            backgroundColor = "#efefef";
        }
        if (props.isSelected) backgroundColor = "#e8f0fe";
        return (
            <Box
                style={{ marginBottom: "4px" }}
                onClick={handleClick}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Card style={{ padding: "4px", backgroundColor: backgroundColor, display: "flex" }}>
                    <Box>
                        <Typography fontSize={10}>{props.node.subcategory}</Typography>
                        <Typography fontSize={8}>{props.node.work_type}</Typography>
                    </Box>
                    <Box>
                        {props.showDelete && hover && (
                            <>
                                <div className={styles.actionButton}>
                                    <IconButton size="small" onClick={() => props.onDelete(id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </div>
                            </>
                        )}
                    </Box>
                </Card>
            </Box>
        );
    }
    return (
        <Box
            className={`tree-node ${styles.root}`}
            style={{ paddingInlineStart: indent }}
            onClick={handleClick}
            {...dragOverProps}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""}`}>
                {props.node.droppable && (
                    <div
                        onClickCapture={(e) => {
                            if (e.detail == 1) {
                                handleToggle(e);
                            }
                        }}
                    >
                        <ArrowRightIcon />
                    </div>
                )}
            </div>
            <TypeIcon droppable={droppable || false} />
            <div
                className={styles.labelGridItem}
                onClickCapture={(e) => {
                    if (e.detail == 2) {
                        const new_value = window.prompt("Rename category to?", props.node.text);
                        if (!new_value?.trim()) {
                            alert("Description value cannot be empty");
                            return false;
                        }
                        const new_cost_code = window.prompt(
                            "Change cost code to?",
                            props.node.costCode,
                        );
                        if (!new_cost_code?.trim()) {
                            alert("Cost Code value cannot be empty");
                            return false;
                        }
                        props.onTextChange(props.node, {
                            description: new_value,
                            cost_code: new_cost_code,
                        });
                    }
                }}
            >
                <Typography variant="body2">{props.node.text}</Typography>
                {props.node.costCode && (
                    <Typography fontSize={8}>Cost Code: {props.node.costCode}</Typography>
                )}
            </div>
            {props.showDelete && hover && (
                <>
                    <div className={styles.actionButton}>
                        <IconButton size="small" onClick={() => props.onDelete(id)}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </div>
                </>
            )}
        </Box>
    );
};
