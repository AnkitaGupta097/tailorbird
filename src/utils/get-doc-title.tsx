import store from "stores";

const GetDocTitle = (currentPage: any) => {
    let storeData = store.getState();
    let projectName = storeData?.projectDetails?.data?.name || "Project";
    switch (currentPage) {
        case "tb_projects_active":
            return "Tailorbird | Active Projects";

        case "tb_projects_archive":
            return "Tailorbird | Archived Projects";

        case "tb_projects_overview":
            return `Tailorbird | ${projectName} - Overview`;

        case "tb_projects_floorplans":
            return `Tailorbird | ${projectName} - Floor Plans`;

        case "tb_projects_budgeting":
            return `Tailorbird | ${projectName} - Budget Manager`;

        case "tb_scopes":
            return "Tailorbird | Scopes";

        case "tb_packages":
            return "Tailorbird | Packages";

        case "tb_scrapper":
            return "Tailorbird | Scrapper";

        default:
            return "Tailorbird";
    }
};
export { GetDocTitle };
