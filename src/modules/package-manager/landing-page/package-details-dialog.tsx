import { Grid, IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import BaseDialog from "../../../components/base-dialog";
import { DialogRows, landingPageConstants } from "../constants";
import { IDialogContent, IPackages, IPkgDetailDialog, IAttrs } from "../interfaces";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import moment from "moment";
import DownloadIcon from "@mui/icons-material/Download";
import LabelTextField from "../create-sku-modal/common/labeltext-field";
import { PrimaryButton, CancelButton } from "../common";

const getValue = (id: string, pkg?: IPackages) => {
    let val = pkg?.[id as keyof IPackages];
    val = val ?? "-";
    if (id === "date_created" || id === "date_updated") {
        try {
            val = moment(new Date(val)).format("MM/DD/YYYY hh:mm a");
            if ("Invalid date".includes(val)) throw new Error("Invalid Date");
        } catch (err) {
            val = "-";
        }
    }
    return val;
};

const FieldRow = ({ label, value }: { label: string; value: string }) => {
    return (
        <React.Fragment>
            <Grid item width="100%" mb="1.5rem">
                <Grid container>
                    <Grid item xs>
                        <Typography variant="text_14_bold">{label}:</Typography>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="tableData">{value}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

//eslint-disable-next-line
const DialogContent: React.FC<IDialogContent> = ({ pkg, onClose, onSave }) => {
    const theme = useTheme();
    const [attrs, setAttrs] = useState<IAttrs>({
        name: "",
        description: "",
    });
    const [errors, setErrors] = useState({
        name: false,
        desc: false,
    });
    useEffect(() => {
        setAttrs({
            name: pkg?.name,
            description: pkg?.description,
        });
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!attrs.name || attrs.name === "") {
            setErrors({
                name: true,
                desc: false,
            });
        } else {
            setErrors({
                name: false,
                desc: false,
            });
        }
        //eslint-disable-next-line
    }, [attrs]);
    return (
        <Grid container width="30.125rem" direction="column">
            <Grid
                item
                width="100%"
                height="auto"
                pb="1rem"
                mb="1.5rem"
                sx={{ borderBottom: `1px solid ${theme.border.divider}` }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="text_18_bold">
                        {landingPageConstants.PKG_SETTINGS}
                    </Typography>
                    <CloseOutlinedIcon
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                            },
                        }}
                        onClick={() => onClose()}
                    />
                </Stack>
            </Grid>
            {DialogRows.map((dialog) => (
                <FieldRow
                    label={dialog.label}
                    key={dialog.label}
                    value={getValue(dialog.id, pkg)}
                />
            ))}
            {pkg?.upload_template_url && (
                <Grid item width="100%" mb="1rem">
                    <IconButton
                        sx={{
                            width: "100%",
                            borderRadius: "0",
                            height: "3.125rem",
                            background: theme.palette.info.main,
                            color: theme.palette.text.secondary,
                            "&:hover": {
                                background: theme.palette.info.main,
                            },
                        }}
                        onClick={() => {
                            window.open(pkg?.upload_template_url, "_blank");
                        }}
                    >
                        <DownloadIcon />
                        <Typography variant="tableData">{landingPageConstants.DOWNLOAD}</Typography>
                    </IconButton>
                </Grid>
            )}
            <Grid item>
                <LabelTextField
                    label={landingPageConstants.NAME}
                    disabled={
                        pkg?.package_type?.toLowerCase() === "base" ||
                        pkg?.package_type?.toLowerCase() === "alt"
                    }
                    required
                    textFieldProps={{
                        fullWidth: true,
                        value: attrs.name,
                        placeholder: landingPageConstants.NAME,
                        onChange(e) {
                            setAttrs((prev) => ({ ...prev, name: e.target.value }));
                        },
                    }}
                    labelStyle={{
                        color: theme.text.light,
                    }}
                    error={errors.name}
                    helperText={
                        pkg?.package_type?.toLowerCase() !== "base" &&
                        pkg?.package_type?.toLowerCase() !== "alt"
                            ? "This Field is Required"
                            : undefined
                    }
                />
            </Grid>
            <Grid item mt="1rem">
                <LabelTextField
                    label={landingPageConstants.DESC}
                    required
                    multiline
                    rows={3}
                    textFieldProps={{
                        fullWidth: true,
                        value: attrs.description,
                        placeholder: landingPageConstants.DESC,
                        onChange(e) {
                            setAttrs((prev) => ({ ...prev, description: e.target.value }));
                        },
                    }}
                    labelStyle={{
                        color: theme.text.light,
                    }}
                    helperText="This Field is Required"
                />
            </Grid>

            <Grid item mt="1.25rem" width="100%">
                <Stack
                    spacing={2}
                    direction="row"
                    width="50%"
                    justifyContent="flex-end"
                    ml="50%"
                    mb="1rem"
                >
                    <CancelButton onClick={() => onClose?.()}>
                        {landingPageConstants.CANCEL}
                    </CancelButton>
                    <PrimaryButton
                        sx={{
                            "&:disabled": {
                                background: "#C0C0C0",
                                color: "white",
                            },
                        }}
                        disabled={errors.name || errors.desc}
                        onClick={() => {
                            onSave?.(pkg, attrs);
                            onClose();
                        }}
                    >
                        {landingPageConstants.SAVE}
                    </PrimaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};

const PackageDetailDialog: React.FC<IPkgDetailDialog> = ({ pkg, open, onClose, onSave }) => {
    return (
        <React.Fragment>
            <BaseDialog
                open={open}
                setOpen={onClose}
                button={null}
                content={<DialogContent pkg={pkg} onClose={onClose} onSave={onSave} />}
            />
        </React.Fragment>
    );
};

export default PackageDetailDialog;
