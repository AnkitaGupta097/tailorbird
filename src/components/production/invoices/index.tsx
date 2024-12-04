import {
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    List,
    Modal,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import ZeroStateComponent from "components/zero-state";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
// import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Select from "components/select";
import BaseLoader from "components/base-loading";
import { capitalize, isEmpty, isNil } from "lodash";
import { graphQLClient } from "utils/gql-client";
import {
    FEATURE_FLAGS,
    DOWNLOAD_INVOICE,
    GET_PROJECT_FILE,
    GENERATE_RETAINAGE_INVOICE,
    GET_CONTRACTOR_SCOPES_STATUS,
    GET_CONTRACTORS_ON_PRODUCTION,
    GENERATE_MOBILIZATION_INVOICE,
    DOWNLOAD_MOBILIZATION_INVOICE,
} from "../constants";
import InvoiceCard, { invoiceType } from "./invoice-card";
import InvoiceSideTray from "./Invoice-side-tray";
import KeyValue from "../common/key-value";
import theme from "styles/theme";
import BaseToggle from "components/toggle";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { getRoundedOffAndFormattedAmount } from "../helper";
import HumanReadableData from "components/human-readable-date";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useProductionContext } from "context/production-context";
import TrackerUtil from "utils/tracker";
import { downloadFile } from "stores/single-project/operation";
import mixpanel from "mixpanel-browser";
import SearchFilters from "../common/search-filters";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { shallowEqual } from "react-redux";
import Class4BudgetComponent from "components/class-4-budget";
import { Delete, OpenInNew, UploadFileOutlined } from "@mui/icons-material";
import {
    CREATE_PROJECT_FILES,
    DELETE_INVOICE_SUPPORTING_DOCS,
    GET_INVOICE_SUPPORTED_DOCUMENTS,
    UPDATE_INVOICE_BY_ID,
} from "stores/projects/tpsm/tpsm-queries";
import { UploadFile } from "./utils";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import { useMutation, useQuery } from "@apollo/client";
import ForwardInvoiceButton from "./forward-invoice";

const getFilterButtons = (
    selected: string,
    countInfo: any,
    // eslint-disable-next-line no-unused-vars
    onChangeInvoiceType: (arg: invoiceType) => void,
    autoInvoicing: boolean,
    isUserCM: boolean,
    contractorScopeStatus: any,
    generateRetainageInvoice: any,
    isRetainageReleased: boolean,
    handleToggleAutoInvoice: any,
    setOpen: Function,
): ReactNode => {
    return (
        <Grid container gap={5} alignItems="center">
            <Grid item>
                <Button
                    variant={selected == "final" ? "contained" : "outlined"}
                    startIcon={<ReceiptIcon />}
                    color="primary"
                    onClick={() => onChangeInvoiceType("final")}
                >
                    <Typography variant="text_14_medium">
                        Final Invoices ({countInfo.final})
                    </Typography>
                </Button>
            </Grid>
            {contractorScopeStatus &&
                contractorScopeStatus?.completed &&
                !isRetainageReleased &&
                !isUserCM && (
                    <Grid item>
                        <Button
                            variant={selected == "final" ? "contained" : "outlined"}
                            startIcon={<ReceiptIcon />}
                            color="primary"
                            disabled={isRetainageReleased}
                            onClick={() => generateRetainageInvoice()}
                        >
                            <Typography variant="text_14_medium">Release Retainage</Typography>
                        </Button>
                    </Grid>
                )}

            {isUserCM && (
                <Grid item>
                    <Button
                        variant={selected == "final" ? "contained" : "outlined"}
                        startIcon={<ReceiptIcon />}
                        color="primary"
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        <Typography variant="text_14_medium">Mobilization</Typography>
                    </Button>
                </Grid>
            )}

            <Grid item>
                <Button
                    variant={selected == "draft" ? "contained" : "outlined"}
                    startIcon={<ReceiptIcon />}
                    color="primary"
                    onClick={() => onChangeInvoiceType("draft")}
                >
                    <Typography variant="text_14_medium">
                        Draft Invoices ({countInfo.draft})
                    </Typography>
                </Button>
            </Grid>
            <Grid item marginLeft={"auto"}>
                <Class4BudgetComponent />
            </Grid>
            {/* <Grid item>
                <Button
                    variant={selected == "downloaded" ? "contained" : "outlined"}
                    startIcon={<DownloadDoneIcon />}
                    color="primary"
                    onClick={() => onChangeInvoiceType("downloaded")}
                >
                    <Typography variant="text_14_medium">
                        Downloaded ({countInfo.downloaded})
                    </Typography>
                </Button>
            </Grid> */}
            <Grid item>
                <BaseToggle
                    onClick={handleToggleAutoInvoice}
                    checked={!!autoInvoicing}
                    value="Auto-generate invoices"
                />
            </Grid>
        </Grid>
    );
};

