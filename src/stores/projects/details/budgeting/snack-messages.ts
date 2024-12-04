export const addItem = (name: string) => {
    return { variant: "success", message: `Added ${name}` };
};

export const addItemFailure = (name: string) => {
    return { variant: "error", message: `Unable to add ${name}` };
};

export const updateItem = (name: string) => {
    return { variant: "success", message: `Updated ${name}` };
};

export const updateItemFailure = (name: string) => {
    return { variant: "error", message: `Unable to update ${name}` };
};

export const removeItem = (name: string) => {
    return { variant: "success", message: `Removed ${name}` };
};

export const removeItemFailure = (name: string) => {
    return { variant: "error", message: `Unable to remove ${name}` };
};

export const fetchItemFailure = (name: string) => {
    return { variant: "error", message: `Unable to fetch ${name}` };
};
