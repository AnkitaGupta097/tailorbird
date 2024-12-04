import {
    Avatar,
    Badge,
    BadgeProps,
    CircularProgress,
    Grid,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Select,
    SxProps,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MergeIcon from "@mui/icons-material/Merge";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import BaseSvgIcon from "components/svg-icon";
import { ReactComponent as LaborIcon } from "../../../assets/icons/labor.svg";
import { ReactComponent as MaterialWithLabourIcon } from "../../../assets/icons/material+labor.svg";
import { ReactComponent as MaterialIcon } from "../../../assets/icons/material.svg";
import { ReactComponent as KebabIcon } from "../../../assets/icons/action_menu.svg";
import EditIcon from "@mui/icons-material/Edit";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { useForm, Controller } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import {
    FEATURE_FLAGS,
    NOT_APPLICABLE,
    PENDING_APPROVAL,
    UNIT_STATUS_COLOR_MAP,
} from "../constants";
import { makeStyles } from "@mui/styles";
import styled from "@emotion/styled";
import { getRoundedOff, getRoundedOffAndFormattedAmount, isValidNumber } from "../helper";
import theme from "styles/theme";
import { isEmpty, isNil } from "lodash";
import BaseChip from "components/chip";
import AvatarGroup from "components/avatar-group";
import TrackerUtil from "utils/tracker";
import { IItem } from "./intefaces/IScopeItem";
import ScopeActivateDialog from "./scope-activate-dialog";
import { useProductionContext } from "context/production-context";
import { isFloatsEqual } from "utils/floating-number-comparator";

interface IScopeItem {
    item: IItem;
    orgs?: Array<{ [key: string]: any }>;
    allStatuses: Array<any>;
    allUOMs: Array<any>;
    editableFields: Array<any>;
    // eslint-disable-next-line no-unused-vars
    updateScopeItem?: (data: any) => void;
    onCancelRequestIconClick?: () => void;
    cancelRequestLoader?: boolean;
    viewableFields: any;
    canUserCancelRequest?: boolean;
    hideSubItemDetail?: boolean;
    scopeId?: number;
    renoUnitId?: string;
    projectName?: string;
    disabled?: boolean;
    currentRenoUnit?: any;
    isFunctional?: boolean;
}

const categoryStyling: SxProps = {
    fontFamily: "Roboto",
    verticalAlign: "middle",
    lineHeight: "39.12px",
};

const getUOMLabel = (uomValue: string, allUOMs: Array<any> = []) => {
    const uomDetail = allUOMs.find((uom) => uom.value === uomValue);
    return uomDetail ? uomDetail.display : uomValue;
};

const getOrg = (id: string, organizations: Array<any>) => {
    return organizations?.find((org) => org.id == id);
};

const getPriceChangeData = (startPrice: number | null, currentPrice: number) => {
    const priceDifference = isNil(startPrice) ? 0 : (currentPrice || 0) - startPrice;

    // eslint-disable-next-line prettier/prettier
    // const roundOffPercentage = percentage ? `${percentage.toFixed(2)}` : 0.00;

    const roundOffCurrentPrice = getRoundedOffAndFormattedAmount(currentPrice || 0.0);

    const displayPrice = `$${roundOffCurrentPrice}`;

    return { displayPrice, priceDifference };
};

const useStyles = makeStyles(() => ({
    cancelRequestIcon: {
        display: "none",
    },
    hoveredContainer: {
        "&:hover $cancelRequestIcon": {
            display: "block",
        },
    },
    categoryCostContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 120px)",
        gap: theme.spacing(1),
        alignItems: "center",
    },
}));

const StyledBadge = styled(Badge)<BadgeProps>({
    "& .MuiBadge-badge": {
        marginLeft: "4px",
    },
    "& .MuiBadge-dot": {
        height: "12px",
        width: "12px",
        borderRadius: "50%",
    },
});

