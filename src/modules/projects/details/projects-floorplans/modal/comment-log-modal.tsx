import React from "react";
import { Dialog, DialogContent, DialogTitle, Box, Typography, Button, styled } from "@mui/material";
import AppTheme from "../../../../../styles/theme";
import { useAppSelector } from "../../../../../stores/hooks";
import { map, find } from "lodash";
import moment from "moment";

interface ICommentLogModal {
    isOpen: boolean;
    handleClose: any;
}

const LogBody = styled(Box)({
    width: "100%",
    paddingBottom: "16px",
    paddingTop: "12px",
    borderBottom: "1px solid #DFE0EB",
});

const CommentLogModal = ({ isOpen, handleClose }: ICommentLogModal) => {
    const { commentLogs, allUsers } = useAppSelector((state: any) => ({
        commentLogs: state.projectFloorplans.commentLogs.data,
        allUsers: state.tpsm.all_User.users,
    }));

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <Box display={"flex"} alignItems="center">
                    <Box mr={4}>
                        <Typography variant="text_18_semibold">Previous comments</Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box style={{ overflowY: "auto", maxHeight: "700px" }}>
                    {map(commentLogs, (log) => {
                        const user = find(allUsers, { id: log.user_id });
                        return (
                            <LogBody>
                                <Box mb={1}>
                                    <Box ml={2}>
                                        <Typography
                                            variant="text_16_medium"
                                            color={AppTheme.text.success}
                                        >
                                            {user?.name}
                                        </Typography>
                                        <Typography
                                            variant="text_12_regular"
                                            color={AppTheme.text.medium}
                                            style={{ marginLeft: "8px" }}
                                        >
                                            {moment(log.created_at).format(
                                                "MMM D, YYYY [at] H:mm A",
                                            )}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="text_16_regular"
                                        style={{ marginLeft: "8px" }}
                                        color={AppTheme.text.medium}
                                    >
                                        {log.remark}
                                    </Typography>
                                </Box>
                            </LogBody>
                        );
                    })}
                </Box>

                <Box display="flex" mt={4}>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ height: "40px", marginRight: "15px" }}
                        onClick={handleClose}
                    >
                        <Typography variant="text_16_semibold"> Close</Typography>
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CommentLogModal;
