import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
    Operation,
    NextLink,
    // split,
} from "@apollo/client";
import TrackerUtil from "utils/tracker";

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

    const query = async (name: any, query: any, variables: any) => {
        const { data } = await client.query({
            query,
            variables,
            fetchPolicy: "network-only",
        });
        return data[name];
    };

    const mutate = async (name: any, mutation: any, variables: any) => {
        const { data } = await client.mutate({
            mutation,
            variables,
        });
        return data[name];
    };

    return { query, mutate };
};

export const client = createGQLClient();

import { createClient } from "graphql-ws";

export const wsclient = createClient({
    url: process.env.REACT_APP_WS_APOLLO_SERVER_URL!,
    connectionParams: () => {
        return {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        };
    },
    on: {
        connecting: () => {
            console.log("WebSocket is connecting");
        },
        connected: () => {
            console.log("WebSocket connected");
        },
        closed: () => {
            console.log("WebSocket disconnected");
        },
        error: (error) => {
            console.error("WebSocket error", error);
        },
    },
});
