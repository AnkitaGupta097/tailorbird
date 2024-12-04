import React, { useEffect, useState } from "react";
import { Alert, Box, IconButton, Snackbar, Stack, Typography } from "@mui/material";
import HorizontalLinearStepper from "components/stepper-horizantal";
import { RENO_WIZARD_V2_STEPS } from "../contants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BaseButton from "components/base-button";
import CreateProject from "./create-project";
import PackageSelection from "./package-selection";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RenovationItems from "./renovation-items";
import UploadAndNotes from "./upload-and-notes";
import RenoWizardV2Summary from "./summary";
import ContactTailorbirdModal from "./common/contact-tailorbird-modal";
import { useAppSelector } from "stores/hooks";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import LoadingDialog from "./common/loading-dialog";
import { useParams } from "react-router-dom";

const RenovationWizardV2 = () => {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const steps = RENO_WIZARD_V2_STEPS;

    const { snackbar, projectDetails, submitted, currentStep, loading } = useAppSelector(
        (state) => ({
            snackbar: state.common.snackbar,
            projectDetails: state.singleProject.projectDetails,
            submitted: state.singleProject.renovationWizardV2.submitted,
            currentStep: state.singleProject.renovationWizardV2.currentStep,
            loading: state.singleProject.renovationWizardV2.loading,
        }),
    );

    const [activeStep, setActiveStep] = useState<any>(steps[currentStep]);
    const [savedWithChanges, setSavedWithChanges] = useState<string[]>([]);
    const [showContactTailorbirdModal, setShowContactTailorbirdModal] = useState<boolean>(false);

    useEffect(() => {
        if (
            projectDetails.projectStatus !== "Draft" &&
            projectDetails.projectStatus !== "Pending Design Specifications"
        ) {
            dispatch(actions.singleProject.markRenoWizardAsSubmitted({}));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectDetails.projectStatus]);

    useEffect(() => {
        if (submitted) {
            setSavedWithChanges(steps.map((s: any) => s.value));
            dispatch(actions.singleProject.setRenoWizardV2CurrentStep({ currentStep: 4 }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitted]);

    useEffect(() => {
        setSavedWithChanges(steps.slice(0, currentStep).map((s: any) => s.value));
        setActiveStep(steps[currentStep]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    const emailToTBAdmin = () => {
        console.log("sending email to tailorird");
        dispatch(actions.singleProject.contactTailorbird({ project_id: projectId }));
        toggleContactTailorbirdModal();
    };

    const toggleContactTailorbirdModal = () => {
        setShowContactTailorbirdModal(!showContactTailorbirdModal);
    };

    const goToPreviousPage = () => {
        dispatch(actions.singleProject.decRenoWizardV2CurrentStep({}));
    };

    return (
        <Stack>
            <Stack direction="row" justifyContent="left" alignItems="center">
                <Box width={"20%"}>
                    {!submitted && activeStep?.backLabel && (
                        <BaseButton
                            variant="text"
                            label={activeStep.backLabel}
                            onClick={goToPreviousPage}
                            sx={{
                                fontSize: 14,
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                            }}
                            startIcon={<ArrowBackIcon />}
                        />
                    )}
                </Box>
                <Box
                    width={"80%"}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <HorizontalLinearStepper
                        steps={RENO_WIZARD_V2_STEPS}
                        activeStep={activeStep.value}
                        background="white"
                        savedWithChanges={savedWithChanges}
                    />
                </Box>
            </Stack>
            <Box py={2}>
                {activeStep.value === "CREATE_PROJECT" && <CreateProject />}
                {activeStep.value === "PACKAGE_SELECTION" && <PackageSelection />}
                {activeStep.value === "APPLIED_PROPERTY_DATA" && <RenovationItems />}
                {activeStep.value === "UPLOAD_AND_NOTES" && <UploadAndNotes />}
                {activeStep.value === "SUMMARY" && <RenoWizardV2Summary />}
            </Box>
            <Box position="fixed" bottom={40} right={-5}>
                <Box sx={{ borderRadius: 2, background: "#004d71" }}>
                    <IconButton onClick={toggleContactTailorbirdModal}>
                        <ChatBubbleOutlineIcon sx={{ color: "white" }} />
                    </IconButton>
                </Box>
                {/* <BaseButton
                    label=""
                    variant="contained"
                    onClick={toggleContactTailorbirdModal}
                    startIcon={<ChatBubbleOutlineIcon />}
                    sx={{
                        padding: 0,
                        margin: 0,
                        minWidth: 60,
                    }}
                /> */}
            </Box>
            <ContactTailorbirdModal
                open={showContactTailorbirdModal}
                onClose={toggleContactTailorbirdModal}
                onSend={emailToTBAdmin}
            />
            <LoadingDialog open={!!loading} />

            <Snackbar
                open={snackbar.open}
                onClose={() => dispatch(actions.common.closeSnack())}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={3000}
            >
                <Alert
                    onClose={() => dispatch(actions.common.closeSnack())}
                    severity={snackbar.variant}
                >
                    <Typography variant="text_16_regular"> {snackbar.message}</Typography>
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default RenovationWizardV2;
