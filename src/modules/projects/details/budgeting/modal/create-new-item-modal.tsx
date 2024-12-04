import React, { useEffect } from "react";
import { Box, Dialog, Typography } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CreateItem from "../scopes/scope-table/create-item";
import appTheme from "styles/theme";
import actions from "stores/actions";
import { useAppDispatch } from "stores/hooks";

interface ICreateNewItemModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
}

const CreateNewItemModal = ({ modalHandler, openModal }: ICreateNewItemModal) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(actions.budgeting.createNewItem({}));
        };
        // eslint-disable-next-line
    }, []);

    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth="md"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
        >
            <Box
                p={5}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
            >
                <Typography variant="text_16_medium">Add Item </Typography>
                <CloseOutlinedIcon
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        modalHandler(false);
                        dispatch(actions.budgeting.createNewItem({}));
                    }}
                />
            </Box>
            <Box p={5} minHeight="300px">
                <CreateItem isModal modalHandler={modalHandler} />
            </Box>
        </Dialog>
    );
};

export default CreateNewItemModal;
