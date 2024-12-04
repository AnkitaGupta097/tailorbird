const categorySortingOrder = [
    {
        name: "Kitchen & Bath Finishes",
        position: 0,
    },
    {
        name: "Plumbing",
        position: 1,
    },
    {
        name: "Appliances",
        position: 2,
    },
    {
        name: "Bath Accessories",
        position: 3,
    },
    {
        name: "Hardware",
        position: 4,
    },
    {
        name: "Lighting",
        position: 5,
    },
    {
        name: "Electric",
        position: 6,
    },
    {
        name: "Flooring",
        position: 7,
    },
    {
        name: "Paint",
        position: 8,
    },
    {
        name: "Blinds",
        position: 9,
    },
    {
        name: "HVAC",
        position: 10,
    },
    {
        name: "Repair and Make Ready",
        position: 11,
    },
    {
        name: "FF&E",
        position: 12,
    },
    {
        name: "Landscaping",
        position: 13,
    },
    {
        name: "Wall Finishes",
        position: 14,
    },
    {
        name: "Bath Hardware",
        position: 15,
    },
    {
        name: "Doors and Millwork",
        position: 16,
    },
    {
        name: "Exterior Finishes",
        position: 17,
    },
    {
        name: "Exterior Stairs",
        position: 18,
    },
    {
        name: "Roofing",
        position: 19,
    },
    {
        name: "Windows",
        position: 20,
    },

    {
        name: "General Conditions",
        position: 21,
    },
    {
        name: "Profit & Overhead",
        position: 22,
    },
    {
        name: "Tax",
        position: 23,
    },
];

const categoryOrderObj: any = {
    "Kitchen & Bath Finishes": 0,
    Plumbing: 1,
    Appliances: 2,
    "Bath Accessories": 3,
    Hardware: 4,
    Lighting: 5,
    Electric: 6,
    Flooring: 7,
    Paint: 8,
    Blinds: 9,
    HVAC: 10,
    "Repair and Make Ready": 11,
    "FF&E": 12,
    Landscaping: 13,
    "Wall Finishes": 14,
    "Bath Hardware": 15,
    "Doors and Millwork": 16,
    "Exterior Finishes": 17,
    "Exterior Stairs": 18,
    Roofing: 19,
    Windows: 20,
    "General Conditions": 21,
    "Profit & Overhead": 22,
    Tax: 23,
};

export { categorySortingOrder, categoryOrderObj };
export interface IPriceEntryTableItems {
    categoryName?: string;
    fpIndex?: number;
    propBidRequestItem?: any[];
    propBidResponseItem?: any[];
    showNavigation?: boolean;
    showExportToExcel?: boolean;
    showStatusBar?: boolean;
    wrapWithAccordion?: boolean;
    displayPricingTable?: boolean;
    disableSnackbar?: boolean;
    costsColumnWidth?: string;
}
