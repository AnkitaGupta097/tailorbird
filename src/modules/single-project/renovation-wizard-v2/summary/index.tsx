import React, { useEffect, useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import PackageSideNav from "../renovation-items/package-sidenav";
import BaseButton from "components/base-button";
import GroupedRenovationItems from "../renovation-items/grouped-renovation-items";
import RenoWizardV2Notes from "../upload-and-notes/notes";
import RenoWizardV2Uploads from "../upload-and-notes/uploads";
import { useAppSelector } from "stores/hooks";
import ConfirmationDialog from "../common/confirmation-dialog";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import { useParams } from "react-router-dom";
import DoneIcon from "assets/icons/check_circle.svg";

const RenoWizardV2Summary = () => {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const { submitted, projectDetails } = useAppSelector((state) => ({
        submitted: state.singleProject.renovationWizardV2.submitted,
        projectDetails: state.singleProject.projectDetails,
        basePackage: state.singleProject.renovationWizardV2.basePackage.data,
    }));

    useEffect(() => {
        if (submitted) {
            dispatch(
                actions.singleProject.getProjectContainerStart({
                    project_id: projectId,
                    is_active: true,
                }),
            );
            dispatch(
                actions.singleProject.getProjectCodicesStart({
                    project_id: projectId,
                }),
            );
            dispatch(
                actions.singleProject.getRenovationItemsStart({
                    project_id: projectId,
                    is_active: false,
                }),
            );
            dispatch(
                actions.singleProject.getProjectScopeDocumentStart({
                    project_id: projectId,
                    file_type: "PROJECT_SCOPE_DOCUMENT",
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitted]);
    const [showSubmissionConfirmationModal, setShowSubmissionConfirmationModal] =
        useState<boolean>(false);

    const toggleShowSubmissionConfirmationModal = () => {
        setShowSubmissionConfirmationModal(!showSubmissionConfirmationModal);
    };

    const submit = () => {
        dispatch(
            actions.singleProject.updateSingleProjectStatusStart({
                input: {
                    user_id: localStorage.getItem("user_id"),
                    status: "Bidbook Documents in Creation",
                    project_id: projectDetails.id,
                },
                markSubmitted: true,
            }),
        );
        toggleShowSubmissionConfirmationModal();
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
                            {submitted
                                ? "This submission has been submitted for bidding"
                                : "Congratulations. Your selections are finished."}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="text_16_light">
                            {submitted
                                ? "Thanks for your help"
                                : "Please submit once you are ready"}
                        </Typography>
                    </Box>
                </Box>
                <Box paddingY={4} display="flex" justifyContent="end" alignItems="end">
                    <Box>
                        {submitted ? (
                            <Box
                                sx={{
                                    padding: 2,
                                    background: "#F1F8F5",
                                    border: "solid 1px #00B779",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <img src={DoneIcon} alt="" />
                                Submitted for bidding
                            </Box>
                        ) : (
                            <BaseButton
                                sx={{ margin: 0, background: "#00AD73!important" }}
                                label="Submit for Bidding"
                                type="active"
                                onClick={toggleShowSubmissionConfirmationModal}
                            />
                        )}
                    </Box>
                </Box>
                <RenoWizardV2Uploads />
                <Box marginY={8}>
                    <Divider />
                </Box>
                <RenoWizardV2Notes showSaveButton={true} title="Your submitted text is below" />
                <GroupedRenovationItems readOnly={true} />
            </Stack>
            {showSubmissionConfirmationModal && (
                <ConfirmationDialog
                    title="Confirm Selection"
                    content={
                        <Box>
                            <Box pb={4}>
                                Are you sure that you would like to continue with your selections?
                            </Box>
                            <Box>
                                Once submitted, these selections will be sent to our team to make
                                sure everything is correct and then sent for bidding. You will not
                                be able to make changes after this is submitted.
                            </Box>
                        </Box>
                    }
                    open={showSubmissionConfirmationModal}
                    onCancel={toggleShowSubmissionConfirmationModal}
                    onDone={submit}
                />
            )}
        </Stack>
    );
};

export default RenoWizardV2Summary;
