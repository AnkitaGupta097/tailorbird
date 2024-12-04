import { Grid, Theme, Typography } from "@mui/material";
import React, { useState } from "react";
import OwnershipDialogIcon from "../../../assets/icons/icon-user-dialog.svg";
// import actions from "stores/actions";
// import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { IOwnershipDialog } from "modules/admin-portal/common/utils/interfaces";
import CommonDialog from "modules/admin-portal/common/dialog";
import { OwnershipDialogConstants } from "modules/admin-portal/common/utils/constants";
import BaseCheckbox from "components/checkbox";
import BaseTextField from "components/text-field";
import FileUpload from "components/upload-files-new";
import { Card, CardContent, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import makeStyles from "@mui/styles/makeStyles";
import AppTheme from "styles/theme";
import { CREATE_PROJECT_FILES } from "stores/projects/file-utility/file-utility-queries";
import { useMutation } from "@apollo/client";
import mixpanel from "mixpanel-browser";
import { INIT_PRODUCTION_FROM_RFP_1 } from "../constants";
import { DELETE_FILE } from "../constants";

interface IImportFromRFPDialog extends IOwnershipDialog {
    projectId: string | undefined;
}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        padding: theme.spacing(0),
        marginBottom: theme.spacing(0),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        textAlign: "left",
    },
}));

const ItemCard = ({ text, onClick }: { text: string; onClick: () => void }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card} elevation={3}>
            <CardContent>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                    <Grid item xs={true}>
                        <div className={classes.text}>{text}</div>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={onClick}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const CheckboxWithLabel = ({
    checked,
    onClick,
    label,
}: {
    checked: boolean;
    onClick: () => void;
    label: string;
}) => {
    return (
        <Grid item sm>
            <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item>
                    <BaseCheckbox size="small" checked={checked} onClick={() => onClick()} />
                </Grid>
                <Grid item xs={true}>
                    <span style={{ flexGrow: 1 }}>{label}</span>
                </Grid>
            </Grid>
        </Grid>
    );
};

interface ImportFromRFPInput {
    projectId: string | undefined;
    contractorOrgId?: string | null;
    fpColumnsSuffix?: string | null;
    s3FilePath: string;
    loadNonRenoUnits?: boolean;
    allowSimpleTaxCategory?: boolean;
    fpIds?: string[] | null;
    unitIds?: string[] | null;
    splitByInventory?: boolean;
    fpInventorySeparator?: string;
    ignorePricingGroup?: boolean;
    allowNaLineItems?: boolean;
}

const uploadFile = (file: File, signedUrl: string) => {
    const options = {
        method: "PUT",
        body: file,
    };
    mixpanel.time_event("FILE_UPLOAD");
    return fetch(signedUrl, options).then((uploadResponse) => {
        if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        } else {
            mixpanel.track("FILE_UPLOAD", {
                fileSizeInMB: (file?.size / (1024 * 1024)).toFixed(3),
                extension: file?.name,
            });
        }
    });
};

