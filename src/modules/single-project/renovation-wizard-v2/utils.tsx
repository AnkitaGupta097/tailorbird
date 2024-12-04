import { graphQLClient } from "utils/gql-client";
import { GET_PACKAGE_BY_ID, GET_PROJECT_BASE_PACKAGE } from "./constants";

export const fetchBasePackage = async (projectId: string) => {
    const response = await graphQLClient.query("getBasePackage", GET_PROJECT_BASE_PACKAGE, {
        input: { project_id: projectId },
    });
    return response.getBasePackage;
};

export const fetchPackageContents = async (packageId: string) => {
    const response = await graphQLClient.query("getPackage", GET_PACKAGE_BY_ID, {
        input: packageId,
    });
    return response.getPackage;
};
