import { PROJECT_TYPE } from "../../constant";
import { map, find, groupBy, sumBy, mapValues, findIndex, cloneDeep } from "lodash";

export const COMMON_HEADERS = ["type", "name", "renoUnits"];

export const generateTableData = (
    data: any,
    type: string,
    projectType?: string,
    typeData?: any,
    groupTypes?: any,
) => {
    if (type === "floorplans") {
        let headers: any = {};
        if (projectType == PROJECT_TYPE[0].value) {
            headers = {
                type: "Floorplan Type",
                name: "Floorplan Name",
                totalUnits: "Total Units",
                bathsPerUnit: "No. of Bathrooms",
                bedsPerUnit: "No. of Bedrooms",
                area: "Total Area(Sq ft)",
                renoUnits: "Reno Units",
            };
        } else {
            headers = {
                type: "Building/Area Type",
                name: "Building/Area Name",
                area: "Total Area(Sq ft)",
            };
        }

        return {
            headers,
            data,
            showAddIcon: false,
            isDefined: true,
            showButton: false,
            isEdit: false,
            groupNames: [],
        };
    } else {
        const typeDataCopy = cloneDeep(typeData);
        let arrayOfMaps: any = {};
        data.map((plan: any) => {
            if (type === "floorplanSplit") {
                arrayOfMaps[plan.id] = typeDataCopy.filter(
                    (type: any) => type.floorPlanId === plan.id,
                );
            } else {
                arrayOfMaps[plan.id] = typeDataCopy.filter((type: any) => {
                    return type.floorplanId === plan.id;
                });
            }
        });

        const headersCopy: any = {
            type: projectType == PROJECT_TYPE[0].value ? "Floorplan Type" : "Building/Area Type",
            name: projectType == PROJECT_TYPE[0].value ? "Floorplan Name" : "Building/Area Name",
            ...Object.assign(
                {},
                ...groupTypes.map((group: any) => ({
                    [group.name]: group.name,
                })),
            ),
            renoUnits: "Reno Units",
        };

        const mappersCopy = data.map((plan: any) => {
            if (!arrayOfMaps?.[plan.id].length) {
                arrayOfMaps[plan.id] = [];
            }

            const groupData = Object.assign(
                {},
                ...arrayOfMaps[plan.id].map((item: any, idx: number) => {
                    if (type === "floorplanSplit") {
                        const group = groupTypes.find(
                            (group: any) => group?.id === item.subGroupId,
                        );
                        return {
                            [group?.name]: item.unitsCount ?? 0,
                            [`subGroupId${idx}`]: group?.id,
                        };
                    } else {
                        const group = groupTypes.find(
                            (group: any) => group?.id === item.inventoryId,
                        );
                        return { [group?.name]: item.count ?? 0, inventoryId: group.id };
                    }
                }),
            );

            return {
                floorplanId: plan.id,
                type: plan?.type,
                name: plan.commercial_name ?? plan?.name,
                ...groupData,
                renoUnits: plan?.renoUnits,
            };
        });

        return {
            headers: headersCopy,
            data: mappersCopy,
            showAddIcon: !groupTypes.length,
            isDefined: groupTypes.length,
            showButton: true,
            isEdit: false,
            groupNames: groupTypes.map((group: any) => group.name),
        };
    }
};

export const generateSubGroupMapper = (subGroups: any, floorData: any) => {
    let mapperCopy: any = [];
    const upperFloorId = find(subGroups, { name: "Upper" });
    const groundFloorId = find(subGroups, { name: "Ground" });
    map(floorData, (data) => {
        mapperCopy.push({
            floor_plan_id: data.floorplanId,
            sub_group_id: upperFloorId?.id,
            units_count: data?.Upper ? data.Upper : 0,
        });
        mapperCopy.push({
            floor_plan_id: data.floorplanId,
            sub_group_id: groundFloorId?.id,
            units_count: data?.Ground ? data.Ground : 0,
        });
    });
    return mapperCopy;
};

export const generateInventoryList = (inventories: any, data: any) => {
    return {
        inventoryList: inventories.data?.map((inventory: any) => {
            return {
                inventoryName: inventory.name,
                floorplanCounts: data.map((item: any) => ({
                    count: item[inventory.name] ? item[inventory.name] : 0,
                    floorplanId: item.floorplanId,
                })),
            };
        }),
        count: inventories.data.length,
    };
};

export const generateNewInventoryList = (inventories: any, floorplans: any) => {
    return {
        inventoryList: inventories.data.length
            ? inventories.data?.map((inventory: any) => {
                  return {
                      inventoryName: inventory.name,
                      floorplanCounts: floorplans.data?.map((plan: any) => {
                          return {
                              count: 0,
                              floorplanId: plan.id,
                          };
                      }),
                  };
              })
            : {
                  inventoryName: "",
                  floorplanCounts: floorplans.data?.map((plan: any) => {
                      return {
                          count: 0,
                          floorplanId: plan.id,
                      };
                  }),
              },
        count: inventories.data.length,
    };
};

export const getUnitMixData = (unitMix: any) => {
    // const { projectFloorPlan, inventory, inventoryMix, unitMixes, propertyUnits } = unitMix;

    const { projectFloorPlan, inventory, inventoryMix } = unitMix;
    const updatedInventoryMix = map(inventoryMix, (data) => {
        const iData = find(inventory, { id: data.inventory_id });
        return { ...data, ...iData };
    });
    const inventoryData = groupBy(updatedInventoryMix, "floor_plan_id");
    let inventoryMixByInventory: any = groupBy(updatedInventoryMix, "inventory_id");
    const floorPlanData = map(projectFloorPlan, (fp) => {
        const iData = inventoryData[fp.id];
        return { ...fp, inventory: iData };
    });
    inventoryMixByInventory = mapValues(inventoryMixByInventory, (value: any) => {
        return sumBy(value, "count");
    });

    return {
        data: floorPlanData,
        totalUnits: sumBy(floorPlanData, "totalUnits"),
        totalRenoUnits: sumBy(floorPlanData, "renoUnits"),
        ...inventoryMixByInventory,
    };
};

export const getUnitDetail = (unitMix: any) => {
    const { propertyUnits, unitMixes, projectFloorPlan, inventory } = unitMix;
    const updateUnits = groupBy(
        map(propertyUnits, (unit) => {
            const unitMix = find(unitMixes, { property_unit_id: unit.id });
            const fpData = find(projectFloorPlan, { id: unit.floor_plan_id });
            return {
                ...unitMix,
                ...unit,
                unit_mix_id: unitMix?.id,
                area: fpData.area,
                renoUnits: fpData.renoUnits,
                is_renovated: unitMix?.is_renovated,
                inventory_index:
                    findIndex(inventory, { id: unitMix?.inventory_id }) == -1
                        ? null
                        : findIndex(inventory, { id: unitMix?.inventory_id }),
            };
        }),
        "floor_plan_id",
    );
    return updateUnits;
};
