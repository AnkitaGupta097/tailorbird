// CustomTable.tsx
import React, { useMemo, useState } from "react";
import { Paper, Grid, Typography, Button, Box } from "@mui/material";
import BaseDataGrid from "components/data-grid";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { formatDate } from "utils/date-time-convertor";
import { useAppSelector } from "stores/hooks";
import { ReactComponent as Download } from "assets/icons/download-outlined.svg";
import { ReactComponent as DownloadDisabled } from "../../../../assets/icons/download-icon-disabled.svg";
import { graphQLClient } from "utils/gql-client";
import { GET_PROJECT_FILE } from "components/production/constants";
import { downloadFile } from "stores/single-project/operation";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";

const FloorPlanMediaTable = ({
    selectedFloorPlanImageVideoMode,
}: {
    selectedFloorPlanImageVideoMode: any;
}) => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const { allUsers } = useAppSelector((state) => {
        return {
            allUsers: state.tpsm.all_User.users,
        };
    });
    const getUploaderName = (userId: any) => {
        return allUsers.find((item: any) => item.id == userId)?.name || "NA";
    };
    const handleDownloadSelectedFiles = async () => {
        try {
            const downloadPromises = selectedRows.map(async (selectedRowId) => {
                const res = await graphQLClient.query("getProjectFile", GET_PROJECT_FILE, {
                    fileId: selectedRowId,
                });
                return downloadFile(res.getProjectFile.download_link, res.getProjectFile.file_name);
            });

            await Promise.all(downloadPromises);
        } catch (error) {
            console.error("Error downloading files:", error);
        }
    };
    const columns = [
        {
            field: "floorplan name",
            headerName: "Floorplan Name",
            flex: 1.25,
            renderCell: () => {
                return (
                    <Typography variant="text_14_regular">
                        {selectedFloorPlanImageVideoMode?.commercial_name}
                    </Typography>
                );
            },
        },
        {
            field: "image",
            headerName: "File",
            flex: 0.5,
            renderCell: (params: GridRenderCellParams) => {
                const fileParts: string[] = params?.row?.file_name
                    ?.split(".")
                    .map((x: string) => x.toLowerCase());
                const extn: string = fileParts[fileParts.length - 1];
                if (["mov", "mp4"].includes(extn)) {
                    return <SmartDisplayIcon sx={{ fontSize: 40 }} color="primary" />;
                }
                return (
                    <img
                        width={48}
                        height={48}
                        src={`${params.row.highestResolutionUrl}#t=0.1`}
                        alt={params?.row?.file_name}
                        style={{
                            borderRadius: 8,
                        }}
                    />
                );
            },
        },
        {
            field: "image title",
            headerName: "File Name",
            flex: 1.25,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params?.row?.file_name}</Typography>
            ),
        },
        {
            field: "upload date",
            headerName: "Upload Date",
            flex: 0.75,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {formatDate(params?.row?.created_at)}
                </Typography>
            ),
        },
        {
            field: "uploaded by",
            headerName: "Uploaded by",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {getUploaderName(params?.row?.created_by)}
                </Typography>
            ),
        },
        {
            field: "Description",
            headerName: "Description",
            flex: 1.25,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params?.row?.file_name}</Typography>
            ),
        },
        {
            field: "Download",
            headerName: "Download",
            flex: 0.5,
            renderCell: (params: GridRenderCellParams) => {
                const handleDownload = async (event: { stopPropagation: () => void }) => {
                    event.stopPropagation();
                    const res = await graphQLClient.query("getProjectFile", GET_PROJECT_FILE, {
                        fileId: params.row.id,
                    });
                    downloadFile(res.getProjectFile.download_link, params?.row?.file_name);
                };
                return (
                    <Button
                        variant="text"
                        onClick={handleDownload}
                        startIcon={<Download />}
                        sx={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                        }}
                    />
                );
            },
        },
    ];
    const handleSelectionModelChange = (selectionModel: number[]) => {
        setSelectedRows(selectionModel);
    };
    const isDownloadEnabled = useMemo(() => {
        return Boolean(selectedRows.length);
    }, [selectedRows]);

    return (
        <Grid item md={12}>
            <Box display={"flex"} gap={"1rem"} flexDirection={"column"}>
                <Typography variant="text_16_semibold">
                    {selectedFloorPlanImageVideoMode.commercial_name} - Images and Videos
                </Typography>
                <Button
                    disabled={!isDownloadEnabled}
                    variant="text"
                    onClick={handleDownloadSelectedFiles}
                    startIcon={!isDownloadEnabled ? <DownloadDisabled /> : <Download />}
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        justifyContent: "flex-start",
                        margin: "1rem 0",
                    }}
                >
                    Download all selected
                </Button>
            </Box>
            <Paper elevation={3}>
                <BaseDataGrid
                    columns={columns}
                    rows={selectedFloorPlanImageVideoMode.missingInfo}
                    rowsPerPageOptions={[10, 20, 30]}
                    disableColumnMenu={false}
                    hideFooter={false}
                    getRowId={(row: any) => row.id}
                    checkboxSelection
                    onSelectionModelChange={handleSelectionModelChange}
                />
            </Paper>
        </Grid>
    );
};

export default FloorPlanMediaTable;
