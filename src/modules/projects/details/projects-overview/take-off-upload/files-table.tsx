import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_DATASORCE_LIST } from "stores/projects/details/overview/overview-queries";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { find } from "lodash";
import download from "../../../../../assets/icons/download.svg";
import actions from "stores/actions";
import BaseDataGrid from "components/data-grid";
import { GridRenderCellParams } from "@mui/x-data-grid";
import BaseCheckbox from "components/checkbox";

interface IProps {
    propertyDetails: any;
    takeOffType: string;
}

interface IDataListItem {
    id: number;
    name: string;
    version: string;
    createdAt: string;
    uploadBy: number;
    uploadPhase: string;
    comments: string;
}

const DatasourceFilesTable = ({ propertyDetails, takeOffType }: IProps) => {
    const [dataList, setList] = useState([]);
    const [rowsPerPageOptions] = useState([5, 10, 25]);

    const dispatch = useAppDispatch();
    const {
        data: queryData,
        loading: queryLoading,
        refetch: refetchList,
    } = useQuery(GET_DATASORCE_LIST, {
        variables: {
            project_id: propertyDetails.projects.find((elm: any) => elm.type === "DEFAULT").id,
        },
    });

    const { floorplans, downloadLinks } = useAppSelector((state) => {
        return {
            floorplans: state.projectFloorplans.floorplans,
            downloadLinks: state.projectOverview.downloadLink.data,
        };
    });

    const { allUsers } = useAppSelector((state) => {
        return {
            allUsers: state.tpsm.all_User.users,
        };
    });

    const columns = [
        { field: "name", headerName: "File Name", width: 250 },
        { field: "version", headerName: "Version", width: 80 },
        {
            field: "createdAt",
            headerName: "Upload date",
            width: 150,
            valueFormatter: (params: GridRenderCellParams) =>
                moment.parseZone(params.value).local().format("L LT"),
        },
        {
            field: "uploadBy",
            headerName: "Uploaded By",
            width: 100,
            valueFormatter: (params: GridRenderCellParams) =>
                find(allUsers, { id: params.value })?.name,
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const rvtStatuses = params.value.filter((item: any) => item.status.includes("rvt"));
                const sitewalkStatuses = params.value.filter((item: any) =>
                    item.status.includes("sitewalk"),
                );
                const takeoffStatuses = params.value.filter((item: any) =>
                    item.status.includes("takeoff"),
                );
                const lastRvtStatus = rvtStatuses[rvtStatuses.length - 1];
                const lastSitewalkStatus = sitewalkStatuses[sitewalkStatuses.length - 1];
                const lastTakeoffStatus = takeoffStatuses[takeoffStatuses.length - 1];

                return (
                    <Box>
                        <Typography
                            variant="text_10_regular"
                            color={
                                lastTakeoffStatus?.status.indexOf("processed") != -1
                                    ? "green"
                                    : lastTakeoffStatus?.status.indexOf("failed") != -1
                                    ? "red"
                                    : "primary"
                            }
                        >
                            {lastTakeoffStatus?.status}
                            <br />
                        </Typography>
                        <Typography
                            variant="text_10_regular"
                            color={
                                lastSitewalkStatus?.status.indexOf("processed") != -1
                                    ? "green"
                                    : lastSitewalkStatus?.status.indexOf("failed") != -1
                                    ? "red"
                                    : "primary"
                            }
                        >
                            {lastSitewalkStatus?.status}
                            <br />
                        </Typography>
                        <Typography
                            variant="text_10_regular"
                            color={
                                lastRvtStatus?.status.indexOf("processed") != -1
                                    ? "green"
                                    : lastRvtStatus?.status.indexOf("failed") != -1
                                    ? "red"
                                    : "primary"
                            }
                        >
                            {lastRvtStatus?.status}
                            <br />
                        </Typography>
                    </Box>
                );
            },
            cellClassName: "multiline",
        },
        { field: "uploadPhase", headerName: "Phase", width: 100 },
        { field: "comments", headerName: "Comment", width: 150 },
    ];

    const rows = dataList.map((item: IDataListItem) => ({ ...item, id: item.id }));

    useEffect(() => {
        if (!queryLoading && queryData?.getProjectDataSource) {
            const datasourceList = queryData.getProjectDataSource;
            const filteredDatasourceList = datasourceList.filter((d: any) =>
                floorplans.data.some(
                    (f) => d.floorPlanName === f.name && f.takeOffType === takeOffType,
                ),
            );

            setList(filteredDatasourceList);
        }
    }, [queryLoading, queryData, floorplans, takeOffType]);

    useEffect(() => {
        refetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [selected, setSelected] = useState<string[]>([]);

    console.log(selected, "slected");

    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const onDownloadClick = () => {
        setIsDownloading(true);
        dispatch(actions.projectOverview.fetchDownloadLinkStart(selected));
    };

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

    return (
        <>
            {selected.length > 0 && (
                <Box width={"100%"} display={"flex"} justifyContent={"flex-end"} mb={2}>
                    <Button
                        disabled={isDownloading}
                        variant="contained"
                        startIcon={<img src={download} alt="upload take-offs" />}
                        sx={{ pb: 2.5, pt: 2.5 }}
                        onClick={onDownloadClick}
                    >
                        {isDownloading && <CircularProgress size={20} color="inherit" />}
                        Download
                    </Button>
                </Box>
            )}
            <BaseDataGrid
                rows={rows}
                columns={columns}
                rowsPerPageOptions={rowsPerPageOptions}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(newSelection: string[]) => {
                    setSelected(newSelection);
                }}
                selectionModel={selected}
                components={{
                    BaseCheckbox: BaseCheckbox,
                }}
            />
        </>
    );
};

export default DatasourceFilesTable;
