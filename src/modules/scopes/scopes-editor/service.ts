const scopeOptions = [
    { name: "Demo Existing", id: 0, isSelected: false },
    { name: "Install New", id: 1, isSelected: false },
    { name: "Remove and Store", id: 2, isSelected: false },
    { name: "Reinstall Existing", id: 3, isSelected: false },
    { name: "Repair Existing", id: 4, isSelected: false },
    { name: "Refinish Existing", id: 5, isSelected: false },
    { name: "Add New", id: 6, isSelected: false },
];

export const getContainerIds = (scopeList: any) => {
    let itemIds: string[] = [];

    scopeList?.map((category: any) =>
        category.items.map((item: any) => {
            if (
                ["name", "component", "scopes"].every((scopeKey) =>
                    Object.keys(item).includes(scopeKey),
                ) == false
            ) {
                let itemKeys: any = Object.values(item);
                [].concat(...itemKeys).map((itemfrmComponet: any) => {
                    itemfrmComponet?.scopes?.map((scope: any) => {
                        if (scope.isSelected && scope?.containerItemIds?.length) {
                            itemIds.push(...scope.containerItemIds);
                        }
                    });
                });
            } else {
                item?.scopes?.map((scope: any) => {
                    if (scope.isSelected && scope.containerItemIds) {
                        itemIds.push(...scope.containerItemIds);
                    }
                });
            }
        }),
    );
    return itemIds;
};
export const getNewlyAddedContainerIds = (itemsList: any) => {
    let itemIds: string[] = [];

    itemIds = itemsList?.map((item: any) => item.containerItemId);
    return itemIds;
};
const sortData = (inputData: any, sortParam: any) => {
    return inputData.sort((a: any, b: any) =>
        a[sortParam]
            ?.trim()
            ?.localeCompare(b[sortParam]?.trim(), undefined, { sensitivity: "base" }),
    );
};

const customSortOrder = [
    "Demo Existing",
    "Install New",
    "Remove and Store",
    "Reinstall Existing",
    "Repair Existing",
    "Refinish Existing",
    "Add New",
];

const customSort = (a: any, b: any) => {
    const aIndex = customSortOrder.indexOf(a.name);
    const bIndex = customSortOrder.indexOf(b.name);

    if (aIndex > -1 && bIndex > -1) {
        return aIndex - bIndex;
    } else if (aIndex > -1) {
        return -1;
    } else if (bIndex > -1) {
        return 1;
    } else {
        return 0;
    }
};

export const getFormattedScopeContainerTree = (scopeContainerTree: any) => {
    return scopeContainerTree
        .map((category: any) => {
            let itemsCopy = category.items?.map((item: any) => {
                const isItemSelected = item.scopes?.some((scope: any) => scope.isSelected);
                return {
                    ...item,
                    scopes: item && item?.scopes && [...item.scopes]?.sort(customSort),
                    isSelected: isItemSelected,
                    showAddScope: false,
                    availableScopesToAdd: scopeOptions
                        ?.filter(
                            (scItem: any) =>
                                item?.scopes?.findIndex((obj: any) => obj.name == scItem.name) ===
                                -1,
                        )
                        ?.sort(customSort),
                };
            });

            const componentGroups = itemsCopy
                ?.filter((item: any) => item.component != null && item.component != "")
                ?.reduce((groups: any, item: any) => {
                    if (!groups[item.component]) {
                        groups[item.component] = [];
                    }
                    groups[item.component].push(item);

                    return groups;
                }, {});

            const itemsWithoutComponents = itemsCopy?.filter(
                (item: any) => item.component == null || item.component == "",
            );

            let categoryCopyUpdated = {
                ...category,
                items: sortData(
                    Object.keys(componentGroups).length > 0
                        ? [componentGroups, ...itemsWithoutComponents]
                        : [...itemsWithoutComponents],
                    "name",
                ),
                isSelected: itemsCopy?.some((it: any) => it.isSelected),
            };
            return categoryCopyUpdated;
        })
        .sort((a: any, b: any) => {
            return (a.id || "").localeCompare(b.id || "");
        });
};
export const getRollupDetailsTree = (
    scopeContainerTree: any,
    isEditFlow: any,
    scopeOptions: any,
    scopeRollUps: any,
    scopeMerge?: any,
    projectMerge?: any,
    isFromInventory?: any,
) => {
    return scopeContainerTree.map((category: any) => {
        const scopeRollUpsCopy = scopeRollUps.map((item: any) => ({
            ...item,
            isSelected: (
                isFromInventory
                    ? projectMerge?.find(
                          (pItem: any) =>
                              pItem.merge_type == "scope merge" &&
                              pItem.scope_name.includes(item.name) &&
                              pItem.category_name == category.name,
                      )
                    : scopeMerge?.find(
                          (pItem: any) =>
                              pItem.merge_type == "scope merge" &&
                              pItem.scope_name.includes(item.name) &&
                              pItem.category_name == category.name,
                      )
            )
                ? true
                : false,
        }));

        const labourRollUpsCopy = scopeOptions.map((item: any) => ({
            ...item,
            isSelected: (
                isFromInventory
                    ? projectMerge?.find(
                          (pItem: any) =>
                              pItem.merge_type == "labour merge" &&
                              pItem.scope_name.includes(item.name) &&
                              pItem.category_name == category.name,
                      )
                    : scopeMerge?.find(
                          (pItem: any) =>
                              pItem.merge_type == "labour merge" &&
                              pItem.scope_name.includes(item.name) &&
                              pItem.category_name == category.name,
                      )
            )
                ? true
                : false,
        }));

        const categoryCopyUpdated = {
            name: category.name,
            scopeRollUps: scopeRollUpsCopy,
            labourRollUps: labourRollUpsCopy,
            isSelected: !isEditFlow
                ? true
                : scopeRollUpsCopy.some((it: any) => it.isSelected) ||
                  labourRollUpsCopy.some((it: any) => it.isSelected),
        };

        return categoryCopyUpdated;
    });
};
