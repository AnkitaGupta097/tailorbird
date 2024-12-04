import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    styled,
    Typography,
} from "@mui/material";
import { PrimaryButton } from "modules/package-manager/common";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import BaseAutoComplete from "../../../../components/base-auto-complete";
import { SecondaryButton } from "modules/scraper/scraper-file-highlighter";
import { ButtonLabels } from "modules/scraper/constant";
import { handleBulkEdit } from "../common/helper";
import CreateNewCategory from "./create-new-category";

const StyledDialog = styled(Dialog)(() => ({
    "& > .MuiDialog-container > .MuiPaper-root": {
        width: "37rem",
        height: "16.5rem",
    },
}));

const BulkEdit = (props: any) => {
    const [open, setOpen] = React.useState(false);

    const [value, setValue] = React.useState<any>("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onChangeHandler = (value: any) => {
        if (typeof value === "string") {
            setValue(value);
        } else if (value?.name) {
            setValue(value?.name);
        } else {
            setValue("");
        }
    };

    return (
        <Grid item>
            <PrimaryButton variant="contained" onClick={handleClickOpen}>
                <EditIcon sx={{ marginRight: "0.6rem" }} />
                <Typography variant="button">{props?.category?.label}</Typography>
            </PrimaryButton>
            <StyledDialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", color: "##000000" }}>
                        {`Add ${props?.category?.label}`}
                    </Typography>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText sx={{ marginBottom: "0.8rem" }}>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.8rem", color: "#001833" }}>
                            {`Select ${props?.category?.label}`}
                        </Typography>
                    </DialogContentText>
                    {props?.category?.name === "subcategory" ? (
                        <BaseAutoComplete
                            options={props?.category?.options}
                            value={value}
                            variant="outlined"
                            onChangeHandler={onChangeHandler}
                        />
                    ) : (
                        <CreateNewCategory
                            name={props?.category?.name}
                            setState={onChangeHandler}
                            value={value}
                            options={props?.category?.options}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent={"right"} gap="1rem">
                        <Grid item>
                            <SecondaryButton onClick={handleClose}>
                                {ButtonLabels?.ACTIONS?.[0]}
                            </SecondaryButton>
                        </Grid>
                        <Grid item>
                            <PrimaryButton
                                onClick={() => {
                                    handleBulkEdit(
                                        props?.tableData,
                                        props?.category?.name,
                                        value,
                                        props?.setShowDialog,
                                        setOpen,
                                        props?.onCellValueChange,
                                    );
                                }}
                            >
                                {ButtonLabels?.ACTIONS?.[1]}
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </StyledDialog>
        </Grid>
    );
};

export default BulkEdit;
