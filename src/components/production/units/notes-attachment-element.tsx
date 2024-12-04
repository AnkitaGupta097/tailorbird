import React, { useEffect, useState } from "react";

import { Grid, Typography } from "@mui/material";
import FileUploadStatus from "./file-upload-status";
import Loader from "modules/admin-portal/common/loader";
import { graphQLClient } from "utils/gql-client";
import { GET_PROJECT_FILE } from "../constants";

interface INotesAttachmentElement {
    remark: string;
    fileIds: Array<string>;
    show?: boolean;
    projectName: string;
}

const NotesAttachmentElement = ({
    remark,
    fileIds,
    show,
    projectName,
}: INotesAttachmentElement) => {
    const [queryLoading, setLoading] = useState(false);
    const [files, setFiles] = useState<Array<any>>([]);

    const fetchAllFiles = () => {
        setLoading(true);
        const promises = fileIds?.map((fileId) =>
            graphQLClient.query("GetProjectFile", GET_PROJECT_FILE, {
                fileId,
            }),
        );

        Promise.allSettled(promises)
            .then((results) => {
                const allFiles = results
                    ?.filter((r: any) => r.status === "fulfilled")
                    .map((response: any) => {
                        return { uploadedFileDetail: { ...response?.value?.getProjectFile } };
                    });
                setFiles(allFiles);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAllFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid
            container
            flexDirection="column"
            gap={2}
            style={{ display: show ? "flex" : "none" }}
            paddingTop={2}
        >
            {queryLoading ? (
                <Loader />
            ) : (
                <>
                    <Grid item>
                        <Typography variant="text_14_regular" color="black">
                            {remark}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <FileUploadStatus
                            projectName={projectName}
                            files={files}
                            readOnly
                            showBorder
                            showDivider={false}
                            containerStyle={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default NotesAttachmentElement;
