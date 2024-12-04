import React from "react";
import { Stack, Box, Typography, Button, Divider } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ReactComponent as Question } from "../../assets/icons/question.svg";
import BaseDialog from "../../components/base-dialog";
import AppTheme from "../../styles/theme";
import { CONFIRMATION_VARIANT } from "../../styles/common-constant";
import { ReactComponent as Triangle } from "../../assets/icons/warning-triangle.svg";
import { ReactComponent as Warning } from "../../assets/icons/warning-blue.svg";
import { ReactComponent as Square } from "../../assets/icons/square-info.svg";
import { ReactComponent as Decline } from "../../assets/icons/decline.svg";
import BaseTextField from "../text-field";
import SaveIcon from "@mui/icons-material/Save";
interface IConfirmationModal {
    onProceed: any;
    onCancel: any;
    text?: any;
    open: boolean;
    isInput?: boolean;
    variant?: String;
    onInputChange?: any;
    actionText?: any;
    cancelText?: any;
    icon?: any;
    [key: string]: any;
    stackWidth?: string;
    title?: string;
}

const ConfirmationModal = ({
    text,
    onProceed,
    onCancel,
    open,
    variant,
    icon,
    isInput,
    onInputChange,
    actionText,
    cancelText,
    stackWidth,
    title,
    ...rest
}: IConfirmationModal) => {
    const getIcon = () => {
        switch (variant) {
            case CONFIRMATION_VARIANT.CREATION:
                return <Question />;
            case CONFIRMATION_VARIANT.DELETION:
                return <Triangle />;
            case CONFIRMATION_VARIANT.WARNING:
                return <Warning />;
            case CONFIRMATION_VARIANT.DECLINE:
                return <Decline />;
            default:
                return <Square />;
        }
    };
    const getBackgroundColor = () => {
        switch (variant) {
            case CONFIRMATION_VARIANT.CREATION:
                return AppTheme.palette.info.main;
            case CONFIRMATION_VARIANT.DELETION:
                return AppTheme.text.error;
            case CONFIRMATION_VARIANT.DECLINE:
                return AppTheme.text.error;
            default:
                return AppTheme.text.info;
        }
    };
    const { loading, loadingText }: any = { ...rest };
    return (
        <Box>
            <BaseDialog
                button={null}
                content={
                    <React.Fragment>
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            p="1rem"
                            width={stackWidth ? stackWidth : "auto"}
                        >
                            {title && (
                                <Box width={"100%"} mb={7}>
                                    <Typography
                                        variant="text_18_bold"
                                        textAlign="center"
                                        lineHeight={"25px"}
                                    >
                                        {title}
                                    </Typography>
                                    <Divider style={{ marginTop: "16px" }} />
                                </Box>
                            )}
                            {icon ? icon : getIcon()}
                            <Typography
                                variant="text_18_regular"
                                textAlign="center"
                                lineHeight={"25px"}
                            >
                                {text}
                            </Typography>
                            {isInput && (
                                <Box mt="20px">
                                    <BaseTextField variant="outlined" onChange={onInputChange} />
                                </Box>
                            )}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={8}
                                mt="20px"
                            >
                                <Button
                                    variant="contained"
                                    sx={{
                                        minWidth: "73px",
                                        padding: "12px 15px",
                                        backgroundColor: "#EEEEEE",
                                        color: "#000000",
                                        ":hover": {
                                            opacity: "0.7",
                                            backgroundColor: "#EEEEEE",
                                        },
                                    }}
                                    onClick={onCancel}
                                >
                                    <Typography variant="text_16_semibold" textAlign="center">
                                        {cancelText ? cancelText : "Cancel"}
                                    </Typography>
                                </Button>

                                <LoadingButton
                                    loading={loading}
                                    onClick={onProceed}
                                    loadingPosition="start"
                                    startIcon={loading ? <SaveIcon /> : null}
                                    variant="contained"
                                    sx={{
                                        minWidth: "73px",
                                        padding: "12px 15px",
                                        backgroundColor: getBackgroundColor(),
                                        ":hover": {
                                            opacity: "0.7",
                                            backgroundColor: getBackgroundColor(),
                                        },
                                    }}
                                >
                                    <Typography variant="text_16_semibold" textAlign="center">
                                        {loading
                                            ? loadingText
                                            : actionText
                                            ? actionText
                                            : "Procced"}
                                    </Typography>
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </React.Fragment>
                }
                open={open}
                setOpen={onCancel}
                {...rest}
            />
        </Box>
    );
};
export default ConfirmationModal;
