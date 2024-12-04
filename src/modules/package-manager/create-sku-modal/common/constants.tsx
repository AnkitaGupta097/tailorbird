import { ICreateSKUState, IErrors } from "../../interfaces";

export const initialState: ICreateSKUState = {
    Manufacturer: "",
    ModelNumber: "",
    Supplier: "",
    ItemNumber: "",
    Subcategory: [""],
    Category: [""],
    UOM: "",
    Style: "",
    Finish: "",
    Grade: "",
    Description: [""],
};

export const initialErrors: IErrors = {
    Subcategory: { error: [false], errMsg: "This field is required." },
    Category: { error: [false], errMsg: "This field is required." },
    UOM: { error: false, errMsg: "This field is required." },
    Description: { error: [false], errMsg: "This field is required." },
};
