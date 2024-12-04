/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { ForgeViewer } from "@lagarsoft/forge-viewer-react";
declare const Autodesk: any;

const useLoadForgeViewer = (interUnitInfo: any) => {
    useEffect(() => {
        const clientId = "0AfNDu5GvNWZcRCLnzE9R8L7aAYLr4ie";
        const clientSecret = "412RKsiXQV7fCZGq";
        const authUrl = "https://developer.api.autodesk.com/authentication/v1/authenticate";

        const options = {
            env: "AutodeskProduction",
            api: "derivativeV2",
            getAccessToken: async () => {
                const response = await fetch(authUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        client_id: clientId,
                        client_secret: clientSecret,
                        grant_type: "client_credentials",
                        scope: "data:read",
                    }),
                });
                const data = await response.json();
                return data.access_token;
            },
        };

        Autodesk.Viewing.Initializer(options, () => {
            const viewerDiv = document.getElementById("forgeViewer");
            const viewer = new Autodesk.Viewing.GuiViewer3D(viewerDiv);
            viewer.start();
            // Add event listeners to capture errors
            viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (event: any) => {
                // Model geometry has loaded
                console.log("EventListener Model geometry loaded successfully.");
            });

            viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, (event: any) => {
                // Object tree has been created
                console.log("EventListener Object tree created successfully.");
            });

            viewer.addEventListener(
                Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT,
                (event: any) => {
                    // Object tree is unavailable
                    console.error("EventListener Object tree is unavailable.");
                },
            );

            viewer.addEventListener(Autodesk.Viewing.ERROR_EVENT, (event: any) => {
                // Handle loading errors
                console.error("EventListener Error loading model:", event);
            });

            viewer.loadModel(
                "your_model_urn_or_path",
                {},
                (model: any) => {
                    // Model loaded successfully
                },
                (errorCode: string) => {
                    console.error(`Error during model loading: ${errorCode}`);
                },
            );
        });
    }, [interUnitInfo]);
};

const ForgeViewerDockingPanel = (props: any) => {
    useLoadForgeViewer(props.interUnitInfo);

    return (
        <div
            id="forgeViewer"
            style={{
                width: "100%",
                maxHeight: "100vh",
                display: "grid",
                gridTemplateColumns: "1fr",
            }}
        >
            <ForgeViewer urn={props.interUnitInfo.id} accessToken={props.token} />
        </div>
    );
};

export default ForgeViewerDockingPanel;