const ImportFromRFPDialog = ({ open, onClose, projectId }: IImportFromRFPDialog) => {
    const [createProjectFiles] = useMutation(CREATE_PROJECT_FILES);
    const [initProductionFromRfp1] = useMutation(INIT_PRODUCTION_FROM_RFP_1);
    const [deleteProjectFile] = useMutation(DELETE_FILE);
    const [rfpInput, setRFPInput] = useState<ImportFromRFPInput>({
        projectId: projectId,
        contractorOrgId: "",
        fpColumnsSuffix: "",
        s3FilePath: "",
        loadNonRenoUnits: false,
        allowSimpleTaxCategory: true,
        fpIds: [],
        unitIds: [],
        splitByInventory: false,
        fpInventorySeparator: ":",
        ignorePricingGroup: false,
        allowNaLineItems: false,
    });
    const [isLoading, setLoading] = useState(false);
    const [isDataLoadSuccess, setIsDataLoadSuccess] = useState(false);
    const onSave = async () => {
        try {
            if (rfpInput.contractorOrgId == null || rfpInput.contractorOrgId.length == 0) {
                setError("Contractor Org Id cannot be empty");
            } else if (selectedFile == null) {
                setError("Please select a file");
            } else if (rfpInput.projectId == null || rfpInput.projectId.length == 0) {
                setError("Project id cannnot be empty");
            } else if (rfpInput.fpColumnsSuffix == null || rfpInput.fpColumnsSuffix.length == 0) {
                setError("fpColumnsSuffix cannot be empty");
            } else {
                setError(undefined);
                setLoading(true);
                const userID = localStorage.getItem("user_id") || "";
                const input = {
                    files: [
                        {
                            file_name: selectedFile.name,
                            file_type: "TBP_CREATION_SHEET",
                            tags: null,
                        },
                    ],
                    project_id: projectId,
                    user_id: userID,
                };
                const { data } = await createProjectFiles({ variables: { input } });
                const projectFile = data.createProjectFiles[0];
                await uploadFile(selectedFile, projectFile.signed_url);
                rfpInput.s3FilePath = projectFile.s3_file_path;
                await initProductionFromRfp1({ variables: { importFromRfpInput: rfpInput } });
                await deleteProjectFile({
                    variables: {
                        input: {
                            file_id: projectFile.id,
                            user_id: userID,
                        },
                    },
                });
                setLoading(false);
                setIsDataLoadSuccess(true);
            }
        } catch (error) {
            setError("Error occurred processing input");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [errorText, setError] = useState<String | undefined>();

    return (
        <>
            <CommonDialog
                open={open}
                onClose={onClose}
                title={"Load Project Data"}
                iconSrc={OwnershipDialogIcon}
                onSave={onSave}
                deleteText={OwnershipDialogConstants.DELETE_TEXT}
                loading={isLoading}
                saveLabel={"Load Data"}
                loaderText={"Processing..."}
                saved={isDataLoadSuccess}
                savedText={"Successfully Loaded"}
                width="40rem"
                minHeight="20rem"
            >
                <Grid container direction="column" spacing="1rem">
                    <Grid item />
                    <CheckboxWithLabel
                        onClick={() => {
                            setRFPInput((prevState) => ({
                                ...prevState,
                                loadNonRenoUnits: !prevState.loadNonRenoUnits,
                            }));
                        }}
                        checked={rfpInput.loadNonRenoUnits ?? false}
                        label="Load Non Reno Units"
                    />
                    <CheckboxWithLabel
                        onClick={() => {
                            setRFPInput((prevState) => ({
                                ...prevState,
                                allowSimpleTaxCategory: !prevState.allowSimpleTaxCategory,
                            }));
                        }}
                        checked={rfpInput.allowSimpleTaxCategory ?? false}
                        label="Allow Simple Tax Category"
                    />
                    <CheckboxWithLabel
                        onClick={() => {
                            setRFPInput((prevState) => ({
                                ...prevState,
                                splitByInventory: !prevState.splitByInventory,
                            }));
                        }}
                        checked={rfpInput.splitByInventory ?? false}
                        label="Split By Inventory"
                    />
                    <CheckboxWithLabel
                        onClick={() => {
                            setRFPInput((prevState) => ({
                                ...prevState,
                                ignorePricingGroup: !prevState.ignorePricingGroup,
                            }));
                        }}
                        checked={rfpInput.ignorePricingGroup ?? false}
                        label="Ignore Pricing Group"
                    />
                    <CheckboxWithLabel
                        onClick={() => {
                            setRFPInput((prevState) => ({
                                ...prevState,
                                allowNaLineItems: !prevState.allowNaLineItems,
                            }));
                        }}
                        checked={rfpInput.allowNaLineItems ?? false}
                        label="Allow NA Line Items"
                    />
                    <Grid item sm>
                        <Grid container direction="row" alignItems="center" spacing={2}>
                            <Grid item sm={4}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_14_medium">
                                            Comma seperated floorplan ids
                                        </Typography>
                                    }
                                    value={rfpInput.fpIds?.join(",")}
                                    onChange={(val: any) => {
                                        console.log("floor plan ids", rfpInput.fpIds);
                                        setRFPInput((prevState) => ({
                                            ...prevState,
                                            fpIds: val.target.value.split(","),
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item sm={4}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_14_medium">
                                            Comma seperated unit ids
                                        </Typography>
                                    }
                                    value={rfpInput.unitIds?.join(",")}
                                    onChange={(val: any) => {
                                        setRFPInput((prevState) => ({
                                            ...prevState,
                                            unitIds: val.target.value.split(","),
                                        }));
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container direction="row" alignItems="center" spacing={2}>
                            <Grid item sm={4}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_14_medium">
                                            FP Inventory Seperator
                                        </Typography>
                                    }
                                    value={rfpInput.fpInventorySeparator}
                                    onChange={(val: any) => {
                                        setRFPInput((prevState) => ({
                                            ...prevState,
                                            fpInventorySeparator: val.target.value,
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item sm={4}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_14_medium">
                                            FP Columns Suffix
                                        </Typography>
                                    }
                                    value={rfpInput.fpColumnsSuffix}
                                    onChange={(val: any) => {
                                        setRFPInput((prevState) => ({
                                            ...prevState,
                                            fpColumnsSuffix: val.target.value,
                                        }));
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={4}>
                        <BaseTextField
                            variant="outlined"
                            label={
                                <Typography variant="text_14_medium">Contractor Org Id</Typography>
                            }
                            value={rfpInput.contractorOrgId}
                            onChange={(val: any) => {
                                setRFPInput((prevState) => ({
                                    ...prevState,
                                    contractorOrgId: val.target.value,
                                }));
                            }}
                        />
                    </Grid>
                    {selectedFile ? (
                        <Grid item xs={true}>
                            <ItemCard
                                text={selectedFile.name}
                                onClick={() => {
                                    setSelectedFile(undefined);
                                }}
                            />
                        </Grid>
                    ) : (
                        <Grid item sm={12}>
                            <FileUpload
                                acceptedFileTypes={[".csv", ".xlsx"]}
                                isMultiple={false}
                                helperText="Accepts .csv, .xlsx only"
                                onFileChange={(files: FileList) => {
                                    console.log("files length", files.length);
                                    if (files.length == 0) return;
                                    const file = files[0];
                                    const fileType = file.type.toLowerCase();
                                    console.log("file.type", file.type);
                                    if (!fileType.includes("xlsx") && !fileType.includes("csv")) {
                                        setError("Invalid File Type");
                                    } else {
                                        setError(undefined);
                                        setSelectedFile(file);
                                    }
                                }}
                                containerWidth="auto"
                            />
                        </Grid>
                    )}
                    {errorText && (
                        <Grid item sm={12}>
                            <Typography color={AppTheme.text.error}>{errorText}</Typography>
                        </Grid>
                    )}
                </Grid>
            </CommonDialog>
        </>
    );
};
export default ImportFromRFPDialog;
