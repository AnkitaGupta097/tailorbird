import { useFeature } from "@growthbook/growthbook-react";
import { Button, CircularProgress } from "@mui/material";
import React from "react";
import { FeatureFlagConstants } from "utils/constants";
import AddIcon from "assets/icons/icon-add.svg";

interface IImportRentRollFromIntrataButton {
    disabled?: boolean;
    isRentRollImportedFromEntrata?: boolean;
    onClick: any;
    importing?: boolean;
}
const ImportRentRollButton = ({
    disabled,
    isRentRollImportedFromEntrata,
    onClick,
    importing,
}: IImportRentRollFromIntrataButton) => {
    const importRentRollFromEntrataFeature = useFeature(
        FeatureFlagConstants.ENTRATA_IMPORT_RENT_ROLL,
    ).on;

    return importRentRollFromEntrataFeature ? (
        <Button
            variant="contained"
            disabled={disabled}
            onClick={onClick}
            startIcon={
                importing ? (
                    <CircularProgress size={24} color="secondary" />
                ) : (
                    <img src={AddIcon} alt="add new Project" />
                )
            }
            style={{ height: "100%" }}
        >
            {isRentRollImportedFromEntrata ? "Reimport " : "Import "}
            From Entrata
        </Button>
    ) : null;
};

export default ImportRentRollButton;