const getMetaData = (metadata: any) => {
    return (
        <Grid container spacing={5}>
            <Grid item xs={3}>
                <KeyValue
                    label="Total Outstanding Amount"
                    value={
                        !isNil(metadata?.outstanding_amount)
                            ? `$${getRoundedOffAndFormattedAmount(metadata?.outstanding_amount)}`
                            : "-"
                    }
                />
            </Grid>
            <Grid item xs={3}>
                <KeyValue
                    label="Total Invoiced Amount"
                    value={
                        !isNil(metadata?.generated_invoice)
                            ? `$${getRoundedOffAndFormattedAmount(metadata?.generated_invoice)}`
                            : "-"
                    }
                />
            </Grid>
            <Grid item xs={3}>
                <KeyValue
                    label="Next Generation Date"
                    value={<HumanReadableData dateString={metadata?.next_generation_date} />}
                />
            </Grid>
            <Grid item xs={3}>
                <KeyValue
                    label="Next Generation Amount"
                    value={
                        !isNil(metadata?.next_generation_amount)
                            ? `$${getRoundedOffAndFormattedAmount(
                                  metadata?.next_generation_amount,
                              )}`
                            : "-"
                    }
                />
            </Grid>
        </Grid>
    );
};

const Invoices = () => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const location = useLocation() as any;
    const navigate = useNavigate();
    const { hasFeature } = useProductionContext();
    const tbOrgIds = useFeature(FeatureFlagConstants.TB_ORG_IDS)?.value ?? [];
    const isUserCM = hasFeature(FEATURE_FLAGS.EDIT_INVOICE_TITLE);
    const {
        allFinalInvoices,
        allDraftInvoices,
        loading,
        snackbarState,
        metadata,
        projectDetails,
        isProjectUpdating,
    } = useAppSelector((state) => {
        return {
            allFinalInvoices: state.invoicesState.finalInvoices,
            allDraftInvoices: state.invoicesState.draftInvoices,
            metadata: state.invoicesState.invoiceMetadata,
            loading: state.invoicesState.loading,
            snackbarState: state.common.snackbar,
            projectDetails: state.singleProject.projectDetails,
            isProjectUpdating: state.singleProject.updating,
        };
    }, shallowEqual);
    const [selectedType, setSelectedType] = useState<invoiceType>("final");

    const [finalInvoices, setFinalInvoices] = useState<any>(null);
    const [isRetainageReleased, setIsRetainageReleased] = useState<boolean>(false);
    const [contractorScopeStatus, setContractorScopeStatus] = useState<any>(null);
    const [draftInvoices, setDraftInvoices] = useState<any>(null);
    // const [downloadedInvoices, setDownloadedInvoices] = useState<any>(null);
    const [sideTrayData, setSideTrayData] = useState<any>(null);
    const [searchFilters, setSearchFilters] = useState<any>({
        invoiceId: undefined,
        contractor: undefined,
    });
    const [startDownloading, setDownloading] = useState(false);
    const [open, setOpen] = useState(false);
    const isInitialRender = useRef(true);

    const canGenerateInvoice = hasFeature(FEATURE_FLAGS.GENERATE_INVOICE);
    const canDownloadInvoice = hasFeature(FEATURE_FLAGS.DOWNLOAD_INVOICE);
    const canUploadSupportingDocuments = hasFeature(
        FEATURE_FLAGS.UPLOAD_INVOICE_SUPPORTING_DOCUMENTS,
    );
    const canForwardInvoiceToPMS = hasFeature(FEATURE_FLAGS.FORWARD_INVOICE_TO_PMS);

    const userDetails: any = JSON.parse(localStorage.getItem("user_details") || "{}");
    const [uploading, setUploading] = useState(false);
    const [uploadedSupportDocs, setUploadedSupportDocs] = useState([] as Array<any>);
    const [downloadingFile, setDownloadingFile] = useState(0);
    console.log(
        "isusercm",
        isUserCM,
        localStorage.getItem("role"),
        isEmpty(tbOrgIds),
        tbOrgIds.includes(localStorage.getItem("organization_id")),
    );
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        TrackerUtil.event("PRODUCTION_INVOICES_SCREEN", {
            projectId,
            projectName: projectDetails?.name,
        });
        getFinalInvoices();
        getInvoices();
        getInvoiceMetadata();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setUploadedSupportDocs([]);
        if (sideTrayData?.id) {
            getGCUploadedFiles();
        }

        // eslint-disable-next-line
    }, [sideTrayData?.id]);

    useEffect(() => {
        // on notification click action
        if (location?.state?.invoiceId && finalInvoices?.length) {
            if (isSearchFilterApplied() && selectedType === "final") {
                setSearchFilters({
                    invoiceId: undefined,
                    contractor: undefined,
                });
            } else {
                const invoice: any = finalInvoices?.find(
                    (i: any) => i.id === location?.state?.invoiceId,
                );
                if (invoice) {
                    navigate(location.pathname, {});
                    setSelectedType("final");
                    onSideTrayIconClick(invoice);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, finalInvoices]);

    useEffect(() => {
        if (finalInvoices?.length === 0 && selectedType === "final") {
            TrackerUtil.event("EMPTY_PAGE_RENDERED", getZeroStateTrackingPayload());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finalInvoices?.length, selectedType]);

    const getZeroStateTrackingPayload = () => {
        return {
            pageName: "invoice-list",
            projectId,
            searchFilters,
            tabName: selectedType,
            projectName: projectDetails?.name,
        };
    };

    useEffect(() => {
        if (draftInvoices?.length === 0 && selectedType === "draft") {
            TrackerUtil.event("EMPTY_PAGE_RENDERED", getZeroStateTrackingPayload());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draftInvoices?.length, selectedType]);

    useEffect(() => {
        if (allFinalInvoices?.length) {
            if (selectedType === "draft" && sideTrayData) {
                setSideTrayData(null);
                setSelectedType("final");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allFinalInvoices?.length]);

    useEffect(() => {
        if (allDraftInvoices && allFinalInvoices && isInitialRender.current) {
            isInitialRender.current = false;
            TrackerUtil.event("PAGE_DATA_LENGTH_STAT", {
                pageName: "final-invoice-list",
                dataLength: allFinalInvoices?.length,
                projectName: projectDetails?.name,
            });
            TrackerUtil.event("PAGE_DATA_LENGTH_STAT", {
                pageName: "draft-invoice-list",
                dataLength: allDraftInvoices?.length,
                projectName: projectDetails?.name,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allDraftInvoices, allFinalInvoices]);

    useEffect(() => {
        if (sideTrayData?.id) {
            const updatedInvoice = allFinalInvoices.find((i) => i.id === sideTrayData?.id);
            setSideTrayData(updatedInvoice);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allFinalInvoices]);

    useEffect(() => {
        if (snackbarState.open) {
            showSnackBar(snackbarState.variant, snackbarState.message as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snackbarState]);

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
            onClose: () => {
                dispatch(actions.common.closeSnack());
            },
        });
    };

    const isSearchFilterApplied = () => {
        return !(isNil(searchFilters?.invoiceId) && isNil(searchFilters?.contractor));
    };

    const getFilteredResult = (invoices: Array<any>, isDraft: boolean = false) => {
        const filteredList = invoices?.filter((invoice: any) => {
            let isMatched = true;
            if (!isDraft && searchFilters?.invoiceId) {
                isMatched = isMatched && invoice?.id === searchFilters?.invoiceId;
            }
            if (searchFilters?.contractor) {
                isMatched = isMatched && invoice?.contractor_id === searchFilters?.contractor;
            }
            return isMatched;
        });

        return filteredList || [];
    };

    useEffect(() => {
        const isSearchApplied = isSearchFilterApplied();
        if (selectedType === "draft") {
            const filteredList = isSearchApplied
                ? getFilteredResult(allDraftInvoices, true)
                : allDraftInvoices;
            setDraftInvoices(filteredList);
        } else {
            const filteredList = isSearchApplied
                ? getFilteredResult(allFinalInvoices)
                : allFinalInvoices;
            setFinalInvoices(filteredList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allDraftInvoices, allFinalInvoices, searchFilters, selectedType]);

    const getFinalInvoices = () => {
        if (!allFinalInvoices) {
            dispatch(actions.production.invoices.fetchFinalInvoicesStart({ projectId }));
        }
    };

    const getInvoiceMetadata = () => {
        if (!metadata) {
            dispatch(actions.production.invoices.fetchInvoiceMetaDataStart({ projectId }));
        }
    };

    const getInvoices = () => {
        if (!allDraftInvoices) {
            dispatch(actions.production.invoices.fetchDraftInvoicesStart({ projectId }));
        }
    };

    const onChangeInvoiceType = (type: invoiceType) => {
        setSideTrayData(null);
        setSelectedType(type);
    };

    useEffect(() => {
        if (allFinalInvoices && allFinalInvoices.length && !isRetainageReleased) {
            const val = allFinalInvoices.filter((i) => i.type == "retainage");
            if (val.length) {
                setIsRetainageReleased(true);
            }
        }
    }, [allFinalInvoices, isRetainageReleased]);

    const mapInvoiceData = () => {
        if (selectedType === "draft") {
            return draftInvoices || [];
        } else {
            return finalInvoices || [];
        }
        // else {
        //     return downloadedInvoices || [];
        // }
    };

    const onGenarateInvoice = () => {
        const contractorId = sideTrayData?.contractor_id;

        TrackerUtil.event("GENERATE_ON_DEMAND_INVOICE", {
            projectId,
            contractorId,
            projectName: projectDetails?.name,
        });

        dispatch(
            actions.production.invoices.generateInvoiceStart({
                projectId,
                contractorId,
                projectName: projectDetails?.name,
            }),
        );
    };

    const onDownload = (downloadLink: string, name: string, fileId: string, invoiceId: number) => {
        mixpanel.time_event("INVOICE_DOWNLOAD");
        downloadFile(downloadLink, name, fileId, projectDetails?.name).then(() => {
            mixpanel.track("INVOICE_DOWNLOAD", {
                invoiceId,
                fileId,
                projectName: projectDetails?.name,
            });
            setDownloading(false);
            setSideTrayData(null);
        });
    };

    const [generateRetainageInvoice] = useMutation(GENERATE_RETAINAGE_INVOICE, {
        async onCompleted() {
            dispatch(actions.production.invoices.fetchFinalInvoicesStart({ projectId }));
            dispatch(
                actions.common.openSnack({
                    message: "Retainage invoice released",
                    variant: "success",
                }),
            );
        },
        onError() {
            dispatch(
                actions.common.openSnack({
                    message: "Retainage invoice generation failed.",
                    variant: "error",
                }),
            );
        },
    });

    const [generateMobilizationInvoice] = useMutation(GENERATE_MOBILIZATION_INVOICE, {
        async onCompleted() {
            dispatch(actions.production.invoices.fetchFinalInvoicesStart({ projectId }));
            dispatch(
                actions.common.openSnack({
                    message: "Mobilization invoice generated!",
                    variant: "success",
                }),
            );
            setSelectedContractor(null);
        },
        onError() {
            dispatch(
                actions.common.openSnack({
                    message: "Mobilization invoice generation failed.",
                    variant: "error",
                }),
            );
            setSelectedContractor(null);
        },
    });
    const onDownloadInvoice = () => {
        const invoiceId = sideTrayData?.id;
        TrackerUtil.event("CLICKED_DOWNLOAD_INVOICE", {
            contractorId: sideTrayData?.contractor_id,
            invoiceId,
            projectName: projectDetails?.name,
        });

        setDownloading(true);
        const invoice = finalInvoices.find((i: any) => i.id == invoiceId);
        if (invoice.type == "mobilization") {
            downloadMobilizationInvoice(invoiceId);
            return;
        }
        let mutaionName = "downloadInvoice";
        let mutaionSchema = DOWNLOAD_INVOICE;
        let payload: any = { invoiceId: invoiceId };
        if (invoice && ["retainage", "mobilization"].includes(invoice.type)) {
            mutaionName = "generateRetainageInvoice";
            mutaionSchema = GENERATE_RETAINAGE_INVOICE;
            payload = {
                contractorOrgId: localStorage.getItem("organization_id"),
                projectId: projectId,
            };
        }
        graphQLClient
            .mutate(mutaionName, mutaionSchema, payload)
            .then((response: any) => {
                const downloadLink = response?.download_link ?? response?.downloadLink;
                const name = response?.file_name ?? response?.fileName;
                const fileId = response?.id;
                onDownload(downloadLink, name, fileId, invoiceId);
            })
            .catch((error: any) => {
                TrackerUtil.error(
                    error,
                    {
                        contractorId: sideTrayData?.contractor_id,
                        invoiceId,
                        projectName: projectDetails?.name,
                    },
                    "DOWNLOAD_INVOICE_FAILED",
                );
                setDownloading(false);
                showSnackBar("error", "Invoice Download failed");
            });
    };

    const getInvoiceTypeCountInfo = () => {
        return {
            draft: allDraftInvoices?.length || 0,
            final: allFinalInvoices?.length || 0,
            // downloaded: downloadedInvoices?.length || 0,
        };
    };

    const getInvoiceDetail = (invoice: any) => {
        const invoiceId = invoice?.id;

        if (!invoice?.units && invoice.type != "retainage") {
            dispatch(actions.production.invoices.fetchInvoiceDetailStart({ invoiceId }));
        }
    };

    async function uploadSupportingDocuments(event: React.ChangeEvent<HTMLInputElement>) {
        setUploading(true);
        try {
            const files = [];

            const invoiceID = sideTrayData?.id;
            for (const file of event.target.files as FileList) {
                files.push({
                    file_name: file.name,
                    file_type: "INVOICE_SUPPORTING_DOCUMENT",
                    tags: { invoiceID: invoiceID },
                });
            }
            const input = {
                files: files,
                project_id: projectId,
                user_id: userDetails.user_id,
                prefix: `project_spec/${projectId}/invoices/${invoiceID}/supporting_documents`,
            };
            const response = await graphQLClient.mutate(
                "createProjectFiles",
                CREATE_PROJECT_FILES,
                {
                    input,
                },
            );
            await Promise.allSettled(
                response.map((s: any, index: number) =>
                    UploadFile((event.target.files ?? [])[index], s.signed_url, s.id),
                ),
            );

            await graphQLClient.mutate("updateInvoiceById", UPDATE_INVOICE_BY_ID, {
                fileIds: response.map((file: any) => file.id),
                invoiceId: invoiceID,
            });
            await getGCUploadedFiles();
        } finally {
            setUploading(false);
        }
    }

    async function downloadMobilizationInvoice(invoiceId: any) {
        graphQLClient
            .query("downloadMobilizationInvoice", DOWNLOAD_MOBILIZATION_INVOICE, {
                invoiceId: invoiceId,
            })
            .then((response: any) => {
                response = response.downloadMobilizationInvoice;
                console.log("downloadMobilizationInvoice", response);
                const downloadLink = response?.download_link ?? response?.downloadLink;
                const name = response?.file_name ?? response?.fileName;
                const fileId = response?.id;
                onDownload(downloadLink, name, fileId, invoiceId);
            })
            .catch((error: any) => {
                TrackerUtil.error(
                    error,
                    {
                        contractorId: sideTrayData?.contractor_id,
                        invoiceId,
                        projectName: projectDetails?.name,
                    },
                    "DOWNLOAD_INVOICE_FAILED",
                );
                setDownloading(false);
                showSnackBar("error", "Invoice Download failed");
            });
    }

    async function getGCUploadedFiles() {
        const response = await graphQLClient.query(
            "getInvoiceSupportedDocuments",
            GET_INVOICE_SUPPORTED_DOCUMENTS,
            {
                invoiceId: sideTrayData?.id,
            },
        );
        setUploadedSupportDocs(response.getInvoiceSupportedDocuments);
    }

    async function viewUploadedFile(fileID: number) {
        try {
            setDownloadingFile(fileID);
            const response = await graphQLClient.query("getProjectFile", GET_PROJECT_FILE, {
                fileId: fileID,
            });
            window.open(response.getProjectFile.download_link, "_blank");
        } finally {
            setDownloadingFile(0);
        }
    }

    const getSideTrayActionButtons = () => {
        if (selectedType === "draft" && canGenerateInvoice) {
            return (
                !metadata?.auto_invoicing && (
                    <div
                        style={{
                            padding: "20px",
                            position: "sticky",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: theme.common.white,
                            borderTop: `1px solid ${theme.border.textarea}`,
                        }}
                    >
                        <Button
                            variant={"contained"}
                            color="primary"
                            onClick={() => onGenarateInvoice()}
                            style={{ height: "36px", width: "100%" }}
                        >
                            <Typography variant="text_16_medium">
                                Generate On-demand Invoice
                            </Typography>
                        </Button>
                    </div>
                )
            );
        } else if (selectedType === "final" && canDownloadInvoice) {
            return (
                <>
                    {uploadedSupportDocs.length > 0 && (
                        <div>
                            <Typography>GC Uploaded Files</Typography>
                            <List>
                                {uploadedSupportDocs.map((doc) => (
                                    <Grid container key={doc.fileId}>
                                        <Grid item>
                                            <Button
                                                disabled={downloadingFile == doc.fileId}
                                                key={doc.fileId}
                                                onClick={async () => {
                                                    viewUploadedFile(doc.fileId);
                                                }}
                                                startIcon={
                                                    downloadingFile == doc.fileId ? (
                                                        <CircularProgress size={8} />
                                                    ) : (
                                                        <OpenInNew />
                                                    )
                                                }
                                                endIcon={
                                                    canUploadSupportingDocuments && (
                                                        <IconButton
                                                            onClick={async (event) => {
                                                                event.stopPropagation();
                                                                event.preventDefault();
                                                                if (
                                                                    window.confirm(
                                                                        "Are you sure you want to delete the uploaded document?",
                                                                    )
                                                                ) {
                                                                    setDownloadingFile(doc.fileId);
                                                                    try {
                                                                        await graphQLClient.mutate(
                                                                            "",
                                                                            DELETE_INVOICE_SUPPORTING_DOCS,
                                                                            {
                                                                                invoiceId:
                                                                                    sideTrayData?.id,
                                                                                fileId: doc.fileId,
                                                                            },
                                                                        );
                                                                        await getGCUploadedFiles();
                                                                    } finally {
                                                                        setDownloadingFile(0);
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    )
                                                }
                                            >
                                                {doc.fileName}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ))}
                            </List>
                        </div>
                    )}

                    <div
                        style={{
                            padding: "20px",
                            position: "sticky",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            display: "flex",
                            background: theme.common.white,
                            borderTop: `1px solid ${theme.border.textarea}`,
                            gap: "12px",
                        }}
                    >
                        {canForwardInvoiceToPMS &&
                            !["mobilization", "retainage"].includes(sideTrayData.type) && (
                                <ForwardInvoiceButton invoiceId={sideTrayData?.id} />
                                // <Tooltip title="Forward the Invoice to a PMS">
                                //     <Button
                                //         onClick={async () => {
                                //             await graphQLClient.mutate("", FORWARD_INVOICE_TO_PMS, {
                                //                 invoiceId: sideTrayData?.id,
                                //             });
                                //         }}
                                //         startIcon={<Forward />}
                                //     >
                                //         Forward
                                //     </Button>
                                // </Tooltip>
                            )}
                        {canUploadSupportingDocuments && (
                            <Tooltip title="Attach supporting documents">
                                <Button
                                    disabled={uploading}
                                    startIcon={
                                        uploading ? (
                                            <CircularProgress size={8} />
                                        ) : (
                                            <UploadFileOutlined />
                                        )
                                    }
                                    variant="contained"
                                    component="label"
                                    color="primary"
                                    style={{ height: "36px", width: "100%" }}
                                >
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        multiple
                                        hidden
                                        onChange={uploadSupportingDocuments}
                                    />
                                    {uploading ? "Uploading" : "Upload Docs"}
                                </Button>
                            </Tooltip>
                        )}
                        <Button
                            disabled={uploading}
                            startIcon={<DoNotDisturbAltIcon />}
                            variant={"outlined"}
                            color="primary"
                            onClick={() => setSideTrayData(null)}
                            style={{ height: "36px", width: "100%" }}
                        >
                            <Typography variant="text_16_medium">Cancel</Typography>
                        </Button>
                        <Button
                            disabled={uploading}
                            startIcon={<FileDownloadIcon />}
                            variant={"contained"}
                            color="primary"
                            onClick={() => onDownloadInvoice()}
                            style={{ height: "36px", width: "100%" }}
                        >
                            <Typography variant="text_16_medium">Download</Typography>
                        </Button>
                    </div>
                </>
            );
        }
    };

    const getInvoiceGenerationDate = (invoice: any): string => {
        let date;
        if (selectedType === "draft") {
            date = metadata?.next_generation_date;
        } else {
            date = invoice?.created_at;
        }
        return date;
    };

    const onSearchFilterClick = (type: string, value: string) => {
        setSearchFilters((prev: any) => ({ ...prev, [type]: value }));
    };

    const getContractorList = () => {
        const uniqContractorId = new Set();
        const contractorList: Array<any> = [];

        const allInvoices = selectedType === "draft" ? allDraftInvoices : allFinalInvoices;

        allInvoices?.forEach((invoice: any) => {
            if (!uniqContractorId.has(invoice?.contractor?.id)) {
                contractorList.push({ ...invoice?.contractor });
                uniqContractorId.add(invoice?.contractor?.id);
            }
        });
        return contractorList;
    };

    const handleToggleAutoInvoice = (e: any) => {
        TrackerUtil.event("CLICKED_AUTO_GENERATE_INVOICES_TOGGLE_BUTTON", {
            projectId,
            projectName: projectDetails?.name,
        });
        const checked = e.target.checked;

        dispatch(
            actions.singleProject.updateSingleProjectStart({
                project_id: projectId,
                projectName: projectDetails?.name,
                successMsg: "Updated Auto Invoicing",
                errorMsg: "Failed to update auto invoicing",
                input: {
                    production_config: {
                        ...projectDetails?.production_config,
                        auto_invoicing: checked ? "true" : "false",
                    },
                },
            }),
        );
    };

    const onSideTrayIconClick = (invoiceData: any) => {
        setSideTrayData(invoiceData);
        if (selectedType == "final" && !(invoiceData.type == "retainage")) {
            getInvoiceDetail(invoiceData);
        }
    };

    const { data: scopeStatus, refetch } = useQuery(GET_CONTRACTOR_SCOPES_STATUS, {
        variables: {
            projectId: projectId,
            contractorOrgId: localStorage.getItem("organization_id"),
        },
    });

    const { data: contractorsOnProduction, refetch: refetchContractors } = useQuery(
        GET_CONTRACTORS_ON_PRODUCTION,
        {
            variables: {
                projectId: projectId,
            },
        },
    );

    useEffect(() => {
        if (!isUserCM && !contractorScopeStatus) {
            refetch();
        }
        if (isUserCM) {
            refetchContractors();
        }
        // eslint-disable-next-line
    }, [isUserCM, contractorScopeStatus]);

    useEffect(() => {
        if (!contractorScopeStatus && scopeStatus) {
            setContractorScopeStatus(scopeStatus);
        }
    }, [scopeStatus, contractorScopeStatus]);

    const [selectedContractor, setSelectedContractor] = useState(null);
    const [mobilizationAmount, setMobilizationAmount] = useState("0");
    const contractorsSelecteOptions = useMemo(() => {
        const newlist =
            (contractorsOnProduction && contractorsOnProduction?.getContractorsOnProduction) ?? [];
        if (newlist) {
            return newlist.map((i: any) => ({ value: i.id, label: i.name }));
        }
        return [];
        // eslint-disable-next-line
    }, [contractorsOnProduction]);

    return (
        <Grid container padding={2} gap={6} marginTop={8}>
            {loading || startDownloading || isProjectUpdating ? (
                <BaseLoader />
            ) : (
                <>
                    <Grid item xs={12}>
                        {getMetaData(metadata)}
                    </Grid>
                    <Grid item xs={12}>
                        {getFilterButtons(
                            selectedType,
                            getInvoiceTypeCountInfo(),
                            onChangeInvoiceType,
                            projectDetails?.production_config?.auto_invoicing === "true",
                            isUserCM,
                            contractorScopeStatus,
                            () => {
                                generateRetainageInvoice({
                                    variables: {
                                        projectId: projectId,
                                        contractorOrgId: localStorage.getItem("organization_id"),
                                    },
                                });
                            },
                            isRetainageReleased,
                            handleToggleAutoInvoice,
                            setOpen,
                        )}
                    </Grid>
                    {!(
                        selectedType === "draft" && hasFeature(FEATURE_FLAGS.RAISE_CHANGE_ORDER)
                    ) && (
                        <Grid item xs={12}>
                            <SearchFilters
                                dataList={allFinalInvoices || []}
                                disabled={!getInvoiceTypeCountInfo()[selectedType]}
                                onSearchFilterClick={onSearchFilterClick}
                                filters={
                                    selectedType === "draft"
                                        ? [{ type: "contractor", placeholder: "Contractor" }]
                                        : [
                                              { type: "invoiceId", placeholder: "Invoice" },
                                              {
                                                  type: "contractor",
                                                  placeholder: "Contractor",
                                                  hide: hasFeature(
                                                      FEATURE_FLAGS.RAISE_CHANGE_ORDER,
                                                  ),
                                              },
                                          ]
                                }
                                contractorList={getContractorList()}
                            />
                        </Grid>
                    )}
                    <Grid container flexDirection="row" gap={5}>
                        <Grid
                            item
                            style={{ height: "65vh" }}
                            flex={9}
                            overflow="auto"
                            sx={{ background: theme.common.white }}
                        >
                            <Grid container flexDirection="column" gap={5}>
                                {mapInvoiceData().length > 0 ? (
                                    mapInvoiceData().map((invoice: any, index: number) => (
                                        <Grid item key={index}>
                                            <InvoiceCard
                                                autoGenerationDate={getInvoiceGenerationDate(
                                                    invoice,
                                                )}
                                                type={selectedType}
                                                data={invoice}
                                                onClickSideTrayIcon={() => {
                                                    onSideTrayIconClick(invoice);
                                                }}
                                            />
                                        </Grid>
                                    ))
                                ) : (
                                    <ZeroStateComponent
                                        label={`No ${capitalize(selectedType)} Invoices Found`}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        {sideTrayData && (
                            <Grid item flex={3}>
                                <Grid container flexDirection="column">
                                    <Grid
                                        item
                                        style={{
                                            height: "calc(65vh - 77px)",
                                            background: theme.common.white,
                                        }}
                                        overflow="auto"
                                    >
                                        <InvoiceSideTray
                                            autoGenerationDate={getInvoiceGenerationDate(
                                                sideTrayData,
                                            )}
                                            data={sideTrayData}
                                            type={selectedType}
                                            onInvoiceIdChange={(newSideTrayData: any) => {
                                                setSideTrayData({
                                                    ...sideTrayData,
                                                    ...newSideTrayData,
                                                });
                                            }}
                                            onClose={() => {
                                                setSideTrayData(null);
                                            }}
                                        />
                                    </Grid>
                                    {getSideTrayActionButtons()}
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </>
            )}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="text_16_medium" component="h2">
                        Generate mobilization invoice
                    </Typography>
                    <Select
                        headerLabelTypographyProps={{
                            variant: "text_14_medium",
                            color: "#202223",
                        }}
                        selectProps={{
                            variant: "outlined",
                            value: selectedContractor,
                            fullWidth: true,
                            onChange: ({ target }: { target: any }) =>
                                setSelectedContractor(target.value),
                            size: "small",
                        }}
                        options={contractorsSelecteOptions}
                        placeholder={"Please choose contractor"}
                    />
                    <Box
                        sx={{
                            padding: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            flexDirection: "row",
                        }}
                    >
                        <Typography id="text_14_medium" variant="text_16_medium" component="h2">
                            Amount:
                        </Typography>
                        <TextField
                            style={{ marginLeft: "10px" }}
                            value={mobilizationAmount}
                            onChange={({ target }) => setMobilizationAmount(target.value)}
                            placeholder="Enter mobilization amount"
                        />
                    </Box>
                    <Button
                        variant={"contained"}
                        color="primary"
                        onClick={() => {
                            setOpen(false);
                            generateMobilizationInvoice({
                                variables: {
                                    projectId: projectId,
                                    contractorOrgId: selectedContractor,
                                    mobilizedAmount: Number(mobilizationAmount),
                                },
                            });
                        }}
                    >
                        <Typography variant="text_16_medium">
                            Create mobilization Invoice
                        </Typography>
                    </Button>
                </Box>
            </Modal>
        </Grid>
    );
};

export default Invoices;
