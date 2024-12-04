/* eslint-disable no-unused-vars */
import { Box, Button, Divider, Grid, SelectChangeEvent, Typography } from "@mui/material";
import BaseDialog from "components/base-dialog";
import React, { useCallback } from "react";
import ConfigSavedSuccessfully from "../acknowledgement-cards/config-saved-successfully";
import SavingConfig from "../acknowledgement-cards/saving-config";
import BaseSelect from "components/select";
import {
    IExhAConfig,
    ISelectedTradeOptionsMap,
    MATERIAL_SUPPLY_OPTIONS,
    ORDERS_OF_EXH_A_OPTIONS,
    VERSION_OPTIONS,
} from "../types";
import CloseIcon from "../../../../../assets/icons/cross-icon.svg";
import WrappedCheckBoxList from "components/wrapped-checkbox-list";
import BaseRadio from "components/base-radio";
import { isEqual } from "lodash";

interface ConfigPopupProps {
    isSavingExhAConfig: boolean;
    exhAConfigSaved: boolean;
    onChangeVersion: (e: SelectChangeEvent<unknown>) => void;
    toggleSettingsModal: () => void;
    configData: IExhAConfig | null;
    setConfigData: React.Dispatch<React.SetStateAction<IExhAConfig | null>>;
    onChangeMaterialSupply: (e: SelectChangeEvent<unknown>) => void;
    setSelectedTradeOptionsId: React.Dispatch<React.SetStateAction<ISelectedTradeOptionsMap>>;
    selectedTradeOptionsId: ISelectedTradeOptionsMap;
    updateExhAConfig: () => Promise<void>;
    isSettingsModalOpen: boolean;
}
export default function ConfigPopup({
    isSavingExhAConfig,
    exhAConfigSaved,
    onChangeVersion,
    toggleSettingsModal,
    configData,
    setConfigData,
    onChangeMaterialSupply,
    setSelectedTradeOptionsId,
    selectedTradeOptionsId,
    updateExhAConfig,
    isSettingsModalOpen,
}: ConfigPopupProps) {
    const onChangeSelectedTradeOptions = useCallback(
        (tradeId: string, selectedOptions: string[]): void => {
            const prospectSelectedOptions = {
                ...selectedTradeOptionsId,
                [tradeId]: selectedOptions,
            };
            if (!isEqual(selectedTradeOptionsId, prospectSelectedOptions)) {
                setSelectedTradeOptionsId((prev) => ({
                    ...prev,
                    [tradeId]: selectedOptions,
                }));
            }
        },
        [selectedTradeOptionsId, setSelectedTradeOptionsId],
    );
    const convertToReadable = (inputString: string): string => {
        const words: string[] = inputString.split("_");
        const capitalizedWords: string[] = words.map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1),
        );
        const readableString: string = capitalizedWords.join(" ");
        return readableString;
    };

    return (
        <BaseDialog
            button={<Button variant="outlined">Settings</Button>}
            content={
                isSavingExhAConfig ? (
                    <Box>{exhAConfigSaved ? <ConfigSavedSuccessfully /> : <SavingConfig />}</Box>
                ) : (
                    <Box sx={{ display: "flex" }} flexDirection={"column"} width={"50rem"} p={1.25}>
                        <Box
                            sx={{ display: "flex" }}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Typography variant="text_16_medium">
                                Exhibit A configuration
                            </Typography>
                            <Button onClick={toggleSettingsModal} sx={{ marginLeft: "auto" }}>
                                <img height={20} width={20} src={CloseIcon} alt="Close button" />
                            </Button>
                        </Box>
                        <Divider
                            flexItem
                            sx={{
                                width: "100%",
                                border: "1px solid #DEDEDE",
                                marginTop: ".5rem",
                            }}
                        />
                        <Box
                            my={"1rem"}
                            gap={"1.5rem"}
                            sx={{ display: "flex" }}
                            alignItems={"center"}
                        >
                            <BaseSelect
                                headerLabel="Version"
                                options={VERSION_OPTIONS}
                                placeholder="Select Version"
                                headerLabelTypographyProps={{
                                    fontSize: "0.875rem",
                                }}
                                selectProps={{
                                    fullWidth: true,
                                    onChange: onChangeVersion,
                                    size: "small",
                                    variant: "outlined",
                                    value: configData?.long_description_included
                                        ? VERSION_OPTIONS[0].value
                                        : configData?.short_description_included
                                        ? VERSION_OPTIONS[1].value
                                        : undefined,
                                }}
                            />
                            <BaseSelect
                                headerLabel="Material Supply"
                                headerLabelTypographyProps={{
                                    fontSize: "0.875rem",
                                }}
                                options={MATERIAL_SUPPLY_OPTIONS}
                                placeholder="Select Material"
                                selectProps={{
                                    fullWidth: true,
                                    onChange: onChangeMaterialSupply,
                                    size: "small",
                                    variant: "outlined",
                                    value: configData?.material_supply,
                                }}
                            />
                        </Box>
                        <Box
                            my={"1rem"}
                            gap={"1.5rem"}
                            sx={{ display: "flex" }}
                            alignItems={"center"}
                        >
                            <BaseRadio
                                options={ORDERS_OF_EXH_A_OPTIONS}
                                alignment="row"
                                labelStyle={{
                                    fontSize: "0.875rem",
                                }}
                                onValChange={(value) => {
                                    setConfigData((prev: IExhAConfig | null) => {
                                        if (!prev) {
                                            return prev;
                                        }

                                        return {
                                            ...prev,
                                            gc_to_subs: value === "gc_to_subs" ? true : false,
                                            owner_to_gc: value === "owner_to_gc" ? true : false,
                                        };
                                    });
                                }}
                                value={
                                    configData?.gc_to_subs
                                        ? "gc_to_subs"
                                        : configData?.owner_to_gc
                                        ? "owner_to_gc"
                                        : null
                                }
                            />
                        </Box>
                        <Box pr={20}>
                            {configData?.trades &&
                                configData.trades.map((trade) => {
                                    return (
                                        <WrappedCheckBoxList
                                            key={trade.trade_id}
                                            titleText={trade.trade_name}
                                            titleTextTypographyProps={{
                                                color: "#000",
                                                fontWeight: "500",
                                                fontSize: "0.875rem",
                                            }}
                                            options={
                                                trade?.trade_options.map((o) => ({
                                                    label: convertToReadable(o.name),
                                                    value: o.id,
                                                })) ?? []
                                            }
                                            onSelectHandler={(selected) => {
                                                onChangeSelectedTradeOptions(
                                                    trade.trade_id,
                                                    selected,
                                                );
                                            }}
                                            selected={
                                                configData?.trades
                                                    ?.find((t) => t.trade_id === trade.trade_id)
                                                    ?.trade_options.filter(
                                                        (option) => option.is_selected,
                                                    )
                                                    .map((option) => option.id) || []
                                            }
                                        />
                                    );
                                })}
                        </Box>
                        <Grid container justifyContent="flex-end" gap="1rem" py="1rem">
                            <Button onClick={toggleSettingsModal} variant="outlined">
                                Cancel
                            </Button>
                            <Button onClick={updateExhAConfig} variant="contained">
                                Save
                            </Button>
                        </Grid>
                    </Box>
                )
            }
            open={isSettingsModalOpen}
            setOpen={toggleSettingsModal}
        />
    );
}
