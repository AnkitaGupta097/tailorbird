import React, { useState } from "react";
import { Typography, Grid, styled, Box, Button } from "@mui/material";
import UnitMixTable from "./unit-mix-table";
import { useAppSelector } from "../../../../../stores/hooks";
import { isEmpty } from "lodash";
import BaseButton from "../../../../../components/base-button";
import UnitMixModal from "../modal/unit-mix-modal";
import CommentLogModal from "../modal/comment-log-modal";
import { ReactComponent as MessageEmpty } from "../../../../../assets/icons/message-empty-icon.svg";
import { ReactComponent as MessageFill } from "../../../../../assets/icons/message-fill-icon.svg";
import { ReactComponent as DownLoad } from "assets/icons/download-icon.svg";
import {
    DOWNLOAD_UNIT_MIX,
    DOWNLOAD_UNIT_MIX_LOGS_FILE,
} from "stores/projects/details/overview/overview-queries";
import { graphQLClient } from "utils/gql-client";

const TitleSection = styled(Box)({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid #DFE0EB",
});

type IUnitMixProps = React.ComponentPropsWithRef<"div"> & {
    unitsEditable: boolean;
    projectId?: string;
};

const UnitMix = ({ unitsEditable, projectId }: IUnitMixProps) => {
    const { unitMix, commentLogs } = useAppSelector((state: any) => ({
        unitMix: state.projectFloorplans.unitMix,
        commentLogs: state.projectFloorplans.commentLogs.data,
    }));

    const [isOpen, setOpen] = useState<any>(false);
    const [isCommentModal, setCommentModal] = useState<any>(false);

    const downloadUnitMix = async () => {
        const res = await graphQLClient.query("downloadUnitMixes", DOWNLOAD_UNIT_MIX, {
            projectId,
        });
        window.open(res.downloadUnitMixes.s3_signed_url);
        const resLogs = await graphQLClient.query(
            "downloadUnitMixesLogs",
            DOWNLOAD_UNIT_MIX_LOGS_FILE,
            {
                projectId,
            },
        );

        if (resLogs?.downloadUnitMixesLogs?.s3_signed_url)
            window.open(resLogs.downloadUnitMixesLogs.s3_signed_url);
    };

    return (
        <Grid container px={10}>
            <Grid item md={12} pb={4}>
                <TitleSection>
                    <Box mb={1}>
                        <Typography variant="text_18_semibold">Unit Mix</Typography>
                    </Box>
                    {isEmpty(commentLogs) ? (
                        <MessageEmpty />
                    ) : (
                        <MessageFill
                            onClick={() => (!isEmpty(commentLogs) ? setCommentModal(true) : null)}
                            style={{ cursor: "pointer" }}
                        />
                    )}
                    <Box flexGrow={1} />
                    <Box>
                        <Button startIcon={<DownLoad />} variant="text" onClick={downloadUnitMix}>
                            Download
                        </Button>
                    </Box>
                </TitleSection>
            </Grid>
            {!isEmpty(unitMix.projectFloorPlan) && <UnitMixTable />}
            <BaseButton
                label="Edit"
                type="active"
                style={{
                    height: "40px",
                }}
                onClick={() => setOpen(true)}
            />
            {isOpen && (
                <UnitMixModal
                    isOpen={isOpen}
                    handleClose={() => setOpen(false)}
                    unitsEditable={unitsEditable}
                />
            )}
            {isCommentModal && (
                <CommentLogModal
                    isOpen={isCommentModal}
                    handleClose={() => setCommentModal(false)}
                />
            )}
        </Grid>
    );
};

export default React.memo(UnitMix);
