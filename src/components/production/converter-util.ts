const convertToDisplayUnit = (key: string, mappings: any) => {
    const mapping = mappings?.filter((mapping: any) => mapping.value === key);
    return mapping?.length > 0 ? mapping[0].display : mapping;
};

export { convertToDisplayUnit };
