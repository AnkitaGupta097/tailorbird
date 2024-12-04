import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import BaseButton from "components/base-button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ContactTailorbirdModal from "../common/contact-tailorbird-modal";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import { useAppSelector } from "stores/hooks";
import { useParams } from "react-router-dom";

const CreateProject = () => {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const { projectDetail } = useAppSelector((state) => ({
        projectDetail: state.singleProject.projectDetails,
    }));

    const [showContactTailorbirdModal, setShowContactTailorbirdModal] = useState<boolean>(false);

    const emailToTBAdmin = () => {
        console.log("sending email to tailorird");
        dispatch(actions.singleProject.contactTailorbird({ project_id: projectId }));
        toggleContactTailorbirdModal();
    };

    const toggleContactTailorbirdModal = () => {
        setShowContactTailorbirdModal(!showContactTailorbirdModal);
    };

    const updateProjectStatusToDraft = () => {
        console.log("updating the project status");
        // TODO: update project status to draft

        dispatch(
            actions.singleProject.updateSingleProjectStatusStart({
                input: {
                    user_id: localStorage.getItem("user_id"),
                    status: "Draft",
                    project_id: projectDetail.id,
                },
                goToNextPage: true,
            }),
        );
    };

    return (
        <Stack justifyContent="center" paddingX={4}>
            <Box display="flex" justifyContent="center">
                <Box>
                    <Box>
                        <Typography variant="text_34_medium">
                            Welcome to Renovation Wizard. Please create a project to begin
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="text_16_light">
                            Use this tool to easily see all the data that relates to your renovation
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                p={{ xs: 10, sm: 15, lg: 20 }}
                paddingX={{ xs: 10, sm: 20, md: 30, lg: 40, xl: 60 }}
            >
                <Box>
                    <Typography>
                        Renovation Wizard allows you to quickly select a previously used scope and
                        package and apply it to a project you would like to get done.
                    </Typography>
                    <Typography sx={{ pt: 2 }}>
                        If all of your unit interiors have the same finish, then Renovation Wizard
                        may be the right tool for you. If you have a more complex project, like with
                        multiple tiers of finishes, feel free to use the button below to tell us
                        about it.
                    </Typography>
                </Box>
                <Box pt={10} display="flex" justifyContent="space-between">
                    <BaseButton
                        sx={{ marginRight: 2 }}
                        label="Have multiple tiers of finishes? Contact Tailorbird directly"
                        onClick={toggleContactTailorbirdModal}
                        variant="outlined"
                    />
                    <BaseButton
                        sx={{ margin: 0 }}
                        label="Continue to Next Step"
                        variant="contained"
                        type="active"
                        onClick={updateProjectStatusToDraft}
                        endIcon={<ArrowForwardIosIcon />}
                    />
                </Box>
            </Box>
            <ContactTailorbirdModal
                open={showContactTailorbirdModal}
                onClose={toggleContactTailorbirdModal}
                onSend={emailToTBAdmin}
            />
        </Stack>
    );
};

export default CreateProject;
