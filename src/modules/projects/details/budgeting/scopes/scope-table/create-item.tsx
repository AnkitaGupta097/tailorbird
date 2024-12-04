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
import { useAppSelector, useAppDispatch } from "stores/hooks";
import { groupBy, keys, map, isEmpty, cloneDeep, find } from "lodash";
import AppTheme from "styles/theme";
import actions from "stores/actions";
import { CheckedIcon, Icon } from "../../../../../package-manager/common";
import {
    WORK_PACKAGE,
    UOM,
    SCOP_ITEMS,
    ITEM_DETAILS,
    MATERIAL_DETAILS,
    SKU_TYPE,
    ERROR_FIELD,
} from "../../constants";
import loaderProgress from "assets/icons/blink-loader.gif";
import { ReactComponent as Triangle } from "assets/icons/warning-triangle.svg";
import ConfirmationModal from "components/confirmation-modal";
import { useSnackbar } from "notistack";
import { graphQLClient } from "utils/gql-client";
import { isItemExist, getSkuDetail } from "../../../helper";
import BaseSnackbar from "components/base-snackbar";
import { useParams } from "react-router-dom";
import {
    CREATE_NEW_ITEM,
    CREATE_SKU_MATERIAL,
} from "stores/projects/details/budgeting/base-scope/base-scope-queries";
import { IItemDetails, IMaterialDetails, IErrorText, ICreateItem } from "../../../interface";
import { IUser } from "stores/ims/interfaces";
import TrackerUtil from "utils/tracker";

