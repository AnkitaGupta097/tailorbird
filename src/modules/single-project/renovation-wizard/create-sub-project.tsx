/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Box, Typography, InputLabel, InputBase, styled } from "@mui/material";
import RenoHeader from "../common/reno-header";
import appTheme from "styles/theme";
import BaseTextField from "components/text-field";
import actions from "stores/actions";
import { useAppSelector, useAppDispatch } from "stores/hooks";

const SInput = styled(InputBase)(({ theme }) => ({
    "& .MuiInputBase-input": {
        borderRadius: 4,
        border: "1px solid",
        borderColor: appTheme.border.medium,
        fontSize: 16,
        width: "300px",
        padding: "10px 12px",
        "&:focus": {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const CreateSubProject = () => {
    const dispatch = useAppDispatch();
    const { inventoryDetails } = useAppSelector((state) => ({
        inventoryDetails: state.singleProject.renovationWizard.currentInventory,
    }));
    return (
        <Box>
            <RenoHeader
                title="Give us more information about the renovation"
                subTitle="This title and description will be used to reference your Tier in the future"
            />
            <Box mt={10} display="flex" justifyContent="center">
                <Box>
                    <BaseTextField
                        value={inventoryDetails?.name}
                        sx={{ width: "324px" }}
                        placeholder="Enter Title"
                        label="Tier Title (e.g. standard/default)"
                        onChange={(e: any) =>
                            dispatch(
                                actions.singleProject.updateCurrentInventory({
                                    name: e.target.value,
                                }),
                            )
                        }
                    />

                    <InputLabel
                        sx={{
                            color: appTheme?.palette?.text?.primary,
                            marginBottom: "5px",
                            marginTop: "15px",
                        }}
                    >
                        <Typography variant="text_14_medium">Tier Description</Typography>
                    </InputLabel>
                    <SInput
                        value={inventoryDetails?.description}
                        multiline
                        rows={4}
                        placeholder="Enter Description"
                        onChange={(e: any) =>
                            dispatch(
                                actions.singleProject.updateCurrentInventory({
                                    description: e.target.value,
                                }),
                            )
                        }
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default CreateSubProject;
