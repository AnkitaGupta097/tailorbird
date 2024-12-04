import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import BaseAutoComplete from "components/auto-complete";
import BaseButton from "components/button";
import BaseTextField from "components/text-field";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import { IItem } from "stores/bidding-portal/bidding-portal-models";
import { useAppDispatch } from "stores/hooks";
import { ROUTES } from "./constants";
import { isEmpty } from "lodash";

interface IAlternateDialog {
    open: boolean;
    onClose: () => void;
    item?: IItem;
    isEdit: boolean;
    isView: boolean;
}

const FORM_TEXT_FIELDS = [
    {
        id: "manufacturer",
        label: "Manufacturer",
        placeholder: "Manufacturer",
    },
    { id: "model_number", label: "Model Number", placeholder: "Model Number" },
    { id: "description", label: "Description / URL", placeholder: "Description / URL" },
];

const REASONS: readonly string[] = ["Item unavailable", "Better price", "Better quality", "Other"];

const initialFormState: {
    model_number?: string | null;
    manufacturer?: string | null;
    description?: string | null;
    unit_pricing?: number | string | null;
    lump_sum?: number | string | null;
    reason?: string | null;
} = {
    model_number: "",
    manufacturer: "",
    description: "",
    unit_pricing: null,
    lump_sum: null,
    reason: REASONS[0],
};

const initialErrors = {
    manufacturer: false,
    model_number: false,
    description: false,
    pricing: false,
};

const validateFormData = (
    formData: typeof initialFormState,
    setErrors: React.Dispatch<React.SetStateAction<typeof initialErrors>>,
    isEdit?: boolean,
): boolean => {
    let fields = ["manufacturer", "model_number", "description"];
    let errors: any = {};
    fields.map((field) => {
        if (
            !formData[field as keyof typeof formData] ||
            formData[field as keyof typeof formData] === ""
        ) {
            errors[field] = true;
        } else errors[field] = false;
    });
    if (
        (!formData["unit_pricing"] && !formData["lump_sum"]) ||
        (formData["lump_sum"] === "" && formData["unit_pricing"] === "")
    ) {
        !isEdit && (errors["pricing"] = true);
    }

    setErrors(errors);
    let totalErrors = Object.values(errors).filter((val) => val);
    return totalErrors.length > 0;
};

