import { Dialog, DialogContent, Paper, Stack, Typography } from "@mui/material";
import BaseButton from "components/button";
import React, { useEffect } from "react";
import SourceOutlinedIcon from "@mui/icons-material/SourceOutlined";
import BaseTextField from "components/text-field";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import CommonDialog from "modules/admin-portal/common/dialog";
import { COPY_APPENDIX_DIALOG } from "modules/projects/constant";

interface ICopyAppendixDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: string | undefined;
}

const CopyAppendixDialog = ({ open, setOpen, projectId }: ICopyAppendixDialogProps) => {
    //const [field, setField] = useState<string>("");
    let [loader, setLoader] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();

    const { loading, error } = useAppSelector((state) => {
        return {
            loading: projectId ? state.rfpProjectManager.details?.[projectId]?.loading : false,
            error: projectId ? state.rfpProjectManager.details?.[projectId]?.error : false,
        };
    });

    const handleCopy = () => {
        dispatch(
            actions.rfpProjectManager.copyAppendixToGCFolderStart({
                project_id: projectId,
            }),
        );
        setOpen(false);
        setLoader(true);
    };

    useEffect(() => {
        if (!loading || error) {
            setTimeout(() => {
                setLoader(false);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [loading, error]);

    return (
        <>
            <CommonDialog
                open={loader}
                onClose={() => setLoader(false)}
                loading={loading}
                //@ts-ignore
                error={error}
                loaderText={COPY_APPENDIX_DIALOG.LOADING}
                errorText={COPY_APPENDIX_DIALOG.ERROR}
                saved={!loading && !error}
                savedText={COPY_APPENDIX_DIALOG.SAVED}
                width="40rem"
                minHeight="26rem"
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <Stack height="100%" justifyContent="center" alignItems="center">
                        <Paper elevation={3} sx={{ padding: "1rem", marginBottom: "1rem" }}>
                            <SourceOutlinedIcon htmlColor="#D90000" fontSize="large" />
                        </Paper>
                        <Typography variant={"text_18_regular"} sx={{ marginBottom: "20px" }}>
                            {COPY_APPENDIX_DIALOG.TEXT}
                        </Typography>
                        <Typography
                            variant={"text_12_regular"}
                            sx={{ marginBottom: "20px", color: "#A80000" }}
                        >
                            {COPY_APPENDIX_DIALOG.MESSAGE}
                        </Typography>
                        <BaseTextField
                            variant={"outlined"}
                            sx={{ marginBottom: "20px" }}
                            onChange={() => {
                                //setField(event.target.value);
                            }}
                            label={COPY_APPENDIX_DIALOG.LABEL}
                            placeholder={COPY_APPENDIX_DIALOG.PLACEHOLDER}
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="center" gap={"15px"}>
                        <BaseButton
                            onClick={() => {
                                setOpen(false);
                            }}
                            label={COPY_APPENDIX_DIALOG.CANCEL}
                            classes="grey default"
                            variant={"text_14_regular"}
                        />
                        <BaseButton
                            onClick={handleCopy}
                            label={COPY_APPENDIX_DIALOG.COPY}
                            classes={"error default"}
                            variant={"text_16_semibold"}
                        />
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CopyAppendixDialog;
