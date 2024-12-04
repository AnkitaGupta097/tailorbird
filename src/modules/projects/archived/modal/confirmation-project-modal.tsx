import React from "react";
import { Stack, Box, Typography, CardMedia } from "@mui/material";
import question from "../../../../assets/icons/question.png";
import BaseDialog from "../../../../components/base-dialog";
import { PrimaryButton, SecondaryButton } from "../../../scraper/scraper-file-highlighter";
interface IConfirmationProjectModal {
    onProceed: any;
    onCancel: any;
    text?: String;
    open: boolean;
    variant?: String;
}

const ConfirmationProjectModal = ({
    text,
    onProceed,
    onCancel,
    open,
}: IConfirmationProjectModal) => {
    return (
        <Box>
            <BaseDialog
                button={null}
                content={
                    <React.Fragment>
                        <Stack alignItems="center" justifyContent="center" p="1rem">
                            <CardMedia
                                component="img"
                                src={question}
                                alt="question"
                                style={{ height: "8rem", width: "8rem" }}
                            />
                            <Typography variant="loaderText" maxWidth="50%" textAlign="center">
                                {text}
                            </Typography>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={8}
                                mt="1rem"
                            >
                                <SecondaryButton
                                    sx={{ width: "auto", minWidth: "0", padding: "1rem 1.25rem" }}
                                    onClick={onCancel}
                                >
                                    <Typography variant="loaderText" textAlign="center">
                                        No
                                    </Typography>
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={onProceed}
                                    sx={{ width: "auto", minWidth: "0", padding: "1rem 1.25rem" }}
                                >
                                    <Typography variant="loaderText" textAlign="center">
                                        Yes
                                    </Typography>
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                    </React.Fragment>
                }
                open={open}
                setOpen={onCancel}
            />
        </Box>
    );
};

export default ConfirmationProjectModal;
