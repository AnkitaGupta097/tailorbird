import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import { DialogContent, Dialog, Button, CircularProgress } from "@mui/material";
import {
    CONTAINER_COMMON_CATEGORIES,
    SAVE_CONTAINER_COMMON_ITEM,
    SAVE_CONTAINER_ITEM,
} from "./constants";
import { IUser } from "stores/ims/interfaces";
import TrackerUtil from "utils/tracker";

interface IScopeObject {
    scope: string;
    work_type: string;
}

interface IUom {
    uom: string;
    formula: any;
}
interface IContainer {
    category: string;
    component: string;
    item_name: string;
    scopes: IScopeObject[];
    project_support: string[];
    uoms: IUom[];
    is_active: boolean;
}

interface IContainerAdminModalProps {
    open: boolean;
    onClose: Function;
    onSave: Function;
    bulkUploadJSON: Array<IContainer> | null;
}

const BulkUploadModal: React.FC<IContainerAdminModalProps> = ({
    open,
    onClose,
    onSave,
    bulkUploadJSON,
}) => {
    const [inProgress, setInProgress] = useState(true);
    const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");
    const runBulkUpload = async () => {
        setInProgress(true);
        const promises = bulkUploadJSON?.map((s) => {
            if (CONTAINER_COMMON_CATEGORIES.includes(s.category)) {
                return graphQLClient.mutate("", SAVE_CONTAINER_COMMON_ITEM, {
                    input: {
                        category: s.category.trim(),
                        scope: s.item_name.trim(),
                        is_active: s.is_active,
                        user: email,
                    },
                });
            } else {
                return graphQLClient.mutate("upsertContainerItemV2", SAVE_CONTAINER_ITEM, {
                    input: {
                        category: s.category.trim(),
                        component: s?.component?.trim() ?? null,
                        item_name: s.item_name.trim(),
                        project_support: s.project_support,
                        scopes: s.scopes,
                        uoms: s.uoms,
                        is_active: s.is_active,
                        user: email,
                    },
                });
            }
        }) as Array<Promise<any>>;
        const response = await Promise.allSettled(promises);
        TrackerUtil.event("CONTAINER_V2_ADMIN_BULK_UPLOAD", {
            email,
            item_count: bulkUploadJSON?.length,
        });
        console.log({ response });
        setInProgress(false);
    };
    useEffect(() => {
        if (Array.isArray(bulkUploadJSON)) {
            runBulkUpload();
        }
        // eslint-disable-next-line
    }, [bulkUploadJSON]);
    return (
        <Dialog
            open={open}
            onClose={() => {
                if (!inProgress) {
                    onClose?.();
                }
            }}
        >
            <DialogContent>
                {inProgress ? (
                    <>
                        <p>Please wait, uploading container items</p>
                        <CircularProgress />
                    </>
                ) : (
                    <>
                        <p>Successfully uploaded container items</p>
                        <Button
                            onClick={() => {
                                onSave();
                            }}
                        >
                            Done
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BulkUploadModal;
