const orgRoles = [
    { name: "ADMIN", id: "1" },
    { name: "ESTIMATOR", id: "2" },
    { name: "CONTRACTOR_ADMIN", id: "3" },
];

const permissions_admin = {
    Projects: { canEdit: true },
    Scopes: { canEdit: true },
    Package: { canEdit: true },
    Scraper: { canEdit: true },
};

const permissions_contractor_admin = {
    ProjectsRfp: { canEdit: true },
    Admin: { canEdit: true },
};

const permissions_estimator = {
    ProjectsRfp: { canEdit: true },
};

export { orgRoles, permissions_admin, permissions_contractor_admin, permissions_estimator };
