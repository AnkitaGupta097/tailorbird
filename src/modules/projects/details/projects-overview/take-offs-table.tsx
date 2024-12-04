import React, { useState, useEffect } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Checkbox,
    InputBase,
    Select,
    MenuItem,
    Button,
    Grid,
    TableHead,
    Typography,
    CircularProgress,
    Box,
    styled,
    TableRow,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../../stores/hooks";
import "../project-details.css";
import search from "../../../../assets/icons/search.svg";
import AddIcon from "../../../../assets/icons/icon-add.svg";
import download from "../../../../assets/icons/download.svg";
import { map, isEmpty, find, filter } from "lodash";
import actions from "../../../../stores/actions";
import moment from "moment";
import { Info } from "@mui/icons-material";

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.palette.secondary.main,
}));
interface Column {
    id: "name" | "group" | "address" | "organization" | "errors" | "status";
    label: string;
    width?: string;
    align?: "right";
}

const columns: readonly Column[] = [
    { id: "name", label: "File Name", width: "30%" },
    { id: "group", label: "Version", width: "10%" },
    {
        id: "address",
        label: "Upload date",
        width: "20%",
    },
    {
        id: "organization",
        label: "Uploaded By",
        width: "10%",
    },
    {
        id: "organization",
        label: "Phase",
        width: "10%",
    },
    {
        id: "status",
        label: "Status",
        width: "20%",
    },
    {
        id: "organization",
        label: "comments",
        width: "20%",
    },
    {
        id: "errors",
        label: "",
        width: "5%",
    },
];

interface ITakeoffsTable {
    setUploadModal: any;
}

interface DataSourceFileVersion {
    version: string;
    id: number;
    user_remarks: string;
    created_at: string;
    uploaded_by: string;
    system_remarks: DataSourceFileSystemRemarks;
}

interface DataSourceFileSystemRemarks {
    error: string;
}
interface IDataSource {
    id: number;
    remoteFileReference: string;
    floorPlanName: string;
    name: string;
    status: Array<any>;
    createdAt: string;
    version: string;
    uploadPhase: string;
    userRemark: string;
    versions: [DataSourceFileVersion];
    uploadBy: string;
    system_remarks: DataSourceFileSystemRemarks;
}

interface ITakeOffUploadInfoModalProps {
    data: string;
    onClose: Function;
}

const TakeOffUploadInfoModal = ({ data, onClose }: ITakeOffUploadInfoModalProps) => {
    return (
        <React.Fragment>
            <Dialog open={true}>
                <DialogContent>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: data ?? "No Errors",
                        }}
                    ></div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

