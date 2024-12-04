import { Column } from "./interface";

export const scraperText = {
    scraperTitle: "Scraper",
    newJobText: "New Job",
    scraperJobsText: "Scraper Jobs",
    uploadFileText: "Upload File",
    DATE_FORMAT: "DD/MM/YYYY hh:mm a",
};

export const columns: readonly Column[] = [
    { id: "name", label: "Name", minWidth: "8rem", align: "left" },
    { id: "ownership", label: "Ownership", align: "left" },
    {
        id: "uploaded by",
        label: "Uploaded By",
        format: (value: number) => value.toLocaleString("en-US"),
        align: "left",
    },
    {
        id: "date",
        label: "Date",
        format: (value: number) => value.toLocaleString("en-US"),
        align: "left",
    },
    {
        id: "description",
        label: "Description",
        minWidth: "28rem",
        format: (value: number) => value.toFixed(2),
        align: "left",
    },
    {
        id: "file name",
        label: "File Name",
        format: (value: number) => value.toFixed(2),
        align: "left",
    },
    {
        id: "status",
        label: "Status",
        format: (value: number) => value.toFixed(2),
        align: "left",
    },
];

export const jobStatuses = ["progress", "completed"];

export const emptyJobList = {
    noScrapeJobsText: "No scrape jobs.",
    createScrapeJobText: "Create a scrape job.",
};

export const fileUpload = {
    inProgressText: "File upload in progress.",
    uploadedJobText:
        "Thanks for uploading the job. The job will take some time to run, we will notify you once the job is done.",
    textFieldLabels: {
        name: "Name *",
        ownership: "Ownership Group Name *",
        description: "Description",
    },
    actionsText: {
        cancel: "Cancel",
        submit: "Submit",
    },
};

export const tablePagination = {
    Next: "Next",
    First: "1",
    Previous: "Previous",
    RowsPerPage: "Rows per page:",
};

export const ButtonLabels = {
    CLOSE: "Close",
    SEARCH_ITEMS: "Search Items",
    SAVE: "Save",
    EXPORT_AS_PACKAGE: "Export as Package",
    DELETE: "Delete",
    ACTIONS: ["Cancel", "Assign"],
};

