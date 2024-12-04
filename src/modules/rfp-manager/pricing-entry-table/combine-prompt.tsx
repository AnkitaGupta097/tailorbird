import {
    Dialog,
    DialogContent,
    Stack,
    Paper,
    Typography,
    DialogActions,
    Grid,
    RadioGroup,
    FormControlLabel,
    Divider,
} from "@mui/material";
import BaseButton from "components/button";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import HelpIcon from "@mui/icons-material/Help";
import BaseTextField from "components/text-field";
import {
    ChildItemList,
    CustomRadio,
    CustomTypography,
    RadioOptionRenderer,
    checkIfAllSameUOM,
    checkIfPercentageApplicable,
} from "./components/combine-prompt-helper";
import { IRfpResponseItems } from "stores/bidding-portal/bidding-portal-models";
import { useAppSelector } from "stores/hooks";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import { useParams } from "react-router-dom";
import { BIDDING_PORTAL } from "../common/constants";
import WarningIcon from "@mui/icons-material/Warning";
import AppTheme from "styles/theme";

interface ICombinePrompt {
    open: boolean;
    selectedComboId?: string;
    onClose: Function;
    onRename: Function;
    onCombine: Function;
    items: any[];
    fpName: string;
}

const CombinePrompt: FC<ICombinePrompt> = ({
    open,
    onClose,
    onRename,
    onCombine,
    selectedComboId,
    items,
    fpName,
}) => {
    let areAllSameUOM: boolean | undefined;
    let isPercentageApplicable: boolean | undefined;

    if (items) {
        areAllSameUOM = checkIfAllSameUOM(items);
        isPercentageApplicable = checkIfPercentageApplicable(items);
    }

    const dispatch = useDispatch();
    const { projectId } = useParams();

    const [comboName, setComboName] = useState("");
    const [qtyOption, setQtyOption] = useState<{ uom: string; value: number } | undefined>();
    const [percentageValue, setPercentageValue] = useState(0);
    const [fpArea, setFpArea] = useState(0);
    const [comboQtyWithSameUOM, setComboQtyWithSameUOM] = useState(0);
    const [checkedItems, setCheckedItems] = useState(
        (items as IRfpResponseItems[]).map(({ id }) => id),
    );

    const { floorplans } = useAppSelector((state) => ({
        floorplans: state?.projectFloorplans?.floorplans?.data,
    }));

    const resetStates = (): void => {
        setComboName("");
        setQtyOption(undefined);
        setPercentageValue(0);
        setCheckedItems([]);
        setComboQtyWithSameUOM(0);
    };

    useEffect(() => {
        return () => resetStates();
    }, []);

    useEffect(() => {
        if (isEmpty(floorplans)) {
            dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectId }));
        } else {
            if (fpName?.toLowerCase() === BIDDING_PORTAL.ALL_FLOOR_PLANS.toLowerCase()) {
                const totalArea = floorplans?.reduce(
                    (currentArea, { area, renoUnits }) => currentArea + area * renoUnits,
                    0,
                );
                setFpArea(totalArea);
            } else {
                const currentFpArea = floorplans?.find(
                    ({ name }) => fpName?.toLowerCase() === name?.toLowerCase(),
                );
                if (currentFpArea) setFpArea(currentFpArea?.area);
            }
        }
        // eslint-disable-next-line
    }, [floorplans]);

    const radioOptions = [
        {
            radioLabel: "Choose Scope Items",
            qtyValue: areAllSameUOM ? comboQtyWithSameUOM : 0,
            uom: areAllSameUOM ? items?.[0]?.specific_uom ?? items?.[0]?.uom : undefined,
            selectable: areAllSameUOM,
        },
        {
            radioLabel: "Use Apartment sqft",
            qtyValue: fpArea,
            uom: "apt-sqft",
            selectable: true,
        },
    ];

    if (isPercentageApplicable) {
        radioOptions.push({
            radioLabel: "Use Percentage",
            qtyValue: percentageValue,
            uom: "percentage",
            selectable: true,
        });
    }

    const handleToggle = (id: string): void => {
        const currentIndex = checkedItems.indexOf(id);
        const newChecked = [...checkedItems];

        if (currentIndex === -1) newChecked.push(id);
        else newChecked.splice(currentIndex, 1);

        setCheckedItems(newChecked);
        setComboQtyWithSameUOM(() =>
            newChecked.reduce((qty, id) => {
                const selectedItem = (items as IRfpResponseItems[]).find((item) => item?.id === id);
                return qty + (selectedItem?.specific_quantity ?? selectedItem?.quantity ?? 0);
            }, 0),
        );
    };

    const optionChangeHandler = (
        e: ChangeEvent<HTMLInputElement>,
        uom: string,
        qty: number,
    ): void => {
        if (e.target.checked) setQtyOption({ uom, value: qty });
    };

    return (
        <Dialog open={open} sx={{ padding: "1rem" }}>
            <DialogContent sx={{ marginTop: "1rem" }}>
                <Grid container direction="column" gap="1rem">
                    <Grid item>
                        <Stack direction="column" alignItems="center" gap={1}>
                            <Paper
                                sx={{
                                    boxShadow: `0px 0px 21px 0px rgba(0, 0, 0, 0.11)`,
                                    padding: "1rem",
                                }}
                            >
                                <HelpIcon htmlColor="#004D71" fontSize="large" />
                            </Paper>
                        </Stack>
                    </Grid>
                    <Grid item alignItems="center">
                        {selectedComboId ? (
                            <CustomTypography
                                variant="text_18_regular"
                                text="What would you like to rename the combined row as?"
                            />
                        ) : (
                            <Stack alignItems="center">
                                <CustomTypography
                                    variant="text_18_regular"
                                    text="Selected items will be combined on every floor plan."
                                />
                                <CustomTypography
                                    variant="text_18_regular"
                                    text="Pricing already entered will be removed."
                                />
                            </Stack>
                        )}
                    </Grid>
                    <Grid item>
                        <Stack direction="column" alignItems="center">
                            <Typography>Combination name</Typography>
                            <BaseTextField
                                value={comboName}
                                onChange={(event: any) => setComboName(event.target.value)}
                                sx={{ width: "80%" }}
                            />
                        </Stack>
                    </Grid>
                    <Grid item marginTop="1rem">
                        {!selectedComboId && (
                            <Grid container direction="row">
                                <RadioGroup value={qtyOption}>
                                    {radioOptions.map(
                                        ({ radioLabel, qtyValue, uom, selectable }, idx) => (
                                            <Grid
                                                item
                                                key={idx}
                                                sx={{
                                                    border: "1px solid #8C9196",
                                                    borderRadius: "0.3rem",
                                                    padding: "0.8rem 1rem",
                                                    marginBottom: "1rem",
                                                }}
                                            >
                                                <FormControlLabel
                                                    value={qtyValue}
                                                    checked={uom === qtyOption?.uom}
                                                    disabled={!selectable}
                                                    control={
                                                        <CustomRadio
                                                            onChange={(e) =>
                                                                optionChangeHandler(
                                                                    e,
                                                                    uom,
                                                                    qtyValue,
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={
                                                        <RadioOptionRenderer
                                                            label={radioLabel}
                                                            value={qtyValue}
                                                            isEditable={uom === "percentage"}
                                                            valueSetter={setPercentageValue}
                                                            uom={
                                                                uom === "apt-sqft"
                                                                    ? "Apt sqft"
                                                                    : uom ?? ""
                                                            }
                                                        />
                                                    }
                                                />
                                                {idx === 0 && (
                                                    <>
                                                        <Divider
                                                            sx={{
                                                                margin: "0.4rem auto",
                                                            }}
                                                        />
                                                        <ChildItemList
                                                            disabled={!selectable}
                                                            items={items}
                                                            checkedItems={checkedItems}
                                                            handleToggle={handleToggle}
                                                        />
                                                    </>
                                                )}
                                                {!selectable && (
                                                    <Stack
                                                        direction="row"
                                                        gap={3}
                                                        sx={{
                                                            height: "4rem",
                                                            borderRadius: "8px",
                                                            padding: "0px 16px",
                                                            margin: "auto",
                                                            backgroundColor:
                                                                AppTheme.background.error,
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <WarningIcon htmlColor="red" />
                                                        <Typography variant="text_16_regular">
                                                            Quantities with different units of
                                                            measurement cannot be summed for a
                                                            combination.
                                                        </Typography>
                                                    </Stack>
                                                )}
                                            </Grid>
                                        ),
                                    )}
                                </RadioGroup>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", marginBottom: "1rem" }}>
                <BaseButton
                    onClick={(): void => {
                        onClose?.();
                        resetStates();
                    }}
                    label="Cancel"
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="grey default"
                    variant="text_16_semibold"
                />
                <BaseButton
                    onClick={(): void => {
                        if (comboName?.length > 0) {
                            selectedComboId
                                ? onRename(comboName)
                                : onCombine(
                                      comboName,
                                      checkedItems,
                                      qtyOption?.uom,
                                      percentageValue,
                                  );
                            resetStates();
                        }
                    }}
                    labelStyles={{ paddingY: ".4rem" }}
                    classes={`primary ${comboName?.length === 0 ? "disabled" : "default"}`}
                    variant="text_16_semibold"
                    label={selectedComboId ? "Rename" : "Combine"}
                    disabled={comboName.length === 0}
                />
            </DialogActions>
        </Dialog>
    );
};
export default CombinePrompt;
