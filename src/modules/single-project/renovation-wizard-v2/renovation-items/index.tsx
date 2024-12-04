import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import ConfirmationDialog from "../common/confirmation-dialog";
import PackageSideNav from "./package-sidenav";
import GroupedRenovationItems from "./grouped-renovation-items";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import { useAppSelector } from "stores/hooks";

const RenovationItems = () => {
    const [showDeleteMaterialSpecModal, setShowDeleteMaterialSpecModal] = useState<boolean>(false);

    const dispatch = useDispatch();
    const { projectDetails, renovationItemsLoading, projectContainerLoading, basePackage } =
        useAppSelector((state) => ({
            projectDetails: state.singleProject.projectDetails,
            renovationItemsLoading: state.singleProject.renovationWizardV2.renovationItems.loading,
            projectContainerLoading:
                state.singleProject.renovationWizardV2.projectContainer.loading,
            basePackage: state.singleProject.renovationWizardV2.basePackage.data,
        }));

    useEffect(() => {
        // Get project-container
        dispatch(
            actions.singleProject.getProjectContainerStart({
                project_id: projectDetails.id,
                is_active: true,
            }),
        );
        dispatch(
            actions.singleProject.getProjectCodicesStart({
                project_id: projectDetails.id,
            }),
        );
        dispatch(
            actions.singleProject.getPackageContentStart({
                packageId: basePackage.package_id,
            }),
        );
        dispatch(
            actions.singleProject.getRenovationItemsStart({
                project_id: projectDetails.id,
                is_active: false,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleDeleteMaterialSpecModal = () => {
        setShowDeleteMaterialSpecModal(!showDeleteMaterialSpecModal);
    };

    const deleteMaterialSpec = () => {
        toggleDeleteMaterialSpecModal();
    };

    const scrollToSection = (id: string) => {
        console.log("scrolling to", id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    if (renovationItemsLoading || projectContainerLoading)
        return (
            <Stack direction="row" pt={30} justifyContent="center">
                <CircularProgress />
            </Stack>
        );
    return (
        <Stack direction="row" py={0}>
            <Stack style={{ border: "solid 1px #C9CCCF" }} width="15%" margin={2} padding={2}>
                <PackageSideNav scrollToSection={scrollToSection} />
            </Stack>
            <Stack flexGrow={1}>
                <Box>
                    <Box>
                        <Typography variant="text_34_medium">
                            We have applied your package to the following selections
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="text_16_light">
                            You are free to make changes to the options below
                        </Typography>
                    </Box>
                </Box>
                <GroupedRenovationItems />
            </Stack>
            {showDeleteMaterialSpecModal && (
                <ConfirmationDialog
                    title="Delete Material Spec"
                    content="Are you sure that you would like to delete this material spec?"
                    open={showDeleteMaterialSpecModal}
                    onCancel={toggleDeleteMaterialSpecModal}
                    onDone={deleteMaterialSpec}
                />
            )}
        </Stack>
    );
};

export default RenovationItems;
