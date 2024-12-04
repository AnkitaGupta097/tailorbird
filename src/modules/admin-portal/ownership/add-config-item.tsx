import React, { useState, useEffect } from "react";
import {
    Typography,
    Grid,
    Box,
    Select,
    MenuItem,
    Checkbox,
    FormControl,
    FormHelperText,
    FormControlLabel,
    Button,
} from "@mui/material";
import BaseTextField from "components/text-field";
import { map, isEmpty, cloneDeep } from "lodash";
import AppTheme from "styles/theme";
import { CheckedIcon, Icon } from "../../package-manager/common";
import { CONTAINER_CATEGORY_QUERY } from "components/container-admin-interface/constants";
import { SCOP_ITEMS, ITEM_DETAILS, ERROR_FIELD } from "../../projects/details/budgeting/constants";

import { SAVE_CONTAINER_ITEM, WORK_PACKAGE } from "./constants";

import loaderProgress from "assets/icons/blink-loader.gif";
import { ReactComponent as Triangle } from "assets/icons/warning-triangle.svg";
import ConfirmationModal from "components/confirmation-modal";
import { useSnackbar } from "notistack";
import { graphQLClient } from "utils/gql-client";
import BaseSnackbar from "components/base-snackbar";
import { UOMS } from "components/container-admin-interface/constants";
import { IItemDetails, IErrorText } from "../../projects/details/interface";
import { IUser } from "stores/ims/interfaces";
import TrackerUtil from "utils/tracker";

