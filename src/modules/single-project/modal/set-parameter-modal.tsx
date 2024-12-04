import React, { useState } from "react";
import { Box, Dialog, Typography, Button, TextField, Autocomplete, Divider } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
import BaseTextField from "components/text-field";
import { IParameterDetails } from "../interface";
import { PARAMETER_DETAILS } from "../contants";
import { useAppSelector } from "stores/hooks";
import { isEmpty, map } from "lodash";

interface ISetParameterModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    setParameterData: any;
}

const SetParameterModal = ({ modalHandler, openModal, setParameterData }: ISetParameterModal) => {
    const userId = localStorage.getItem("user_id") || "";
    const { packageCreateSearch } = useAppSelector((state) => {
        return {
            packageCreateSearch: state.scraperService.scraper.categories,
        };
    });
    const { manufacturers } = packageCreateSearch;
    const [parameterDetails, setParameterDetails] = useState<IParameterDetails>(PARAMETER_DETAILS);

    const updateParameterDetail = (key: string, value: any) => {
        setParameterDetails({ ...parameterDetails, [key]: value });
    };

    const applyParameters = () => {
        setParameterData({ ...parameterDetails, user_id: userId });
        modalHandler(false);
    };
    if (isEmpty(manufacturers)) {
        return null;
    }
    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth="md"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Box
                p={6}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid` }}
            >
                <Typography variant="text_18_bold">Set Parameters</Typography>
                <CloseOutlinedIcon
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        modalHandler(false);
                    }}
                />
            </Box>
            <Box p={6}>
                <Typography variant="text_16_regular" color={appTheme.text.medium}>
                    Want to see only specific options? Set your parameters below.
                </Typography>
                <br />
                <Button
                    variant="text"
                    component="label"
                    onClick={() => setParameterDetails(PARAMETER_DETAILS)}
                    style={{ paddingLeft: "0px", marginTop: "5px", marginBottom: "20px" }}
                >
                    <Typography variant="text_18_medium" color={appTheme.scopeHeader.label}>
                        Reset all parameters
                    </Typography>
                </Button>
                <br />
                <Typography variant="text_16_medium">Set Preferred Manufacturer</Typography>
                <Box mt={2} mb={6}>
                    <Typography variant="text_16_regular" color={appTheme.text.medium}>
                        Select all that apply
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={8}>
                    <Box width={"70%"}>
                        <Typography variant="text_14_medium">Manufacturers</Typography>
                        <Autocomplete
                            multiple
                            value={parameterDetails.manufacturers}
                            options={manufacturers}
                            sx={{ marginTop: "5px", width: "100%", height: "56" }}
                            getOptionLabel={(option: string) => option}
                            onChange={(event, newValue: any) => {
                                updateParameterDetail("manufacturers", newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Please Select"
                                />
                            )}
                        />
                    </Box>
                    <Box>
                        <Typography variant="text_14_medium">current selections:</Typography>
                        {map(parameterDetails.manufacturers, (item) => (
                            <Box mt={1}>
                                <Typography variant="text_14_regular" color={appTheme.text.medium}>
                                    {item}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Divider />
                <Box my={8}>
                    <Typography variant="text_16_medium">Set Price Point</Typography>
                    <Box mt={4} display="flex" justifyContent="space-between" mb={8}>
                        <Box>
                            <BaseTextField
                                type="number"
                                placeholder="$1,000"
                                label="Low End Price Point"
                                value={parameterDetails.low_price}
                                onChange={(e: any) =>
                                    updateParameterDetail("low_price", parseInt(e.target.value, 10))
                                }
                            />
                        </Box>
                        <Box>
                            <BaseTextField
                                type="number"
                                placeholder="$1,000"
                                label="High End Price Point"
                                value={parameterDetails.high_price}
                                onChange={(e: any) =>
                                    updateParameterDetail(
                                        "high_price",
                                        parseInt(e.target.value, 10),
                                    )
                                }
                            />
                        </Box>
                    </Box>
                    <Divider />
                </Box>
                <Typography variant="text_16_medium">Set Preferred Finish</Typography>
                <Box mt={4} mb={8}>
                    <BaseTextField
                        placeholder="Enter finish here"
                        label="Finish"
                        value={parameterDetails.finish}
                        onChange={(e: any) => updateParameterDetail("finish", e.target.value)}
                    />
                </Box>
                <Divider />
                <Box mt={8} display="flex" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        component="label"
                        style={{ height: "40px", marginRight: "15px" }}
                        onClick={() => modalHandler(false)}
                    >
                        <Typography variant="text_16_medium">Cancel</Typography>
                    </Button>
                    <Button
                        variant="contained"
                        component="label"
                        style={{ height: "40px" }}
                        onClick={applyParameters}
                    >
                        <Typography variant="text_16_medium">Apply Parameters</Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default SetParameterModal;
