/* eslint-disable no-unused-vars */
export interface ISelectedCItem {
    id: String;
}

export const getItemsWithSelections = (scopeDetails: any) => {
    const stateCopy = JSON.parse(JSON.stringify(scopeDetails));
    return stateCopy.filter((cat: any) => {
        cat.items = cat.items.filter((item: any) => {
            item.scopes = item?.scopes?.filter((scope: any) => scope.isSelected);
            return item?.scopes?.length && item.isSelected;
        });
        return cat.items.length && cat.isSelected;
    });
};

export const getRenoItemsWithWavgValues = (
    renovationItems: any,
    inventoryMixes?: any,
    floorPlanData?: any,
    scopeType?: any,
) => {
    // WAVG Quantity Formula (Q1 * U1) + (Q2 * U2) + ...  + (Qn * Un) / (U1 + U2 +...+ Un)
    // for Floor plan 1
    // Take off Quantity as Q1
    // units of renovation for floorplan  as U1
    // and soo on
    // for Floor plan n
    // Take off Quantity as Qn
    // units of renovation for floorplan  as Un

    // totalFpUnits = (U1 + U2 +...+ Un)
    let totalFpUnits = 0;
    if (scopeType == "altScope") {
        totalFpUnits =
            floorPlanData?.reduce((accumulator: any, currentValue: any) => {
                return accumulator + (currentValue.renoUnits ?? 0);
            }, 0) || 0;
    }
    let renovationItemsUpdated = JSON.parse(JSON.stringify(renovationItems))?.map((item: any) => {
        let inventories = inventoryMixes.filter((inv: any) => inv.inventoryId === item.inventoryId);

        if (scopeType != "altScope") {
            totalFpUnits =
                inventories?.reduce((accumulator: any, currentValue: any) => {
                    return accumulator + (currentValue.count ?? 0);
                }, 0) || 0;
        }

        item.showInCatTree = true;
        item.take_offs = item?.take_offs?.map((takeoff: any) => {
            let fp_reno_units = 0;
            if (scopeType != "altScope") {
                fp_reno_units =
                    inventoryMixes?.find(
                        (fp: any) =>
                            fp.floorplanId == takeoff.fp_id && fp.inventoryId === item.inventoryId,
                    )?.count || 0;
            } else {
                fp_reno_units =
                    floorPlanData?.find((fp: any) => fp.id == takeoff.fp_id)?.renoUnits || 0;
            }
            return {
                ...takeoff,
                renoUnits: fp_reno_units, // U(floorplan)
            };
        });

        let quantitySum =
            item?.take_offs?.reduce((accumulator: any, currentValue: any) => {
                return accumulator + (currentValue.take_off_value * currentValue.renoUnits ?? 0);
            }, 0) || 0;
        let oneOfeachQty =
            item?.take_offs?.reduce((accumulator: any, currentValue: any) => {
                return accumulator + (currentValue.take_off_value ?? 0);
            }, 0) || 0;

        //WAVG quantity =(Q1 * U1) + (Q2 * U2) +...+ (Qn * nk) / (U1 + U2 + ...+Un)
        return {
            ...item,
            wavgQuantity: Number(quantitySum),
            oneOfeachQty: Number(oneOfeachQty),
            allRenoWavg: Number((quantitySum / totalFpUnits) * (item.unitCost ?? 0)) || 0,
            oneOfEachWavg:
                Number((oneOfeachQty / item?.take_offs?.length) * (item.unitCost ?? 0)) || 0,
        };
    });

    return renovationItemsUpdated;
};

export const getOverallWAVG = (renovationItems: any) => {
    let allRenoWavg = renovationItems.reduce((accumulator: any, currentValue: any) => {
        return accumulator + currentValue.allRenoWavg || 0;
    }, 0);
    let oneOfEachWavg = renovationItems.reduce((accumulator: any, currentValue: any) => {
        return accumulator + currentValue.oneOfEachWavg || 0;
    }, 0);

    oneOfEachWavg = Number(oneOfEachWavg.toFixed(2));
    allRenoWavg = Number(allRenoWavg.toFixed(2));

    allRenoWavg = isNaN(allRenoWavg) ? 0 : allRenoWavg;
    oneOfEachWavg = isNaN(oneOfEachWavg) ? 0 : oneOfEachWavg;

    return { allRenoWavg: allRenoWavg, oneOfEachWavg: oneOfEachWavg };
};

