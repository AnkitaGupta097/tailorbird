import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import BaseSvgIcon from "components/svg-icon";
import { AddUserText, InviteEstimatorsText, IValue } from "../constant";
import { ReactComponent as TakeOffIcon } from "../../../assets/icons/take-off-adjustment.svg";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import BaseButton from "components/button";
import BaseTextField from "components/text-field";
import React, { useCallback, useState } from "react";
import BaseAutoComplete from "components/auto-complete";
import PhoneNumberField from "components/phone-field";

interface IAddUser {
    addUser: boolean;
    value: IValue[];
    setAddUser: React.Dispatch<React.SetStateAction<boolean>>;
    /* eslint-disable no-unused-vars */
    addNewUser: (field: IValue) => void;
}

const initialUserErrors: any = {
    name: false,
    email: false,
};

const initialData: IValue = {
    name: "",
    email: "",
    contact_number: "",
    role: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
};

const AddUser = ({ addUser, setAddUser, addNewUser }: IAddUser) => {
    const [field, setField] = useState<IValue>(initialData);
    const [errors, setErrors] = useState<any>(initialUserErrors);
    const onSave = useCallback(() => {
        let errors = { ...initialUserErrors };
        if (!field.email) {
            errors.email = true;
        }
        if (!field.name) {
            errors.name = true;
        }

        //@ts-ignore
        if (Object.values(errors).reduce((prev, curr) => (!!curr === true ? 1 + prev : prev)) > 0) {
            setErrors(errors);
            return;
        }
        addNewUser(field);
        setErrors(initialUserErrors);
        setField(initialData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field]);
    return (
        <Dialog open={addUser} onClose={() => setAddUser(false)}>
            <DialogTitle>
                <Stack direction="row" alignItems="center">
                    <BaseSvgIcon svgPath={<TakeOffIcon />} />
                    <Typography variant="text_16_semibold" ml="0.6rem">
                        {AddUserText.USER}
                    </Typography>
                    <IconButton
                        sx={{
                            marginLeft: "auto",
                            padding: 0,
                        }}
                        onClick={() => {
                            setAddUser(false);
                        }}
                    >
                        <DisabledByDefaultRoundedIcon
                            htmlColor="#004D71"
                            style={{ marginRight: "-0.2rem" }}
                            fontSize="large"
                        />
                    </IconButton>
                </Stack>
                <Divider sx={{ marginTop: "0.5rem" }} />
            </DialogTitle>
            <DialogContent sx={{ marginBottom: 0, paddingBottom: "0.5rem" }}>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <BaseTextField
                            fullWidth
                            label={AddUserText.USER_NAME}
                            variant={"outlined"}
                            onChange={(event: any) => {
                                field.name = event.target.value;
                                setField(field);
                            }}
                            size="small"
                            error={errors.name}
                            helperText={errors.name && "This Field is required"}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <BaseTextField
                            fullWidth
                            label={AddUserText.EMAIL}
                            variant={"outlined"}
                            onChange={(event: any) => {
                                field.email = event.target.value;
                                setField(field);
                            }}
                            size="small"
                            error={errors.email}
                            helperText={errors.email && "This Field is required"}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <PhoneNumberField
                            onChange={(newPhoneNumber: any) =>
                                setField((prev) => ({
                                    ...prev,
                                    phoneNumber: newPhoneNumber,
                                }))
                            }
                            value={field.contact_number}
                            label={AddUserText.PHONE_NO}
                            size="small"
                            containerSpacing={2.5}
                            variant="outlined"
                            containerStyle={{
                                marginTop: ".25rem",
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <BaseAutoComplete
                            variant={"outlined"}
                            options={AddUserText.ROLES}
                            placeholder={AddUserText.SELECT_ROLE}
                            label={AddUserText.ROLE}
                            onChange={(event: any, newValue: any) => {
                                field.role = newValue;
                                setField(field);
                            }}
                            size="small"
                            isError={errors?.email ? true : false}
                            helperText={errors?.email ? "This is a required field" : ""}
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container direction="row" spacing="0.75rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {AddUserText.STREET_ADDRESS}
                                        </Typography>
                                    }
                                    fullWidth
                                    value={field.streetAddress}
                                    size="small"
                                    onChange={(e: any) => {
                                        setField((prev) => ({
                                            ...prev,
                                            streetAddress: e.target.value,
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {AddUserText.CITY}
                                        </Typography>
                                    }
                                    fullWidth
                                    value={field.city}
                                    onChange={(e: any) => {
                                        setField((prev) => ({ ...prev, city: e.target.value }));
                                    }}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction="row" spacing="0.75rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {AddUserText.STATE}
                                        </Typography>
                                    }
                                    fullWidth
                                    value={field.state}
                                    size="small"
                                    onChange={(e: any) => {
                                        setField((prev) => ({ ...prev, state: e.target.value }));
                                    }}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {AddUserText.ZIP_CODE}
                                        </Typography>
                                    }
                                    fullWidth
                                    value={field.zipCode}
                                    onChange={(e: any) => {
                                        setField((prev) => ({
                                            ...prev,
                                            zipCode: e.target.value,
                                        }));
                                    }}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ marginRight: "1rem", marginBottom: "1rem", marginTop: 0 }}>
                <BaseButton
                    onClick={() => {
                        setAddUser(false);
                    }}
                    label={InviteEstimatorsText.CANCEL}
                    classes="grey default spaced"
                    variant={"text_14_regular"}
                />
                <BaseButton
                    onClick={onSave}
                    label={AddUserText.SAVE}
                    classes="primary default spaced"
                    variant={"text_16_semibold"}
                />
            </DialogActions>
        </Dialog>
    );
};

export default AddUser;
