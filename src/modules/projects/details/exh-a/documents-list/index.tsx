import React, { useCallback, useEffect, useState } from "react";

import {
    Box,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import ArchiveIcon from "@mui/icons-material/ArchiveOutlined";
import { getFileIcon } from "../helper";
import { makeStyles } from "@mui/styles";
import { graphQLClient } from "utils/gql-client";
import { GET_EXH_A_DOCUMENTS } from "../exh-a.graphql";
import { IDocument } from "../types";
import BaseLoader from "components/base-loading";
import moment from "moment-timezone";
import { useAppSelector } from "stores/hooks";
import { useMutation } from "@apollo/client";
import { DELETE_FILE, GET_PROJECT_FILE } from "components/production/constants";
import { downloadFile } from "stores/single-project/operation";
const useStyles = makeStyles(() => ({
    listItem: {
        transition: "background-color 0.3s ease",
        "&:hover": {
            background: "#CDE8F5",
        },
    },
    listItemSecondaryAction: {
        visibility: "hidden",
        "&:hover": {
            visibility: "inherit",
        },
    },
}));
export default function DocumentsList({ projectId }: { projectId: string }) {
    const classes = useStyles();
    const [loading, setLoading] = useState<boolean>(false);
    const [hoveredListItemIndex, setHoveredListItemIndex] = useState<string>("");
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [isDownloadingDocument, setIsDownloadingDocument] = useState<boolean>(false);
    const [deleteProjectFile] = useMutation(DELETE_FILE);
    const user_id = localStorage.getItem("user_id");

    const { allUsers } = useAppSelector((state) => {
        return {
            allUsers: state.tpsm.all_User.users,
        };
    });
    const getUploaderName = (userId: any) => {
        return allUsers.find((item: any) => item.id == userId)?.name || "NA";
    };
    const getExhADocuments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await graphQLClient.query("GetExhADocuments", GET_EXH_A_DOCUMENTS, {
                projectId,
            });
            setDocuments(res.getExhADocument);
        } catch (error) {
            console.error(`getExhADocument failed with ${error}`);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            getExhADocuments();
        }
    }, [getExhADocuments, projectId]);

    const handleListItemMouseover = (value: string) => {
        setHoveredListItemIndex(value);
    };
    const handleListItemMouseout = (value: string) => {
        if (hoveredListItemIndex === value) {
            setHoveredListItemIndex("");
        }
    };
    const handleDownloadFile = async (document: IDocument) => {
        setIsDownloadingDocument(true);
        const res = await graphQLClient.query("getProjectFile", GET_PROJECT_FILE, {
            fileId: Number(document.id),
        });
        await downloadFile(res.getProjectFile.download_link, res.getProjectFile.file_name);
        setIsDownloadingDocument(false);
    };
    const onArchive = (documentId: string) => {
        if (documentId) {
            setLoading(true);
            deleteProjectFile({
                variables: {
                    input: {
                        file_id: Number(documentId),
                        user_id,
                    },
                },
            })
                .then(() => getExhADocuments())
                .finally(() => setLoading(false));
        }
    };
    if (loading || !documents || isDownloadingDocument) {
        return <BaseLoader />;
    }
    return (
        <Box px={"3rem"} py={"1.5rem"}>
            {Boolean(documents.length) &&
                documents.map((document) => {
                    const secondaryActionClassName =
                        hoveredListItemIndex !== document.id
                            ? classes.listItemSecondaryAction
                            : null;
                    return (
                        <ListItem
                            className={classes.listItem}
                            onMouseOver={() => handleListItemMouseover(document.id)}
                            onMouseOut={() => handleListItemMouseout(document.id)}
                            key={document.id}
                            sx={{
                                marginBottom: "8px",
                                border: "1px solid #C9CCCF",
                                borderRadius: "8px",
                                padding: "0.75rem",
                                cursor: "pointer",
                            }}
                        >
                            <ListItemAvatar>{getFileIcon(document.file_name)}</ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="text_12_medium"
                                        color={"#232323"}
                                        sx={{ lineHeight: "16px" }}
                                    >
                                        {document.file_name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        variant="text_12_regular"
                                        color={"#757575"}
                                        sx={{ lineHeight: "16px" }}
                                    >
                                        {`${moment(document.created_at).format(
                                            "l [at] LT",
                                        )}  by ${getUploaderName(document.created_by)}`}
                                    </Typography>
                                }
                                sx={{ display: "flex", flexDirection: "column" }}
                            />
                            <ListItemSecondaryAction
                                sx={{ display: "flex", gap: "8px" }}
                                className={secondaryActionClassName as string}
                            >
                                <Button
                                    onClick={() => {
                                        handleDownloadFile(document);
                                    }}
                                    variant="contained"
                                >
                                    Download{" "}
                                    <FileDownloadIcon
                                        sx={{ fontSize: "16px", marginLeft: "4px" }}
                                    />
                                </Button>
                                <Button
                                    onClick={() => {
                                        onArchive(document.id);
                                    }}
                                    variant="outlined"
                                >
                                    Archive
                                    <ArchiveIcon sx={{ fontSize: "16px", marginLeft: "4px" }} />
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
        </Box>
    );
}
