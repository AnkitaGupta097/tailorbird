import { Paper, Grid, Typography, Divider, Link } from "@mui/material";
import BaseButton from "components/button";
import BaseChip from "components/chip";
import React from "react";
import { ProjectDetailsText } from "../constant";
import { getText, getBgColor, getTextColor } from "../helper";
import { formatDate } from "utils/date-time-convertor";

interface IDetails {
    details: {
        address: string;
        bid_status: string;
        bidbook_url: string;
        bid_due_date: string;
        folder_url: string;
        ownership_group_name: string;
        project_id: string;
        project_name: string;
        property_type: string;
        organization_id: string;
    };
}

const Details = (props: IDetails) => {
    return (
        <Paper elevation={3}>
            <Grid container>
                <Grid item md={12} sx={{ margin: "1.25rem 0 1.25rem 1.25rem" }}>
                    <Typography variant="text_16_semibold">
                        {props?.details.project_name}
                    </Typography>
                </Grid>
                <Grid item md={12}>
                    <Divider />
                </Grid>
                <Grid item md={12} sx={{ margin: "1.25rem 0 1.25rem 1.25rem" }}>
                    <Grid container>
                        <Grid item md={6}>
                            <Grid container md={12} spacing={3}>
                                <Grid item md={12}>
                                    <Grid container md={12} direction="row">
                                        <Grid item md={4}>
                                            <Typography variant="text_14_regular">{`${ProjectDetailsText.PROPERTY_NAME}:`}</Typography>
                                        </Grid>
                                        <Grid item md={8}>
                                            <Typography variant="text_14_semibold">
                                                {props?.details.project_name.length !== 0
                                                    ? props?.details?.project_name
                                                    : "-"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12}>
                                    <Grid container md={12} direction="row">
                                        <Grid item md={4}>
                                            <Typography variant="text_14_regular">
                                                {`${ProjectDetailsText.OWNERSHIP_GROUP}:`}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8}>
                                            <Typography variant="text_14_semibold">
                                                {props?.details.ownership_group_name.length !== 0
                                                    ? props?.details.ownership_group_name
                                                    : "-"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12}>
                                    <Grid container md={12} direction="row">
                                        <Grid item md={4}>
                                            <Typography variant="text_14_regular">{`${ProjectDetailsText.PROPERTY_TYPE}:`}</Typography>
                                        </Grid>
                                        <Grid item md={8}>
                                            <Typography variant="text_14_semibold">
                                                {props?.details.property_type.length !== 0
                                                    ? props?.details.property_type
                                                    : "-"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12}>
                                    <Grid container md={12} direction="row">
                                        <Grid item md={4}>
                                            <Typography variant="text_14_regular">
                                                {`${ProjectDetailsText.PROPERTY_ADDRESS}:`}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8}>
                                            <Typography variant="text_14_semibold">
                                                {props?.details.address.length !== 0
                                                    ? props?.details.address
                                                    : "-"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={3}>
                            <Grid container flexDirection={"column"} spacing={6}>
                                <Grid item md={6}>
                                    <Grid container flexDirection={"row"}>
                                        <Grid item md={12}>
                                            <Typography variant="text_12_light">
                                                {ProjectDetailsText.LAST_BIDDING_DATE}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography variant="text_14_semibold">
                                                {formatDate(props?.details.bid_due_date, true)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={6}>
                                    <Grid container flexDirection={"row"}>
                                        <Grid item md={12}>
                                            <Typography variant="text_12_light">
                                                {ProjectDetailsText.BIDBOOK}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={12}>
                                            {props?.details.bidbook_url !== "UNASSIGNED" ? (
                                                <Link
                                                    href={props?.details.bidbook_url}
                                                    target="_blank"
                                                    underline="none"
                                                    sx={{ marginLeft: 0, marginRight: 0 }}
                                                >
                                                    <BaseButton
                                                        onClick={() => {}}
                                                        label={ProjectDetailsText.OPEN}
                                                        classes="primary default"
                                                        variant={"text_16_semibold"}
                                                    ></BaseButton>
                                                </Link>
                                            ) : (
                                                "-"
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={3}>
                            <Grid container flexDirection={"column"} spacing={3}>
                                <Grid item md={6}>
                                    <Grid container flexDirection={"row"}>
                                        <Grid item md={12}>
                                            <Typography variant="text_12_light">
                                                {ProjectDetailsText.STATUS}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={12}>
                                            <BaseChip
                                                label={getText(props?.details.bid_status)}
                                                bgcolor={getBgColor(props?.details.bid_status)}
                                                textColor={getTextColor(props?.details.bid_status)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={6}>
                                    <Grid container flexDirection={"row"}>
                                        <Grid item md={12}>
                                            <Typography variant="text_12_light">
                                                {ProjectDetailsText.RFP_FOLDER}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={12}>
                                            {props?.details.bidbook_url !== "UNASSIGNED" ? (
                                                <Link
                                                    href={props?.details.folder_url}
                                                    target="_blank"
                                                    underline="none"
                                                    sx={{ marginLeft: 0, marginRight: 0 }}
                                                >
                                                    <BaseButton
                                                        onClick={() => {}}
                                                        label={ProjectDetailsText.OPEN}
                                                        classes="primary default"
                                                        variant={"text_16_semibold"}
                                                    ></BaseButton>
                                                </Link>
                                            ) : (
                                                "-"
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Details;
