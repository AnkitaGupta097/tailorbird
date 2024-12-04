import React from "react";
import { IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PreviewModal = ({ mediaFile, onClose }: any) => {
    const isImageFile = /\.(jpg|jpeg|png|gif)$/i.test(mediaFile?.file_name);

    return (
        <Modal open={true} onClose={onClose}>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    boxShadow: "none",
                    borderRadius: "8px",
                    maxWidth: "800px",
                    width: "100%",
                    height: "auto",
                    outline: "none",
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[900],
                        zIndex: 10,
                        background: "#fff",
                        "&:hover": {
                            background: "radial-gradient(circle, transparent 20%, #008080 20%)",
                            backgroundSize: "300%",
                            backgroundPosition: "center",
                            transition: "background 0.8s",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <div
                    style={{
                        minHeight: "150px",
                        padding: 0,
                        background: "transparent",
                        borderRadius: "8px",
                    }}
                >
                    {mediaFile.isBestPracticeVideo ? (
                        <div style={{ maxWidth: "100%" }}>
                            <div
                                style={{
                                    position: "relative",
                                    paddingBottom: "56.25%",
                                    height: 0,
                                    overflow: "hidden",
                                }}
                            >
                                <iframe
                                    src={
                                        "https://tailorbirdhomescom.sharepoint.com/sites/tailorbirdhomes-corporate/_layouts/15/embed.aspx?UniqueId=3424a977-8d39-4ae7-9803-b07f962ee625&embed=%7B%22af%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create"
                                    }
                                    width="100%"
                                    allowFullScreen
                                    title="TB-Video Capture.mp4"
                                    style={{
                                        border: "none",
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        height: "100%",
                                        maxWidth: "100%",
                                    }}
                                ></iframe>
                            </div>
                        </div>
                    ) : isImageFile ? (
                        <img
                            src={mediaFile?.previewLink}
                            alt="preview"
                            style={{ width: "100%" }}
                            className="missingimg"
                        />
                    ) : (
                        <video autoPlay controls style={{ width: "100%" }} className="missingvideo">
                            <source src={mediaFile?.previewLink} type="video/mp4" />
                            <track
                                kind="captions"
                                src="captions.vtt"
                                srcLang="en"
                                label="English"
                                default
                            />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PreviewModal;
