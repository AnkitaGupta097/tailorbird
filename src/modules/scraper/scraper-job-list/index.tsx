import { Chip, Typography, Stack } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import actions from "../../../stores/actions";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import { useNavigate } from "react-router-dom";
import { emptyJobList, jobStatuses } from "../constant";
import { getBgColor, getTextColor } from "../helper";
import BaseDataGrid from "components/data-grid";
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import moment from "moment";
import ContentPlaceholder from "components/content-placeholder";
const ScraperJobList = (props: { handleOpen: () => void; searchText: any }) => {
    //Navigation
    const navigate = useNavigate();
    //Redux
    const dispatch = useAppDispatch();
    const { loading, jobs } = useAppSelector((state) => {
        return {
            loading: state.scraperService.scraper.loading,
            jobs: state.scraperService.scraper.data,
            snackbar: state.common.snackbar,
        };
    }, shallowEqual);

    useEffect(() => {
        if (jobs?.length == 0 || !jobs) {
            dispatch(actions.scraperService.fetchScraperStart());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let rows: any[] = jobs
        ?.slice()
        ?.sort((s1: any, s2: any) => Date.parse(s1.createdAt) - Date.parse(s2.createdAt))
        ?.reverse()
        ?.map((project: any) => ({
            id: project.job_id,
            name: project.name,
            ownership: project?.ownership_name,
            uploadedBy: project?.created_by,
            creationDate: project?.created_at,
            description: project?.description,
            fileName:
                project.file_name?.indexOf("/") > -1
                    ? project.file_name.substring(project.file_name.indexOf("/") + 1)
                    : project.file_name,
            status: project?.status,
        }));

    const [displayedRows, setDisplayedRows] = useState<any[]>(rows);

    //Columns
    const ScraperJobsListColumns: GridColumns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Project Name",
                flex: 1.5,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.name}</Typography>
                ),
            },
            {
                field: "ownership",
                headerName: "Ownership",
                flex: 0.6,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.ownership_name || ""}
                    </Typography>
                ),
            },
            {
                field: "uploadedBy",
                headerName: "Uploaded By",
                flex: 0.75,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.uploadedBy}</Typography>
                ),
            },
            {
                field: "creationDate",
                headerName: "Date",
                flex: 0.65,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.creationDate
                            ? moment.parseZone(params.row.creationDate).local().format("L LT")
                            : ""}
                    </Typography>
                ),
            },
            {
                field: "description",
                headerName: "Description",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.description}</Typography>
                ),
            },
            {
                field: "fileName",
                headerName: "File Name",
                flex: 1.5,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.fileName}</Typography>
                ),
            },
            {
                field: "status",
                headerName: "Status",
                flex: 0.75,
                renderCell: (params: GridRenderCellParams) => (
                    <Chip
                        label={
                            <Typography color={getTextColor(params.row.status)} variant="tableData">
                                {jobStatuses.includes(params.row.status)
                                    ? `Scraping ${params.row.status}`
                                    : params.row.status}
                            </Typography>
                        }
                        sx={{ backgroundColor: getBgColor(params.row.status) }}
                    />
                ),
            },
        ], //eslint-disable-next-line
        [jobs],
    );

    useEffect(() => {
        if (props.searchText === "") setDisplayedRows(rows);
        else
            setDisplayedRows(
                rows.filter(
                    (row) =>
                        row.ownership?.toLowerCase().includes(props.searchText) ||
                        row.name?.toLowerCase().includes(props.searchText) ||
                        row.uploadedBy?.toLowerCase().includes(props.searchText),
                ),
            );
        //eslint-disable-next-line
    }, [jobs, props.searchText]);

    return (
        <React.Fragment>
            <BaseDataGrid
                columns={ScraperJobsListColumns}
                rows={displayedRows}
                rowsPerPageOptions={[10, 20, 30]}
                loading={loading}
                onRowClick={(rowData: any) => {
                    if (rowData.status === "submitted") {
                        navigate(`/scraper/highlight_results/${rowData.id}`);
                    } else {
                        navigate(`/scraper/highlight_results/${rowData.id}/results`);
                    }
                }}
                sx={{
                    // pointer cursor on ALL rows
                    "& .MuiDataGrid-row:hover": {
                        cursor: "pointer",
                    },
                }}
                disableColumnMenu={false}
                components={{
                    NoRowsOverlay: () => (
                        <Stack sx={{ margin: "10px" }}>
                            <ContentPlaceholder
                                onLinkClick={() => {
                                    props?.handleOpen;
                                }}
                                text={emptyJobList.noScrapeJobsText}
                                aText=""
                                height="90px"
                            />
                        </Stack>
                    ),
                }}
                hideFooter={jobs?.lengthv > 10 ? true : false}
                getRowId={(row: any) => row.id}
            />
        </React.Fragment>
    );
};

export default ScraperJobList;
