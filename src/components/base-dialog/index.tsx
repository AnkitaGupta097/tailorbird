import React, { ReactNode } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    styled,
    Typography,
    TypographyProps,
    DialogTitleProps,
    DialogProps,
} from "@mui/material";

interface IBaseAddDialog {
    button: ReactNode;
    header?: ReactNode;
    content: ReactNode;
    actions?: ReactNode;
    open: boolean;
    /* eslint-disable-next-line */
    setOpen: (v: boolean) => void;
    [v: string]: any;
}

const StyledSpan = styled(Typography)<TypographyProps>(() => ({
    cursor: "pointer",
}));

const StyledDialogTitle = styled(DialogTitle)<DialogTitleProps>(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px 10px 24px",
}));

const StyledDialog = styled(Dialog)<DialogProps>(() => ({
    "& .MuiPaper-root": {
        maxWidth: "100%",
    },
}));

const BaseDialog = ({
    button,
    header,
    content,
    actions,
    open,
    setOpen,
    ...others
}: IBaseAddDialog) => {
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    return (
        <React.Fragment>
            <StyledSpan onClick={handleOpen} onKeyDown={handleOpen} variant="buttonText">
                {button}
            </StyledSpan>
            <StyledDialog open={open} onClose={handleClose} {...others}>
                {header ? (
                    <StyledDialogTitle className="Base-dialog-header">
                        <Typography variant="dialogHeader" sx={{ width: "100%" }}>
                            {header}
                        </Typography>
                    </StyledDialogTitle>
                ) : null}
                <DialogContent
                    className="Base-dialog-content"
                    sx={{
                        padding: "10px 24px",
                        overflowY: "initial",
                    }}
                >
                    <Typography variant="dialogContent" sx={{ display: "block", width: "100%" }}>
                        {content}
                    </Typography>
                </DialogContent>
                {actions ? (
                    <DialogActions className="Base-dialog-actions">{actions}</DialogActions>
                ) : null}
            </StyledDialog>
        </React.Fragment>
    );
};

export default BaseDialog;