const TakeOffsTable = ({ setUploadModal }: ITakeoffsTable) => {
    const [selected, setSelected] = useState<readonly string[]>([]);
    // @ts-ignore
    const [filesList, setfilesList] = useState<[IDataSource]>([]);
    const [selectedData, setSelectedData] = useState<any>([]);
    const [infoModalData, setInfoModalData] = useState<any>(null);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const { dataSourceList, allUsers, dataSourceUploadStatus, downloadLinks } = useAppSelector(
        (state) => {
            return {
                dataSourceList: state.projectOverview.dataSourceList.data,
                fileListLoading: state.projectOverview.dataSourceList.loading,
                downloadLinks: state.projectOverview.downloadLink.data,
                dataSourceUploadStatus: state.projectOverview.dataSourceUploadStatus?.status,
                allUsers: state.tpsm.all_User.users,
            };
        },
    );

    useEffect(() => {
        dispatch(actions.projectOverview.fetchDataSourceListStart(projectId));
        let statusInterval = setInterval(() => {
            if (dataSourceUploadStatus === "progress") {
                dispatch(actions.projectOverview.fetchDataSourceUploadStatusStart(projectId));
            }
            if (dataSourceUploadStatus === "completed") {
                if (!isEmpty(dataSourceList)) {
                    dispatch(actions.projectOverview.fetchDataSourceListStart(projectId));
                }
                clearInterval(statusInterval);
            }
        }, 10000);
        return () => clearInterval(statusInterval);
        // eslint-disable-next-line
    }, [dataSourceUploadStatus, infoModalData]);

    useEffect(() => {
        let statusInterval = setInterval(() => {
            dispatch(actions.projectOverview.fetchDataSourceListStart(projectId));
            clearInterval(statusInterval);
        }, 10000);
        return () => clearInterval(statusInterval);
    });

    useEffect(() => {
        if (isDownloading) {
            const urls = (downloadLinks[downloadLinks.length - 1]?.urls ?? []) as Array<string>;
            for (const url of urls) {
                window.open(url);
            }
            setIsDownloading(false);
        }
        // eslint-disable-next-line
    }, [downloadLinks]);

    useEffect(() => {
        setfilesList(dataSourceList);
    }, [dataSourceList]);

    useEffect(() => {
        dispatch(actions.projectOverview.fetchDataSourceListStart(projectId));
        // eslint-disable-next-line
    }, []);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = dataSourceList.map((n: any) => {
                return n.name;
            });
            setSelected(newSelected);
            setSelectedData(dataSourceList);
            return;
        }
        setSelected([]);
        setSelectedData([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, data: any) => {
        const selectedIndex = selected.indexOf(data.name);
        let newSelected: readonly string[] = [];
        let newSelectedData: any = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, data.name);
            newSelectedData = newSelectedData.concat(selectedData, data);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            newSelectedData = newSelectedData.concat(selectedData.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            newSelectedData = newSelectedData.concat(selectedData.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
            newSelectedData = newSelectedData.concat(
                selectedData.slice(0, selectedIndex),
                selectedData.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
        setSelectedData(newSelectedData);
    };

    const handleSearch = (value: string) => {
        if (isEmpty(value)) {
            setfilesList(dataSourceList);
        } else {
            const searchedProjects: any = filter(dataSourceList, (row) =>
                row.name?.toLowerCase().includes(value),
            );
            setfilesList(searchedProjects);
        }
    };

    const setVersion = (id: string | number, index: number) => {
        const dataList: [IDataSource] = [...filesList];
        const data = { ...dataList[index] };
        const updateVersion: any = find(data.versions, { id: id });
        data.id = updateVersion.id;
        data.userRemark = updateVersion.user_remarks;
        data.version = updateVersion.version;
        data.createdAt = updateVersion.created_at;
        data.uploadBy = updateVersion.uploaded_by;
        dataList.splice(index, 1, data);
        setfilesList(dataList);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const numSelected = selected.length;

    const onDownloadClick = () => {
        setIsDownloading(true);
        const fileIds = [] as Array<number>;
        selected.forEach((fileName) => {
            filesList.forEach((fileObject) => {
                if (fileObject.name === fileName) {
                    fileIds.push(fileObject.id);
                }
            });
        });
        dispatch(actions.projectOverview.fetchDownloadLinkStart(fileIds));
    };

    const infoModal = (event: any, d: any) => {
        event.stopPropagation();
        const error =
            d?.versions.find((t: any) => t.version == d.version)?.system_remarks?.error ?? "";
        setInfoModalData(error);
    };

    return (
        <React.Fragment>
            {infoModalData && (
                <TakeOffUploadInfoModal
                    data={infoModalData}
                    onClose={() => {
                        setInfoModalData(null);
                    }}
                />
            )}

            <Grid container style={{ marginTop: "40px", height: "45px" }}>
                <Grid item md={isEmpty(selected) ? 6 : 4}>
                    <span className="input-label">Take-offs</span>
                </Grid>
                <Grid item md={isEmpty(selected) ? 6 : 8} style={{ display: "flex" }}>
                    <Box
                        mr={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexGrow: 1,
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            bgcolor: "background.paper",
                            color: "text.secondary",
                            "& svg": {
                                m: 1.5,
                            },
                            "& div": {
                                mx: 1.5,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                            }}
                        >
                            <InputBase
                                fullWidth
                                placeholder={"Search by File Name"}
                                inputProps={{ "aria-label": "search" }}
                                onChange={(e) => handleSearch(e.target.value.toLowerCase())}
                            />
                        </Box>
                        <Box>
                            <img src={search} alt="search project" />
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={
                            dataSourceUploadStatus === "progress" ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <img src={AddIcon} alt="upload take-offs" />
                            )
                        }
                        style={{ height: "100%" }}
                        onClick={() => setUploadModal(true)}
                    >
                        Upload
                    </Button>
                    {!isEmpty(selected) && (
                        <React.Fragment>
                            <Button
                                disabled={isDownloading}
                                variant="contained"
                                startIcon={<img src={download} alt="upload take-offs" />}
                                style={{ marginLeft: "10px", height: "100%" }}
                                onClick={() => {
                                    onDownloadClick();
                                }}
                            >
                                {isDownloading && <CircularProgress size={20} color="inherit" />}
                                Download
                            </Button>
                        </React.Fragment>
                    )}
                </Grid>
            </Grid>
            <Grid container style={{ marginTop: "15px" }}>
                {!isEmpty(dataSourceList) && (
                    <Box style={{ width: "100%" }}>
                        <Paper elevation={3}>
                            <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead
                                        style={{ paddingTop: "15px", paddingBottom: "15px" }}
                                    >
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <StyledCheckbox
                                                    color="primary"
                                                    indeterminate={
                                                        numSelected > 0 &&
                                                        numSelected < dataSourceList.length
                                                    }
                                                    checked={
                                                        dataSourceList.length > 0 &&
                                                        numSelected === dataSourceList.length
                                                    }
                                                    onChange={handleSelectAllClick}
                                                    inputProps={{
                                                        "aria-label": "select all desserts",
                                                    }}
                                                />
                                            </TableCell>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ width: column.width }}
                                                >
                                                    <Typography variant="tableData">
                                                        {column.label}
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {!isEmpty(filesList) ? (
                                            map(filesList, (data, index) => {
                                                const {
                                                    uploadPhase,
                                                    createdAt,
                                                    uploadBy,
                                                    name,
                                                    versions,
                                                    // userRemark,
                                                    id,
                                                    version,
                                                    status,
                                                } = data;

                                                let rvtStatuses = status.filter((item) =>
                                                    item.status.includes("rvt"),
                                                );
                                                let sitewalkStatuses = status.filter((item) =>
                                                    item.status.includes("sitewalk"),
                                                );
                                                let takeoffStatuses = status.filter((item) =>
                                                    item.status.includes("takeoff"),
                                                );
                                                let lastRvtStatus =
                                                    rvtStatuses[rvtStatuses.length - 1];
                                                let lastSitewalkStatus =
                                                    sitewalkStatuses[sitewalkStatuses.length - 1];
                                                let lastTakeoffStatus =
                                                    takeoffStatuses[takeoffStatuses.length - 1];
                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                const isItemSelected = isSelected(data.name);

                                                return (
                                                    <TableRow
                                                        key={id}
                                                        hover
                                                        onClick={(event) =>
                                                            handleClick(event, data)
                                                        }
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <StyledCheckbox
                                                                color="primary"
                                                                checked={isItemSelected}
                                                                inputProps={{
                                                                    "aria-labelledby": labelId,
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="tableData">
                                                                {name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {versions.length > 1 && (
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    fullWidth
                                                                    variant="standard"
                                                                    className="version-selection"
                                                                    value={id}
                                                                    onClick={(e) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                    onChange={(e) => {
                                                                        setVersion(
                                                                            e.target.value,
                                                                            index,
                                                                        );
                                                                    }}
                                                                >
                                                                    {map(versions, (version) => {
                                                                        return (
                                                                            <MenuItem
                                                                                value={version.id}
                                                                            >
                                                                                <Typography variant="tableData">
                                                                                    {
                                                                                        version.version
                                                                                    }
                                                                                </Typography>
                                                                            </MenuItem>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            )}

                                                            {versions.length == 1 && (
                                                                <Typography
                                                                    variant="tableData"
                                                                    style={{ paddingLeft: "10px" }}
                                                                >
                                                                    {version}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="tableData">
                                                                {moment
                                                                    .parseZone(createdAt)
                                                                    .local()
                                                                    .format("L LT")}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="tableData">
                                                                {
                                                                    find(allUsers, {
                                                                        id: uploadBy,
                                                                    })?.name
                                                                }
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="tableData">
                                                                {uploadPhase}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography
                                                                variant="tableData"
                                                                color={
                                                                    lastTakeoffStatus?.status.indexOf(
                                                                        "processed",
                                                                    ) != -1
                                                                        ? "green"
                                                                        : lastTakeoffStatus?.status.indexOf(
                                                                              "failed",
                                                                          ) != -1
                                                                        ? "red"
                                                                        : "primary"
                                                                }
                                                            >
                                                                {lastTakeoffStatus?.status}
                                                                <br />
                                                            </Typography>
                                                            <Typography
                                                                variant="tableData"
                                                                color={
                                                                    lastSitewalkStatus?.status.indexOf(
                                                                        "processed",
                                                                    ) != -1
                                                                        ? "green"
                                                                        : lastSitewalkStatus?.status.indexOf(
                                                                              "failed",
                                                                          ) != -1
                                                                        ? "red"
                                                                        : "primary"
                                                                }
                                                            >
                                                                {lastSitewalkStatus?.status}
                                                                <br />
                                                            </Typography>
                                                            <Typography
                                                                variant="tableData"
                                                                color={
                                                                    lastRvtStatus?.status.indexOf(
                                                                        "processed",
                                                                    ) != -1
                                                                        ? "green"
                                                                        : lastRvtStatus?.status.indexOf(
                                                                              "failed",
                                                                          ) != -1
                                                                        ? "red"
                                                                        : "primary"
                                                                }
                                                            >
                                                                {lastRvtStatus?.status}
                                                                <br />
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="tableData">
                                                                {id &&
                                                                    find(versions, { id: id })
                                                                        ?.user_remarks}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                onClick={(event) => {
                                                                    infoModal(event, data);
                                                                }}
                                                            >
                                                                <Info />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                                                    <CircularProgress />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                )}
            </Grid>
        </React.Fragment>
    );
};

export default TakeOffsTable;
