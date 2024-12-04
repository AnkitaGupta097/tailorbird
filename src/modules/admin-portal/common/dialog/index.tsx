import {
    Grid,
    Stack,
    Typography,
    Divider,
    IconButton,
    Dialog,
    DialogContent,
    Paper,
} from "@mui/material";
import BaseButton from "components/button";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import React, { FC } from "react";
import { ICommonDialog } from "../utils/interfaces";
import BlinkLoader from "../../../../assets/icons/blink-loader.gif";
import CheckIcon from "../../../../assets/icons/icon-ellipse5.svg";
import RedCheckIcon from "../../../../assets/icons/icon_red_question.svg";
import WarningIcon from "../../../../assets/icons/icon_warning_red.svg";
import ErrorIcon from "../../../../assets/icons/icon-error.svg";
const CommonDialog: FC<ICommonDialog> = ({
    iconSrc,
    open,
    onClose,
    children,
    title,
    onSave,
    loading,
    saved,
    loaderText,
    savedText,
    deleteDialog,
    deleteText,
    onDelete,
    error,
    errorText,
    minHeight,
    width,
    errorName,
    downloadFile,
    saveLabel,
}) => {
    return (
        <>
            <Dialog onClose={() => onClose?.()} open={open} maxWidth="md">
                <DialogContent>
                    <Grid
                        container
                        width={width}
                        minHeight={minHeight}
                        direction="column"
                        justifyContent="center"
                    >
                        {!loading && !saved && !deleteDialog && !error && title && (
                            <>
                                <Grid item>
                                    <Stack direction="row" alignItems="center">
                                        <img src={iconSrc} alt="icon" />
                                        <Typography variant="text_16_semibold" ml="1rem">
                                            {title}
                                        </Typography>
                                        <IconButton
                                            sx={{
                                                marginLeft: "auto",
                                                marginRight: "-0.7rem",
                                            }}
                                            onClick={() => onClose?.()}
                                        >
                                            <DisabledByDefaultRoundedIcon
                                                htmlColor="#004D71"
                                                fontSize="large"
                                            />
                                        </IconButton>
                                    </Stack>
                                </Grid>
                                <Divider
                                    flexItem
                                    sx={{
                                        width: "100%",
                                        border: "1px solid #DEDEDE",
                                        marginTop: ".5rem",
                                    }}
                                />
                                <Grid item sm>
                                    {children}
                                </Grid>
                                <Grid item mt="1rem">
                                    <Stack direction="row" justifyContent="flex-end" spacing="1rem">
                                        <BaseButton
                                            classes="grey default"
                                            onClick={() => onClose?.()}
                                            label="Close"
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                        />
                                        <BaseButton
                                            classes="primary default"
                                            label={saveLabel ? saveLabel : "Save"}
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                            onClick={() => onSave?.()}
                                        />
                                    </Stack>
                                </Grid>
                            </>
                        )}
                        {loading && (
                            <>
                                <Stack height="100%" justifyContent="center" alignItems="center">
                                    <Paper elevation={3} sx={{ padding: "1rem" }}>
                                        <img src={BlinkLoader} alt="Loader" />
                                    </Paper>
                                    <Typography
                                        whiteSpace="pre-line"
                                        variant="text_18_regular"
                                        mt="1rem"
                                        maxWidth="60%"
                                        textAlign="center"
                                    >
                                        {loaderText}
                                    </Typography>
                                </Stack>
                            </>
                        )}
                        {saved && (
                            <>
                                <Stack height="100%" justifyContent="center" alignItems="center">
                                    <img src={CheckIcon} alt="Saved Icon" />
                                    <Typography variant="text_18_regular" mt="1rem">
                                        {savedText}
                                    </Typography>
                                </Stack>
                            </>
                        )}
                        {deleteDialog && !saved && !error && !loading && (
                            <>
                                <Stack height="100%" justifyContent="center" alignItems="center">
                                    <Paper
                                        elevation={3}
                                        sx={{ padding: "1rem", marginBottom: "3rem" }}
                                    >
                                        <img src={RedCheckIcon} alt="Delete icon" />
                                    </Paper>
                                    <Typography variant="text_18_regular" mb="2rem">
                                        {deleteText}
                                    </Typography>
                                    <Stack direction="row" justifyContent="flex-end" spacing="1rem">
                                        <BaseButton
                                            classes="grey default"
                                            onClick={() => onClose?.()}
                                            label="No"
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                        />
                                        <BaseButton
                                            classes="primary default"
                                            label="Yes"
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                            onClick={() => onDelete?.()}
                                        />
                                    </Stack>
                                </Stack>
                            </>
                        )}
                        {!loading && error && !saved && (
                            <Stack height="100%" justifyContent="center" alignItems="center">
                                <Paper elevation={3} sx={{ padding: "1rem" }}>
                                    <img
                                        src={downloadFile ? ErrorIcon : WarningIcon}
                                        alt="Loader"
                                    />
                                </Paper>
                                <Typography variant="text_18_bold" color="#D90000" mt="1rem">
                                    {typeof errorName == "string" ? errorName : "Error"}
                                </Typography>
                                <Typography
                                    whiteSpace="pre-line"
                                    variant="text_18_regular"
                                    mt="1rem"
                                    maxWidth="60%"
                                    textAlign="center"
                                >
                                    {errorText}
                                </Typography>
                                {downloadFile && (
                                    <Stack
                                        direction="row"
                                        marginTop={"2rem"}
                                        justifyContent="flex-end"
                                        spacing="1rem"
                                    >
                                        <BaseButton
                                            classes="grey default"
                                            onClick={() => onClose?.()}
                                            label="Cancel"
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                        />
                                        <BaseButton
                                            classes="primary default"
                                            label="Download error list"
                                            style={{
                                                backgroundColor: "#D90000",
                                            }}
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                            onClick={() => downloadFile?.()}
                                        />
                                    </Stack>
                                )}
                            </Stack>
                        )}
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default CommonDialog;
