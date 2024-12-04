import React, { ReactNode, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "styles/theme";
import BaseAutoComplete from "components/auto-complete";
import AvatarGroup from "components/avatar-group";
import BaseTextField from "components/text-field";
import BaseCheckbox from "components/checkbox";
import BaseChip from "components/chip";
import { isValidNumber } from "../helper";
import { useAppSelector } from "stores/hooks";
import { shallowEqual } from "react-redux";
import BaseToggle from "components/toggle";
import Select from "components/select";
import { GET_FILTERED_RENO_UNITS } from "../constants";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import TrackerUtil from "utils/tracker";

type AddNewScopeItemModalProps = {
    open: boolean;
    onClose: any;
    onSubmitNewItem: any;
    category: any;
    currentUnit: any;
};

const AddNewScopeItemModal = ({
    open,
    currentUnit,
    onClose,
    onSubmitNewItem,
    category,
}: AddNewScopeItemModalProps) => {
    const { allConstants, projectName } = useAppSelector((state) => {
        return {
            allConstants: state.productionProject.constants,
            projectName: state.singleProject.projectDetails?.name,
        };
    }, shallowEqual);

    const { unitId: renoUnitId, projectId } = useParams();

    const { data: applicableUnitsData, loading } = useQuery(GET_FILTERED_RENO_UNITS, {
        variables: {
            projectId,
            renoUnitFilters: [
                {
                    name: "unit_scope_ids",
                    values: [category.id.toString()],
                },
                {
                    name: "scopes_under_completion",
                    values: ["false"],
                },
                {
                    name: "reno_unit_status",
                    values: ["unscheduled", "scheduled", "not_started", "in_progress"],
                },
            ],
        },
    });

    const onSave = (data: any) => {
        TrackerUtil.event("SUBMIT_NEW_LINE_ITEM", {
            renoUnitId,
            scopeId: category.id,
            projectName,
            newItemName: data.name,
        });
        const newItemData = {
            ...data,
            takeOffValue: parseFloat(data.takeOffValue),
            price: parseFloat(data.price),
            unitScopeId: category.id,
            renoUnitIds: data.renoUnitIds?.map((unit: any) => unit.value),
        };
        onSubmitNewItem(newItemData);
    };

    const getDefaultValues = () => ({
        renoUnitIds: [
            {
                label: `${currentUnit.name} (Current Unit)`,
                value: currentUnit.id,
                contractors: currentUnit.subs,
            },
        ],
        name: "",
        workType: "",
        spec: "",
        takeOffValue: "",
        uom: "",
        priceType: "",
        price: "",
    });

    const {
        handleSubmit,
        control,
        setValue,
        formState: { isValid, isDirty },
    } = useForm({
        defaultValues: {
            ...getDefaultValues(),
        },
        mode: "onChange",
    });

    const {
        control: control2,
        watch,
        reset,
    } = useForm({
        defaultValues: {
            copyExisting: false,
            existingLineItem: "",
        },
    });

    const isCopyExisting = watch("copyExisting");
    const currExistingLineItem = watch("existingLineItem");

    const existingItemsOptions =
        category.items
            ?.filter((item: any) => !item.groups)
            ?.map((item: any) => ({ label: item.item, value: item.id })) || [];

    useEffect(() => {
        if (!isCopyExisting) {
            reset({ existingLineItem: "" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCopyExisting]);

    useEffect(() => {
        if (currExistingLineItem) {
            const itemObj = category.items?.find((item: any) => item.id === currExistingLineItem);
            setValue("name", itemObj.item);
            setValue("workType", itemObj.work_type);
            setValue("spec", itemObj.description);
            setValue("takeOffValue", itemObj.takeoff_value);
            setValue("price", itemObj.price);
            setValue("priceType", "unit_price");
            setValue("uom", itemObj.uom?.toLowerCase());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currExistingLineItem]);

    const getCategoryHeader = () => (
        <div
            style={{
                borderBottom: "solid 1px rgba(0, 0, 0, 0.12)",
                paddingBottom: "20px",
            }}
        >
            <Typography variant="text_16_medium" color={theme.text.medium}>
                {category?.scope}
            </Typography>
        </div>
    );

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

    const getApplicableUnits = () => {
        const applicableRenoUnits = applicableUnitsData?.getFilteredRenovationUnits || [];
        return (
            applicableRenoUnits?.map((unit: any) => ({
                label: unit.id === renoUnitId ? `${unit.unit_name} (Current Unit)` : unit.unit_name,
                value: unit.id,
                contractors: unit.subs?.map((sub: any) => sub?.name),
            })) || []
        );
    };

    const getEditableField = (fieldDetail: any): ReactNode => {
        switch (fieldDetail?.type) {
            case "multi-select":
                return (
                    <Controller
                        name={fieldDetail?.key}
                        control={control}
                        rules={
                            fieldDetail?.required
                                ? {
                                      required: "required",
                                  }
                                : {}
                        }
                        render={({ field, fieldState }) => {
                            return (
                                <BaseAutoComplete
                                    {...field}
                                    multiple
                                    loading={fieldDetail.loading}
                                    disableCloseOnSelect
                                    placeholder={field.value?.length ? "" : "Please Choose One"}
                                    variant={"outlined"}
                                    labelComponent={
                                        <div style={{ marginBottom: "8px" }}>
                                            <Typography
                                                variant="text_14_medium"
                                                color={theme.background.black}
                                            >
                                                {fieldDetail?.label}
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
                                    options={[selectAllOption].concat(fieldDetail?.options) ?? []}
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
                                                                      fieldDetail.options.length
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
                                                                    fieldDetail.options.length
                                                            }
                                                            style={{ marginRight: 8 }}
                                                        />
                                                        <Typography variant="text_14_regular">
                                                            {option.label}
                                                        </Typography>
                                                    </div>
                                                    {option.value !== "selectAll" && (
                                                        <div style={{ marginLeft: "auto" }}>
                                                            {option.contractors?.length > 0 ? (
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
                                        handleOnChangeOption(selected, field, fieldDetail?.options)
                                    }
                                    helperText={
                                        "Single-unit OR Multi-unit? (let choose all units or some)"
                                    }
                                    helperTextColor={"#6D7175"}
                                />
                            );
                        }}
                    />
                );
            case "select":
                return (
                    <Controller
                        name={fieldDetail?.key}
                        control={fieldDetail.formControl || control}
                        rules={
                            fieldDetail?.required
                                ? {
                                      required: "required",
                                  }
                                : {}
                        }
                        render={({ field, fieldState }) => (
                            <Select
                                headerLabel={fieldDetail.label}
                                headerLabelTypographyProps={{
                                    variant: "text_14_medium",
                                    color: "#202223",
                                }}
                                selectProps={{
                                    variant: "outlined",
                                    fullWidth: true,
                                    onChange: field.onChange,
                                    size: "small",
                                    value: field.value,
                                }}
                                error={!!fieldState?.error}
                                helperText={fieldState.error?.message}
                                options={fieldDetail?.options}
                                placeholder={fieldDetail.placeholder || "Please Choose One"}
                            />
                        )}
                    />
                );
            case "text":
            case "number":
                return (
                    <Controller
                        name={fieldDetail?.key}
                        control={control}
                        rules={
                            fieldDetail?.required
                                ? {
                                      required: "required",
                                      validate: (value) =>
                                          fieldDetail.type === "number"
                                              ? isValidNumber(value) ||
                                                `Invalid ${fieldDetail.label}`
                                              : true,
                                  }
                                : {}
                        }
                        render={({ field, fieldState }) => (
                            <BaseTextField
                                {...field}
                                key={fieldDetail?.key}
                                label={
                                    <Typography variant="text_14_medium">
                                        {fieldDetail.label}
                                    </Typography>
                                }
                                fullWidth
                                multiline={fieldDetail?.isMultiline}
                                rows={fieldDetail?.rows}
                                placeholder={fieldDetail?.isMultiline ? "Text field" : ""}
                                error={!!fieldState?.error}
                                helper={fieldState.error?.message}
                            />
                        )}
                    />
                );
            case "toggle":
                return (
                    <Controller
                        name={fieldDetail?.key}
                        control={fieldDetail.formControl || control}
                        rules={
                            fieldDetail?.required
                                ? {
                                      required: "required",
                                  }
                                : {}
                        }
                        render={({ field }) => (
                            <BaseToggle
                                {...field}
                                checked={field.value}
                                value={fieldDetail.label}
                            />
                        )}
                    />
                );
            default:
                return <></>;
        }
    };

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            onClose={onClose}
            PaperProps={{
                sx: {
                    minHeight: 500,
                },
            }}
        >
            <DialogTitle
                sx={{
                    borderBottom: "solid 1px #C9CCCF",
                    padding: "16px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="text_16_semibold">Add New Scope Item</Typography>
                <CloseIcon onClick={onClose} sx={{ cursor: "pointer" }} />
            </DialogTitle>
            <DialogContent
                sx={{ borderBottom: "solid 1px #C9CCCF", padding: "16px 24px !important" }}
            >
                <Grid container flexDirection="column" gap={5}>
                    <Grid item>{getCategoryHeader()}</Grid>
                    <Grid item>
                        {getEditableField({
                            key: "renoUnitIds",
                            type: "multi-select",
                            label: "Select Applicable Unit",
                            required: true,
                            options: applicableUnitsData
                                ? getApplicableUnits()
                                : [
                                      {
                                          label: `${currentUnit.name} (Current Unit)`,
                                          value: currentUnit.id,
                                          contractors: currentUnit.subs,
                                      },
                                  ],
                            loading,
                        })}
                    </Grid>
                    <Grid item>
                        {getEditableField({
                            key: "copyExisting",
                            type: "toggle",
                            label: "Copy data from another item",
                            required: false,
                            formControl: control2,
                        })}
                    </Grid>
                    {isCopyExisting && (
                        <Grid item>
                            {getEditableField({
                                key: "existingLineItem",
                                type: "select",
                                label: "",
                                placeholder: "Select an item to copy data",
                                required: false,
                                formControl: control2,
                                options: existingItemsOptions,
                            })}
                        </Grid>
                    )}
                    <Grid item>
                        {getEditableField({
                            key: "name",
                            type: "text",
                            label: "Scope Item Name",
                            required: true,
                        })}
                    </Grid>
                    <Grid item>
                        {getEditableField({
                            key: "workType",
                            type: "select",
                            label: "Work Type",
                            required: true,
                            options: [
                                { label: "Material", value: "material" },
                                { label: "Labor", value: "labor" },
                                { label: "Other", value: "other" },
                            ],
                        })}
                    </Grid>
                    <Grid item>
                        {getEditableField({
                            key: "spec",
                            type: "text",
                            isMultiline: true,
                            rows: 2,
                            label: "Spec",
                            required: false,
                        })}
                    </Grid>
                    <Grid item>
                        {getEditableField({
                            key: "takeOffValue",
                            type: "number",
                            label: "Quantity",
                            required: true,
                        })}
                    </Grid>
                    <Grid item>
                        {getEditableField({
                            key: "uom",
                            type: "select",
                            label: "UoM",
                            options: allConstants?.UnitOfMeasurements?.map((uom: any) => ({
                                label: uom.display,
                                value: uom.value?.toLowerCase(),
                            })),
                            required: true,
                        })}
                    </Grid>
                    <Grid item container gap={5}>
                        <Grid item xs>
                            {getEditableField({
                                key: "priceType",
                                type: "select",
                                label: "Pricing Type (Unit Price / Lump Sum)",
                                required: true,
                                options: allConstants?.PriceType?.map((pt: any) => ({
                                    label: pt.display,
                                    value: pt.value,
                                })),
                            })}
                        </Grid>
                        <Grid item xs>
                            {getEditableField({
                                key: "price",
                                type: "number",
                                label: "Pricing",
                                required: true,
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: "16px 24px" }}>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit(onSave)}
                    disabled={!isValid || !isDirty}
                >
                    Submit for Approval
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddNewScopeItemModal;
