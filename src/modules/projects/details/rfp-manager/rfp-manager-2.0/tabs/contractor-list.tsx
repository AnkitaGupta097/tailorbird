import React, { useEffect } from "react";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import { GridRowParams } from "@mui/x-data-grid";
import BaseCheckbox from "components/checkbox";
import ContentPlaceholder from "components/content-placeholder";
import BaseDataGrid from "components/data-grid";
import { KebabMenuIcon } from "modules/package-manager/landing-page/packages-table";
import moment from "moment";
import { TimeStampTo12HourFormat } from "utils/date-time-convertor";
import LeveledBidSheetsUpload from "./leveled-bisheet-upload";
import ContractUpload from "./contract-upload";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useParams } from "react-router-dom";
import actions from "stores/actions";
import { isEmpty } from "lodash";
import MaximumBidderspopup from "./maximumBidderspopup";
interface IContractorList {
    columns: any;
    contractors: any[];
    setOpenModal: any;
    setSelectedContractors: React.Dispatch<React.SetStateAction<string[]>>;
    isBidSetup: boolean;
    projectDetails: any;
    latestRenovationVersion: number;
    versionSavedOn: string;
    getMaxBidders: any;
    getIsRestrictedMaxBidders: any;
}

const ContractorList = ({ projectDetails, ...props }: IContractorList) => {
    const [maxBidders, setMaxbidders] = React.useState<number>();
    const [isRestrictedMaxBidders, setIsRestrictedMaxBidders] = React.useState<boolean>();
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const { allUsers } = useAppSelector((state) => {
        return {
            allUsers: state.tpsm.all_User?.users || [],
        };
    });
    useEffect(() => {
        dispatch(
            actions.singleProject.getLeveledBidDocumentsStart({
                project_id: projectId,
                file_type: "LEVELED_BID_DOCUMENTS",
            }),
        );
        dispatch(
            actions.singleProject.getLeveledBidDocumentsStart({
                project_id: projectId,
                file_type: "CONTRACTS",
            }),
        );
        if (isEmpty(allUsers)) {
            dispatch(actions.tpsm.fetchAllUserStart(""));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    useEffect(() => {
        if (projectDetails) {
            setMaxbidders(projectDetails?.max_bidders);
            setIsRestrictedMaxBidders(projectDetails?.is_restricted_max_bidders);
        }
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        props.getMaxBidders(maxBidders);
        props.getIsRestrictedMaxBidders(isRestrictedMaxBidders);
        // eslint-disable-next-line
    }, [isRestrictedMaxBidders, maxBidders]);

    return (
        <>
            {props?.isBidSetup && (
                <Grid
                    container
                    direction="row"
                    alignItems={"center"}
                    sx={{ marginTop: "16px", marginBottom: "16px" }}
                >
                    <Grid item>
                        <Typography
                            variant="text_14_bold"
                            sx={{
                                fontStyle: !isRestrictedMaxBidders ? "italic" : "normal",
                                color: !isRestrictedMaxBidders ? "#D2D5D8" : "#202223",
                            }}
                        >
                            {maxBidders && isRestrictedMaxBidders
                                ? `Maximum Bidders: ${maxBidders}`
                                : maxBidders && !isRestrictedMaxBidders
                                ? "Maximum Bidders Disabled"
                                : `Edit Maximum Bidders`}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <MaximumBidderspopup
                            oldMaxBidders={maxBidders ?? projectDetails?.max_bidders}
                            OldIsRestrictedMaxBidders={
                                isRestrictedMaxBidders ?? projectDetails?.is_restricted_max_bidders
                            }
                            setMaxBidders={setMaxbidders}
                            setIsRestrictedMaxBidders={setIsRestrictedMaxBidders}
                            contractors={props?.contractors}
                        />
                    </Grid>
                    <Grid item>
                        <Stack direction={"row"} gap={2}>
                            <Divider
                                orientation="vertical"
                                flexItem={true}
                                sx={{ borderLeftWidth: 2 }}
                            />
                            <Typography
                                variant={"text_14_bold"}
                                sx={{ color: "#202223" }}
                            >{`Latest Bidbook Version: ${
                                props?.latestRenovationVersion > 0
                                    ? `Version ${props?.latestRenovationVersion}`
                                    : "No version saved yet"
                            }`}</Typography>
                            {props?.latestRenovationVersion > 0 && (
                                <Typography variant={"text_14_regular"}>{`(saved on ${moment(
                                    props?.versionSavedOn,
                                ).format("MM/DD/YYYY")} at ${TimeStampTo12HourFormat(
                                    props?.versionSavedOn,
                                )})`}</Typography>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            )}
            <BaseDataGrid
                columns={props?.columns}
                rows={props?.contractors ?? []}
                rowsPerPageOptions={[10, 20, 30]}
                getRowHeight={() => "auto"}
                checkboxSelection={true}
                isRowSelectable={(params: GridRowParams) =>
                    params.row.bid_status !== "declined" &&
                    params.row.bid_status !== "lost_bid" &&
                    props?.isBidSetup
                }
                onSelectionModelChange={(ids: string[]) => {
                    props?.setSelectedContractors(ids);
                }}
                hideFooter={props?.contractors?.length > 10 ? false : true}
                components={{
                    MoreActionsIcon: KebabMenuIcon,
                    BaseCheckbox: BaseCheckbox,
                    NoRowsOverlay: () => (
                        <Stack margin={"10px"}>
                            <ContentPlaceholder
                                onLinkClick={() => props?.setOpenModal(true)}
                                text="No contractors added."
                                aText="Add contractors"
                                height="250px"
                            />
                        </Stack>
                    ),
                }}
                getRowId={(row: any) => row?.organization_id}
            />

            <LeveledBidSheetsUpload />

            <ContractUpload />
        </>
    );
};

export default ContractorList;
