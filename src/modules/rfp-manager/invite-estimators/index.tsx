import {
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import BaseSvgIcon from "components/svg-icon";
import React from "react";
import { ReactComponent as TakeOffIcon } from "../../../assets/icons/take-off-adjustment.svg";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import BaseAutoComplete from "components/auto-complete";
import { stringAvatar } from "../helper";
import BaseChip from "components/chip";
import BaseButton from "components/button";
import AddIcon from "@mui/icons-material/Add";
import { InviteEstimatorsText, IValue } from "../constant";

interface IInviteEstimators {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    addUser: boolean;
    collaborators: IValue[];
    setAddUser: React.Dispatch<React.SetStateAction<boolean>>;
    value: IValue[];
    setValue: React.Dispatch<React.SetStateAction<IValue[]>>;
    inviteCollaborators: () => void;
    setCollaborators: React.Dispatch<React.SetStateAction<IValue[]>>;
    users: any[];
}

const InviteEstimators = ({
    isOpen,
    inviteCollaborators,
    setOpen,
    setAddUser,
    value,
    setValue,
    users,
}: IInviteEstimators) => {
    const PaperComponentCustom = (options: any) => {
        const { containerProps, children } = options;
        return (
            <Paper
                {...containerProps}
                sx={{ display: "flex", flexDirection: "column", maxHeight: "20rem" }}
            >
                {children?.[2] === null ? (
                    <Stack
                        direction="row"
                        spacing={2}
                        component="li"
                        alignItems={"center"}
                        sx={{ padding: "1.4rem 0 0.9rem 1.25rem" }}
                    >
                        {/* <Avatar {...stringAvatar(InviteEstimatorsText.NO_USER_FOUND, "#D90000")} /> */}
                        <Typography variant="text_14_semibold">
                            {InviteEstimatorsText.NO_USER_FOUND}
                        </Typography>
                    </Stack>
                ) : (
                    children
                )}
                <Divider />
                <BaseButton
                    variant={"text_16_semibold"}
                    onMouseDown={(event: { preventDefault: () => void }) => {
                        event.preventDefault();
                        setAddUser(true);
                    }}
                    onClick={() => {}}
                    label={InviteEstimatorsText.NEW_USER}
                    classes="primary default"
                    startIcon={<AddIcon style={{ fontSize: "1.7rem" }} />}
                    sx={{
                        marginTop: "0.9rem",
                        marginRight: "1rem",
                        alignSelf: "flex-end",
                        marginBottom: "0.9rem",
                        paddingTop: "0.4rem",
                    }}
                />
            </Paper>
        );
    };

    return (
        <>
            <Dialog open={isOpen} onClose={() => setOpen(false)}>
                <DialogTitle id="alert-dialog-title">
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                        {<BaseSvgIcon svgPath={<TakeOffIcon />} />}
                        <Typography variant="text_16_semibold" sx={{ paddingRight: "18rem" }}>
                            {InviteEstimatorsText.INVITE_ESTIMATORS}
                        </Typography>
                        <IconButton
                            sx={{ padding: 0 }}
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <DisabledByDefaultRoundedIcon
                                htmlColor="#004D71"
                                style={{ marginRight: "-0.2rem" }}
                                fontSize="large"
                            />
                        </IconButton>
                    </Stack>
                    <Divider sx={{ marginTop: "0.9rem" }} />
                </DialogTitle>
                <DialogContent>
                    <BaseAutoComplete
                        variant={"filled"}
                        PaperComponent={PaperComponentCustom}
                        options={users}
                        value={value}
                        onChange={(event: any, newValue: any) => {
                            setValue(newValue);
                        }}
                        multiple
                        sx={{
                            ".MuiFilledInput-root.MuiInputBase-sizeSmall": {
                                paddingBottom: "14px",
                            },
                        }}
                        placeholder={InviteEstimatorsText.ADD_USER}
                        freeSolo
                        // selectOnFocus
                        clearOnBlur
                        getOptionLabel={(option: { name: any }) => option.name}
                        isOptionEqualToValue={(option: { name: any }, value: { name: any }) =>
                            option.name === value.name
                        }
                        renderOption={(props: any, option: any) => (
                            <Stack
                                key={option.email}
                                direction="row"
                                spacing={2}
                                marginBottom="0.9rem"
                                component="li"
                                {...props}
                            >
                                <Avatar {...stringAvatar(option.name, "#410099")} />
                                <Stack>
                                    <Typography variant="text_14_semibold">
                                        {option.name}
                                    </Typography>
                                    <Typography variant="text_12_regular">
                                        {option.email}
                                    </Typography>
                                </Stack>
                            </Stack>
                        )}
                        renderTags={(tagValue: any, getTagProps: any) =>
                            tagValue.map((option: any, index: any) => (
                                // eslint-disable-next-line
                                <BaseChip
                                    avatar={
                                        <Avatar sx={{ backgroundColor: "#FFFFFF" }}>
                                            {option.name.split(" ")[0][0]}
                                        </Avatar>
                                    }
                                    bgcolor={"#004D71"}
                                    textColor={"#FFFFFF"}
                                    variant="filled"
                                    label={option.email}
                                    sx={{
                                        ".MuiChip-deleteIcon": {
                                            color: "#FFFFFF",
                                        },
                                    }}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                    />
                </DialogContent>
                <DialogActions sx={{ marginBottom: "1rem", marginRight: "1rem" }}>
                    <BaseButton
                        onClick={() => {
                            setOpen(false);
                        }}
                        label={InviteEstimatorsText.CANCEL}
                        classes="grey default spaced"
                        variant={"text_14_regular"}
                    />
                    <BaseButton
                        onClick={() => {
                            inviteCollaborators();
                            setOpen(false);
                        }}
                        disabled={value.length === 0}
                        label={InviteEstimatorsText.SEND}
                        classes="primary default spaced"
                        variant={"text_16_semibold"}
                    />
                </DialogActions>
            </Dialog>
        </>
    );
};

export default InviteEstimators;
