import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

export const GET_ALL_USER = gql`
    query getUsers {
        getAllUsers {
            id
            email
            name
            organizationId
        }
    }
`;
const useScheduler = () => {
    const { loading, error, data } = useQuery(GET_ALL_USER, {
        variables: { trackId: "trackId" },
    });
    useEffect(() => {
        console.log(loading, error, data);
    });

    return [loading, error, data];
};

export default useScheduler;
