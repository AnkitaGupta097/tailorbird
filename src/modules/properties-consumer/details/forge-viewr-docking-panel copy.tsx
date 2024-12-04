/* eslint-disable no-unused-vars */
import React from "react";
declare const Autodesk: any;

export interface ForgeViewerProps {
    interUnitInfo: any;
}

const ForgeViewer = ({ interUnitInfo }: ForgeViewerProps) => {
    const viewerUrl = `https://viewer.autodesk.com/7.*/viewer3D.min.js`;
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

    Autodesk.Viewing.Initializer(
        options,
        () => {
            const viewerDiv = document.getElementById("forgeViewer");
            const viewer = new Autodesk.Viewing.GuiViewer3D(viewerDiv);
            viewer.start();
            viewer.start();
            // Add event listeners to capture errors
            viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (event: any) => {
                // Model geometry has loaded
                console.log("EventListener Model geometry loaded successfully.");
            });

            viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, (event: any) => {
                // Object tree has been created
                console.log(" EventListener Object tree created successfully.");
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

            viewer.loadModel(interUnitInfo.id, {}, (model: any) => {
                // Model loaded, you can interact with it here
            });
            const iframe: any = document.createElement("iframe");
            iframe.src = viewerUrl;
            iframe.sandbox = "allow-scripts allow-same-origin";
            iframe.onload = () => {
                const viewer3D = iframe.contentWindow.Autodesk.Viewing.Private.GuiViewer3D;

                const viewer = new viewer3D(
                    iframe.contentWindow.document.getElementById("forgeViewer"),
                    options,
                );
                viewer.start();
                viewer.load(`urn:${interUnitInfo.id}`);
            };

            document.body.appendChild(iframe);

            return () => {
                document.body.removeChild(iframe);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [interUnitInfo.id],
    );

    return <div id="forgeViewer" style={{ width: "100%", height: "500px" }}></div>;
};

export default ForgeViewer;
