/* eslint-disable no-unused-vars */

import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import "./forge-viewer.css";
import { FeatureFlagConstants } from "utils/constants";
import { useFeature } from "@growthbook/growthbook-react";
import { Color } from "three";
declare global {
    interface Window {
        Autodesk: any; // You can use a specific type if you have one
    }
}
const ForgeViewer = ({ interUnitInfo, prokey }: any) => {
    const viewerContainer = useRef<HTMLDivElement>(null);
    const viewerRef = useRef(null);
    const isForgeViewerModelBrowserEnabled = useFeature(
        FeatureFlagConstants.FORGE_VIEWER_MODEL_BROWSER_ENABLED,
    ).on;
    async function initViewer(container: any, accessToken_promise: Promise<any>) {
        const [accessToken] = await Promise.all([accessToken_promise]);
        return new Promise(function (resolve, reject) {
            window.Autodesk.Viewing.Initializer({ accessToken }, function () {
                const config = {
                    extensions: ["Autodesk.DocumentBrowser"],
                };
                const viewer = new window.Autodesk.Viewing.GuiViewer3D(container, config);
                viewer.start();
                viewer.setTheme("light-theme");
                viewer.setLightPreset(18);
                viewer.setContextMenu(null);
                viewer.setEnvMapBackground(false); //!<<< Turn on for  background image
                viewer.setProgressiveRendering(true);
                viewer.setDisplayEdges(false);
                resolve(viewer);
                viewerRef.current = viewer;
                // loadModel(viewer, interUnitInfo.urn);
                loadModel(viewer, interUnitInfo?.urn, interUnitInfo?.guid);

                // Create a ResizeObserver instance linked to the callback function
                const resizeObserver = new ResizeObserver(() => {
                    // Set the viewer canvas width to the container width
                    viewer.canvas.style.width = `${container.offsetWidth}px`;
                });

                // Start observing the container with the ResizeObserver
                resizeObserver.observe(container);
            });
        });
    }
    function loadModel(viewer: any, urn: any, guid: any) {
        return new Promise(function (resolve, reject) {
            function onDocumentLoadSuccess(doc: any) {
                const manifest = doc.getRoot().search({ type: "geometry" });
                console.log(manifest);
                let viewBubble = manifest.find(function (bubble: any) {
                    return bubble.data.guid === guid;
                });

                if (viewBubble) {
                    resolve(viewer.loadDocumentNode(doc, viewBubble));
                }

                viewer.addEventListener(window.Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function () {
                    viewer.toolbar
                        .getControl("settingsTools")
                        .setVisible(isForgeViewerModelBrowserEnabled);
                    viewer.toolbar.getControl("navTools").setVisible(false);
                    viewer.toolbar.getControl("modelTools").setVisible(false);
                    viewer.set2dSelectionColor(new Color("rgb(0, 77, 113)"), 0.4);
                });

                viewer.addEventListener(
                    window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                    () => {
                        viewer.setBackgroundColor(255, 255, 255, 255, 255, 255); //!<<< Change background color
                        //Load model browser -navigator with search of available items on revit data as react virtualised list
                        if (isForgeViewerModelBrowserEnabled) {
                            viewer.loadExtension("Autodesk.ModelStructure");
                            viewer.getExtension("Autodesk.ModelStructure").activate();
                        }
                    },
                    { once: true },
                );
                if (isForgeViewerModelBrowserEnabled) {
                    viewer.addEventListener(
                        window.Autodesk.Viewing.SELECTION_CHANGED_EVENT,
                        function () {
                            const myDbids = viewer.getSelection();
                            viewer.loadExtension("Autodesk.PropertiesManager");
                            viewer.getExtension("Autodesk.PropertiesManager").activate();
                        },
                    );
                }
                //Uncomment this if you want to hide de viewcube ui
                // viewer.addEventListener(
                //     window.Autodesk.Viewing.VIEWER_INITIALIZED,
                //     function(){
                //         viewer.toolbar
                //             .getControl("modelTools")
                //             .removeControl("toolbar-pdf-text-selection");
                //         viewer.getExtension("Autodesk.ViewCubeUi").setVisible(false);
                //     }
                // );
            }
            function onDocumentLoadFailure(code: any, message: any, errors: any) {
                reject({ code, message, errors });
            }
            window.Autodesk.Viewing.Document.load(
                `urn:${urn}`,
                onDocumentLoadSuccess,
                onDocumentLoadFailure,
            );
        });
    }

    useEffect(() => {
        if (window.Autodesk && window.Autodesk.Viewing) {
            const options = {
                env: "AutodeskProduction",
                api: "derivativeV2",
                getAccessToken: async () => {
                    const response = await fetch(
                        process.env.REACT_APP_FORGE_VIEWER_AUTH_URL || "",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: new URLSearchParams({
                                client_id: process.env.REACT_APP_FORGE_VIEWER_CLIENT_ID || "",
                                client_secret:
                                    process.env.REACT_APP_FORGE_VIEWER_CLIENT_SECRET || "",
                                grant_type: "client_credentials",
                                scope: "data:read",
                            }),
                        },
                    );
                    const data = await response.json();
                    return data.access_token;
                },
            };

            const previewediv = document.getElementById(`${prokey}-preview`);
            initViewer(previewediv, options.getAccessToken());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interUnitInfo]);

    useEffect(() => {
        return () => {
            if (viewerRef.current) {
                (viewerRef.current as any).finish();
            }
        };
    }, []);

    return (
        <Box
            id={`${prokey}-preview`}
            ref={viewerContainer}
            key={prokey}
            display={"flex"}
            flex={1}
            margin={"5px 24px"}
            border={"1px solid var(--v-3-colors-border-normal-subdued, #C9CCCF)"}
        />
    );
};

export default ForgeViewer;