const AlternateDialog: React.FC<IAlternateDialog> = ({ open, onClose, item, isEdit, isView }) => {
    const { projectId, userID, role } = useParams();
    const [formData, setFormData] = React.useState<typeof initialFormState>(initialFormState);
    const [errors, setErrors] = React.useState<typeof initialErrors>(initialErrors);
    const navState = useLocation().state as any;
    const navigate = useNavigate();
    const orgId = !isEmpty(navState?.organization_id)
        ? navState?.organization_id ?? ""
        : localStorage.getItem("organization_id") ?? "";
    const dispatch = useAppDispatch();
    const onSubmit = (): void => {
        let error = validateFormData(formData, setErrors, isEdit);
        if (!error) {
            if (!isEdit) {
                dispatch(
                    actions.biddingPortal.createAlternateItemStart({
                        formData: {
                            unique_price: 0,
                            total_price: formData.lump_sum ?? 0,
                            specific_uom: item?.uom,
                            reno_item_id: item?.reno_item_id,
                            reason: formData.reason,
                            project_id: projectId,
                            model_no: formData.model_number,
                            manufacturer: formData.manufacturer,
                            is_unique_price: null,
                            description: formData.description,
                            default_price: formData.unit_pricing,
                            created_by: userID,
                            contractor_org_id: orgId,
                            bid_request_id: item?.bid_request_id,
                            message: (
                                <Typography>
                                    Added to Alternates,&nbsp;
                                    <Link
                                        display="inline"
                                        onClick={() => {
                                            navigate(
                                                ROUTES.ENTRY_TABLE(
                                                    role!,
                                                    userID!,
                                                    projectId!,
                                                    "Alternates",
                                                ),
                                                {
                                                    state: {
                                                        data: navState?.data,
                                                        category: "Alternates",
                                                        index: navState?.index,
                                                        tab: navState?.tab,
                                                        organization_id: orgId,
                                                        selectedVersion: navState?.selectedVersion,
                                                        bidResponseItem: navState?.bidResponseItem,
                                                        bidRequestItem: navState?.bidRequestItem,
                                                        isAdminAccess: navState?.isAdminAccess,
                                                        isLatest: navState?.isLatest,
                                                        version: navState?.version,
                                                    },
                                                },
                                            );
                                        }}
                                        sx={{
                                            "&:hover": {
                                                cursor: "pointer",
                                            },
                                        }}
                                    >
                                        View Alternates for this floor plan
                                    </Link>
                                </Typography>
                            ),
                        },
                    }),
                );
            } else {
                // Dispatch action to edit alternate item
                dispatch(
                    actions.biddingPortal.editAlternateItemStart({
                        reno_item_id: item?.reno_item_id,
                        reason: formData.reason,
                        project_id: projectId,
                        model_no: formData.model_number,
                        manufacturer: formData.manufacturer,
                        description: formData.description,
                        id: item?.id,
                        userID,
                    }),
                );
            }
            setFormData(initialFormState);
            setErrors(initialErrors);
            onClose?.();
        }
    };
    const onEditInAlternates = () => {
        navigate(ROUTES.ENTRY_TABLE(role!, userID!, projectId!, "Alternates"), {
            state: {
                data: navState?.data,
                category: "Alternates",
                index: navState?.index,
                tab: navState?.tab,
                organization_id: orgId,
                selectedVersion: navState?.selectedVersion,
                bidResponseItem: navState?.bidResponseItem,
                bidRequestItem: navState?.bidRequestItem,
                isAdminAccess: navState?.isAdminAccess,
                isLatest: navState?.isLatest,
                version: navState?.version,
            },
        });
        onClose?.();
    };

    React.useEffect(() => {
        if ((isEdit || isView) && item) {
            setFormData({
                description: item?.description,
                reason: item?.reason,
                manufacturer: item?.manufacturer,
                model_number: item?.model_no,
            });
        }
        //eslint-disable-next-line
    }, [item, isEdit, isView]);

    return (
        <Dialog
            open={open}
            onClose={() => onClose?.()}
            sx={{
                ".MuiPaper-root": {
                    minWidth: "30rem",
                },
            }}
        >
            <DialogTitle>
                <Stack direction="column" gap={4}>
                    <Typography variant="text_18_semibold">
                        {isEdit
                            ? `Edit Alternate Item`
                            : `Alternate Item details for ${item?.subcategory}`}
                    </Typography>
                    {!isEdit && !isView ? (
                        <Typography variant="text_14_regular" sx={{ color: "#916A00" }}>
                            Note: This will be added to the Alternates category, and can be managed
                            from there.
                        </Typography>
                    ) : isView ? (
                        <Typography variant="text_14_regular" sx={{ color: "#916A00" }}>
                            Note: This is a quick view for this item. Any edits can be made from the
                            Alternates category page only.
                        </Typography>
                    ) : null}
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={2} mb="1rem">
                    {FORM_TEXT_FIELDS.map((field) => (
                        <BaseTextField
                            key={field.id}
                            label={field.label}
                            fullWidth
                            disabled={isView && item}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData({ ...formData, [field.id]: e.target.value });
                            }}
                            sx={{
                                ".MuiFormHelperText-root": {
                                    margin: "0",
                                },
                            }}
                            value={formData?.[field.id as keyof typeof formData]}
                            placeholder={field.placeholder}
                            error={errors[field.id as keyof typeof errors]}
                            helperText={
                                errors[field.id as keyof typeof errors]
                                    ? "Required field"
                                    : undefined
                            }
                        />
                    ))}
                </Stack>
                <Stack
                    direction="column"
                    spacing={3}
                    marginBottom="1rem"
                    display={isEdit || isView ? "none" : "initial"}
                >
                    <Typography variant="text_14_regular">
                        Pricing (enter per {item?.uom} or Lump Sum)
                    </Typography>
                    <Stack direction="row" gap={4} justifyContent="space-between">
                        <BaseTextField
                            fullWidth
                            placeholder="Unit price"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData({
                                    ...formData,
                                    unit_pricing: e.target.value,
                                    lump_sum: null,
                                });
                            }}
                            type="number"
                            sx={{
                                "input::-webkit-outer-spin-button": {
                                    "-webkit-appearance": "none",
                                    margin: 0,
                                },
                                "input::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                },
                                "input[type=number]": {
                                    margin: 0,
                                    "-moz-appearance": "textfield",
                                },
                                ".MuiFormHelperText-root": {
                                    margin: "0",
                                },
                            }}
                            value={
                                formData?.unit_pricing ??
                                parseFloat(
                                    `${
                                        parseFloat(`${formData?.lump_sum ?? "0"}`) /
                                        (item?.quantity ?? 1)
                                    }`,
                                ).toFixed(2)
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography variant="text_14_regular" color="black">
                                            / {item?.uom}
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                            error={errors?.pricing}
                            helperText={errors?.pricing ? "Pricing is required" : undefined}
                        />
                        <BaseTextField
                            fullWidth
                            placeholder="Lump sum"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData({
                                    ...formData,
                                    lump_sum: e.target.value,
                                    unit_pricing: null,
                                });
                            }}
                            type="number"
                            sx={{
                                "input::-webkit-outer-spin-button": {
                                    "-webkit-appearance": "none",
                                    margin: 0,
                                },
                                "input::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                    margin: 0,
                                },
                                "input[type=number]": {
                                    "-moz-appearance": "textfield",
                                },
                                ".MuiFormHelperText-root": {
                                    margin: "0",
                                },
                            }}
                            value={
                                formData?.lump_sum ??
                                parseFloat(
                                    `${
                                        parseFloat(`${formData?.unit_pricing ?? "0"}`) *
                                        (item?.quantity ?? 0)
                                    }`,
                                ).toFixed(2)
                            }
                            error={errors?.pricing}
                            helperText={errors?.pricing ? "Pricing is required" : undefined}
                        />
                    </Stack>
                </Stack>
                <Stack direction="column" gap={2} mt=".5rem">
                    <Typography variant="text_14_medium">Field label (Typing)</Typography>
                    <BaseAutoComplete
                        value={formData.reason}
                        options={REASONS}
                        variant="outlined"
                        disabled={isView && item}
                        disableClearable
                        onChange={(e: any, value: string) => {
                            setFormData({ ...formData, reason: value });
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "left",
                    "&.MuiDialogActions-root": {
                        marginLeft: "1rem",
                        marginBottom: "1rem",
                    },
                }}
            >
                <BaseButton
                    onClick={(): void => {
                        setFormData(initialFormState);
                        setErrors(initialErrors);
                        onClose?.();
                    }}
                    label="Cancel"
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="grey default"
                    variant="text_16_semibold"
                />
                {isView ? (
                    <BaseButton
                        onClick={onEditInAlternates}
                        labelStyles={{ paddingY: ".4rem" }}
                        classes="primary default"
                        variant="text_16_semibold"
                        label="Edit in Alternates"
                    />
                ) : (
                    <BaseButton
                        onClick={(): void => {
                            onSubmit();
                        }}
                        labelStyles={{ paddingY: ".4rem" }}
                        classes="primary default"
                        variant="text_16_semibold"
                        label="Save"
                    />
                )}
            </DialogActions>
        </Dialog>
    );
};
export default React.memo(AlternateDialog);
