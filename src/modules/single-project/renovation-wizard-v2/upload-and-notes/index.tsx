import React, { useRef } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import BaseButton from "components/base-button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PackageSideNav from "../renovation-items/package-sidenav";
import RenoWizardV2Uploads from "./uploads";
import RenoWizardV2Notes from "./notes";

const UploadAndNotes = () => {
    const notesRef = useRef();

    const proceed = () => {
        // @ts-ignore
        notesRef.current.saveNotesAndGoToNext();
    };

    return (
        <Stack direction="row" py={0}>
            <Stack style={{ border: "solid 1px #C9CCCF" }} width="15%" margin={2} padding={2}>
                <PackageSideNav />
            </Stack>
            <Stack flexGrow={1}>
                <Box>
                    <Box>
                        <Typography variant="text_34_medium">
                            Add any additional documents and information below
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="text_16_light">
                            You may upload any supporting scope documents to help our team
                        </Typography>
                    </Box>
                </Box>
                <Box paddingY={4} display="flex" justifyContent="end" alignItems="end">
                    <Box>
                        <BaseButton
                            sx={{ margin: 0 }}
                            label="Continue to Next Step"
                            variant="contained"
                            type="active"
                            onClick={proceed}
                            endIcon={<ArrowForwardIosIcon />}
                        />
                    </Box>
                </Box>
                <RenoWizardV2Uploads />
                <Box marginY={8}>
                    <Divider />
                </Box>
                <RenoWizardV2Notes ref={notesRef} />
            </Stack>
        </Stack>
    );
};

export default UploadAndNotes;
