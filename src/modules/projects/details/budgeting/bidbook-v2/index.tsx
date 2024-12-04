import {
    Box,
    Button,
    Card,
    CardMedia,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControlLabel,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import BaseAutoComplete from "components/auto-complete";
import BaseDialog from "components/base-dialog";
import BaseSnackbar from "components/base-snackbar";
import BaseTabs from "components/base-tabs";
import { CONTAINER_CATEGORY_QUERY } from "components/container-admin-interface/constants";
import ContentPlaceholder from "components/content-placeholder";
import StepperHorizantal from "components/stepper-horizantal";
import { useCallbackPrompt } from "hooks/use-callback-prompt";
import CommonDialog from "modules/admin-portal/common/dialog";
import DialogBox from "modules/package-manager/create-edit-package/warning-dialog";
import { BIDBOOK_TABS } from "modules/projects/constant";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dispatchActions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { categorySortingOrder } from "stores/projects/details/budgeting/base-scope/constants";
import { graphQLClient } from "utils/gql-client";
import loader from "../../../../../assets/icons/loader.gif";
import { GET_EXH_A_CONFIG_QUERY } from "../../exh-a/exh-a.graphql";
import { IExhAConfig } from "../../exh-a/types";
import { BIDBOOK_2_0_STEPS } from "../constants";
import {
    CREATE_EXH_A,
    CREATE_RENOVATION_VERSION,
    GET_LATEST_RENOVATION_VERSION,
    GET_PROJECT_ITEMS,
    GET_VERSIONED_DATA,
} from "./actions/mutation-contsants";
import Alts from "./alts";
import BaselineBid from "./baseline-bid";
import ActionWrapper from "./common/action-wrapper";
import DefineFloorplans from "./define-floorplans";
import DefineInventories from "./define-inventories";
import FlooringBid from "./flooring-bid";
import "./index.css";
import ManageUnits from "./manage-units";

const BidBook = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { projectId } = useParams();
    const organization_id = localStorage.getItem("organization_id");
    const dispatch = useAppDispatch();
    const [selectedOption, setSelectedOption] = useState<0 | 1 | 2>(0);
    const [configData, setConfigData] = useState<IExhAConfig | null>(null);

    const [steps, setSteps] = useState<typeof BIDBOOK_2_0_STEPS>([]);
    const [activeStep, setActiveStep] = React.useState(BIDBOOK_2_0_STEPS[0].value);
    const [currentTab, setCurrentTab] = useState<string>(BIDBOOK_TABS()?.[0].value);
    const [isExportedOnce, setIsExportedOnce] = React.useState(false);
    const [savedWithChanges, setSavedWithChanges] = React.useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [containerItemsList, setContainerItemsList] = useState([]);
    const [saveChanges, setSaveChanges] = useState(false);
    const [latestRenoBidbookVerion, setLatestRenoBidbookVerion] = useState(null);
    const [selectedBidbookVerion, setSelectedBidbookVerion] = useState(null);
    const [selectedVersionData, setSelecteVersionData] = useState({});
    const [viewMode, setViewMode] = useState(false);
    const [loadingVersionedData, setLoadingVersionedData] = useState(false);
    const [versioDropDownOptions, setversioDropDownOptions]: any = useState();
    const [addRowConfirmation, setAddRowConfirmation] = useState(false);
    const [addRowConfirmationAccepted, setAddRowConfirmationAccepted] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const [bidbookSaveInprogress, setBidbookSaveInprogress] = useState(false);

    const [checked, setChecked] = React.useState(false);

    const { projectDetails } = useAppSelector((state) => {
        return {
            projectDetails: state.projectDetails.data,
        };
    });
    const rfp_project_version =
        parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
            .toFixed(1)
            .toString() ?? "1.0";
    const container_version = Number(
        parseFloat((projectDetails as any)?.system_remarks?.container_version).toFixed(1),
    );

    const createArray = (n: any) => {
        const newArray: Number[] = Array.from({ length: n }, (_, index) => index + 1);
        setversioDropDownOptions(newArray);
    };
    const actionWrapperRef = useRef<Record<any, any>>();

    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(
        actionWrapperRef?.current?.isHavingUnsavedChanges,
    );
    const setIsHavingUnsavedChanges = actionWrapperRef?.current?.setIsHavingUnsavedChanges;

    // API calls to fetch and update the records
    const getCategoryData = async () => {
        const res = await graphQLClient.query("getCategoryData", CONTAINER_CATEGORY_QUERY);
        setCategoryData(
            res.getCategories.map((s: any) => {
                return s.category;
            }),
        );
    };
    const getExhAConfig = useCallback(async () => {
        try {
            const res = await graphQLClient.query("GetExhAConfig", GET_EXH_A_CONFIG_QUERY, {
                projectId,
            });
            setConfigData(res.getExhAConfig);
        } catch (error) {
            console.error(`getExhAConfig failed with ${error}`);
        }
    }, [projectId]);

    useEffect(() => {
        getExhAConfig();
    }, [getExhAConfig]);

    const getLatestRenoBidVersion = async () => {
        try {
            setIsLoading(true);
            const res = await graphQLClient.query(
                "LatestRenovationVersion",
                GET_LATEST_RENOVATION_VERSION,
                {
                    projectId: projectId,
                },
            );
            const renovation_version = res?.latestRenovationVersion?.renovation_version ?? null;

            createArray(renovation_version);
            setSelectedBidbookVerion(renovation_version);
            setLatestRenoBidbookVerion(renovation_version);
            setIsExportedOnce(renovation_version != null ?? true);
        } finally {
            setIsLoading(false);
        }
    };

    const getContainerData = async () => {
        const res = await graphQLClient.query("GetProjectContainer", GET_PROJECT_ITEMS, {
            input: {
                project_id: projectId,
                is_active: true,
            },
        });
        const { getProjectContainer } = res;
        const containerItemsListOptions = getProjectContainer.map((option: any) => {
            const firstLetter = option.item[0].toUpperCase();
            return {
                ...option,
                firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
                label: option.item,
                pc_item_id: option.project_codex_id,
            };
        });

        setContainerItemsList(containerItemsListOptions);
    };

    const getRenovationVersionedData = async () => {
        const res = await graphQLClient.query("RenovationVersion", GET_VERSIONED_DATA, {
            projectId: projectId,
            version: Number(selectedBidbookVerion),
        });
        setLoadingVersionedData(false);
        let resCopy = JSON.parse(JSON.stringify(res.renovationVersion));
        const sortRenovationItems = (items: any[]) => {
            return items
                .slice()
                .map((t: any) => ({ ...t, initialCost: t.unitCost }))
                .sort((a: any, b: any) => {
                    const categoryA = a.category.toLowerCase();
                    const categoryB = b.category.toLowerCase();
                    const positionA = categorySortingOrder.find(
                        (item: any) => item.name.toLowerCase() === categoryA,
                    )?.position;
                    const positionB = categorySortingOrder.find(
                        (item: any) => item.name.toLowerCase() === categoryB,
                    )?.position;

                    if (positionA !== undefined && positionB !== undefined) {
                        return positionA - positionB;
                    } else if (positionA !== undefined) {
                        return -1;
                    } else if (positionB !== undefined) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
        };

        resCopy.all_renovation_items.alt_scope = sortRenovationItems(
            resCopy.all_renovation_items.alt_scope,
        );
        resCopy.all_renovation_items.base_scope = sortRenovationItems(
            resCopy.all_renovation_items.base_scope,
        );
        resCopy.all_renovation_items.flooring_scope = sortRenovationItems(
            resCopy.all_renovation_items.flooring_scope,
        );

        setSelecteVersionData(resCopy);
    };
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };
    const generateExhC = async () => {
        await graphQLClient.mutate("CreateRenovationVersion", CREATE_RENOVATION_VERSION, {
            createRenovationVersionPayload: {
                project_id: projectId,
                created_by: localStorage.getItem("user_id"),
            },
        });
    };
    const generateExhA = async () => {
        const bidType = configData?.owner_to_gc
            ? "OWNER_TO_GC"
            : configData?.gc_to_subs
            ? "GC_TO_SUBS"
            : "OWNER_TO_GC";
        await graphQLClient.mutate("createExhADocument", CREATE_EXH_A, {
            bidType,
            projectId,
        });
    };

    const saveAsNewVersionConfirm = async () => {
        try {
            setBidbookSaveInprogress(true);
            if (selectedOption === 0) {
                await generateExhC();
                await generateExhA();
                getLatestRenoBidVersion();
                showSnackBar("success", "New version generated successfully.");
            } else if (selectedOption === 1) {
                await generateExhC();
                getLatestRenoBidVersion();
                showSnackBar("success", "Ex C generated successfully.");
            } else if (selectedOption === 2) {
                await generateExhA();
                showSnackBar("success", "SOW (Ex A) generated successfully.");
            }
        } catch (e) {
            if (selectedOption === 0) {
                showSnackBar("error", "New version generation unsuccessful.");
            } else if (selectedOption === 1) {
                showSnackBar("error", "Ex C generation unsuccessful.");
            } else if (selectedOption === 2) {
                showSnackBar("error", "SOW (Ex A) generation unsuccessful.");
            }
        } finally {
            setBidbookSaveInprogress(false);
        }
    };

    const onTabChanged = (event: React.ChangeEvent<{}>, newValue: string) => {
        setCurrentTab(newValue);
    };

    const DIALOG_KEY = "showDialog";
    const EXPIRATION_DAYS = 15;

    const handleCheckboxChange = (event: any) => {
        setChecked(event.target.checked);

        if (event.target.checked) {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + EXPIRATION_DAYS);
            localStorage.setItem(DIALOG_KEY, JSON.stringify(expirationDate));
        } else {
            localStorage.removeItem(DIALOG_KEY);
        }
    };

    const confirmationCheck = () => {
        const lastShownDate = localStorage.getItem(DIALOG_KEY);
        if (lastShownDate) {
            const expirationDate = new Date(JSON.parse(lastShownDate));
            const currentDate = new Date();

            if (currentDate < expirationDate) {
                // If the current date is less than the expiration date, do not show the dialog
                setAddRowConfirmationAccepted(true);
                return;
            }
        }

        // Show the dialog if the condition is not met or local storage is not set
        setAddRowConfirmation(true);
    };
    useMemo(() => {
        getCategoryData();
        getContainerData();
        getLatestRenoBidVersion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(dispatchActions.budgeting.fetchExportDetailsStart({ projectId }));
        dispatch(
            dispatchActions.rfpProjectManager.fetchAssignedContractorListStart({
                project_id: projectId,
                rfp_project_version: rfp_project_version,
            }),
        );
        dispatch(
            dispatchActions.projectFloorplans.fetchFloorplanDataStart({
                id: projectId,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (viewMode && selectedBidbookVerion !== null) {
            getRenovationVersionedData();
            setLoadingVersionedData(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode, selectedBidbookVerion, currentTab]);

    useEffect(() => {
        if (currentTab == "/bidbookmodifier") {
            setViewMode(false);
            if (container_version > 2.0) {
                setSteps(BIDBOOK_2_0_STEPS.filter((item: any, index) => index > 2));
                setActiveStep("BASE_BID");
            } else {
                setSteps(BIDBOOK_2_0_STEPS);
                setActiveStep("FLOOR_PLANS");
            }
        } else {
            setViewMode(true);
            setSteps(BIDBOOK_2_0_STEPS.filter((item: any, index) => index > 2));
            setActiveStep("BASE_BID");
        }
        if (projectDetails?.projectType != "INTERIOR") {
            setSteps(
                BIDBOOK_2_0_STEPS.filter(
                    (item: any, index) =>
                        index > 2 && !["MANAGE_UNITS", "FLOORING"].includes(item.value),
                ),
            );
        }
    }, [currentTab, projectDetails, container_version]);

    if (loading) {
        //project?.organization_id?.trim().length == 0
        return (
            <CommonDialog
                open={loading}
                onClose={() => {}}
                loading={loading}
                loaderText={"Please wait. loading ..."}
                width="40rem"
                minHeight="26rem"
            />
        );
    }

    const NavigateBudget = () => {
        const updatedUrl = pathname.replace("/bidbook", "/budgeting");
        navigate(updatedUrl);
    };
    // Optional JavaScript to handle scroll events and show/hide the floating div
    // eslint-disable-next-line no-unused-vars
    let lastScrollY = 0;
    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 5 * 16) {
            // Scrolling down more than 10rem (assuming 1rem = 16px), show the floating div
            document.getElementById("floatingDiv")?.classList.add("floating-div");
        } else {
            // Scrolling up or not scrolled enough, hide the floating div
            document.getElementById("floatingDiv")?.classList.remove("floating-div");
        }

        lastScrollY = currentScrollY;
    }

    const onChangeSelectedOption = (option: 0 | 1 | 2) => setSelectedOption(option);

    window.addEventListener("scroll", handleScroll);
    const getLoaderCopy = () => {
        switch (selectedOption) {
            case 0:
                return "New Version save is in progress.Note: This should take about 30 seconds.Please do not refresh / leave this page.";
            case 1:
                return "Ex C generation is in progress.Note: This should take about 30 seconds.Please do not refresh / leave this page.";
            case 2:
                return "SOW (Ex A) generation is in progress.Note: This should take about 30 seconds.Please do not refresh / leave this page.";
        }
    };
    return (
        <Grid container sx={{ padding: "0 2.4rem " }} flexDirection="column">
            <Box>
                <BaseDialog
                    button={null}
                    content={
                        <React.Fragment>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                                alignItems={"center"}
                                justifyContent={"center"}
                                flexDirection={"column"}
                                width={"50rem"}
                                height={"25rem"}
                                gap="2rem"
                            >
                                <Card
                                    sx={{
                                        width: "2.75rem",
                                        height: "2.75rem",
                                        boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.11)",
                                        borderRadius: "8px",
                                    }}
                                >
                                    <CardMedia component="img" image={loader} alt="loading..." />
                                </Card>
                                <Typography
                                    textAlign="center"
                                    width={"75%"}
                                    variant="text_18_medium"
                                >
                                    {getLoaderCopy()}
                                </Typography>
                            </Box>
                        </React.Fragment>
                    }
                    open={bidbookSaveInprogress}
                    setOpen={() => setBidbookSaveInprogress(false)}
                />
            </Box>

            <Grid item md={12} sm={12}>
                <BaseTabs
                    currentTab={currentTab}
                    onTabChanged={onTabChanged}
                    //@ts-ignore
                    tabList={BIDBOOK_TABS()}
                    tabColor="#004D71"
                />
                {currentTab == "/bidbookmodifier" ? (
                    !isExportedOnce && (
                        <ContentPlaceholder
                            onLinkClick={() => NavigateBudget()}
                            text="Baseline bidbook not saved yet."
                            aText="Please use the Budgeting tab."
                            height={"70vh"}
                            isLink
                        />
                    )
                ) : latestRenoBidbookVerion == null ? (
                    <ContentPlaceholder
                        onLinkClick={() => setCurrentTab("/bidbookmodifier")}
                        text="To save a new version, "
                        aText="use the Bidbook Modifier tab."
                        height={"70vh"}
                        isLink
                    />
                ) : (
                    <BaseAutoComplete
                        variant={"outlined"}
                        options={versioDropDownOptions}
                        placeholder={"select version"}
                        label={"Bidbook Version"}
                        onChange={(event: any, newValue: any) => {
                            setSelectedBidbookVerion(newValue);
                        }}
                        value={selectedBidbookVerion}
                        defaultValue={latestRenoBidbookVerion}
                    />
                )}
                {(latestRenoBidbookVerion !== null || currentTab == "/bidbookmodifier") &&
                    isExportedOnce && (
                        <>
                            <StepperHorizantal
                                viewMode={viewMode}
                                steps={steps}
                                activeStep={activeStep}
                                savedWithChanges={savedWithChanges}
                            />
                            <Paper elevation={3} sx={{ padding: "24px" }}>
                                <ActionWrapper
                                    ref={actionWrapperRef}
                                    projectType={projectDetails?.projectType}
                                    viewMode={viewMode}
                                    activeStep={activeStep}
                                    setActiveStep={setActiveStep}
                                    save={saveAsNewVersionConfirm}
                                    setSaveChanges={setSaveChanges}
                                    steps={steps}
                                    projectId={projectId}
                                    selectedOption={selectedOption}
                                    onChangeSelectedOption={onChangeSelectedOption}
                                    container_version={container_version}
                                />
                                <Divider sx={{ margin: "20px 0", padding: 0 }}></Divider>
                                <Grid
                                    item
                                    style={{ height: "calc(100vh - 12rem)" }}
                                    xs={12}
                                    sx={{
                                        "& .warning": {
                                            backgroundColor: "#ffc7cd",
                                            color: "#1a3e72",
                                        },

                                        "& .updated": {
                                            fontSize: "0.835rem",
                                            fontWeight: 500,
                                            background: "yellow",
                                        },
                                        " .deleted": {
                                            textDecoration: "line-through",
                                            background: "#ff000099",
                                        },
                                        ".newRow": {
                                            background: "#E3EEF3",
                                        },
                                    }}
                                >
                                    {activeStep === "FLOOR_PLANS" && (
                                        <DefineFloorplans
                                            setIsHavingUnsavedChanges={setIsHavingUnsavedChanges}
                                            saveChanges={saveChanges}
                                            setSavedWithChanges={setSavedWithChanges}
                                            setActiveStep={setActiveStep}
                                            setSaveChanges={setSaveChanges}
                                            viewMode={viewMode}
                                            confirmationCheck={confirmationCheck}
                                            setAddRowConfirmationAccepted={
                                                setAddRowConfirmationAccepted
                                            }
                                            addRowConfirmationAccepted={addRowConfirmationAccepted}
                                            projectId={projectId}
                                            organization_id={organization_id}
                                        />
                                    )}
                                    {activeStep === "INVENTORIES" && (
                                        <DefineInventories
                                            setIsHavingUnsavedChanges={setIsHavingUnsavedChanges}
                                            saveChanges={saveChanges}
                                            setSavedWithChanges={setSavedWithChanges}
                                            setActiveStep={setActiveStep}
                                            setSaveChanges={setSaveChanges}
                                            viewMode={viewMode}
                                            confirmationCheck={confirmationCheck}
                                            setAddRowConfirmationAccepted={
                                                setAddRowConfirmationAccepted
                                            }
                                            addRowConfirmationAccepted={addRowConfirmationAccepted}
                                            projectId={projectId}
                                            organization_id={organization_id}
                                        />
                                    )}
                                    {activeStep === "MANAGE_UNITS" && (
                                        <ManageUnits
                                            setIsHavingUnsavedChanges={setIsHavingUnsavedChanges}
                                            saveChanges={saveChanges}
                                            setSavedWithChanges={setSavedWithChanges}
                                            setActiveStep={setActiveStep}
                                            setSaveChanges={setSaveChanges}
                                            viewMode={viewMode}
                                            confirmationCheck={confirmationCheck}
                                            setAddRowConfirmationAccepted={
                                                setAddRowConfirmationAccepted
                                            }
                                            addRowConfirmationAccepted={addRowConfirmationAccepted}
                                            projectId={projectId}
                                            organization_id={organization_id}
                                        />
                                    )}
                                    {activeStep === "BASE_BID" && (
                                        <BaselineBid
                                            setIsHavingUnsavedChanges={setIsHavingUnsavedChanges}
                                            categoryData={categoryData}
                                            containerItemsList={containerItemsList}
                                            saveChanges={saveChanges}
                                            setSavedWithChanges={setSavedWithChanges}
                                            setActiveStep={setActiveStep}
                                            setSaveChanges={setSaveChanges}
                                            viewMode={viewMode}
                                            selectedBidbookVerion={selectedBidbookVerion}
                                            selectedVersionData={selectedVersionData}
                                            loading={loadingVersionedData}
                                            confirmationCheck={confirmationCheck}
                                            setAddRowConfirmationAccepted={
                                                setAddRowConfirmationAccepted
                                            }
                                            addRowConfirmationAccepted={addRowConfirmationAccepted}
                                            projectId={projectId}
                                            organization_id={organization_id}
                                        />
                                    )}
                                    {activeStep === "ALTERNATIVES" && (
                                        <Alts
                                            setIsHavingUnsavedChanges={setIsHavingUnsavedChanges}
                                            categoryData={categoryData}
                                            containerItemsList={containerItemsList}
                                            saveChanges={saveChanges}
                                            setSavedWithChanges={setSavedWithChanges}
                                            setActiveStep={setActiveStep}
                                            setSaveChanges={setSaveChanges}
                                            viewMode={viewMode}
                                            selectedBidbookVerion={selectedBidbookVerion}
                                            selectedVersionData={selectedVersionData}
                                            loading={loadingVersionedData}
                                            confirmationCheck={confirmationCheck}
                                            setAddRowConfirmationAccepted={
                                                setAddRowConfirmationAccepted
                                            }
                                            addRowConfirmationAccepted={addRowConfirmationAccepted}
                                            projectId={projectId}
                                            organization_id={organization_id}
                                        />
                                    )}
                                    {activeStep === "FLOORING" && (
                                        <FlooringBid
                                            setIsHavingUnsavedChanges={setIsHavingUnsavedChanges}
                                            categoryData={categoryData}
                                            containerItemsList={containerItemsList}
                                            saveChanges={saveChanges}
                                            setSavedWithChanges={setSavedWithChanges}
                                            setActiveStep={setActiveStep}
                                            setSaveChanges={setSaveChanges}
                                            viewMode={viewMode}
                                            selectedBidbookVerion={selectedBidbookVerion}
                                            selectedVersionData={selectedVersionData}
                                            loading={loadingVersionedData}
                                            confirmationCheck={confirmationCheck}
                                            setAddRowConfirmationAccepted={
                                                setAddRowConfirmationAccepted
                                            }
                                            addRowConfirmationAccepted={addRowConfirmationAccepted}
                                            projectId={projectId}
                                            organization_id={organization_id}
                                        />
                                    )}
                                </Grid>
                                <DialogBox
                                    // @ts-ignore
                                    showDialog={showPrompt}
                                    confirmNavigation={confirmNavigation}
                                    cancelNavigation={cancelNavigation}
                                />
                                <Dialog
                                    open={addRowConfirmation}
                                    onClose={() => setAddRowConfirmation(false)}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                        {"Are you sure to want add another row?"}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText
                                            id="alert-dialog-description"
                                            sx={{ color: "#1c5da9" }}
                                        >
                                            You have just added a new row. Would you like to add
                                            another row as well?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <FormControlLabel
                                            sx={{ color: "#5808b8" }}
                                            control={
                                                <Checkbox
                                                    checked={checked}
                                                    onChange={handleCheckboxChange}
                                                    sx={{ color: "#5808b8" }}
                                                />
                                            }
                                            label="Do not show for 15 days"
                                        />
                                        <Button onClick={() => setAddRowConfirmation(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setAddRowConfirmationAccepted(true);
                                                setAddRowConfirmation(false);
                                                setIsHavingUnsavedChanges(true);
                                            }}
                                            // eslint-disable-next-line jsx-a11y/no-autofocus
                                            autoFocus
                                        >
                                            Proceed
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Paper>
                        </>
                    )}
            </Grid>
        </Grid>
    );
};

export default BidBook;
