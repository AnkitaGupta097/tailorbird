import React, { FC, MouseEventHandler } from "react";
import ArrowTooltip from "../pricing-summary-table/arrowTooltip";
import { IconButton, MenuItem } from "@mui/material";
import { StyledMenu } from "./helper-components";
import { ReactComponent as DownloadIcon } from "../../../assets/icons/Download-Icon-Vector.svg";
import { useParams } from "react-router-dom";
import actions from "stores/actions";
import { useDispatch } from "react-redux";

interface IExportItems {
    export_open: boolean;
    handleClick: MouseEventHandler<HTMLButtonElement>;
    anchorEl: HTMLElement | null;
    handleClose: () => void;
    exportRowToExcel: () => void;
    ExportPageToExcel: () => void;
    ExportBidbookToExcel: () => void;
    disableExportRow: boolean;
    showExportRowOption?: boolean;
    projectName?: string;
    bidStatus?: string;
    fileName?: string;
}

const ExportToExcelButton: FC<IExportItems> = ({
    export_open,
    handleClick,
    anchorEl,
    handleClose,
    exportRowToExcel,
    ExportPageToExcel,
    ExportBidbookToExcel,
    disableExportRow,
    showExportRowOption,
    projectName,
    bidStatus,
}) => {
    const dispatch = useDispatch();
    const { projectId, floorplanName } = useParams();

    return (
        <>
            <ArrowTooltip title="Export Bidbook to Excel" arrow>
                <IconButton
                    id="export-button"
                    sx={{
                        width: "48px",
                        height: "48px",
                        top: ".25rem",
                        bgcolor: "#EEEEEE",
                        borderRadius: "5px",
                        "&:hover": {
                            bgcolor: "#909090",
                        },
                    }}
                    aria-controls={export_open ? "export_options" : undefined}
                    aria-haspopup="true"
                    aria-expanded={export_open ? "true" : undefined}
                    onClick={handleClick}
                >
                    <DownloadIcon />
                </IconButton>
            </ArrowTooltip>
            <StyledMenu
                id="export_options"
                MenuListProps={{
                    "aria-labelledby": "export-button",
                }}
                anchorEl={anchorEl}
                open={export_open}
                onClose={handleClose}
            >
                {showExportRowOption && (
                    <MenuItem
                        disabled={disableExportRow}
                        onClick={() => {
                            exportRowToExcel();
                            handleClose();
                        }}
                    >
                        Export Selected Row(s)
                    </MenuItem>
                )}
                <MenuItem
                    onClick={() => {
                        if (floorplanName) {
                            dispatch(
                                actions.biddingPortal.updateExcelFileDetails({
                                    floorplanName,
                                    projectId,
                                    projectName,
                                    eventName: "RFP : Bidbook : Download : Floorplan Download",
                                    eventId: "rfp_bidbook_download_floorplan_download",
                                    bidStatus,
                                }),
                            );
                        }
                        ExportPageToExcel();
                        handleClose();
                    }}
                    disableRipple
                >
                    Export Page to Excel
                </MenuItem>
                <MenuItem //MIXPANEL : download complete bidbook
                    onClick={() => {
                        dispatch(
                            actions.biddingPortal.updateExcelFileDetails({
                                floorplanName,
                                projectId,
                                projectName,
                                eventName: "RFP : Bidbook : Download : Complete Bidbook",
                                eventId: "rfp_bidbook_download_complete_bidbook",
                                bidStatus,
                            }),
                        );
                        ExportBidbookToExcel();
                        handleClose();
                    }}
                    disableRipple
                >
                    Export Bidbook to Excel
                </MenuItem>
            </StyledMenu>
        </>
    );
};

ExportToExcelButton.defaultProps = {
    showExportRowOption: true,
};

export default ExportToExcelButton;
