import {
    Box,
    ButtonBase,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import BaseChip from "components/chip";
import React, { useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import GroupIcon from "@mui/icons-material/Group";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import BaseButton from "components/button";
import AddIcon from "@mui/icons-material/Add";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import FileUpload from "components/upload-files-new";
import loaderProgress from "../../../../../../assets/icons/blink-loader.gif";
import FileUploadStatus from "./file-upload-status";
import { useAppDispatch } from "stores/hooks";
import { useParams } from "react-router-dom";
import actions from "stores/actions";
import BaseDataGrid from "components/data-grid";
import { GridRenderCellParams, GridActionsCellItem, GridSelectionModel } from "@mui/x-data-grid";
import { KebabMenuIcon } from "modules/admin-portal/common/utils/constants";
import BaseCheckbox from "components/checkbox";
import BaseTextArea from "components/text-area";
import { IFileDetails, IUploadFileDetails } from "stores/projects/file-utility/file-utility-models";
import moment from "moment";

interface IDocumentsProps {
    uploadedFiles: IUploadFileDetails[];
    isS3Upload: boolean;
    contractors: any;
    rfpFiles: IFileDetails[];
    finalistFiles: IFileDetails[];
    archivedFiles: IFileDetails[];
}

const Documents = ({
    uploadedFiles,
    isS3Upload,
    contractors,
    rfpFiles,
    finalistFiles,
    archivedFiles,
}: IDocumentsProps) => {
    const user_id = localStorage.getItem("user_id");
    const bidders = contractors?.filter(
        (contractor: { bid_status: string }) =>
            contractor?.bid_status !== "pending_invite" &&
            contractor?.bid_status !== "declined" &&
            contractor?.bid_status !== "Not Invited",
    );
    const isAwarded = contractors?.some(
        (contractor: { bid_status: string }) => contractor?.bid_status === "awarded",
    );
    const finalists = contractors?.filter(
        (contractor: { bid_status: string }) => contractor?.bid_status === "finalist",
    );
    const [currentTab, setCurrentTab] = useState<Number>(finalists?.length > 0 ? 1 : 0);
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = React.useState<GridSelectionModel>([]);
    const [uploadMessage, setUploadMessage] = useState("");
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const uploadToS3 = (files: any) => {
        let uploadedFiles = [...files]?.map((obj: any) => {
            const { name } = obj; // destructure the object and remove the keys you want to rename
            return {
                file_name: name,
                file_type: currentTab === 1 ? "RFP_FINALIST_DOCUMENT" : "BID_DOCUMENT",
                tags: {
                    is_cover_image: false,
                    projectId: projectId,
                },
            }; // create a new object with the renamed keys and the remaining keys
        });

        setLoading(false);
        dispatch(
            actions.fileUtility.createProjectFilesStart({
                input: {
                    project_id: projectId,
                    user_id: user_id ?? "",
                    files: uploadedFiles,
                },
                files: [...files],
            }),
        );
    };

    const handleOnSave = () => {
        dispatch(
            actions.fileUtility.getProjectFilesStart({
                project_id: projectId,
                file_type: currentTab === 1 ? "RFP_FINALIST_DOCUMENT" : "BID_DOCUMENT",
            }),
        );
        dispatch(actions.fileUtility.resetUploadedFilesState({}));
        setOpen(false);
        setUploadMessage("");
    };

    const isSaveDisable = () => {
        if ((isS3Upload || uploadMessage?.length === 0) && bidders?.length > 0) {
            return true;
        }
        return false;
    };
    const onFileUpload = (files: any) => {
        uploadToS3(files);
    };

    const archiveFiles = async (allFiles: IFileDetails[]) => {
        let files = allFiles?.filter((file: IFileDetails) => selectedIds?.includes(file?.id));
        dispatch(
            actions.fileUtility.ArchiveProjectStart({
                project_id: projectId,
                files: files,
            }),
        );
    };

    const archiveFile = async (file: IFileDetails) => {
        dispatch(
            actions.fileUtility.ArchiveProjectStart({
                project_id: projectId,
                files: [file],
            }),
        );
    };

    const DeleteFiles = async () => {
        let AllFiles =
            currentTab === 2 ? archivedFiles : currentTab === 1 ? finalistFiles : rfpFiles;
        let files = AllFiles?.filter((obj: IFileDetails) => selectedIds.includes(obj.id));
        dispatch(
            actions.fileUtility.DeleteFilesStart({
                project_id: projectId,
                files: files,
                user_id: user_id,
            }),
        );
    };

    const DeleteFile = async (file: IFileDetails) => {
        try {
            dispatch(
                actions.fileUtility.DeleteFilesStart({
                    project_id: projectId,
                    files: [file],
                    user_id: user_id,
                }),
            );
        } catch (error) {
            console.error(error);
        }
    };

    const restoreFiles = async () => {
        let files = archivedFiles?.filter((file: IFileDetails) => selectedIds?.includes(file?.id));
        dispatch(
            actions.fileUtility.UndoProjectStart({
                project_id: projectId,
                files: files,
            }),
        );
    };

    const restoreFile = async (file: IFileDetails) => {
        dispatch(
            actions.fileUtility.UndoProjectStart({
                project_id: projectId,
                files: [file],
            }),
        );
    };

    const handleChange = (event: { target: { value: string } }) => {
        setUploadMessage(event?.target?.value);
    };

    const columns = [
        {
            field: "file_name",
            headerName: "File name",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {params.row?.file_name?.length !== 0 ? params.row?.file_name : "-"}
                </Typography>
            ),
        },
        {
            field: "created_by",
            headerName: "Added by",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {params.row?.created_by?.length === 0 || params.row?.created_by === "undefined"
                        ? "-"
                        : params.row?.created_by}
                </Typography>
            ),
        },
        {
            field: "created_at",
            headerName: "Date added",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {params.row?.created_at?.length === 0 || params.row?.created_at === undefined
                        ? "-"
                        : moment(new Date(params.row?.created_at)).format("MM/DD/YYYY")}
                </Typography>
            ),
        },
        {
            field: "tags",
            headerName: "File Size",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {params.row?.tags?.file_size?.length === 0 ||
                    params.row?.tags?.file_size === undefined
                        ? "-"
                        : params.row?.tags?.file_size}
                </Typography>
            ),
        },
        {
            field: "action",
            headerName: "Action",
            headerAlign: "left",
            align: "left",
            flex: 0.5,
            type: "actions",
            getActions: (params: any) => {
                return [
                    <GridActionsCellItem
                        placeholder=""
                        key="archive"
                        label={currentTab === 2 ? "Restore" : "Move to archive"}
                        showInMenu
                        onClick={() =>
                            currentTab === 2 ? restoreFile(params?.row) : archiveFile(params?.row)
                        }
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    />,
                    <GridActionsCellItem
                        placeholder=""
                        key="delete"
                        label={"Delete"}
                        showInMenu
                        onClick={() => {
                            DeleteFile(params?.row);
                        }}
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    />,
                ];
            },
        },
    ];
    return (
        <>
            <Grid container direction={"row"}>
                <Grid item xs={3} md={3} sm={3} sx={{ paddingRight: "1rem" }}>
                    <Grid container direction={"column"}>
                        <Grid
                            item
                            sx={{
                                borderRadius: "4px",
                                background: currentTab === 0 ? "#E3EEF3" : "#FAFBFB",
                            }}
                        >
                            <Grid
                                container
                                direction={"row"}
                                sx={{ padding: "16px 20px" }}
                                justifyContent="space-between"
                                component={ButtonBase}
                                onClick={() => {
                                    finalists?.length > 0
                                        ? setCurrentTab(currentTab)
                                        : setCurrentTab(0);
                                }}
                            >
                                <Grid item>
                                    <Stack direction="row" gap={2}>
                                        <GroupIcon
                                            htmlColor="#5C5F62"
                                            sx={{ opacity: finalists?.length > 0 ? 0.3 : 1 }}
                                        />
                                        <Typography
                                            sx={{ opacity: finalists?.length > 0 ? 0.3 : 1 }}
                                        >{`Bidders (${bidders?.length}) `}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item>
                                    <BaseChip
                                        label={`${rfpFiles?.length} files`}
                                        bgcolor={rfpFiles?.length > 0 ? "#A4E8F2" : "FAFBFB"}
                                        textColor={rfpFiles?.length > 0 ? "#1F7A76" : "#969696"}
                                        sx={{ opacity: finalists?.length > 0 ? 0.3 : 1 }}
                                    ></BaseChip>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                direction={"row"}
                                sx={{
                                    padding: "16px 20px",
                                    background: currentTab === 1 ? "#E3EEF3" : "#FAFBFB",
                                }}
                                justifyContent="space-between"
                                component={ButtonBase}
                                onClick={() => {
                                    finalists?.length > 0
                                        ? setCurrentTab(1)
                                        : setCurrentTab(currentTab);
                                }}
                            >
                                <Grid item>
                                    <Stack direction="row" gap={2}>
                                        <WorkspacePremiumOutlinedIcon
                                            htmlColor="#5C5F62"
                                            sx={{ opacity: finalists?.length > 0 ? 1 : 0.3 }}
                                        />
                                        <Typography
                                            sx={{ opacity: finalists?.length > 0 ? 1 : 0.3 }}
                                        >{`Finalist only (${finalists?.length})`}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item>
                                    <BaseChip
                                        label={`${finalistFiles?.length} files`}
                                        bgcolor={finalistFiles?.length > 0 ? "#A4E8F2" : "FAFBFB"}
                                        textColor={
                                            finalistFiles?.length > 0 ? "#1F7A76" : "#969696"
                                        }
                                        sx={{ opacity: finalists?.length > 0 ? 1 : 0.3 }}
                                    ></BaseChip>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            sx={{
                                borderRadius: "4px",
                                background: currentTab === 2 ? "#E3EEF3" : "#FAFBFB",
                            }}
                        >
                            <Grid
                                container
                                direction={"row"}
                                sx={{ padding: "16px 20px" }}
                                justifyContent="space-between"
                                component={ButtonBase}
                                onClick={() => {
                                    setCurrentTab(2);
                                }}
                            >
                                <Grid item>
                                    <Stack direction="row" gap={2}>
                                        <FolderIcon htmlColor="#5C5F62" />
                                        <Typography>{"Archive"}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item>
                                    <BaseChip
                                        label={`${archivedFiles?.length} files`}
                                        bgcolor={archivedFiles?.length > 0 ? "#A4E8F2" : "FAFBFB"}
                                        textColor={
                                            archivedFiles?.length > 0 ? "#1F7A76" : "#969696"
                                        }
                                    ></BaseChip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={9} md={9} sm={9}>
                    {(currentTab === 2
                        ? archivedFiles?.length > 0
                        : currentTab === 1
                        ? finalistFiles?.length > 0
                        : rfpFiles?.length > 0) && (
                        <Grid container direction={"column"} gap={2}>
                            <Grid item>
                                <Grid container gap={4}>
                                    {!(currentTab === 2) && (
                                        <Grid item>
                                            <BaseButton
                                                classes={
                                                    isAwarded
                                                        ? "primary disabled"
                                                        : "primary default"
                                                }
                                                onClick={() => setOpen(true)}
                                                startIcon={<AddIcon />}
                                                label={"Add Files"}
                                            />
                                        </Grid>
                                    )}
                                    {selectedIds?.length > 0 && (
                                        <>
                                            <Grid item>
                                                <BaseButton
                                                    classes="grey default"
                                                    onClick={() => {
                                                        currentTab === 2
                                                            ? restoreFiles()
                                                            : currentTab === 0
                                                            ? archiveFiles(rfpFiles)
                                                            : archiveFiles(finalistFiles);
                                                    }}
                                                    startIcon={<FolderIcon />}
                                                    label={
                                                        currentTab === 2
                                                            ? "Restore"
                                                            : "Move to archive"
                                                    }
                                                />
                                            </Grid>
                                            <Grid item>
                                                <BaseButton
                                                    classes="grey default"
                                                    onClick={() => DeleteFiles()}
                                                    startIcon={<DeleteIcon />}
                                                    label={"Delete"}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item>
                                <BaseDataGrid
                                    columns={columns}
                                    rows={
                                        currentTab === 2
                                            ? archivedFiles
                                            : currentTab === 1
                                            ? finalistFiles
                                            : rfpFiles
                                    }
                                    getRowId={(row: IFileDetails) => row?.id}
                                    checkboxSelection
                                    selectionModel={selectedIds}
                                    rowsPerPageOptions={[10, 20, 30]}
                                    components={{
                                        MoreActionsIcon: KebabMenuIcon,
                                        BaseCheckbox: BaseCheckbox,
                                    }}
                                    onSelectionModelChange={(ids: GridSelectionModel) => {
                                        setSelectedIds(ids);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                    {(currentTab === 2
                        ? archivedFiles?.length === 0 || archivedFiles === undefined
                        : currentTab === 1
                        ? finalistFiles?.length === 0 || finalistFiles === undefined
                        : rfpFiles?.length === 0 || rfpFiles === undefined) && (
                        <Grid
                            container
                            direction={"column"}
                            alignItems="center"
                            justifyContent={"center"}
                            gap="10px"
                            sx={{
                                border: "1px solid #BCBCBB",
                                borderRadius: "5px",
                                //padding: "15.6rem 32rem",
                                background: "#FFFFFF",
                                height: "50vh",
                            }}
                        >
                            <Grid item>
                                <ErrorOutlineIcon htmlColor="#410099" />
                            </Grid>
                            <Grid item>
                                <Typography variant="text_18_regular" color="#410099">
                                    {"This folder is empty."}
                                </Typography>
                            </Grid>
                            {!(currentTab === 2) && (
                                <Grid item>
                                    <BaseButton
                                        classes={isAwarded ? "primary disabled" : "primary default"}
                                        onClick={() => setOpen(true)}
                                        startIcon={<AddIcon />}
                                        label={"Add Files"}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Dialog open={open} fullWidth maxWidth={"sm"}>
                <DialogTitle>
                    <Grid container>
                        <Grid item sx={{ display: "flex", alignItems: "center" }} xs={11}>
                            <GroupIcon />
                            <Typography variant="text_16_semibold" marginLeft={"13px"}>
                                {`Upload files for ${currentTab === 0 ? "bidders" : "finalist"} (${
                                    bidders?.length
                                })`}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-end" }} xs>
                            <IconButton
                                sx={{ padding: 0 }}
                                onClick={() => {
                                    setOpen(false);
                                    setUploadMessage("");
                                }}
                            >
                                <DisabledByDefaultRoundedIcon
                                    htmlColor="#004D71"
                                    fontSize="large"
                                />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: "0.5rem" }} />
                </DialogTitle>
                <DialogContent>
                    <Grid container direction={"column"}>
                        <Grid item>
                            <FileUpload isMultiple onFileChange={onFileUpload} helperText="" />
                            {isLoading ? (
                                <Box
                                    height={150}
                                    alignItems="center"
                                    display={"flex"}
                                    justifyContent="center"
                                >
                                    <img
                                        src={loaderProgress}
                                        alt="file-status"
                                        style={{
                                            width: "44px",
                                            height: "44px",
                                        }}
                                    />
                                </Box>
                            ) : (
                                <FileUploadStatus uploadedFiles={uploadedFiles} />
                            )}
                        </Grid>
                        {/* <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography variant="text_12_regular" color="#757575">
                                {"Maximum size: 1MB"}
                            </Typography>
                        </Grid> */}
                        {bidders?.length > 0 && (
                            <>
                                <Grid item sx={{ marginTop: "20px" }}>
                                    <Typography variant="text_12_regular" color="#757575">
                                        {
                                            "Please provide a message below explaining the updates. This message will be emailed to general contractors along with a list of which documents have been updated."
                                        }
                                    </Typography>
                                </Grid>
                                <Grid item sx={{ marginTop: "20px", marginBottom: "8px" }}>
                                    <Typography variant="text_12_regular" color="#757575">
                                        {
                                            "Add message (will not be emailed to “Not Invited” or “Declined” contractors)*"
                                        }
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <BaseTextArea
                                        style={{ width: "100%", minHeight: "8em" }}
                                        onChange={handleChange}
                                        value={uploadMessage}
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid
                            item
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "8px",
                                marginTop: "8px",
                            }}
                        >
                            <BaseButton
                                onClick={() => {
                                    setOpen(false);
                                    setUploadMessage("");
                                }}
                                label={"Cancel"}
                                classes="grey default spaced"
                                variant={"text_14_regular"}
                            />
                            <BaseButton
                                onClick={handleOnSave}
                                label={"Save"}
                                classes={
                                    isSaveDisable()
                                        ? "primary disabled spaced"
                                        : "primary default spaced"
                                }
                                variant={"text_16_semibold"}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Documents;