export const dummy_data = `| LIGHTING | COMMON PRICE PAID | PHOTO | SKU/ITEM NUMBER | DESCRIPTION | VENDOR | RETAIL PRICE EACH | |:--------------------------------|:--------------------|:--------|:------------------|:-----------------------------------------------------------------------|:---------------|:--------------------| | SMALL CEILING FIXTURE | | | X9006-BNK-LED | CRAFTMADE LED FLUSHMOUNT 6" WIDE LED FLUSH MOUNT CEILING FIXTURE - 10W | BUILD.COM | 12.72 | | DINING FIXTURE | | | 3660124 | DESIGN HOUSE TESS 13.38" SATIN NICKEL LED FLUSH MOUNT LIGHT | LOWES | 37.51 | | LARGE CEILING FIXTURE (KITCHEN) | 80 | | 1345590 | DESIGN HOUSE OWENS 32" BR. NICKEL LED FLUSH MOUNT LIGHT | LOWES | 133.48 | | CEILING FAN | 116 | | 2366509 | HUNTER AVIA LED BRUSHED NICKEL 48" FLUSH MOUNT CEILING FAN | LOWES | 149.99 | | VANITY LIGHT | 100 | | 1362634 | KICHLER AMITY 3 LIGHT NICKEL RUSTIC VANITY LIGHT | LOWES | 99.98 | | INTERIOR SCONCE | 28.5 | | 1562016 | 5" BRUSHED NICKEL WALL SCONCE | LOWES | 38 | | | | | | | | | | PLUMBING | | | | | | | | KITCHEN FAUCET | 123 | | 302480680 | SINGLE HANDLE PULL DOWN PRAYER STANDARD KITCHEN FAUCET - BR. NICKEL | HOME DEPOT | 69.99 | | VANITY FAUCET (DROP IN SINK) | 38 | | HD67730W-6104 | DORSET 4" HIGH ARC BATHROOM FAUCET - BRUSHED NICKEL | HOME DEPOT | 40.5 | | VANITY FAUCET (UNDERMOUNT SINK) | 38 | | 3767786 | BR. NICKEL 1 HANDLE SINGLE HOLE FAUCET W DECK PLATE | LOWES | 48.08 | | | | | | | | | | HARDWARE | | | | | | | | CABINET PULLS | 2 | | HARDWARE | COLORADO COLLECTION - SATIN NICKEL | REPUBLIC ELITE | | | BATH HOOK | 10 | | 232032 | LATITUDE II SINGLE ROBE HOOK - SATIN NICKEL | LOWES | 11.5 | | TOILET PAPER HOLDER | 10 | | 321478 | GATCO LATITUDE SATIN NICKEL TP HOLDER | LOWES | 24.98 | | | | | | | | | | INTERIOR DOOR LEVER | 10 | | 753484 | KWIKSET SIGNATURES HALIFAX SATIN NICKEL DUMMY DOOR HANDLE | LOWES | 20.98 | | | | | 644525 | ACTUAL LEVER | | | | BLACK TEMPLATE - 3.10.21 | | | | | | | |:--------------------------------|:------------------|:------|:----------------|:---------------------------------------------------------------|:---------------|:------------------| | | | | | | | | | LIGHTING | COMMON PRICE PAID | PHOTO | SKU/ITEM NUMBER | DESCRIPTION | VENDOR | RETAIL PRICE EACH | | SMALL CEILING FIXTURE | | | X9006-FB-LED | CRAFTMADE LED FLUSHMOUNT 6" WIDE LED 10W | BUILD.COM | 13.98 | | DINING FIXTURE | | | 313392927 | FLAXMERE 11.8" MATTE BLACK LED FLUSH MOUNT CEILING LIGHT | LOWES | 34.97 | | LARGE CEILING FIXTURE (KITCHEN) | 80 | | 3768237 | DESIGN HOUSE OWENS INTEGRATED LED CEILING LIGHT IN MATTE BLACK | LOWES | 184.21 | | CEILING FAN | 116 | | 1461049 | HUNTER PORT HAVEN MATTE BLACK 44" LED CEILING FAN | LOWES | 129.98 | | VANITY LIGHT | 100 | | 2582003 | KICHLER AMITY 3 LIGHT BLACK VANITY LIGHT | LOWES | 99.98 | | INTERIOR SCONCE | 28.5 | | 314126897 | AERO 1 LIGHT BLACK ADA WALL SCONCE | HOME DEPOT | 54.9 | | | | | | | | | | PLUMBING | | | | | | | | KITCHEN FAUCET | 123 | | 313628065 | SYDNEY SINGLE HANDLE PULL DOWN KITCHEN FAUCET IN MATTE BLACK | HOME DEPOT | 99.99 | | VANITY FAUCET (DROP IN SINK) | 38 | | 1102763 | ALLEN AND ROTH HARLOW MATTE BLACK BATHROOM SINK FAUCET | LOWES | 69 | | VANITY FAUCET (UNDERMOUNT SINK) | 38 | | 1984424 | CLIHOME MATTE BLACK 1 HANDLE SINGLE HOLE BATHROOM FAUCET | LOWES | 53.99 | | | | | | | | | | HARDWARE | | | | | | | | CABINET PULLS | 2 | | HARDWARE | COLORADO COLLECTION - MATTE BLACK | REPUBLIC ELITE | | | BATH HOOK | 10 | | 4245MX | LATITUDE II SINGLE HOOK IN MATTE BLACK | HOME DEPOT | 12.89 | | TOILET PAPER HOLDER | 10 | | 720046 | GATCO LATITUDE BLACK SURFACE MOUNT TP HOLDER | LOWES | 17.31 | | | | | | | | | | INTERIOR DOOR LEVER | 10 | | 804670 | KWIKSET HALIFAX IRON BLACK UNIVERSAL DUMMY DOOR HANDLE | LOWES | 17.97 | | | | | 804702 | ACTUAL LEVER | | | | GOLD TEMPLATE - 3.10.10 | | | | | | | |:------------------------------------------|:------------------|:------|:----------------|:-----------------------------------------------------------------------|:---------------|:------------------| | | | | | | | | | LIGHTING | COMMON PRICE PAID | PHOTO | SKU/ITEM NUMBER | DESCRIPTION | VENDOR | RETAIL PRICE EACH | | SMALL CEILING FIXTURE | | | W004276574 | KAMELYA 1 LIGHT 8.27" LED FLUSH MOUNT | WAYFAIR | 68.99 | | SMALL CEILING FIXTURE (DINING) - OPTION 1 | | | DBYH2602 | BYRNEDALE 1 LIGHT LED FLUSH MOUNT - 11"W - GOLD | WAYFAIR | 63.89 | | SMALL CEILING FIXTURE (DINING) - OPTION 2 | | | 315283674 | 10" 1 LIGHT MODERN GOLD FLUSH MOUNT | HOME DEPOT | 39.9 | | LARGE CEILING FIXTURE (KITCHEN) | 80 | | DBYH2602 | BYRNEDALE 1 LIGHT LED FLUSH MOUNT - 16.75"W - GOLD | WAYFAIR | 119.26 | | CEILING FAN | 116 | | W003064646 | 52" SATSUMA 5 BLADE CEILING FAN - SATIN BRASS | WAYFAIR | 146.99 | | VANITY LIGHT | 100 | | 2329467 | NEW WORLD DÉCOR PURSUIT GOLD VANITY LIGHT | LOWES | 120 | | INTERIOR SCONCE | 28.5 | | 2581982 | ALLEN AND ROTH VALLYMEDE 1 LIGHT GOLD SCONCE | LOWES | 39.98 | | | | | | | | | | PLUMBING | | | | | | | | KITCHEN FAUCET | 123 | | 1638786 | VIGO GRAMERCY MATTE GOLD PULL DOWN KITCHEN FAUCET | LOWES | 182.9 | | VANITY FAUCET (DROP IN SINK) | 38 | | 3210851 | CMI CASMIT MATTE GOLD BATHROOM FAUCET W DRAIN AND DECKPLATE | LOWES | 116.51 | | VANITY FAUCET (UNDERMOUNT SINK) | 38 | | 2130361 | VIGO NOMA MATTE GOLD 1HANDLE SINGLE HOLE BATHROOM SINK FAUCET | LOWES | 118.9 | | | | | | | | | | HARDWARE | | | | | | | | CABINET PULLS | 2 | | HARDWARE | COLORADO COLLECTION - ROSE GOLD (LOOKS LIKE SATIN GOLD) | REPUBLIC ELITE | | | BATH HOOK | 10 | | 353RH-BBZ | DIA WALL MOUNT ROBE HOOK - BRUSHED BRONZE | HOME DEPOT | 16.63 | | TOILET PAPER HOLDER | 10 | | 2130343 | GATCO LATITUDE BRUSHED BRONZE SINGLE POST TP HOLDER | LOWES | 21.98 | | | | | | | | | | TOILET PAPER HOLDER | | | 1164715 | SCHLAGE FC172 LAT/COL CUSTOM LATITUDE COLLINS SATIN BRASS UNIV. HANDLE | LOWES | 44.99 | | CHROME TEMPLATE - 3.10.10 | | | | | | | |:--------------------------------|:------------------|:------|:----------------|:-----------------------------------------------------------------------|:-----------|:------------------| | | | | | | | | | LIGHTING | COMMON PRICE PAID | PHOTO | SKU/ITEM NUMBER | DESCRIPTION | VENDOR | RETAIL PRICE EACH | | SMALL CEILING FIXTURE | | | 301390706 | CHROME INDOOR/OUTDOOR LED FLUSH MOUNT | HOME DEPOT | 15.95 | | DINING FIXTURE | | | IYG8011L-2/CR | 13" CHROME LED FLUSH MOUNT | HOME DEPOT | 39.97 | | LARGE CEILING FIXTURE (KITCHEN) | 80 | | FM43315-CH | KUZCO LIGHTING BROOK 15" WIDE LED FLUSH MOUNT CEILING FIXTURE | BUILD.COM | 88.2 | | CEILING FAN | 116 | | 311324039 | STILLMORE 52" INTEGRATED LED CHROME CEILING FAN W LIGHT KIT | HOME DEPOT | 129 | | VANITY LIGHT | 100 | | 63438B | HANSEN 3 LIGHT CHROME WALL FIXTURE | HOME DEPOT | 58.65 | | INTERIOR SCONCE | 28.5 | | 1107391 | WESTMORE CAMERON CHROME WALL SCONCE | LOWES | 38.67 | | | | | | | | | | PLUMBING | | | | | | | | KITCHEN FAUCET | 123 | | RF421007 | SINGLE HANDLE PULL DOWN CHROME KITCHEN FAUCET | HOME DEPOT | 69.99 | | VANITY FAUCET (DROP IN SINK) | 38 | | HD67730W-6B01 | DORSET 4" CENTERSET BATHROOM FAUCET - CHROME | LOWES | 49 | | VANITY FAUCET (UNDERMOUNT SINK) | 38 | | 1147768 | VIGO NOMA CHROME 1 HANDLE SINGLE HOLE BATHROOM SINK FAUCET | LOWES | 79.9 | | | | | | | | | | HARDWARE | | | | | | | | CABINET PULLS | 2 | | MCPPZ005PC | MISENO 5" CTC HANDLE STYLE CABINET PULL - CHROME | BUILD.COM | 5.41 | | BATH HOOK | 10 | | 2022745067 | LATITIUDE II SINGLE ROBE - CHROME | HOME DEPOT | 11.06 | | TOILET PAPER HOLDER | 10 | | 959132 | GATCO LATITUDE 2 CHROME TP HOLDER | LOWES | 15.41 | | | | | | | | | | INTERIOR DOOR LEVER | 10 | | 753482 | KWIKSET SIGNATURES HALIFAX POLISHED CHROME UNIVERSAL DUMMY DOOR HANDLE | LOWES | 17.98 | | | | | 644526 | ACTUAL LEVER | | | | ONLY OPTION | W004428775 | |:--------------------|:------------------------------------------------------------------------------------| | WAYFAIR | ELAHANA 14.25" INTEGRATED LED OUTDOOR ARMED SCONCE | | | DESIGN TO GIVE DIRECTION ON FINISH WHEN EXTERIOR PAINT IS COMPLETE AT EACH PROPERTY | | | | | WAYFAIR REP | | | REGGIE GIESEN | | | 857-306-0755 | | | RGIESEN@WAYFAIR.COM | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | PHOTO | SKU | BRAND | |:-------------|:--------|:------------|:---------------| | REFRIGERATOR | | AART318FFDB | FERGUSON-AMANA | | RANGE | | AACR4303MFB | FERGUSON-AMANA | | RANGE HOOD | | | | | DISHWASHER | | AADB1400AGB | FERGUSON-AMANA | | MICROWAVE | | AAMV2307PFB | FERGUSON-AMANA | | | PHOTO | SKU | BRAND | |:-------------|:--------|:------------|:---------------| | REFRIGERATOR | | AART318FFDS | FERGUSON-AMANA | | RANGE | | AACR4303MFS | FERGUSON-AMANA | | RANGE HOOD | | | | | DISHWASHER | | AADB1700AGS | FERGUSON-AMANA | | MICROWAVE | | AAMV2307PFS | FERGUSON-AMANA |`;

export const editFieldConstants = {
    DELETE: "Delete",
    EDIT: "Edit",
    OPEN_URL: "Open Url",
    HELPER_TEXT: "Valid URL's start with http:// (or) https://",
};

export const textHighlighterConstants = {
    DATA: "Data",
    MODEL_NUMBER: "Model Number",
    ITEMS_FOUND: " Item(s) Found",
    ADD_NEW_ITEMS: "Add New Items",
    ADD_MODEL_URL: "Add Model or URL",
    CLICK_TO_ADD_TO_MODAL: "Click to add to Model",
};
