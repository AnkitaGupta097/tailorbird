import React, { useEffect, useMemo, useState } from "react";
import { map } from "lodash";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Avatar,
    Tooltip,
    Grid,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import BaseAutoComplete from "components/auto-complete";
import AppTheme from "styles/theme";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { GET_SIBLING_RENO_UNITS } from "../constants";
import { useParams } from "react-router-dom";
import BaseCheckbox from "components/checkbox";
import BaseChip from "components/chip";
import AvatarGroup from "components/avatar-group";
import { Controller, useForm } from "react-hook-form";
import TrackerUtil from "utils/tracker";
import { shallowEqual } from "react-redux";

const ScopeActivateDialog = (props: any) => {
    const dispatch = useAppDispatch();
    const { projectName } = useAppSelector((state) => {
        return {
            projectName: state.singleProject.projectDetails?.name,
        };
    }, shallowEqual);

    const { currentUnit, scopeItemId, scopeItem, isScopeItemActive, scopeId } = props;
    const isItemPricingGroup = scopeItem.groups?.length > 0;

    const scopeItemName = isItemPricingGroup
        ? map(scopeItem.groups, "item").join(", ")
        : `${scopeItem.item}${scopeItem.scope ? ` - ${scopeItem.scope}` : ""}`;

    const [isOpenConfirmation, setIsOpenConfirmation] = useState<boolean>(false);
    const { unitId: renoUnitId } = useParams();
    const formDefaultValues = {
        renoUnitIds: [
            {
                label: `${currentUnit.unit_name} (Current Unit)`,
                value: currentUnit.id,
                contractors: currentUnit.subs?.map((sub: any) => sub?.name),
            },
        ],
    };

    const siblingRenoUnitsPayload = isItemPricingGroup
        ? {
              pricingGroupId: scopeItem.pricing_group_id,
              unitScopeItemId: null,
          }
        : {
              pricingGroupId: null,
              unitScopeItemId: scopeItemId,
          };

    const {
        data: applicableUnitsData,
        loading,
        refetch,
    } = useQuery(GET_SIBLING_RENO_UNITS, {
        variables: siblingRenoUnitsPayload,
    });

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getApplicableUnits = () => {
        const applicableRenoUnits = applicableUnitsData?.siblingRenoUnits || [];
        return (
            applicableRenoUnits?.map((unit: any) => ({
                label: unit.id === renoUnitId ? `${unit.unitName} (Current Unit)` : unit.unitName,
                value: unit.id,
                contractors: unit.subs?.map((sub: any) => sub?.name),
            })) || []
        );
    };

    const getOptions = () => {
        return applicableUnitsData
            ? getApplicableUnits()
            : [
                  {
                      label: `${currentUnit.unit_name} (Current Unit)`,
                      value: currentUnit.id,
                      contractors: currentUnit.subs?.map((sub: any) => sub?.name),
                  },
              ] ?? [];
    };

    const selectAllOption = useMemo(() => ({ label: "Select All", value: "selectAll" }), []);

    const handleOnChangeOption = (newValues: any[] = [], field: any, options: any[]) => {
        const selectedValues = field.value;
        const allOptions = options;
        const currSelectedValue = newValues[newValues.length - 1]?.value;

        //last selected is select all check box
        if (currSelectedValue === "selectAll") {
            if (selectedValues?.length) {
                field.onChange([]);
            } else {
                field.onChange([...allOptions]);
            }
        } else {
            if (selectedValues?.find((sv: any) => sv.value === currSelectedValue)) {
                field.onChange(selectedValues.filter((sv: any) => sv.value != currSelectedValue));
            } else {
                field.onChange(newValues);
            }
        }
    };

    const {
        handleSubmit,
        control,
        // setValue,
        formState: {
            isValid,
            //  isDirty
        },
    } = useForm({
        defaultValues: formDefaultValues,
        mode: "onChange",
    });

    const onSubmit = (data: any) => {
        const pricingGroupKey = isScopeItemActive
            ? "deActivatePricingGroupsId"
            : "activatePricingGroupsId";
        const itemKey = isScopeItemActive
            ? "deActivateUnitScopeItemsId"
            : "activateUnitScopeItemsId";

        const entityKey = isItemPricingGroup ? pricingGroupKey : itemKey;
        const entityValue = isItemPricingGroup ? scopeItem.pricing_group_id : scopeItemId;

        const payload = {
            renoUnitIds: map(data?.renoUnitIds, "value"),
            [`${entityKey}`]: entityValue,
            scopeId,
            projectName,
        };

        const trackerEventKey = `${isScopeItemActive ? "DEACTIVATE_" : "ACTIVATE_"}${
            isItemPricingGroup ? "PRICING_GROUP" : "LINE_ITEM"
        }`;
        TrackerUtil.event(trackerEventKey, payload);

        const itemAction = isScopeItemActive
            ? actions.production.unitScopes.deActivateScopeItemStart
            : actions.production.unitScopes.activateScopeItemStart;

        const pricingGroupAction = isScopeItemActive
            ? actions.production.unitScopes.deActivatePricingGroupStart
            : actions.production.unitScopes.activatePricingGroupStart;

        const action = isItemPricingGroup ? pricingGroupAction : itemAction;

        dispatch(action(payload));
        props.onClose && props.onClose();
    };

    return (
        <Dialog open={true} onClose={props.onClose} fullWidth>
            <DialogTitle>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ borderBottom: `1px solid ${AppTheme.border.inner}` }}
                >
                    <Grid item xs={11} sx={{ overflow: "hidden" }}>
                        <Grid container columnGap={1}>
                            <Grid item>
                                <Typography variant="text_18_bold">
                                    {scopeItem.status === "not_applicable"
                                        ? "Activate"
                                        : "Deactivate"}
                                </Typography>
                            </Grid>
                            <Grid item xs={9} sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                <Tooltip title={scopeItemName} arrow>
                                    <Typography
                                        variant="text_18_bold"
                                        sx={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {scopeItemName}
                                    </Typography>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <CloseOutlinedIcon
                            sx={{
                                "&:hover": {
                                    cursor: "pointer",
                                },
                            }}
                            onClick={props.onClose}
                        />
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent sx={{ height: "300px" }}>
                {isOpenConfirmation ? (
                    <Typography variant="text_16_regular">
                        {scopeItem.status === "not_applicable"
                            ? `Are you sure you want to activate ${scopeItemName}? The cost for this will now be considered in the total.`
                            : `Are you sure you want to deactivate ${scopeItemName}? The cost for this will not be considered in the total.`}
                    </Typography>
                ) : (
                    <Controller
                        name={"renoUnitIds"}
                        control={control}
                        rules={{
                            required: "required",
                        }}
                        render={({ field, fieldState }) => {
                            return (
                                <BaseAutoComplete
                                    {...field}
                                    multiple
                                    loading={loading}
                                    disableCloseOnSelect
                                    placeholder={field.value?.length ? "" : "Please Choose One"}
                                    variant={"outlined"}
                                    labelComponent={
                                        <div style={{ marginBottom: "8px" }}>
                                            <Typography
                                                variant="text_14_medium"
                                                color={AppTheme.background.black}
                                            >
                                                Select Applicable Unit
                                            </Typography>
                                        </div>
                                    }
                                    ListboxProps={{
                                        style: {
                                            padding: "10px",
                                        },
                                    }}
                                    filterOptions={(options: any[], { inputValue }: any) => {
                                        if (inputValue.trim() === "") {
                                            return options;
                                        }

                                        const normalizedInput = inputValue.toLowerCase();
                                        const filtered = options
                                            .slice(1)
                                            .filter((option) =>
                                                option.label.includes(normalizedInput),
                                            );
                                        return filtered;
                                    }}
                                    options={[selectAllOption].concat(getOptions()) ?? []}
                                    renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                                {...props}
                                                key={option.value}
                                                style={{
                                                    borderBottom: "1px solid #C9CCCF",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <div>
                                                        <BaseCheckbox
                                                            size="small"
                                                            checked={
                                                                option.value === "selectAll"
                                                                    ? field.value.length ===
                                                                      getOptions().length
                                                                    : !!field.value?.find(
                                                                          (selectedVal: any) =>
                                                                              selectedVal.value ===
                                                                              option.value,
                                                                      )
                                                            }
                                                            indeterminate={
                                                                option.value === "selectAll" &&
                                                                field.value.length &&
                                                                field.value.length !==
                                                                    getOptions().length
                                                            }
                                                            style={{ marginRight: 8 }}
                                                        />
                                                        <Typography variant="text_14_regular">
                                                            {option.label}
                                                        </Typography>
                                                    </div>
                                                    {option.value !== "selectAll" && (
                                                        <div style={{ marginLeft: "auto" }}>
                                                            {option?.contractors?.length > 0 ? (
                                                                <AvatarGroup
                                                                    names={option.contractors}
                                                                    size={32}
                                                                />
                                                            ) : (
                                                                <Avatar />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    }}
                                    renderTags={(tagValue: any, getTagProps: any) =>
                                        tagValue.map((option: any, index: any) => (
                                            <BaseChip
                                                key={option.value}
                                                bgcolor={"#004D71"}
                                                textColor={"#FFFFFF"}
                                                variant="filled"
                                                label={option.label}
                                                sx={{
                                                    ".MuiChip-deleteIcon": {
                                                        color: "#FFFFFF",
                                                    },
                                                }}
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    getOptionLabel={(option: any) => option?.label}
                                    error={fieldState.error}
                                    errorText={fieldState.error?.message}
                                    onChange={(event: React.SyntheticEvent, selected: any[]) =>
                                        handleOnChangeOption(selected, field, getOptions())
                                    }
                                    helperText={
                                        "Single-unit OR Multi-unit? (let choose all units or some)"
                                    }
                                    helperTextColor={"#6D7175"}
                                />
                            );
                        }}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={props.onClose}>
                    <Typography variant="text_16_medium"> Cancel</Typography>
                </Button>
                {isOpenConfirmation ? (
                    <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                        <Typography variant="text_16_medium">
                            Confirm and Notify Contractors
                        </Typography>
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={() => setIsOpenConfirmation(true)}
                        disabled={!isValid}
                    >
                        <Typography variant="text_16_medium"> Confirm</Typography>
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ScopeActivateDialog;
