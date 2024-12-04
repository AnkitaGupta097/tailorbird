import { cloneDeep } from "lodash";
import React, { Dispatch } from "react";
import { SCRAPED_SKUS_RESULTS } from "./constant";
import SuccessIcon from "../../../../assets/icons/icon-correct.svg";
import ErrorIcon from "../../../../assets/icons/icon-exclamation.svg";
import { AnyAction } from "redux";
import actions from "stores/actions";

export const handleProductSelect = (
    tableData: {
        [x: string]: any[];
    }[],
    setTableData: React.Dispatch<
        React.SetStateAction<
            {
                [x: string]: any[];
            }[]
        >
    >,
    modelNumber?: string,
    id?: number,
    isAll?: boolean,
) => {
    const filterData = cloneDeep(tableData).map((obj: any) => {
        if (isAll !== undefined) {
            obj.isSelected = isAll;
        } else if (obj?.result?.["model_number"] === modelNumber && obj?.id === id) {
            obj.isSelected = !obj?.isSelected;
        }
        return obj;
    });
    setTableData(filterData);
};

export const removeSelected = (
    data: {
        [x: string]: any[];
    }[],
    setData: React.Dispatch<
        React.SetStateAction<
            {
                [x: string]: any[];
            }[]
        >
    >,
    tableData: {
        [x: string]: any[];
    }[],
    setTableData: React.Dispatch<
        React.SetStateAction<
            {
                [x: string]: any[];
            }[]
        >
    >,
    skus: [
        {
            sku: string;
            count: number;
            isSelected: boolean;
        },
    ],
    setSkus: React.Dispatch<
        React.SetStateAction<
            [
                {
                    sku: string;
                    count: number;
                    isSelected: boolean;
                },
            ]
        >
    >,
    deleteList: any,
    setDeleteList: React.Dispatch<React.SetStateAction<any[]>>,
    setShowDialog: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            message: string;
            icon: any;
        }>
    >,
    dispatch: Dispatch<AnyAction>,
    job: any,
) => {
    const newDeleteList: any[] = [];
    let saveData = cloneDeep(data);
    let skusData = cloneDeep(skus);
    const filterTableData = cloneDeep(tableData).map((obj: any) => {
        if (obj?.isSelected) {
            newDeleteList.push(obj?.id);
            const index = saveData.findIndex((item) => item.id === obj.id);
            if (index >= 0) saveData.splice(index, 1);
            const skuIndex = skusData.findIndex((sku) => sku.sku === obj?.properties?.sku_number);
            if (skuIndex >= 0) skusData[skuIndex].count = skusData[skuIndex].count - 1;
            return null;
        }
        return obj;
    });

    setDeleteList([...deleteList, ...newDeleteList]);
    const finalTableArr = filterTableData.filter((el) => el != null);
    //@ts-ignore
    setTableData(finalTableArr);

    //@ts-ignore
    setData(saveData);
    setSkus(skusData);
    if (finalTableArr.length === 0) {
        setShowDialog({
            open: true,
            message: "Your products are successfully deleted",
            icon: SuccessIcon,
        });
    }

    const updatedJobDetails: any = { data: saveData, job: job };

    // When SKU is deleted by user update both SKU count and job details in Redux
    dispatch(
        actions.scraperService.updateSKUsWithCountSuccess({
            job_id: job.job_id,
            latestData: skusData,
        }),
    );
    dispatch(
        actions.scraperService.updateJobDetailsSuccess({
            job_id: job.job_id,
            latestData: updatedJobDetails,
            deleteList: [...deleteList, ...newDeleteList],
        }),
    );
};

export const exportAsPackage = (
    data: {
        [x: string]: any[];
    }[],
    allSubCats: string[],
    setPackageSaveModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const subCategoryMap = {};
    //@ts-ignore
    allSubCats.forEach((subCategory) => (subCategoryMap[subCategory] = 1));
    const errors = [] as Array<any>;
    data.forEach((row: any) => {
        //@ts-ignore
        if (subCategoryMap[row?.result?.subcategory] != 1) {
            errors.push(row);
        }
    });
    if (errors.length > 0) {
        alert(`${SCRAPED_SKUS_RESULTS.ALERT} ${errors.length} ${SCRAPED_SKUS_RESULTS.ITEMS}`);
        return;
    }
    setPackageSaveModal(true);
};

export const getScrapedResultsColumns = (props: any) => {
    return [
        { name: "product_thumbnail_url", label: "Image", showImage: true },
        { name: "model_number", label: "Model No." },
        {
            name: "category",
            label: "Category",
            isAutoComplete: true,
            options: props?.category,
        },
        {
            name: "subcategory",
            label: "Subcategory",
            isAutoComplete: true,
            options: props?.subcategory,
        },
        { name: "manufacturer_name", label: "Manuf" },
        { name: "supplier", label: "Supplier" },
        { name: "item_number", label: "Item No." },
        { name: "style", label: "Style", isAutoComplete: true, options: props?.style },
        { name: "finish", label: "Finish", isAutoComplete: true, options: props?.finish },
        { name: "grade", label: "Grade", isAutoComplete: true, options: props?.grade },
        { name: "price", label: "Price", isShowLess: true },
        { name: "description", label: "Description", isShowLess: true },
        { name: "url", label: "URL" },
    ];
};

