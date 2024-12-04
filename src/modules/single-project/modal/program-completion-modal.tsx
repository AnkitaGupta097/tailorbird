import React from "react";
import { Box, Dialog, Typography, Button, Divider } from "@mui/material";

import appTheme from "styles/theme";

interface IProgramCompletionModal {
    /* eslint-disable-next-line */
    ProgramCompletionModalHandler: (val: boolean) => void;
    openProgramCompletionModal: boolean;
    backToWelcomePage: any;
    stayInQuestionerePage: any;
}

const ProgramCompletionModal = ({
    ProgramCompletionModalHandler,
    openProgramCompletionModal,
    backToWelcomePage,
    stayInQuestionerePage,
}: IProgramCompletionModal) => {
    return (
        <Dialog
            open={openProgramCompletionModal}
            fullWidth={true}
            maxWidth="sm"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => ProgramCompletionModalHandler(false)}
        >
            <Box p={6}>
                <Typography variant="text_18_bold" color={appTheme.text.dark}>
                    Completed Program
                </Typography>
            </Box>

            <Divider />
            <Box p={6}>
                <Typography variant="text_16_regular" color={appTheme.text.medium}>
                    Youve completed every renovation detail for the title program. Return to the
                    project summary screen to see an overview of all your programs.
                </Typography>
            </Box>

            <Divider />
            <Box p={6} display="flex" justifyContent="flex-end">
                <Button
                    variant="outlined"
                    component="label"
                    style={{ height: "40px", marginRight: "15px" }}
                    onClick={() => {
                        ProgramCompletionModalHandler(false), stayInQuestionerePage();
                    }}
                >
                    <Typography variant="text_16_medium">Cancel</Typography>
                </Button>
                <Button
                    variant="contained"
                    component="label"
                    style={{ height: "40px" }}
                    onClick={() => {
                        ProgramCompletionModalHandler(false), backToWelcomePage();
                    }}
                >
                    <Typography variant="text_16_medium">Go to Summary Page</Typography>
                </Button>
            </Box>
        </Dialog>
    );
};

export default ProgramCompletionModal;