const ScopeItemCard: React.FC<IScopeItem> = ({
    scopeId,
    item,
    orgs,
    allStatuses,
    allUOMs,
    editableFields,
    updateScopeItem,
    onCancelRequestIconClick,
    cancelRequestLoader,
    viewableFields,
    canUserCancelRequest,
    hideSubItemDetail,
    renoUnitId,
    disabled,
    currentRenoUnit,
    isFunctional,
    projectName,
}) => {
    const { hasFeature } = useProductionContext();
    const [isEditMode, setEditMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [isActivateDialogOpen, setIsActivateDialogOpen] = useState<boolean>(false);
    const isScopeItemActive = item?.status !== NOT_APPLICABLE;
    const canActivateDeactivateScopeItem = hasFeature(FEATURE_FLAGS.ACTIVATE_DEACTIVATE_LINE_ITEMS);
    const canEditItemQty = hasFeature(FEATURE_FLAGS.EDIT_UNIT_SCOPE_ITEM_QTY);

    //if item.groups present use the combined price for price_group
    const priceDetail = item.groups?.length
        ? getPriceChangeData(null, item.price!)
        : getPriceChangeData(item.start_price, item.price!);

    const isRequestPendingForApproval = item.status === PENDING_APPROVAL && canUserCancelRequest;
    const classes = useStyles();

    useEffect(() => {
        setEditMode(false);
    }, [item]);

    const getDefaultValues = () => {
        const defaultValues = {
            price: getRoundedOff(item.price!),
        };
        if (item?.groups) {
            return {
                ...defaultValues,
                items: item?.groups?.map((subItem: any) => ({
                    id: subItem.id,
                    uom: subItem.uom?.toLowerCase(),
                    takeoff_value: subItem.takeoff_value,
                })),
            };
        } else {
            return {
                ...defaultValues,
                uom: item.uom?.toLowerCase(),
                takeoff_value: item.takeoff_value,
                total_price: getRoundedOff(item.total_price || 0.0),
            };
        }
    };

    const {
        handleSubmit,
        control,
        formState: { isValid, isDirty },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            ...getDefaultValues(),
        },
        mode: "onChange",
    });

    const totalPriceValue = watch("total_price");
    const priceValue = watch("price");
    const takeOffValue = watch("takeoff_value");

    const getTotalPriceDisplayData = () => {
        const percentage = item?.percent_contrib_to_scope_total! || 0.0;
        // eslint-disable-next-line prettier/prettier
        const roundOffPercentage = !isNil(percentage) ? `${percentage.toFixed(2)}` : 0.0;

        // eslint-disable-next-line prettier/prettier
        const roundOffCurrentPrice = item?.total_price
            ? getRoundedOffAndFormattedAmount(item?.total_price)
            : 0.0;

        const displayPrice = `$${roundOffCurrentPrice}`;
        const changePercentage = `${roundOffPercentage}%`;
        const priceDifference = 0;

        return { displayPrice, changePercentage, priceDifference };
    };

    const getPriceDisplayElement = (
        priceDetail: any,
        withPercentage: boolean = false,
        isFieldEditable: boolean = false,
        key: string,
        disabled = false,
    ): ReactNode => {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    color: disabled ? theme.text.disabled : undefined,
                }}
            >
                {isFieldEditable ? (
                    <>
                        <Typography color={disabled ? theme.text.disabled : undefined}>
                            $
                        </Typography>

                        {getEditableField({
                            defaultValue: item[key],
                            key: key,
                            type: "input",
                            disabled,
                        })}
                    </>
                ) : (
                    <Typography
                        variant="text_14_medium"
                        color={disabled ? theme.text.disabled : undefined}
                    >
                        {priceDetail.displayPrice}
                    </Typography>
                )}
                {withPercentage && (
                    <Typography color={theme.icon.subdued}>
                        ({priceDetail.changePercentage})
                    </Typography>
                )}
                {priceDetail.priceDifference != 0 &&
                    (priceDetail.priceDifference > 0 ? (
                        <IconButton color="error">
                            <ArrowUpwardIcon />
                        </IconButton>
                    ) : (
                        <IconButton color="info">
                            <ArrowDownwardIcon />
                        </IconButton>
                    ))}
            </div>
        );
    };

    const isFieldEditable = (fieldKey: string) => {
        return editableFields?.find((field) => field.value === fieldKey);
    };

    const changeRequest = (data: any) => {
        if (Object.keys(data)?.length > 0) {
            updateScopeItem && updateScopeItem(data);
        } else {
            setEditMode(false);
        }
    };

    const trackEvent = (event: string, payload: any) => {
        TrackerUtil.event(event, payload);
    };

    const onSave = (data: any) => {
        trackEvent("RAISE_CHANGE_ORDER", {
            pricingGroupId: item?.pricing_group_id,
            itemId: item?.id,
            renoUnitId,
            scopeId,
            projectName,
        });

        if (isDirty) {
            if (item?.groups) {
                const updatedItems =
                    data?.items?.map((subItem: any) => {
                        const originalData = item?.groups?.find(
                            (oSubItem: any) => oSubItem?.id === subItem?.id,
                        )!;
                        const editedData = Object.keys(subItem).reduce((updatedData: any, key) => {
                            if (subItem[key] != originalData[key]) {
                                if (
                                    key === "uom" &&
                                    subItem[key] !== originalData[key]?.toLowerCase()
                                ) {
                                    updatedData[key] = allUOMs?.find(
                                        (uom) => uom.value.toLowerCase() === subItem[key],
                                    )?.value;
                                } else {
                                    updatedData[key] = parseFloat(subItem[key]);
                                }
                                updatedData.id = subItem?.id;
                            }
                            return updatedData;
                        }, {});
                        return editedData;
                    }) || [];

                const finalItems = updatedItems?.filter(
                    (item: any) => Object.keys(item).length > 0,
                );
                const updatedPricingGroupData = {};
                if (data?.price != item?.price) {
                    //@ts-ignore
                    updatedPricingGroupData.price = parseFloat(data?.price);
                }
                if (finalItems?.length > 0) {
                    //@ts-ignore
                    updatedPricingGroupData.items = finalItems;
                }
                changeRequest(updatedPricingGroupData);
            } else {
                const editedData = Object.keys(data).reduce((updatedData: any, key) => {
                    if (data[key] != item[key]) {
                        if (key === "uom" && data[key] !== item[key]?.toLowerCase()) {
                            updatedData[key] = allUOMs?.find(
                                (uom) => uom.value.toLowerCase() === data[key],
                            )?.value;
                        } else {
                            updatedData[key] = parseFloat(data[key]);
                        }
                    }
                    return updatedData;
                }, {});
                changeRequest(editedData);
            }
        } else {
            setEditMode(false);
        }
    };

    const getCancelRequestActions = (): ReactNode => {
        return (
            <>
                <Grid item>
                    <StyledBadge color="error" variant="dot" />
                </Grid>
                {cancelRequestLoader ? (
                    <Grid item>
                        <CircularProgress
                            sx={{
                                marginLeft: "4px",
                            }}
                            size={"12px"}
                        />
                    </Grid>
                ) : (
                    <Grid item className={classes.cancelRequestIcon}>
                        <IconButton onClick={onCancelRequestIconClick} style={{ padding: "4px" }}>
                            <DoNotDisturbAltIcon style={{ height: "20px" }} />
                        </IconButton>
                    </Grid>
                )}
            </>
        );
    };

    const getActionButton = (): ReactNode => {
        return (
            <IconButton
                onClick={
                    isEditMode
                        ? handleSubmit(onSave)
                        : () => {
                              reset();
                              setEditMode(true);
                          }
                }
                disabled={!isValid || isRequestPendingForApproval || disabled}
            >
                {isEditMode ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        );
    };

    const getPopoverActionButton = (): ReactNode => {
        const isPricingGroup = item?.groups?.length > 0;
        return (
            isHovered && (
                <>
                    <IconButton
                        onClick={(event) => {
                            event.stopPropagation();
                            setAnchorEl(event.currentTarget);
                        }}
                    >
                        <KebabIcon />
                    </IconButton>
                    <Menu
                        id="action-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={(event: any) => {
                            event.stopPropagation();
                            setAnchorEl(null);
                            setIsHovered(false);
                        }}
                    >
                        {isScopeItemActive && editableFields?.length > 0 && (
                            <MenuItem
                                onClick={
                                    isEditMode
                                        ? handleSubmit(onSave)
                                        : () => {
                                              reset();
                                              setEditMode(true);
                                          }
                                }
                                disabled={!isValid || isRequestPendingForApproval}
                            >
                                <ListItemIcon>
                                    {isEditMode ? (
                                        <SaveIcon fontSize="small" />
                                    ) : (
                                        <EditOutlinedIcon fontSize="small" />
                                    )}
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography variant="text_16_regular">
                                        {`${isEditMode ? "Save" : "Edit"} ${
                                            isPricingGroup ? "Combined Row" : "Item"
                                        }`}
                                    </Typography>
                                </ListItemText>
                            </MenuItem>
                        )}

                        <MenuItem
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsActivateDialogOpen(true);
                            }}
                        >
                            <ListItemIcon>
                                {isScopeItemActive ? (
                                    <DoNotDisturbAltIcon fontSize="small" />
                                ) : (
                                    <ToggleOnOutlinedIcon fontSize="small" />
                                )}
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant="text_16_regular">
                                    {`${isScopeItemActive ? "Deactivate" : "Activate"} ${
                                        isPricingGroup ? "Combined Row" : "Scope Item"
                                    }`}
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </>
            )
        );
    };

    const getEditableField = (fieldValue: any): ReactNode => {
        // console.log({ fieldValue });
        return fieldValue.type === "input" ? (
            <Controller
                name={fieldValue.key}
                control={control}
                rules={{
                    required: "required",
                    validate: (value) => isValidNumber(value) || "invalid",
                }}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        key={fieldValue.key}
                        disabled={fieldValue?.disabled}
                        size="small"
                        error={!!fieldState?.error}
                        InputProps={{
                            style: { height: "36px", maxWidth: "104px" },
                        }}
                    />
                )}
            />
        ) : (
            <Controller
                name={fieldValue.key}
                control={control}
                render={({ field }) => (
                    <Select {...field} style={{ height: " 36px" }}>
                        {fieldValue?.options.map((option: any) => (
                            <MenuItem key={option.value} value={option.value.toLowerCase()}>
                                {option.display}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            />
        );
    };

    const getItemSpec = (scopeItem: any): ReactNode => {
        const displayData = [];
        if (!isEmpty(scopeItem?.manufacturer)) {
            displayData.push(scopeItem?.manufacturer);
        }
        if (!isEmpty(scopeItem?.model_number)) {
            displayData.push(scopeItem?.model_number);
        }
        if (!isEmpty(scopeItem?.description)) {
            displayData.push(scopeItem?.description);
        }

        const concatenatedString = displayData.join(" | ");
        return concatenatedString ? (
            <Tooltip title={concatenatedString} arrow>
                <Typography
                    color={disabled ? theme.text.disabled : theme.icon.subdued}
                    variant="text_14_regular"
                    noWrap
                    style={{
                        display: "inline-block",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {concatenatedString}
                </Typography>
            </Tooltip>
        ) : (
            <></>
        );
    };

    const isMaterialWorkType = () => {
        return item?.work_type?.toLowerCase() === "material";
    };

    const isLaborWorkType = () => {
        return item?.work_type?.toLowerCase() === "labor";
    };

    const getItemElement = (item: any, isGroupItem: boolean, index: number) => {
        const org = orgs && getOrg(item.contractor_org_id, orgs);

        return (
            <Grid container justifyContent={"space-between"} alignItems={"center"}>
                <Grid item xs={5}>
                    <Grid
                        container
                        flexDirection={"row"}
                        alignItems="center"
                        columnGap={3}
                        sx={{ width: "100%" }}
                    >
                        {viewableFields?.work_type_icon && (
                            <Grid item>
                                <BaseSvgIcon
                                    svgPath={
                                        isMaterialWorkType() ? (
                                            <MaterialIcon />
                                        ) : isLaborWorkType() ? (
                                            <LaborIcon />
                                        ) : (
                                            <MaterialWithLabourIcon />
                                        )
                                    }
                                />
                            </Grid>
                        )}
                        {viewableFields?.item_name && (
                            <Grid item xs={9}>
                                <Grid container flexDirection={"column"}>
                                    <Grid
                                        item
                                        sx={{
                                            maxWidth: "100%",
                                        }}
                                    >
                                        <Tooltip
                                            title={`${item.item}${
                                                item.scope ? ` - ${item.scope}` : ""
                                            }`}
                                            arrow
                                        >
                                            <Typography
                                                variant="text_14_medium"
                                                sx={{
                                                    ...categoryStyling,
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    display: "inline-block",
                                                    whiteSpace: "nowrap",
                                                    maxWidth: "100%",
                                                }}
                                                color={disabled ? theme.text.disabled : "primary"}
                                            >
                                                {`${item.item}${
                                                    item.scope ? ` - ${item.scope}` : ""
                                                }`}
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                    {viewableFields?.spec && (
                                        <Grid item sx={{ maxWidth: "100%" }}>
                                            {getItemSpec(item)}
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        )}
                        {isRequestPendingForApproval && !isGroupItem && getCancelRequestActions()}
                    </Grid>
                </Grid>
                <Grid item xs={7}>
                    <Grid
                        container
                        flexDirection={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Grid item xs>
                            <Grid container justifyContent={"space-between"} alignItems={"center"}>
                                {viewableFields?.uom && !(isGroupItem && hideSubItemDetail) && (
                                    <Grid item xs={isEditMode ? 4 : 2}>
                                        <Grid
                                            container
                                            justifyContent={"flex-end"}
                                            alignItems={"center"}
                                            columnGap={2}
                                            color={"black"}
                                        >
                                            {isEditMode && isFieldEditable("takeoff_value") ? (
                                                <Grid item xs={4}>
                                                    {getEditableField({
                                                        defaultValue: item.takeoff_value,
                                                        key: isGroupItem
                                                            ? `items.[${index}].takeoff_value`
                                                            : "takeoff_value",
                                                        type: "input",
                                                        disabled: isGroupItem
                                                            ? false
                                                            : !isFloatsEqual(
                                                                  totalPriceValue,
                                                                  item?.total_price,
                                                              ),
                                                    })}
                                                </Grid>
                                            ) : (
                                                <Grid item>
                                                    <Typography
                                                        variant="text_14_medium"
                                                        sx={categoryStyling}
                                                        color={
                                                            disabled
                                                                ? theme.text.disabled
                                                                : undefined
                                                        }
                                                    >
                                                        {item.takeoff_value}
                                                    </Typography>
                                                </Grid>
                                            )}

                                            {isEditMode && isFieldEditable("uom") ? (
                                                <Grid item>
                                                    {getEditableField({
                                                        defaultValue: item.uom,
                                                        key: isGroupItem
                                                            ? `items.[${index}].uom`
                                                            : "uom",
                                                        type: "select",
                                                        options: allUOMs,
                                                    })}
                                                </Grid>
                                            ) : (
                                                <Grid item>
                                                    <Typography
                                                        variant="text_14_medium"
                                                        sx={categoryStyling}
                                                        color={
                                                            disabled
                                                                ? theme.text.disabled
                                                                : undefined
                                                        }
                                                    >
                                                        {getUOMLabel(item.uom, allUOMs)}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>
                                )}
                                {viewableFields?.price && !isNil(item.price) && !isGroupItem && (
                                    <>
                                        <Grid item xs={1} sx={{ textAlign: "center" }}>
                                            <Typography
                                                variant="text_14_medium"
                                                sx={categoryStyling}
                                                color={disabled ? theme.text.disabled : "black"}
                                            >
                                                x
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={
                                                isEditMode &&
                                                isFieldEditable("price") &&
                                                !isGroupItem
                                                    ? 2
                                                    : 1
                                            }
                                        >
                                            {getPriceDisplayElement(
                                                priceDetail,
                                                false,
                                                isEditMode &&
                                                    isFieldEditable("price") &&
                                                    !isGroupItem,
                                                "price",
                                                !isFloatsEqual(totalPriceValue, item?.total_price),
                                            )}
                                        </Grid>

                                        <Grid item xs={1}>
                                            <IconButton disabled={disabled}>
                                                <KeyboardDoubleArrowRightIcon />
                                            </IconButton>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Typography
                                                variant="text_14_medium"
                                                sx={{
                                                    color: disabled
                                                        ? theme.text.disabled
                                                        : undefined,
                                                }}
                                            >
                                                {getPriceDisplayElement(
                                                    getTotalPriceDisplayData(),
                                                    true,
                                                    isEditMode && isFieldEditable("total_price"),
                                                    "total_price",
                                                    priceValue != item?.price ||
                                                        takeOffValue != item?.takeoff_value,
                                                )}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                        {viewableFields?.status && (
                            <Grid item>
                                <Select
                                    value={item.status}
                                    disabled
                                    sx={{
                                        backgroundColor: "#DFE0EB",
                                        height: "20px",
                                    }}
                                >
                                    {allStatuses.map((scopeStatus) => (
                                        <MenuItem key={scopeStatus.value} value={scopeStatus.value}>
                                            {scopeStatus.display}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        )}
                        {viewableFields?.contractor && (
                            <Grid item>
                                {org ? <AvatarGroup names={[org?.name]} size={32} /> : <Avatar />}
                            </Grid>
                        )}
                        {!isScopeItemActive && (
                            <Grid item>
                                <BaseChip
                                    label="Deactivated"
                                    {...UNIT_STATUS_COLOR_MAP["not_started"]}
                                    sx={{ borderRadius: "4px" }}
                                />
                            </Grid>
                        )}
                        {!isGroupItem &&
                            item?.status !== "completed" &&
                            (canActivateDeactivateScopeItem || canEditItemQty
                                ? isFunctional && <Grid item>{getPopoverActionButton()}</Grid>
                                : editableFields?.length > 0 && (
                                      <Grid item>{getActionButton()}</Grid>
                                  ))}
                    </Grid>
                </Grid>
                <hr style={{ width: "100%", color: "#d2d5d8", opacity: 0.5 }} />
            </Grid>
        );
    };

    return (
        <Grid
            container
            flexDirection="column"
            className={classes.hoveredContainer}
            onMouseEnter={() => isFunctional && setIsHovered(true)}
            onMouseLeave={() => {
                if (isFunctional) {
                    setIsHovered(false);
                    setAnchorEl(null);
                }
            }}
        >
            {item.groups && (
                <Grid container flexDirection="row" alignItems="center" gap={2} spacing={2}>
                    <Grid item>
                        <IconButton color={"primary"} disabled={!isScopeItemActive}>
                            <MergeIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography color={isScopeItemActive ? "#004D71" : "#969696"}>
                            Combined Row
                        </Typography>
                    </Grid>
                    {isRequestPendingForApproval && getCancelRequestActions()}
                    <Grid item marginLeft="auto">
                        {getPriceDisplayElement(
                            priceDetail,
                            false,
                            isEditMode && isFieldEditable("price"),
                            "price",
                        )}
                    </Grid>
                    {(canEditItemQty || canActivateDeactivateScopeItem) &&
                    item?.status !== "completed"
                        ? isFunctional && <Grid item>{getPopoverActionButton()} </Grid>
                        : editableFields?.length > 0 && <Grid item>{getActionButton()}</Grid>}
                </Grid>
            )}
            {(item?.groups || [item]).map((itemDetail: any, index: number) =>
                getItemElement(itemDetail, !!item?.groups, index),
            )}
            {isActivateDialogOpen && (
                <ScopeActivateDialog
                    onClose={() => {
                        setIsActivateDialogOpen(false);
                    }}
                    scopeId={scopeId}
                    scopeItemId={item.id}
                    scopeItem={item}
                    currentUnit={currentRenoUnit}
                    isScopeItemActive={isScopeItemActive}
                />
            )}
        </Grid>
    );
};

export default ScopeItemCard;
