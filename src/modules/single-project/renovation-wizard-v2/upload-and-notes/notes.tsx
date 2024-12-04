/* eslint-disable no-unused-vars */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Box, Typography } from "@mui/material";
import RichTextEditor from "components/rich-text-editor";
import BaseButton from "components/base-button";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import { useAppSelector } from "stores/hooks";

type RenoWizardV2NotesProps = {
    title?: string;
    showSaveButton?: boolean;
};

const RenoWizardV2Notes = ({ title, showSaveButton = false }: RenoWizardV2NotesProps, ref: any) => {
    const dispatch = useDispatch();
    const { projectDetails } = useAppSelector((state) => ({
        projectDetails: state.singleProject.projectDetails,
    }));
    const notes = projectDetails.system_remarks?.notes;
    const [allowNotesEdit, setAllowNotesEdit] = useState(!showSaveButton);
    const [unsavedNotes, setUnsavedNotes] = useState(notes);

    const handleNotesChange = (content: string) => {
        setUnsavedNotes(content);
    };

    const saveNotesChange = (goToNextPage = true) => {
        dispatch(
            actions.singleProject.updateSingleProjectStart({
                project_id: projectDetails.id,
                input: {
                    notes: unsavedNotes,
                },
                goToNextPage,
            }),
        );
    };

    useImperativeHandle(ref, () => ({
        saveNotesAndGoToNext: saveNotesChange,
    }));

    const handleSave = () => {
        saveNotesChange(false);
        setAllowNotesEdit(false);
    };

    return (
        <Box>
            <Box>
                <Typography variant="text_14_medium">
                    {title ||
                        "Would you like to tell the Tailorbird team anything? Add any information below."}
                </Typography>
                {showSaveButton && !allowNotesEdit && (
                    <BaseButton
                        variant="text"
                        label="Edit"
                        onClick={() => setAllowNotesEdit(true)}
                    />
                )}
            </Box>
            {allowNotesEdit ? (
                <Box>
                    <RichTextEditor data={unsavedNotes} onChange={handleNotesChange} />
                </Box>
            ) : (
                <Box sx={{ border: "solid 1px #ddd", p: 2 }} className="ck-editor">
                    <Box dangerouslySetInnerHTML={{ __html: notes }} />
                </Box>
            )}
            {showSaveButton && allowNotesEdit && (
                <Box display="flex" pt={2} justifyContent="end">
                    <BaseButton
                        variant="outlined"
                        label="Cancel"
                        onClick={() => setAllowNotesEdit(false)}
                    />
                    <BaseButton variant="contained" label="Save" onClick={handleSave} />
                </Box>
            )}
        </Box>
    );
};

export default forwardRef(RenoWizardV2Notes);
