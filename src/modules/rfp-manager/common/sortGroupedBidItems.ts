export const sortGroupedBidItems = (current: any, next: any) => {
    const propertyOrder = [
        "bed_count",
        "bath_count",
        "fp_area",
        "fp_name",
        "inventory_name",
        "sub_group_name",
    ];

    for (const property of propertyOrder) {
        const currentValue = current?.[property];
        const nextValue = next?.[property];

        if (currentValue === undefined) return 1;
        if (nextValue === undefined) return -1;

        if (currentValue > nextValue) return 1;
        if (currentValue < nextValue) return -1;
    }

    return 0;
};