export const getCatTreeWithDiffAmount = (baseDataForDiff: any, currentCatTree: any) => {
    const baseDataCatTree = baseDataForDiff?.categoryTree || [];
    return currentCatTree?.map((cct: any) => {
        let base = baseDataCatTree?.find((item: any) => item.name === cct.name);

        cct.cat_all_reno_wavg_diff = Number(
            ((base?.cat_all_reno_wavg || 0) - cct?.cat_all_reno_wavg).toFixed(2),
        );
        cct.cat_one_of_each_wavg_diff = Number(
            ((base?.cat_one_of_each_wavg || 0) - cct?.cat_one_of_each_wavg).toFixed(2),
        );
        cct?.items?.map((cctScope: any) => {
            let cctScopeBase = base?.items?.find(
                (cctsitem: any) => cctsitem.name === cctScope.name,
            );

            cctScope.allRenoWavgAmount_diff = Number(
                ((cctScopeBase?.allRenoWavgAmount || 0) - cctScope.allRenoWavgAmount).toFixed(2),
            );
            cctScope.oneOfEachWavgAmount_diff = Number(
                ((cctScopeBase?.oneOfEachWavgAmount || 0) - cctScope.oneOfEachWavgAmount).toFixed(
                    2,
                ),
            );
        });
        return cct;
    });
};

export const getCatTreeFromRenoItems = (
    renovationItems: any,
    baseDataForDiff?: any,
    scopeType?: any,
) => {
    let groups = JSON.parse(JSON.stringify(renovationItems)) || [];
    groups = groups.reduce(
        (groups: any, item: any) => ({
            ...groups,
            [item.category]: [...(groups[item.category] || []), item],
        }),
        {},
    );
    let catTree: any = [];

    Object.keys(groups).forEach((element: any) => {
        let isItemExisted = catTree?.findIndex((ite: any) => ite.name == element);
        if (isItemExisted < 0) {
            let catObj: any = {
                name: element,
                items: [],
                isComplete: true,
                cat_all_reno_wavg: 0,
                showInCatTree: true,
                cat_all_reno_wavg_diff: 0,
                cat_one_of_each_wavg_diff: 0,
            };
            groups[element].forEach((ritem: any) => {
                let scopeItems = groups[element]?.filter((x: any) => x.item == ritem.item);
                let carItemInd = catObj.items?.findIndex((it: any) => it.name == ritem.item);
                if (carItemInd < 0) {
                    let allRenoWavgAmount = 0;

                    let oneOfEachWavgAmount = 0;
                    scopeItems.forEach((element: any) => {
                        allRenoWavgAmount += element.allRenoWavg;
                        oneOfEachWavgAmount += element.oneOfEachWavg;
                    });

                    allRenoWavgAmount = Number(allRenoWavgAmount.toFixed(2));
                    oneOfEachWavgAmount = Number(oneOfEachWavgAmount.toFixed(2));

                    let scItem = groups[element]?.find((x: any) => x.item == ritem.item);

                    let ex = {
                        name: ritem.item,
                        isSelected: ritem.isSelected,
                        scopes: new Array(0),
                        isComplete: true,
                        allRenoWavgAmount: isNaN(allRenoWavgAmount) ? "-" : allRenoWavgAmount,
                        oneOfEachWavgAmount: isNaN(oneOfEachWavgAmount) ? "-" : oneOfEachWavgAmount,
                        showInCatTree: true,
                        allRenoWavgAmount_diff: 0,
                        oneOfEachWavgAmount_diff: 0,
                    };
                    ex.scopes.push({
                        name: scItem.scope,
                        isSelected: scItem.isSelected,
                    });
                    catObj.isSelected = renovationItems?.some(
                        (sc: any) => sc.category == element && sc.isSelected,
                    );
                    catObj.showInCatTree = renovationItems?.some(
                        (sc: any) => sc.category == element && sc.showInCatTree,
                    );
                    ex.showInCatTree = scopeItems?.some(
                        (sc: any) => sc.subcategory == ritem.subcategory && sc.showInCatTree,
                    );

                    catObj.items.push(ex);
                }

                if (!ritem.workId) {
                    catObj.isComplete = false;
                    catObj.items.forEach((t: any) => {
                        if (t.name === ritem.item) {
                            t.isComplete = false;
                        }
                    });
                }
            });
            catTree.push(catObj);
        }
    });
    //calculating catgory level weighted average
    catTree = catTree?.map((categoryItem: any) => {
        let catLeveltotalAmt = categoryItem?.items?.reduce(
            (accumulator: any, currentValue: any) => {
                return (
                    accumulator +
                    (isNaN(currentValue.allRenoWavgAmount) ? 0 : currentValue.allRenoWavgAmount)
                );
            },
            0,
        );
        let catLevelOneOfEachAmt = categoryItem?.items?.reduce(
            (accumulator: any, currentValue: any) => {
                return (
                    accumulator +
                    (isNaN(currentValue.oneOfEachWavgAmount) ? 0 : currentValue.oneOfEachWavgAmount)
                );
            },
            0,
        );

        categoryItem.cat_all_reno_wavg = isNaN(catLeveltotalAmt)
            ? 0
            : Number(catLeveltotalAmt.toFixed(2));
        categoryItem.cat_one_of_each_wavg = isNaN(catLevelOneOfEachAmt)
            ? 0
            : Number(catLevelOneOfEachAmt.toFixed(2));
        return categoryItem;
    });
    catTree.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
    if (scopeType === "altScope") {
        catTree = getCatTreeWithDiffAmount(baseDataForDiff, catTree);
    }
    return catTree;
};

