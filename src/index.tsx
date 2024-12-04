import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
    NextLink,
    Operation,
} from "@apollo/client";
import { Provider } from "react-redux";
import store from "./stores";
import { Auth0Provider } from "@auth0/auth0-react";
import FeatureFlag from "components/feature-flag";
import TrackerUtil from "utils/tracker";

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

const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        addTypename: true,
    }),
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
if (
    process.env.REACT_APP_AUTH0_DOMAIN !== undefined &&
    process.env.REACT_APP_AUTH0_CLIENT_ID !== undefined
) {
    root.render(
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
            redirectUri={process.env.REACT_APP_AUTH0_REDIRECT_URL}
            audience={process.env.REACT_APP_AUTH0_API_AUDIENCE}
            scope={process.env.REACT_APP_AUTH0_SCOPE}
            cacheLocation="localstorage"
            useRefreshTokens={true}
            grant_type="refresh_token"
        >
            <ApolloProvider client={apolloClient}>
                <Provider store={store}>
                    <FeatureFlag />
                    <App />
                </Provider>
            </ApolloProvider>
        </Auth0Provider>,
    );
}