export const setCategoriesToEdit = (props: any) => {
    return [
        { name: "subcategory", label: "Sub Category", options: props?.subcategory },
        { name: "style", label: "Style", options: props?.style },
        { name: "finish", label: "Finish", options: props?.finish },
        { name: "grade", label: "Grade", options: props?.grade },
        { name: "category", label: "Category", options: props?.category },
    ];
};

export const getFilteredSKURows: any = (props: any) => {
    switch (props?.type) {
        case "DeSelectAll":
            if (
                (props?.isNotFoundOrIncomplete?.type === "incomplete" &&
                    props?.isNotFoundOrIncomplete?.value === true) ||
                (props?.isNotFoundOrIncomplete?.type === "not_found" &&
                    props?.isNotFoundOrIncomplete?.value === true)
            ) {
                const data = props?.jobDetails.filter((item: any) =>
                    props?.isNotFoundOrIncomplete?.type === "incomplete"
                        ? item.result.subcategory === "" ||
                          item.result.subcategory === null ||
                          !isKnownSubcategory({
                              allSubCats: props?.allSubCats,
                              value: item.result.subcategory,
                          })
                        : item.status === "not_implemented",
                );
                return data;
            }
            return props?.jobDetails;
        case "SelectAll":
            return props?.jobDetails?.filter((el: any) => {
                if (
                    (props?.isNotFoundOrIncomplete?.type === "incomplete" &&
                        props?.isNotFoundOrIncomplete?.value === true) ||
                    (props?.isNotFoundOrIncomplete?.type === "not_found" &&
                        props?.isNotFoundOrIncomplete?.value === true)
                ) {
                    return props?.skus.some(() => {
                        return (
                            // f.sku === el.properties.sku_number &&
                            props?.isNotFoundOrIncomplete?.type === "incomplete"
                                ? el.result.subcategory === "" ||
                                      el.result.subcategory === null ||
                                      !isKnownSubcategory({
                                          allSubCats: props?.allSubCats,
                                          value: el.result.subcategory,
                                      })
                                : el.status === "not_implemented"
                        );
                    });
                } else {
                    return el;
                }
            });
        case "Multiple":
            if (props?.isChecked && !props?.checkedIndexes.includes(props?.index)) {
                props?.checkedIndexes.push(props?.index);
            } else if (!props?.isChecked && props?.checkedIndexes.includes(props?.index)) {
                props.checkedIndexes = props?.checkedIndexes.filter(
                    (index: number) => index !== props?.index,
                );
            }
            props?.setCheckedIndexes(props?.checkedIndexes);
            if (props?.checkedIndexes.length > 0 || props?.isChecked.value) {
                return props?.jobDetails?.filter((el: any) => {
                    if (
                        (props?.isNotFoundOrIncomplete?.type === "incomplete" &&
                            props?.isNotFoundOrIncomplete?.value === true) ||
                        (props?.isNotFoundOrIncomplete?.type === "not_found" &&
                            props?.isNotFoundOrIncomplete?.value === true)
                    ) {
                        return props?.checkedIndexes.some((f: any) => {
                            if (props?.skus[f].sku == "URLs" && !el.properties?.sku_number) {
                                let nullSkuNumber =
                                    !el.properties?.sku_number ||
                                    String(el.properties?.sku_number).trim() == ""
                                        ? true
                                        : false;
                                let nullSheetNumber =
                                    !el.properties?.sheet_name ||
                                    String(el.properties?.sheet_name).trim() == ""
                                        ? true
                                        : false;
                                let bool = nullSkuNumber && nullSheetNumber;
                                if (bool) {
                                    return props?.isNotFoundOrIncomplete?.type === "incomplete"
                                        ? el.result.subcategory === "" ||
                                              el.result.subcategory === null ||
                                              !isKnownSubcategory({
                                                  allSubCats: props?.allSubCats,
                                                  value: el.result.subcategory,
                                              })
                                        : el.status === "not_implemented";
                                }
                            } else {
                                return (
                                    props?.skus[f].sku === el.properties.sku_number &&
                                    (props?.isNotFoundOrIncomplete?.type === "incomplete"
                                        ? el.result.subcategory === "" ||
                                          el.result.subcategory === null ||
                                          !isKnownSubcategory({
                                              allSubCats: props?.allSubCats,
                                              value: el.result.subcategory,
                                          })
                                        : el.status === "not_implemented")
                                );
                            }
                            return (
                                props?.skus[f].sku === el.properties.sku_number &&
                                (props?.isNotFoundOrIncomplete?.type === "incomplete"
                                    ? el.result.subcategory === "" ||
                                      el.result.subcategory === null ||
                                      !isKnownSubcategory({
                                          allSubCats: props?.allSubCats,
                                          value: el.result.subcategory,
                                      })
                                    : el.status === "not_implemented")
                            );
                        });
                    } else {
                        return props?.checkedIndexes.some((f: any) => {
                            if (props?.skus[f].sku == "URLs" && !el.properties?.sku_number) {
                                let nullSkuNumber =
                                    !el.properties?.sku_number ||
                                    String(el.properties?.sku_number).trim() == ""
                                        ? true
                                        : false;
                                let nullSheetNumber =
                                    !el.properties?.sheet_name ||
                                    String(el.properties?.sheet_name).trim() == ""
                                        ? true
                                        : false;
                                let bool = nullSkuNumber && nullSheetNumber;
                                if (bool) {
                                    return el;
                                }
                            } else {
                                return props?.skus[f].sku === el.properties.sku_number;
                            }
                        });
                    }
                });
            } else {
                return getFilteredSKURows({
                    skus: props?.skus,
                    jobDetails: props?.jobDetails,
                    type: "DeSelectAll",
                    index: props?.index,
                    isChecked: props?.isChecked,
                    setIsChecked: props?.setIsChecked,
                    checkedIndexes: props?.checkedIndexes,
                    setCheckedIndexes: props?.setCheckedIndexes,
                    isNotFoundOrIncomplete: props?.isNotFoundOrIncomplete,
                    allSubCats: props?.allSubCats,
                });
            }
    }
};

