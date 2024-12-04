/* eslint-disable no-unused-vars */
import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Color } from "three";
import { promiseHooks } from "v8";
declare global {
    interface Window {
        Autodesk: any; // You can use a specific type if you have one
    }
}
const ForgeViewerExterior = ({ interUnitInfo, proKey }: any) => {
    console.log({ interUnitInfo: interUnitInfo });
    const viewerContainer = useRef(null);
    const viewerRef = useRef(null);
    async function initViewer(container: any, accessToken_promise: Promise<any>) {
        const [accessToken] = await Promise.all([accessToken_promise]);
        return new Promise(function (resolve, reject) {
            window.Autodesk.Viewing.Initializer({ accessToken }, function () {
                const config = {
                    extensions: ["Autodesk.DocumentBrowser"],
                };
                const viewer = new window.Autodesk.Viewing.GuiViewer3D(container, config);
                console.log("viewer", viewer);
                viewer.start();
                viewer.setTheme("light-theme");
                resolve(viewer);
                viewerRef.current = viewer;
                // loadModel(viewer, interUnitInfo.urn);
                loadModel(viewer, interUnitInfo.urn, interUnitInfo.view_type);
            });
        });
    }

    function loadModel(viewer: any, urn: any, viewType: any) {
        console.log("viewType", viewType);

        return new Promise(function (resolve, reject) {
            function onDocumentLoadSuccess(doc: any) {
                const manifest = doc.getRoot().search({ type: "geometry" });
                console.log("manifest", manifest);
                let viewBubble = manifest.find(function (bubble: any) {
                    console.log("bubble", bubble.data);
                    return bubble.data.name.includes(viewType);
                });

                console.log("viewBubble", viewBubble);

                if (viewBubble) {
                    resolve(viewer.loadDocumentNode(doc, viewBubble));
                }

                viewer.setLightPreset(4);
                viewer.setContextMenu(null);
                viewer.addEventListener(window.Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function () {
                    viewer.toolbar.getControl("settingsTools").setVisible(false);
                    viewer.toolbar.getControl("navTools").setVisible(false);
                    viewer.toolbar.getControl("modelTools").setVisible(false);
                    viewer.set2dSelectionColor(new Color("rgb(0, 77, 113)"), 0.4);
                });

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
            console.log("urnn", urn);

            window.Autodesk.Viewing.Document.load(
                `urn:${urn}`,
                onDocumentLoadSuccess,
                onDocumentLoadFailure,
            );
        });
    }
    useEffect(() => {
        if (window.Autodesk && window.Autodesk.Viewing) {
            console.log("view updated", interUnitInfo);

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

            const previewExteriordiv = document.getElementById("previewExterior");
            initViewer(previewExteriordiv, options.getAccessToken());
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

    return <Box id={"previewExterior"} ref={viewerContainer} key={proKey} />;
};

export default ForgeViewerExterior;