const CreateItemd = ({ isModal, newItem, modalHandler, itemIndex }: ICreateItem) => {
    const { enqueueSnackbar } = useSnackbar();
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");
    const {
        packageCreateSearch,
        newItemDetails,
        newItemStatus,
        basePackage,
        projectDetails,
        containerTree,
        packageList,
        allUsers,
    } = useAppSelector((state) => {
        return {
            packageCreateSearch: state.scraperService.scraper.categories,
            projectDetails: state.projectDetails.data,
            containerTree: state.scopes.containerTree,
            newItemDetails: state.budgeting.details.newItem,
            newItemStatus: state.budgeting.details.newItemStatus,
            newItemList: state.budgeting.details.newItemList,
            basePackage: state.budgeting.details.basePackage.data[0],
            allUsers: state.tpsm.all_User.users,
            renovationItems: state.budgeting.details.baseScope.renovations.data,
            packageList: state.budgeting.details.packageList,
        };
    });
    const { insertedNewItemIndex, loading } = newItemStatus;
    const { subcategory_pair, style, finish, grade, supplier } = packageCreateSearch;
    const categoryData = groupBy(subcategory_pair, "category");
    const [step, setStep] = useState(1);
    const [itemDetails, setItemDetails] = useState<IItemDetails>(newItem ? newItem : ITEM_DETAILS);
    const [materialDetails, setMaterialDetails] = useState<IMaterialDetails>(MATERIAL_DETAILS);
    const [kitDetails, setKitDetails] = useState<IMaterialDetails>(MATERIAL_DETAILS);
    const [errorText, setErrorText] = useState<IErrorText>(ERROR_FIELD);
    // const [newItemWithReno, setNewItemWithReno] = useState<any>(null);
    // const [itemForAddingSku, setItemForAddingSku] = useState<any>(null);
    const [openWarningModal, setWarningModal] = useState({
        skip: false,
        save: false,
    });

    useEffect(() => {
        if (isEmpty(newItemDetails) && isModal) {
            setItemDetails({ ...ITEM_DETAILS, scopes: [] });
        }
        if (
            (!isEmpty(newItemDetails) && isModal) ||
            (insertedNewItemIndex === itemIndex && !isModal)
        ) {
            changeStep(2);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        !isModal && fetchSkuDetail(newItem);
        // eslint-disable-next-line
    }, [packageList]);

    const onSkip = () => {
        setWarningModal({ ...openWarningModal, skip: true });
    };
    const onSave = (): any => {
        const validation = cloneDeep(errorText);
        const itemValidation = isModal ? itemDetails : newItem;
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

    const updateErrorText = (key: string, text: any) => setErrorText({ ...errorText, [key]: text });

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
        if (key === "item_name") {
            const isExist = isItemExist(containerTree, value);
            isExist
                ? updateErrorText("item_name", "Item name already exist.")
                : updateErrorText("item_name", "");
        } else {
            setErrorText({ ...errorText, [key]: false });
        }
        isModal
            ? setItemDetails({ ...itemDetails, [key]: value })
            : dispatch(
                  actions.budgeting.updateItemList({
                      key,
                      value,
                      itemIndex,
                  }),
              );
    };

    const updateSKUDetail = (key: string, value: string, skuType: string) => {
        if (skuType == SKU_TYPE.MATERIAL) {
            if (key == "description") {
                setErrorText({ ...errorText, description_material: false });
            }
            setMaterialDetails({ ...materialDetails, [key]: value });
        } else {
            if (key == "description") {
                setErrorText({ ...errorText, description_kit: false });
            }
            setKitDetails({ ...kitDetails, [key]: value });
        }
    };

    const selectScope = (e: any, name: string) => {
        let scopes = cloneDeep(isModal ? itemDetails.scopes : newItem.scopes);
        if (e.target.checked) {
            setErrorText({ ...errorText, scopes: false });
            scopes.push(name);
        } else {
            scopes = scopes.filter((item: any) => item !== name);
        }
        isModal
            ? setItemDetails({ ...itemDetails, scopes })
            : dispatch(
                  actions.budgeting.updateItemList({
                      key: "scopes",
                      value: scopes,
                      itemIndex,
                  }),
              );
    };

    const createSKU = async () => {
        const validation = cloneDeep(errorText);
        const inputObj: any =
            itemDetails?.work_package === WORK_PACKAGE[1].value
                ? [
                      {
                          ...materialDetails,
                      },
                      {
                          ...kitDetails,
                          is_kit: true,
                      },
                  ]
                : [
                      {
                          ...materialDetails,
                      },
                  ];
        if (
            (isEmpty(materialDetails.description) || isEmpty(kitDetails.description)) &&
            itemDetails?.work_package === WORK_PACKAGE[1].value
        ) {
            if (isEmpty(materialDetails.description)) {
                validation.description_material = true;
                changeStep(2);
            }
            if (isEmpty(kitDetails.description)) {
                validation.description_kit = true;
            }
            setErrorText({ ...validation });
        } else {
            if (isEmpty(materialDetails.description)) {
                validation.description_material = true;
                setErrorText({ ...validation });
            } else {
                try {
                    dispatch(actions.budgeting.createNewItemLoader(isModal ? "modal" : itemIndex));
                    await graphQLClient.mutate("updatePackage", CREATE_SKU_MATERIAL, {
                        input: {
                            package_id: basePackage?.id,
                            materials: inputObj,
                        },
                    });
                    enqueueSnackbar("", {
                        variant: "success",
                        action: (
                            <BaseSnackbar
                                variant="success"
                                title="SKU details added Successfully."
                            />
                        ),
                    });
                    await dispatch(actions.budgeting.fetchPackageByIdStart(basePackage?.id));
                    if (isModal) {
                        modalHandler(false);
                    } else {
                        dispatch(actions.budgeting.createNewItemLoader(null));
                    }
                } catch (error: any) {
                    if (error.message == "400: Bad Request") {
                        enqueueSnackbar("", {
                            variant: "success",
                            action: (
                                <BaseSnackbar
                                    variant="success"
                                    title="SKU details added Successfully."
                                />
                            ),
                        });
                        await dispatch(actions.budgeting.fetchPackageByIdStart(basePackage?.id));
                    } else {
                        enqueueSnackbar("", {
                            variant: "error",
                            action: (
                                <BaseSnackbar variant="error" title="Unable to add SKU details." />
                            ),
                        });
                        dispatch(actions.budgeting.createNewItemLoader(null));
                    }
                    isModal
                        ? modalHandler(false)
                        : dispatch(actions.budgeting.updateNewlyInsertedItem(null));
                }
            }
        }
    };

    const fetchRenoItem = (category: any) => {
        dispatch(
            actions.scopes.fetchMDMContainerTreeStart({
                projectType: projectDetails?.projectType,
                containerVersion: projectDetails?.system_remarks?.container_version || "2.0",
            }),
        );
        if (basePackage?.id) dispatch(actions.budgeting.fetchPackageByIdStart(basePackage?.id));
        if (category == "Flooring") {
            dispatch(
                actions.budgeting.fetchFlooringRenoItemsStart({
                    projectId,
                    feature: "new-item",
                }),
            );
        } else {
            dispatch(
                actions.budgeting.fetchBaseScopeRenosStart({ projectId, feature: "new-item" }),
            );
        }
    };
    const createItem = async () => {
        dispatch(actions.budgeting.createNewItemLoader(isModal ? "modal" : itemIndex));
        setWarningModal({ ...openWarningModal, save: false });
        const itemValidation = isModal ? itemDetails : newItem;
        try {
            const res = await graphQLClient.mutate("createNewItem", CREATE_NEW_ITEM, {
                input: {
                    project_id: projectId,
                    user_id: projectDetails.userId,
                    scopes: itemValidation.scopes,
                    category: itemValidation.category,
                    work_package: itemValidation.work_package,
                    item_name: itemValidation.item_name.trim(),
                    uom: itemValidation.uom,
                    user: email,
                },
            });
            TrackerUtil.event("CONTAINER_V2_CREATE_NEW_ITEM", {
                projectId,
                item_name: itemValidation.item_name,
                category: itemValidation.category,
                email,
            });
            enqueueSnackbar("", {
                variant: "success",
                action: <BaseSnackbar variant="success" title="New item created." />,
            });
            setWarningModal({ ...openWarningModal, save: false });
            dispatch(actions.budgeting.fetchDataSourceNewItemsStart({ projectId }));
            dispatch(actions.budgeting.createNewItemLoader(null));
            dispatch(actions.budgeting.updateNewlyInsertedItem(itemIndex));
            fetchRenoItem(itemValidation.category);
            const itemDetail = find(res, { work_type: "Material" });
            if (itemDetail?.subcategory) {
                isModal
                    ? dispatch(actions.budgeting.createNewItem(itemDetail))
                    : dispatch(
                          actions.budgeting.updateItemList({
                              key: "subcategory",
                              value: itemDetail?.subcategory,
                              itemIndex,
                          }),
                      );
                isModal && changeStep(2, itemDetail);
            } else {
                if (isModal) {
                    modalHandler(false);
                }
            }
        } catch (error) {
            dispatch(actions.budgeting.createNewItemLoader(null));
            setWarningModal({ ...openWarningModal, save: false });
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title="Unable to create new item." />,
            });
        }
    };

    const fetchSkuDetail = (itemToGetSku: any) => {
        const skuDetail = getSkuDetail(itemToGetSku.subcategory, packageList);
        const skuObj = {
            category: itemToGetSku?.category,
            user_id: projectDetails.userId,
            created_by: find(allUsers, { id: projectDetails.userId })?.name,
            subcategory: itemToGetSku.subcategory,
        };
        if (!isEmpty(skuDetail)) {
            map(skuDetail, (sku, index) => {
                const obj: any = {
                    url: sku.url,
                    subcategory: sku.subcategory,
                    style: sku.style,
                    model_id: sku.model_id,
                    manufacturer: sku.manufacturer,
                    grade: sku.grade,
                    finish: sku.finish,
                    description: sku.description,
                    isExist: sku?.description ? true : false,
                };
                if (index == 0) {
                    setMaterialDetails({ ...materialDetails, ...obj });
                } else {
                    setKitDetails({ ...kitDetails, ...obj });
                }
            });
        } else {
            setMaterialDetails({
                ...materialDetails,
                ...skuObj,
            });
            setKitDetails({ ...kitDetails, ...skuObj });
        }
    };

    const changeStep = (no: any, item?: string) => {
        if (!basePackage?.id && no == 2) {
            enqueueSnackbar("", {
                variant: "info",
                action: (
                    <BaseSnackbar
                        variant="info"
                        title="You can't procced without base-package. First add the base-package."
                    />
                ),
            });
            if (isModal) {
                modalHandler(false);
            }
        } else {
            if (no == 1) {
                dispatch(actions.budgeting.updateNewlyInsertedItem(null));
            }
            if (no == 2) {
                fetchSkuDetail(isModal ? (item ? item : newItemDetails) : newItem);
            }
            setStep(no);
        }
    };

    const skipSKUDetail = () => {
        if (isModal) {
            modalHandler(false);
        }
    };

    const getDescriptionHelper = () => {
        if (errorText.description_material && step == 2) {
            return "Description field mandatory*.";
        }

        if (errorText.description_kit && step == 3) {
            return "Description field mandatory*.";
        }
    };

    const getSKUDetail = (skuType: string) => {
        const itemObject = skuType == SKU_TYPE.KIT ? kitDetails : materialDetails;
        return (
            <Grid container>
                <Grid item md={4} mt={4}>
                    <Typography variant="text_14_regular">Style</Typography>
                    <Box mt={2.4} pr={2}>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={itemObject.style}
                                displayEmpty
                                fullWidth
                                disabled={itemObject?.isExist}
                                onChange={(e) => updateSKUDetail("style", e.target.value, skuType)}
                                placeholder="users"
                                sx={{ height: "44px" }}
                            >
                                <MenuItem value="" style={{ display: "none" }}>
                                    <Typography
                                        variant="text_14_regular"
                                        color={AppTheme.text.medium}
                                    >
                                        Enter Style
                                    </Typography>
                                </MenuItem>
                                {map(style, (item, index) => (
                                    <MenuItem key={index} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} mt={4}>
                    <Typography variant="text_14_regular">Finish</Typography>
                    <Box mt={2.4} pr={2}>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={itemObject.finish}
                                displayEmpty
                                disabled={itemObject?.isExist}
                                fullWidth
                                onChange={(e) => updateSKUDetail("finish", e.target.value, skuType)}
                                placeholder="users"
                                sx={{ height: "44px" }}
                            >
                                <MenuItem value="" style={{ display: "none" }}>
                                    <Typography
                                        variant="text_14_regular"
                                        color={AppTheme.text.medium}
                                    >
                                        Enter Finish
                                    </Typography>
                                </MenuItem>
                                {map(finish, (item, index) => (
                                    <MenuItem key={index} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} mt={4}>
                    <Typography variant="text_14_regular">Grade</Typography>
                    <Box mt={2.4} pr={2}>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                disabled={itemObject?.isExist}
                                displayEmpty
                                fullWidth
                                value={itemObject.grade}
                                onChange={(e) => updateSKUDetail("grade", e.target.value, skuType)}
                                placeholder="users"
                                sx={{ height: "44px" }}
                            >
                                <MenuItem value="" style={{ display: "none" }}>
                                    <Typography
                                        variant="text_14_regular"
                                        color={AppTheme.text.medium}
                                    >
                                        Enter Grade
                                    </Typography>
                                </MenuItem>
                                {map(grade, (item, index) => (
                                    <MenuItem key={index} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} mt={4} pr={2}>
                    <BaseTextField
                        label="Manufacturer"
                        style={{ width: "100%" }}
                        disabled={itemObject?.isExist}
                        onChange={(e: any) =>
                            updateSKUDetail("manufacturer", e.target.value, skuType)
                        }
                        value={itemObject.manufacturer}
                    />
                </Grid>
                <Grid item md={4} mt={4} pr={2}>
                    <BaseTextField
                        label="Model Number"
                        style={{ width: "100%" }}
                        disabled={itemObject?.isExist}
                        value={itemObject.model_id}
                        onChange={(e: any) => updateSKUDetail("model_id", e.target.value, skuType)}
                    />
                </Grid>
                <Grid item md={4} mt={4}>
                    <Typography variant="text_14_regular">Supplier</Typography>
                    <Box mt={2.4} pr={2}>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                displayEmpty
                                disabled={itemObject?.isExist}
                                fullWidth
                                value={itemObject.supplier}
                                onChange={(e) =>
                                    updateSKUDetail("supplier", e.target.value, skuType)
                                }
                                placeholder="users"
                                sx={{ height: "44px" }}
                            >
                                <MenuItem value="" style={{ display: "none" }}>
                                    <Typography
                                        variant="text_14_regular"
                                        color={AppTheme.text.medium}
                                    >
                                        Enter Supplier
                                    </Typography>
                                </MenuItem>
                                {map(supplier, (item, index) => (
                                    <MenuItem key={index} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} mt={4} pr={2}>
                    <BaseTextField
                        label="Item Number"
                        style={{ width: "100%" }}
                        disabled={itemObject?.isExist}
                        value={itemObject.sku_id}
                        onChange={(e: any) => updateSKUDetail("sku_id", e.target.value, skuType)}
                    />
                </Grid>
                <Grid item md={4} mt={4} pr={2}>
                    <BaseTextField
                        label="Sub-Category"
                        style={{ width: "100%" }}
                        disabled={itemObject?.isExist}
                        value={itemObject?.subcategory}
                    />
                </Grid>
                <Grid item md={12} mt={4} pr={2}>
                    <BaseTextField
                        label="Description*"
                        helper={getDescriptionHelper()}
                        style={{ width: "100%" }}
                        value={itemObject.description}
                        disabled={itemObject?.isExist}
                        onChange={(e: any) =>
                            updateSKUDetail("description", e.target.value, skuType)
                        }
                    />
                </Grid>
                <Grid item md={5} mt={7} mb={2}>
                    <Typography variant="text_12_light" fontStyle="italic">
                        &quot;This SKU information would be added to Base Package of the project
                        only, (and not Alt Package).&quot;
                    </Typography>
                </Grid>
                <Grid item md={7} mt={7} mb={2} display="flex" justifyContent="flex-end">
                    {isModal && (
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{
                                height: "50px",
                                width: "100px",
                                backgroundColor: "white",
                                boxShadow: "none",
                            }}
                            onClick={onSkip}
                        >
                            <Typography
                                variant="text_16_semibold"
                                color={AppTheme.scopeHeader.label}
                            >
                                Skip
                            </Typography>
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ height: "50px", width: "140px" }}
                        onClick={() => changeStep(step - 1)}
                    >
                        <Typography variant="text_16_semibold"> Back</Typography>
                    </Button>
                    {itemObject?.isExist ? null : (
                        <Button
                            variant="contained"
                            onClick={() =>
                                itemDetails?.work_package === WORK_PACKAGE[1].value && step == 2
                                    ? changeStep(3)
                                    : createSKU()
                            }
                            style={{ marginLeft: "10px", height: "50px", width: "140px" }}
                        >
                            <Typography variant="text_16_semibold">
                                {itemDetails?.work_package === WORK_PACKAGE[1].value && step == 2
                                    ? "Next"
                                    : "Save"}
                            </Typography>
                        </Button>
                    )}
                </Grid>
            </Grid>
        );
    };

    const isItemDisabled = () => {
        if (isModal) {
            return !isEmpty(newItemDetails) ? true : false;
        } else {
            return newItem.item_id ? true : false;
        }
    };
    const itemObj = isModal ? itemDetails : newItem;
    const getItemDetail = () => {
        return (
            <Grid container>
                {isModal && (
                    <Grid item md={4} pr={2}>
                        <BaseTextField
                            label="Item Name*"
                            style={{ width: "100%" }}
                            classes={errorText?.item_name && "error"}
                            helper={errorText?.item_name}
                            value={itemDetails.item_name}
                            disabled={isItemDisabled()}
                            onKeyPress={(e: React.FormEvent) => blockSpecialChar(e)}
                            onChange={(e: any) => updateItemDetail("item_name", e.target.value)}
                        />
                    </Grid>
                )}
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
                                disabled={isItemDisabled()}
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
                                {keys(categoryData).map((category, index) => (
                                    <MenuItem key={index} value={category}>
                                        {category}
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
                                disabled={isItemDisabled()}
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
                                    <MenuItem key={index} value={wp.value}>
                                        {wp.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText> Work package field required*</FormHelperText>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} mt={isModal ? 4 : 0}>
                    <Typography variant="text_14_regular">UoM*</Typography>
                    <Box mt={2.4} pr={2}>
                        <FormControl fullWidth error={errorText.uom}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                fullWidth
                                displayEmpty
                                value={itemObj.uom}
                                disabled={isItemDisabled()}
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
                                {map(UOM, (unit, index) => (
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
                                            disabled={isItemDisabled()}
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
                        onClick={() => (isItemDisabled() ? changeStep(2) : onSave())}
                    >
                        <Typography variant="text_16_semibold">
                            {isItemDisabled() ? "Next" : "Save"}
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderUI = () => {
        switch (step) {
            case 1: {
                return getItemDetail();
            }
            case 2: {
                return getSKUDetail(SKU_TYPE.MATERIAL);
            }
            case 3: {
                return getSKUDetail(SKU_TYPE.KIT);
            }
        }
    };
    return (
        <Grid container>
            <Grid item md={12} mb={step > 1 ? 1 : 5}>
                <Typography variant="text_14_medium">
                    {step == 1 ? "Item Details " : "SKU Details "}
                </Typography>
                <Typography variant="text_10_regular">{`(Step ${step}/${
                    itemObj?.work_package === WORK_PACKAGE[1].value ? "3" : "2"
                })`}</Typography>
            </Grid>
            {step > 1 && (
                <Grid item md={12} mb={5}>
                    <Typography variant="text_14_medium" color={AppTheme.scopeHeader.label}>
                        Work Package :
                    </Typography>
                    <Typography variant="text_14_medium" color={AppTheme.scopeHeader.label}>
                        {step == 2 ? "  Material" : "  Kit"}
                    </Typography>
                </Grid>
            )}
            {loading == "modal" && isModal ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    width="100%"
                    height="100%"
                    alignItems="center"
                    mt={5}
                >
                    <div>
                        <img
                            src={loaderProgress}
                            alt="loading"
                            style={{
                                width: "44px",
                                height: "44px",
                                paddingTop: "20px",
                            }}
                        />
                    </div>
                </Box>
            ) : (
                renderUI()
            )}
            <ConfirmationModal
                text={
                    <Box mb={8}>
                        <Typography variant="text_18_semibold"> Warning</Typography>
                        <Box mt={3}>
                            <Typography variant="text_18_regular">
                                You haven’t added SKU details. You can update it later on.
                            </Typography>
                        </Box>
                    </Box>
                }
                onCancel={() => cancleWarningModal("skip")}
                onProceed={skipSKUDetail}
                open={openWarningModal.skip}
                icon={<Triangle />}
                actionText="Continue"
            />
            <ConfirmationModal
                text={
                    <Box mb={7}>
                        <Typography variant="text_18_semibold"> Confirmation</Typography>
                        <Box mt={3}>
                            <Typography variant="text_18_regular">
                                This item will be permanently moved to selected category.
                            </Typography>
                        </Box>
                        {itemDetails?.work_package !== WORK_PACKAGE[3].value && (
                            <Typography variant="text_18_regular">
                                Do you want to proceed?
                            </Typography>
                        )}
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

export default CreateItemd;