export const handleBulkEdit = (
    tableData: {
        [x: string]: any[];
    }[],
    category: string,
    value: string,
    setShowDialog: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            message: string;
            icon: any;
        }>
    >,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onCellValueChange: (
        // eslint-disable-next-line no-unused-vars
        list: { skuNumber: string; id: number; key: string; value: string }[],
    ) => void,
) => {
    let updateList: { skuNumber: string; id: number; key: string; value: string }[] = [];
    //update value for selected category
    try {
        cloneDeep(tableData).map((obj: any) => {
            if (obj?.isSelected) {
                let skuNumber =
                    obj?.properties?.sku_number == null || String(obj?.properties?.sku_number) == ""
                        ? "URLs"
                        : obj?.properties?.sku_number;
                updateList.push({
                    skuNumber: skuNumber,
                    id: obj?.id,
                    key: category,
                    value: value,
                });
            }
        });

        onCellValueChange(updateList);

        setOpen(false);
        setShowDialog({
            open: true,
            message: `${category} successfully added in your products`,
            icon: SuccessIcon,
        });
    } catch (error) {
        setOpen(false);
        setShowDialog({
            open: true,
            message: `Failed to add ${category} to your products`,
            icon: ErrorIcon,
        });
    }
};

//TO-DO : If empty sub category is updated
// also update sku status state , after TPM-239 is merged
export const setSKUStatus = (props: any) => {
    let skuStatus: any = {};
    props?.jobdetails.forEach((item: any) => {
        let keys = Object.keys(skuStatus);
        const skuNumber =
            item.properties.sku_number == null || String(item.properties.sku_number).trim() == ""
                ? "URLs"
                : item.properties.sku_number;
        let status =
            item.result.subcategory === null ||
            item.result.subcategory === "" ||
            !isKnownSubcategory({
                allSubCats: props?.allSubCats,
                value: item.result.subcategory,
            })
                ? "incomplete"
                : item.status;

        if (keys !== undefined && keys?.includes(skuNumber)) {
            let skuJobs = skuStatus?.[skuNumber];
            let jobFound = false;
            skuJobs?.forEach((job: any) => {
                if (job.id === item.id) jobFound = true;
            });

            if (!jobFound) {
                skuStatus?.[skuNumber]?.push({ id: item.id, status: status });
            }
        } else if (skuNumber !== null) {
            const statusDetails = skuStatus;
            statusDetails[skuNumber] = [{ id: item.id, status: status }];

            skuStatus = statusDetails;
        }
    });

    return skuStatus;
};

export const isErrorFound = (props: any) => {
    const keys = Object.keys(props?.skuStatus);
    let isError = false;
    if (keys && keys.includes(props?.sku)) {
        let skuJobs = props?.skuStatus[props?.sku];
        isError = skuJobs.some(
            (job: any) => job.status === "not_implemented" || job.status === "incomplete",
        );
    }
    return isError;
};

export const isKnownSubcategory = (props: any) => {
    const isKnownSubcategory = !!props?.allSubCats?.find(
        (subCategory: any) => subCategory == props?.value,
    );
    return isKnownSubcategory;
};
