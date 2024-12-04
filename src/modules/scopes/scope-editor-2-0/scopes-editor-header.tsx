import React from "react";
import { Box } from "@mui/material";
import BaseButton from "components/button";
const ScopeEditorHeader = ({
    setIsReset,
    scopeList,
    scopeData,
    handleSave_FromHeader,
}: {
    setIsReset: any;
    scopeList: any;
    scopeData: any;
    setOpenRollUpConfig?: any;
    handleSave_FromHeader?: any;
}) => {
    const IsSaveUpdateEnabled = scopeList?.some((data: any) => data.isSelected);
    return (
        <Box display={"grid"} gridAutoFlow="column" columnGap={"15px"}>
            <BaseButton
                classes="grey default"
                onClick={() => setIsReset(true)}
                label={"Reset"}
                startIcon={null}
                variant={"text_16_semibold"}
            />
            <BaseButton
                classes={IsSaveUpdateEnabled ? "primary default" : "primary disabled"}
                disabled={!IsSaveUpdateEnabled}
                variant={"text_16_semibold"}
                onClick={() => handleSave_FromHeader()}
                label={scopeData?.isEdit ? "Update" : "Save"}
                startIcon={null}
            />
        </Box>
    );
};

export default ScopeEditorHeader;