// eslint-disable-next-line no-unused-vars
export const getSelections = (scopeDetailsCopy: any, scopeDetails: any, type: string) => {
    let data: any = [];
    scopeDetailsCopy?.map((category: any) => {
        category.items?.map((item: any) => {
            item.scopes?.map((scope: any) => {
                let origScope = scopeDetails
                    ?.find((parentitem: any) => parentitem.name == category.name)
                    ?.items?.find((categoryitem: any) => categoryitem.name == item.name)
                    ?.scopes?.find((scopeitem: any) => scopeitem.name == scope.name);
                //considering if the scope option is not exist in original scope >> it
                //should be added from new UI to add new scope item and making the change as followin to save that in to inventory details
                if (origScope == undefined) {
                    origScope = { ...scope, isBase: false, isSelected: false };
                }
                if (type === "create") {
                    if (scope.isSelected) {
                        data.push({
                            category: category.name,
                            item: item.name,
                            scope: scope.name,
                            ...(scope.isAltSku ? { isAltSku: scope.isAltSku } : {}),
                        });
                    }
                } else if (type === "update") {
                    if (
                        origScope.isSelected != scope.isSelected ||
                        scope.isSelected ||
                        // eslint-disable-next-line no-prototype-builtins
                        (origScope.hasOwnProperty("isAltSku") &&
                            origScope.isAltSku != scope.isAltSku)
                    ) {
                        data.push({
                            category: category.name,
                            item: item.name,
                            scope: scope.isSelected ? scope.name : "",
                            ...(scope.isAltSku ? { isAltSku: scope.isAltSku } : {}),
                        });
                    }
                }
            });
        });
    });
    //finding indexs of items to be removed from changes list
    let indexesToRemove: any = [];
    data.forEach((element: any, index: number) => {
        if (element.scope == "") {
            // checking if the item scope is empty and if there is any other item from same category subgroup with scope
            // considering that is a swiching between the dropdown options (ex :  Toilet >> remove and reset or Replace )
            let isExist = data?.findIndex(
                (ite: any) => ite.item == element.item && ite.scope != "",
            );
            isExist >= 0 && indexesToRemove.push(index);
        }
    });
    // new set of updated data
    let updatedSet: any = [];
    data.forEach((changedItem: any, index: number) => {
        // checking if item index present in the indexesToRemove array
        if (indexesToRemove.includes(index) == false) {
            updatedSet.push(changedItem);
        }
    });
    return updatedSet;
};

export const getInventoriesWithRenos = (inventories: any) => {
    return inventories.data?.map((inventory: any) => {
        return {
            ...inventory,
            isDefined: !!inventory.baseScopeId,
        };
    });
};
