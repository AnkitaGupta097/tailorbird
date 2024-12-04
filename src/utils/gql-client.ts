import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
    Operation,
    NextLink,
} from "@apollo/client";
import TrackerUtil from "./tracker";

export type GraphQLClient = {
    query: any;
    mutate: any;
};

export const createGQLClient = (): GraphQLClient => {
    const cache = new InMemoryCache({
        addTypename: false,
        resultCaching: false,
    });
    const httpLink = new HttpLink({
        uri: process.env.REACT_APP_APP_APOLLO_SERVER_URL,
    });

    const authLink = new ApolloLink((operation: Operation, forward: NextLink) => {
        operation.setContext({
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });

        return forward(operation).map((result) => {
            return TrackerUtil.trackGraphQLResult(operation, result);
        });
    });

    const client = new ApolloClient({
        cache: cache,
        link: authLink.concat(httpLink),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "network-only",
            },
            mutate: {
                fetchPolicy: "no-cache",
            },
        },
    });

    // eslint-disable-next-line no-unused-vars
    const query = (name: any, query: any, variables: any) => {
        return client
            .query({
                query,
                variables,
                fetchPolicy: "network-only",
            })
            .then(({ data }) => data);
    };

    const mutate = (name: any, mutation: any, variables: any) => {
        return client
            .mutate({
                mutation,
                variables,
            })
            .then(({ data }) => {
                return data[name];
            })
            .catch((error) => {
                // Handle error here
                console.log("GraphQL mutation error", error);
                throw error;
            });
    };

    return { query, mutate };
};

export const graphQLClient = createGQLClient();
