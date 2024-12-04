import React, { useEffect, useState } from "react";
import BaseDialog from "components/base-dialog";
import { Grid, Stack, Typography, useTheme } from "@mui/material";
import { CONTAINER_VERSIONS, landingPageConstants } from "../constants";
import LabelTextField from "../create-sku-modal/common/labeltext-field";
import { CancelButton, PrimaryButton } from "../common";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OwnerShip from "components/ownership-dropdown";
import { IOrg, IContent, IDataState, ICreateStandardPkgDialog } from "../interfaces";

const validateErrors = (
    data: IDataState,
    setErrors: React.Dispatch<React.SetStateAction<any>>,
): any => {
    const errors = {
        name: data.name === "",
        description: data.description === "",
        ownership: !data.ownership,
    };
    setErrors(() => ({
        ...errors,
    }));
    return errors;
};

const Content = ({ onClose, onSave }: IContent) => {
    const theme = useTheme();
    const [data, setData] = useState<IDataState>({
        name: "",
        ownership: null,
        description: "",
        version: CONTAINER_VERSIONS[0],
    });
    const [errors, setErrors] = useState({
        name: false,
        description: false,
        ownership: false,
    });
    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        const allErrorsFalse = Object.values(errors).every((prop: any) => !prop);
        setDisableSave(!allErrorsFalse);
    }, [errors]);

    useEffect(() => {
        validateErrors(data, setErrors);
    }, [data]);

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
                    <Typography variant="text_18_bold">{`${landingPageConstants.CREATE} ${landingPageConstants.STANDARD_PKG}`}</Typography>
                    <CloseOutlinedIcon
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                            },
                        }}
                        onClick={() => onClose?.()}
                    />
                </Stack>
            </Grid>
            <Grid item>
                <LabelTextField
                    label={landingPageConstants.NAME}
                    required
                    textFieldProps={{
                        fullWidth: true,
                        value: data.name,
                        placeholder: landingPageConstants.NAME,
                        onChange(e) {
                            setData((prev) => ({ ...prev, name: e.target.value }));
                        },
                    }}
                    labelStyle={{
                        color: theme.text.light,
                    }}
                    error={errors.name}
                    helperText={errors.name ? "This Field is Required" : undefined}
                />
            </Grid>
            <Grid item mt="1rem">
                <LabelTextField
                    label={landingPageConstants.OWNERSHIP_GROUP}
                    required
                    labelStyle={{
                        color: theme.text.light,
                    }}
                    dropDownMenu={
                        <OwnerShip
                            value={data.ownership}
                            setState={(val: IOrg) => {
                                setData((data) => ({ ...data, ownership: val }));
                            }}
                            placeholder={landingPageConstants.OWNERSHIP_GROUP}
                            error={errors.ownership}
                            helperText={errors.ownership ? "This Field is Required" : undefined}
                        />
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
                        value: data.description,
                        placeholder: landingPageConstants.DESC,
                        onChange(e) {
                            setData((prev) => ({ ...prev, description: e.target.value }));
                        },
                    }}
                    labelStyle={{
                        color: theme.text.light,
                    }}
                    error={errors.description}
                    helperText={errors.description ? "This Field is Required" : undefined}
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
                        disabled={disableSave}
                        onClick={() => {
                            onSave?.(data);
                            onClose?.();
                        }}
                    >
                        {landingPageConstants.SAVE}
                    </PrimaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};

const CreateStandardPkgDialog: React.FC<ICreateStandardPkgDialog> = ({ open, onClose, onSave }) => {
    return (
        <React.Fragment>
            <BaseDialog
                open={open}
                setOpen={onClose}
                button={null}
                content={<Content onClose={onClose} onSave={onSave} />}
            />
        </React.Fragment>
    );
};

export default CreateStandardPkgDialog;