const AddContainerItem = ({ modalHandler, onSave }: any) => {
    const { enqueueSnackbar } = useSnackbar();
    const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");

    const [categoryData, setCategoryData] = useState([]);
    const [itemDetails, setItemDetails] = useState<IItemDetails>(ITEM_DETAILS);
    const [errorText, setErrorText] = useState<IErrorText>(ERROR_FIELD);
    const [inProgress, setInProgress] = useState(false);

    const [openWarningModal, setWarningModal] = useState({
        skip: false,
        save: false,
    });

    const getCategoryData = async () => {
        const res = await graphQLClient.query("getCategoryData", CONTAINER_CATEGORY_QUERY);
        setCategoryData(res.getCategories);
    };

    useEffect(() => {
        getCategoryData();
        // eslint-disable-next-line
    }, []);

    const onClickSave = (): any => {
        const validation = cloneDeep(errorText);
        const itemValidation = itemDetails;
        if (
            isEmpty(itemValidation.item_name) ||
            isEmpty(itemValidation.category) ||
            isEmpty(itemValidation.work_package) ||
            isEmpty(itemValidation.uom) ||
            isEmpty(itemValidation.scopes)
        ) {
            if (isEmpty(itemValidation.item_name)) {
                validation.item_name = "Item name required*";
            }
            if (isEmpty(itemValidation.category)) {
                validation.category = true;
            }
            if (isEmpty(itemValidation.work_package)) {
                validation.work_package = true;
            }
            if (isEmpty(itemValidation.uom)) {
                validation.uom = true;
            }
            if (isEmpty(itemValidation.scopes)) {
                validation.scopes = true;
            }
            setErrorText({ ...validation });
        } else {
            setWarningModal({ ...openWarningModal, save: true });
        }
    };

    const cancleWarningModal = (key: string) => {
        setWarningModal({ ...openWarningModal, [key]: false });
    };

    const blockSpecialChar = (e: any) => {
        // Refer this link ( http://www.foreui.com/articles/Key_Code_Table.htm ) to see any key-code
        const keyCode = e.which;
        if (
            !(
                (keyCode > 64 && keyCode < 91) ||
                (keyCode > 96 && keyCode < 123) ||
                keyCode == 8 ||
                keyCode == 32 ||
                (keyCode >= 48 && keyCode <= 57)
            )
        ) {
            e.preventDefault();
        }
    };

    const updateItemDetail = (key: string, value: string) => {
        setItemDetails({ ...itemDetails, [key]: value });
    };

    const selectScope = (e: any, name: string) => {
        let scopes = cloneDeep(itemDetails.scopes);
        if (e.target.checked) {
            setErrorText({ ...errorText, scopes: false });
            scopes.push(name);
        } else {
            scopes = scopes.filter((item: any) => item !== name);
        }
        setItemDetails({ ...itemDetails, scopes });
    };

    const createItem = async () => {
        setInProgress(true);
        setWarningModal({ ...openWarningModal, save: false });
        try {
            const { item_name, category, scopes, work_package, uom } = itemDetails;
            const scopesWithWorkType = scopes.map((scope) => ({
                scope: scope,
                work_type: work_package,
            }));

            const res = await graphQLClient.mutate("createContainerItemV2", SAVE_CONTAINER_ITEM, {
                input: {
                    category: category.trim(),
                    item_name: item_name.trim(),
                    project_support: ["common_area", "interior"],
                    scopes: scopesWithWorkType,
                    uoms: [
                        {
                            uom: uom.trim(),
                        },
                    ],
                    is_active: true,
                    user: email,
                },
            });
            onSave(res);
            TrackerUtil.event("CONTAINER_V2_CREATE_NEW_ITEM", {
                category: category.trim(),
                item_name: item_name.trim(),
                user: email,
            });
            enqueueSnackbar("", {
                variant: "success",
                action: <BaseSnackbar variant="success" title="New item created." />,
            });
            setWarningModal({ ...openWarningModal, save: false });
            setInProgress(false);
            modalHandler(false);
        } catch (error) {
            setInProgress(false);
            setWarningModal({ ...openWarningModal, save: false });
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title="Unable to create new item." />,
            });
        }
    };

    const itemObj = itemDetails;
    const getItemDetail = () => {
        return (
            <Grid container>
                <Grid item md={4} pr={2}>
                    <BaseTextField
                        label="Item Name*"
                        style={{ width: "100%" }}
                        classes={errorText?.item_name && "error"}
                        helper={errorText?.item_name}
                        value={itemDetails.item_name}
                        onKeyPress={(e: React.FormEvent) => blockSpecialChar(e)}
                        onChange={(e: any) => updateItemDetail("item_name", e.target.value)}
                    />
                </Grid>
                <Grid item md={4}>
                    <Typography variant="text_14_regular">Category*</Typography>
                    <Box mt={2.4} pr={2}>
                        <FormControl fullWidth error={errorText.category}>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                fullWidth
                                onChange={(e: any) => updateItemDetail("category", e.target.value)}
                                value={itemObj.category}
                                displayEmpty
                                sx={{ height: "44px" }}
                            >
                                <MenuItem value="" style={{ display: "none" }}>
                                    <Typography
                                        variant="text_14_regular"
                                        color={AppTheme.text.medium}
                                    >
                                        Select Category
                                    </Typography>
                                </MenuItem>
                                {categoryData.map((category: any, index) => (
                                    <MenuItem key={index} value={category.category}>
                                        {category.category}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText> Category field required*</FormHelperText>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4}>
                    <Typography variant="text_14_regular">Work Package*</Typography>
                    <Box mt={2.4} pr={2}>
                        <FormControl fullWidth error={errorText.work_package}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                displayEmpty
                                value={itemObj.work_package}
                                fullWidth
                                onChange={(e: any) =>
                                    updateItemDetail("work_package", e.target.value)
                                }
                                sx={{ height: "44px", width: "100%" }}
                            >
                                <MenuItem value="" style={{ display: "none" }}>
                                    <Typography
                                        variant="text_14_regular"
                                        color={AppTheme.text.medium}
                                    >
                                        Select Work Package
                                    </Typography>
                                </MenuItem>
                                {map(WORK_PACKAGE, (wp, index) => (
                                    <MenuItem key={index} value={wp.work_type}>
                                        {wp.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText> Work package field required*</FormHelperText>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} mt={4}>
                    <Typography variant="text_14_regular">UoM*</Typography>
                    <Box mt={2.4} pr={2}>
                        <FormControl fullWidth error={errorText.uom}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                fullWidth
                                displayEmpty
                                value={itemObj.uom}
                                onChange={(e: any) => updateItemDetail("uom", e.target.value)}
                                sx={{ height: "44px" }}
                            >
                                <MenuItem value="" style={{ display: "none" }}>
                                    <Typography
                                        variant="text_14_regular"
                                        color={AppTheme.text.medium}
                                    >
                                        Select UOM
                                    </Typography>
                                </MenuItem>
                                {map(UOMS, (unit, index) => (
                                    <MenuItem key={index} value={unit}>
                                        {unit}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText> UOM field required*</FormHelperText>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={12} mt={4}>
                    <Typography variant="text_14_regular">Scope Item*</Typography>{" "}
                    <Grid container mt={2.4} pr={2} display="flex">
                        <FormControl
                            fullWidth
                            error={errorText.scopes}
                            style={{ display: "contents" }}
                        >
                            {map(SCOP_ITEMS, (item, index) => {
                                return (
                                    <Grid item md={4} mt={0.2}>
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox
                                                    checkedIcon={<CheckedIcon />}
                                                    icon={<Icon />}
                                                />
                                            }
                                            label={
                                                <Typography variant="text_14_regular">
                                                    {item.label}
                                                </Typography>
                                            }
                                            checked={
                                                itemObj?.scopes?.includes(item.value) ? true : false
                                            }
                                            onChange={(e) => selectScope(e, item.value)}
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                );
                            })}
                            <Grid item md={12} mt={0.2}>
                                <FormHelperText>Select scopes*</FormHelperText>
                            </Grid>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item md={12} mt={4} mb={2} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        style={{ marginLeft: "10px", height: "50px", width: "146px" }}
                        onClick={onClickSave}
                    >
                        <Typography variant="text_16_semibold">{"Save"}</Typography>
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderUI = () => {
        return getItemDetail();
    };

    return (
        <Grid container>
            <Grid item md={12} mb={5}>
                <Typography variant="text_14_medium">{"Item Details "}</Typography>
            </Grid>
            {inProgress ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    width="100%"
                    height="100%"
                    alignItems="center"
                    mt={5}
                >
                    <img
                        src={loaderProgress}
                        alt="loading"
                        style={{
                            width: "44px",
                            height: "44px",
                            padding: "20px",
                        }}
                    />
                    <Typography variant="text_18_regular">
                        Saving item details information
                    </Typography>
                </Box>
            ) : (
                renderUI()
            )}
            <ConfirmationModal
                text={
                    <Box mb={7}>
                        <Typography variant="text_18_semibold"> Confirmation</Typography>
                        <Box mt={3}>
                            <Typography variant="text_18_regular">
                                This item will be permanently moved to selected category.
                            </Typography>
                        </Box>
                        <Typography variant="text_18_regular">Do you want to proceed?</Typography>
                    </Box>
                }
                icon={<Triangle />}
                actionText="Yes"
                onCancel={() => cancleWarningModal("save")}
                onProceed={createItem}
                open={openWarningModal.save}
            />
        </Grid>
    );
};

export default AddContainerItem;
