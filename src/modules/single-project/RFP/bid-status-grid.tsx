/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    Stack,
    Typography,
    Divider,
    AccordionDetails,
    Box,
} from "@mui/material";
import BaseChip from "components/chip";
import { IRFPProps } from "./index";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataGridPro from "components/data-grid-pro";
import { GridRenderCellParams } from "@mui/x-data-grid";

import moment from "moment";
import { cloneDeep } from "lodash";
function BidStatusGrid(RFP: IRFPProps) {
    const [rows, setRows]: any[] = useState([]);
    const getStatusLabel = (status: string) => {
        switch (status) {
            case "requested_revised_pricing":
                return "Request for Revision";
            case "pending_invite":
                return "Not Invited";
            case "pending_submission":
                return "Accepted";
            case "sent":
                return "Invited";
            case "lost_bid":
                return "Lost Bid";
            case "awarded":
                return "Won";
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };
    useEffect(() => {
        setRows(
            RFP.bidStatusData.map((item: any, index: number) => ({
                id: index,
                contractor: item.orgName,
                bidActivityResponse: getStatusLabel(item.bid_status),
                isActive: item.bid_status == "pending_submission",
                ...item,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [RFP.bidStatistics, RFP.organizations]);
    const getColor = (status: any) => {
        switch (status) {
            case "Finalist":
                return "#B86800";

            case "Declined":
                return "#D72C0D";

            case "Closed":
            case "Not Invited":
                return "#6A6464";

            case "Sitewalk Completed":
                return "#0E845C";

            case "Request for Revision":
                return "#0088C7";
            case "Invited":
                return "#0088C7";
            case "Accepted":
            case "Submitted":
                return "#0E845C";
            case "Won":
                return "#410099";
            default:
                return "";
        }
    };
    const getSubmittedDate = (item: any) => {
        const rfpVersion = RFP?.project?.system_remarks?.rfp_project_version;
        const bidResponses: any = cloneDeep(
            rfpVersion === "1.0" ? item?.bid_versions : item?.bid_responses,
        ); // Clone the array
        const dateProperty = rfpVersion === "1.0" ? "date_created" : "created_at";
        const sortedData = bidResponses?.sort(
            (a: any, b: any) =>
                new Date(b?.[dateProperty]).getTime() - new Date(a?.[dateProperty]).getTime(),
        );
        return sortedData?.length ? sortedData[0]?.[dateProperty] : "";
    };

    const getImportantDate = (item: any) => {
        let importantDates: any = [];

        switch (item.bidActivityResponse) {
            case "Declined":
                importantDates.push(
                    <Typography>{`Initial Bid Due  ${moment(
                        RFP?.project?.rfp_bid_details?.bid_due_date,
                    ).format("l")}`}</Typography>,
                );
                break;
            case "Closed":
            case "Not Invited":
                importantDates.push(
                    <Typography>{`Initial Bid Due  ${moment(
                        RFP?.project?.rfp_bid_details?.bid_due_date,
                    ).format("l")}`}</Typography>,
                );
                break;
            case "Sitewalk Completed":
                importantDates.push(
                    <Typography>{`Initial Bid Due  ${moment(
                        RFP?.project?.rfp_bid_details?.bid_due_date,
                    ).format("l")}`}</Typography>,
                );
                break;
            case "Request for Revision":
                importantDates.push(
                    <Typography>{`Initial Bid Due  ${moment(
                        RFP?.project?.rfp_bid_details?.bid_due_date,
                    ).format("l")}`}</Typography>,
                );
                break;
            case "Invited":
                importantDates.push(
                    <Typography>{`Initial Bid Due  ${moment(
                        RFP?.project?.rfp_bid_details?.bid_due_date,
                    ).format("l")}`}</Typography>,
                );
                break;
            case "Accepted":
                importantDates.push(
                    <Typography>{`Initial Bid Due  ${moment(
                        RFP?.project?.rfp_bid_details?.bid_due_date,
                    ).format("l")}`}</Typography>,
                );
                break;
            case "Submitted":
            case "Lost Bid":
                importantDates.push(
                    <Typography>{`Submitted  ${
                        getSubmittedDate(item) || getSubmittedDate(item) != ""
                            ? moment(getSubmittedDate(item)).format("l")
                            : ""
                    }`}</Typography>,
                );
                break;

            default:
                break;
        }

        item?.sitewalkDetils
            ? importantDates.push(
                  <Typography>{`Sitewalk  ${moment(
                      item?.sitewalkDetils?.invite_config?.scheduled_date_time,
                      "DD-MM-YYYY HH:mm",
                  ).format("l  [at] LT")}`}</Typography>,
              )
            : importantDates;

        return importantDates;
    };
    const BidStatistiDataColumns: any = useMemo(
        () => [
            {
                field: "contractor",
                headerName: "Contractor",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.contractor}</Typography>
                ),
            },
            {
                field: "bidActivityResponse",
                headerName: "Bid Status",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Box columnGap={3} display={"flex"}>
                        <BaseChip
                            label={params.row.bidActivityResponse}
                            bgcolor={"#fff"}
                            textColor={getColor(params.row.bidActivityResponse)}
                            sx={{
                                width: "fit-content",
                                fontSize: "14px",
                                fontWeight: 400,
                                fontFamily: "Roboto",
                                lineHeight: "20px",
                                borderRadius: "4px",
                                border: `1px solid ${getColor(params.row.bidActivityResponse)}`,
                            }}
                        />
                        {params.row.isFinalist && (
                            <BaseChip
                                label={"Finalist"}
                                bgcolor={"#fff"}
                                textColor={getColor("Finalist")}
                                sx={{
                                    width: "fit-content",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    fontFamily: "Roboto",
                                    lineHeight: "20px",
                                    borderRadius: "4px",
                                    border: `1px solid ${getColor(params.row.bidActivityResponse)}`,
                                }}
                            />
                        )}
                    </Box>
                ),
            },

            {
                field: "importantDates",
                headerName: "Important Dates",
                type: "string",
                flex: 1,
                headerAlign: "left",
                align: "left",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {getImportantDate(params.row)}
                    </Typography>
                ),
            },
        ], //eslint-disable-next-line
        [RFP.bidStatistics],
    );
    return (
        <Accordion elevation={0}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-bid-status-content"
                id="panel-bid-status-header"
            >
                <Stack direction={"row"} gap={"1.5rem"} alignItems={"center"}>
                    <Typography variant="text_18_semibold" color={"#232323"}>
                        Bid Status
                    </Typography>
                    <BaseChip
                        label={`${rows.filter((row: any) => row.isActive).length} Active`}
                        bgcolor={"#AEE9D1"}
                        textColor={"#0E845C"}
                        sx={{
                            width: "fit-content",
                            fontSize: "14px",
                            fontWeight: 400,
                            fontFamily: "Roboto",
                            lineHeight: "20px",
                            borderRadius: "4px",
                            border: "1px solid  #AEE9D1",
                        }}
                    />
                </Stack>
            </AccordionSummary>
            <Divider sx={{ color: "#232323", marginBottom: "1.5rem" }} />
            <AccordionDetails>
                <DataGridPro
                    disableColumnMenu={false}
                    disableRowSelectionOnClick
                    columns={BidStatistiDataColumns}
                    rows={rows}
                    checkboxSelection={false}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    showNoRowsOverlay={true}
                    pageSizeOptions={[10, 20, 30]}
                    hideToolbar
                    rowsPerPageOptions={[10, 20, 30]}
                />
            </AccordionDetails>
        </Accordion>
    );
}
export default BidStatusGrid;
