import React, { useState } from "react";
import {
    Button,
    Select,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import styles from "./AddDialog.module.css";

export const AddDialog = (props: any) => {
    const [text, setText] = useState("");
    const [costCode, setCostCode] = useState("");
    const fileType = "text";
    const [parent, setParent] = useState(0);
    const droppable = true;

    const handleChangeText = (e: any) => {
        setText(e.target.value);
    };

    const handleChangeParent = (e: any) => {
        setParent(Number(e.target.value));
    };

    return (
        <Dialog open={true} onClose={props.onClose}>
            <DialogTitle>Add New Category/Description/Node</DialogTitle>
            <DialogContent className={styles.content}>
                <div>
                    <TextField
                        label="Name or Description"
                        onChange={handleChangeText}
                        value={text}
                    />
                </div>
                <div>
                    <TextField
                        label="Cost Code"
                        onChange={(e) => {
                            setCostCode(e.target.value);
                        }}
                        value={costCode}
                    />
                </div>
                <div>
                    <FormControl className={styles.select}>
                        <InputLabel>Parent</InputLabel>
                        <Select label="Parent" onChange={handleChangeParent} value={parent}>
                            <MenuItem value={0}>(root)</MenuItem>
                            {props.tree
                                .filter((node: any) => node.droppable === true)
                                .map((node: any) => (
                                    <MenuItem key={node.id} value={node.id}>
                                        {node.text}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button
                    disabled={text === ""}
                    onClick={() =>
                        props.onSubmit({
                            text,
                            costCode,
                            parent,
                            droppable,
                            data: {
                                fileType,
                            },
                        })
                    }
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};
