import { find, filter, map } from "lodash";

const isItemExist = (containerTree: any, itemName: any) => {
    const isExist = filter(containerTree, (categoryItem) => {
        return find(categoryItem.items, { name: itemName }) ? true : false;
    });
    return isExist.length > 0 ? true : false;
};

const mapRenoWithNewItem = (renoItem: any, newItemList: any) => {
    let renoByWorkTypeMaterial = filter(renoItem, (item) => {
        return item.workType == "Material";
    });
    renoByWorkTypeMaterial = map(renoByWorkTypeMaterial, (renoItem) => {
        return { ...renoItem, item: renoItem.item.toLowerCase() };
    });
    const mapRenoWithItem = map(newItemList, (newItem) => {
        const item = find(renoByWorkTypeMaterial, { item: newItem.item_name.toLowerCase() });
        if (item) {
            return {
                ...newItem,
                subcategory: item.subcategory,
                workType: item.workType,
                workId: item.workId,
            };
        } else {
            return newItem;
        }
    });
    return mapRenoWithItem;
};

const getSkuDetail = (subcategory: any, packageList: any) => {
    const skuDetailsInfo = filter(packageList, (sku) => sku.subcategory == subcategory);
    return { ...skuDetailsInfo };
};
export { isItemExist, mapRenoWithNewItem, getSkuDetail };
