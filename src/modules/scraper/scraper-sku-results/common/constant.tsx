export const columns = [
    { name: "product_thumbnail_url", label: "Image" },
    { name: "model_number", label: "Model No." },
    { name: "category", label: "Category", isAutoComplete: true },
    { name: "subcategory", label: "Subcategory", isAutoComplete: true },
    { name: "manufacturer_name", label: "Manuf" },
    { name: "supplier", label: "Supplier" },
    { name: "item_number", label: "Item No." },
    { name: "style", label: "Style", isAutoComplete: true },
    { name: "finish", label: "Finish", isAutoComplete: true },
    { name: "grade", label: "Grade", isAutoComplete: true },
    { name: "price", label: "Price" },
    { name: "description", label: "Description" },
    { name: "url", label: "URL" },
];

export const LOADER = {
    FETCHING_MESSAGE: "Fetching job status...",
    WAITING_MESSAGE:
        "In the meantime you can wait for it or you can carry on you other work, When it's finished we will notify you",
    SERVER_MESSAGE: "Getting scrape results from server...",
    SUCCESS_MESSAGE: "Your data is successfully scraped",
    HEADING: "Your data is being scraped. It will take some time.",
};

export const SINGLE_SCRAPED_RESULTS = {
    RESULT_FOUND: "Result Found",
    PLACEHOLDER: "N/A",
    DESCRIPTION: "Description",
    URL: "url:",
};

export const SCRAPED_SKUS_RESULTS = {
    ALERT: "Please set subcategories for",
    ITEMS: "items",
    GO_TO_HOME: "Go to Scraper",
    FILTERS: ["Not found", "Incomplete"],
};

export const SCRAPER_SKU_GROUPS = {
    ALL: "Select/Deselect All",
};

export const CREATE_NEW_CATEGORY = {
    YES: "Yes",
    NO: "No",
    CATEGORY_ADDED: "successfully Added",
    ARE_YOU_SURE: "Are you sure that you want to create a new",
    FAILED: "Failed to Add",
};

export const SCRAPED_STAGE = {
    COMPLETED: "Scraping complete",
    SCRAPED: "Scraped",
    ERROR: "Error",
    TOTAL: "Total",
};
