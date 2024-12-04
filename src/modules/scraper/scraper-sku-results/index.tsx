import {
    Alert,
    Box,
    Card,
    CardMedia,
    Checkbox,
    Divider,
    Grid,
    Snackbar,
    styled,
    Typography,
    useTheme,
} from "@mui/material";
import { cloneDeep, groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "../../../stores/gql-client";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import NavigationBar from "../scraper-file-highlighter/navigation-bar";
import { IScrapingStatusResponse } from "./common/interfaces";
import { getJobStatus } from "../../../stores/scraper/service/scraper-queries";
import actions from "../../../stores/actions";
import {
    exportAsPackage,
    getScrapedResultsColumns,
    removeSelected,
    setCategoriesToEdit,
    setSKUStatus,
} from "./common/helper";
import { PrimaryButton, SecondaryButton } from "../scraper-file-highlighter";
import { ButtonLabels } from "../constant";
import SavePackageModal from "../../package-manager/save-package";
import { getAllSubCategories } from "../../../stores/packages/creation/queries";
import BaseDialog from "../../../components/base-dialog";
import AppTheme from "../../../styles/theme";
import loader from "../../../assets/icons/loader.gif";
import { LOADER, SCRAPED_SKUS_RESULTS, SCRAPED_STAGE } from "./common/constant";
import ScraperDialog from "./scraper-dialog";
import { SuccessIcon } from "../helper";
import ScraperTable from "./scraper-table";
import BasePagination from "../../../components/base-pagination";
import ScraperSkuGroups from "./scraper-sku-groups";
import BulkEdit from "./scraper-bulk-edit";
import Success from "../../../assets/icons/icon-correct.svg";
import ScraperErrorFilter from "./scraper-error-filter";
import { useCallbackPrompt } from "hooks/use-callback-prompt";
import DialogBox from "modules/package-manager/create-edit-package/warning-dialog";

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    border: `1px solid ${theme.background.selectedSKU}`,
    borderRadius: "4px",
    backgroundColor: theme.palette.secondary.light,
    width: "1.4rem",
    height: "1.4rem",
}));

const ScrapedSKUSResults = () => {
    const theme = useTheme();

    //Params
    const { jobId } = useParams();

    //Navigation
    const navigate = useNavigate();

    //Redux
    const dispatch = useAppDispatch();
    const {
        snackbar,
        pdfUploadData,
        loading,
        jobdetails,
        allSubCats,
        skusWithCount,
        finish,
        style,
        grade,
        category,
        packages,
        subcategory,
        supplier,
        packageCreateSearch,
    } = useAppSelector((state) => {
        return {
            loading: state.scraperService.pdfscraper.loading,
            snackbar: state.common.snackbar,
            pdfUploadData: state.scraperService.pdfscraper.data,
            jobdetails: jobId ? state.scraperService.scraper.jobDetails[jobId] : {},
            allSubCats: state.packageManager.packages.allSubCats,
            skusWithCount: jobId ? state.scraperService.scraper.skusWithCount[jobId] : {},
            finish: state.scraperService.scraper.categories.finish,
            style: state.scraperService.scraper.categories.style,
            grade: state.scraperService.scraper.categories.grade,
            category: state.scraperService.scraper.categories.category,
            packages: state.scraperService.scraper.categories.package,
            subcategory: state.scraperService.scraper.categories.subcategory,
            supplier: state.scraperService.scraper.categories.supplier,
            packageCreateSearch: state.scraperService.scraper.categories,
        };
    }, shallowEqual);
    const { subcategory_pair } = packageCreateSearch;
    const categoriesInfo = groupBy(subcategory_pair, "category");

    //States

    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(true);

    // State for storing scraped job status
    const [scrapingStatus, setscrapingStatus] = React.useState<IScrapingStatusResponse>({
        status: "fetching",
        completed: 0,
        failed: 0,
        total: 0,
    });

    // State for storing scraped job details that gets modified for API update
    const [data, setData] = useState<
        {
            [x: string]: any;
        }[]
    >([]);

    // State for storing scraped job details viewed in scraper table
    const [tableData, setTableData] = useState<
        {
            [x: string]: any;
        }[]
    >([]);

    // State for storing skus selected by user in highlight interface, retrived from backend
    const [skus, setSkus] = useState<[{ sku: string; count: number; isSelected: boolean }]>([
        { sku: "", count: 0, isSelected: false },
    ]);

    // State for change image popper
    const [anchorEl, setAnchorEl] = React.useState<{ id: number; value: null | HTMLElement }>({
        id: 0,
        value: null,
    });

    // state for storing deleted skus of scraper table
    const [deleteList, setDeleteList] = useState<any[]>([]);

    // state for storing errors present in skus of scraper table
    const [errorsPresent, setErrorsPresent] = useState(true);

    // common reusable state for all loader dialogs in scraper
    const [showDialog, setShowDialog] = useState<{ open: boolean; message: string; icon: any }>({
        open: false,
        message: "",
        icon: undefined,
    });

    // State that stores if save package dialog window has to be opened
    const [packageSaveModalOpen, setPackageSaveModal] = React.useState(false);

    // State that stores data updated in skus of scraper table
    const [modifiedData, setModifiedData] = useState<{ subcategories: any[]; data: any[] }>({
        subcategories: [],
        data: [],
    });

    // State that stores column data of scraper table
    const [columns, setColumns] = useState<any[]>([]);

    // stores all selected/ deselected state of SKUs from scraper group
    const [isChecked, setIsChecked] = useState<{ index: number; value: boolean }>({
        index: -1,
        value: false,
    });
    const [refreshScrapeData, setRefreshScrapedata] = useState(false);
    // stores all specific SKUs of scraper group that are selected
    const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);

    const fileName = pdfUploadData?.spec_file?.file_name.length
        ? pdfUploadData?.spec_file?.file_name
        : jobdetails?.job?.file_name;

    // Stores bulk edit category and their options
    const [bulkEdit, setBulkEdit] = useState<any[]>();

    // Stores highlighted sku id along with the job status with the same id
    const [skuStatus, setSkuStatus] = useState<{
        skuNumber: {
            id: number;
            status: string;
        }[];
    }>();

    // Stores type and value to differentiate between incomplete and not found filter
    const [isNotFoundOrIncomplete, setIsNotFoundOrIncomplete] = useState<{
        type: string;
        value: boolean;
    }>({
        type: "not_found",
        value: false,
    });
    // Stores the value wihich decides if real time scraping status is to be shown or not
    const [showScrapingStatus, setShowScrapingStatus] = useState<boolean>(false);

    //Pagination
    const [page, setPage] = React.useState(1);
    const index = page === 1 ? 0 : page - 1;
    const paginatedData =
        tableData?.length > 0 ? tableData?.slice(index * 11, index * 11 + 11) : [];
    const totalNoOfPages = Math.ceil(tableData?.length / 11);

    //Hooks
    useEffect(() => {
        dispatch(
            actions.scraperService.fetchDataForSearchFiltersStart({
                input: {},
            }),
        );
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (scrapingStatus?.status === "progress") setShowScrapingStatus(true);
        if (scrapingStatus?.status === "success") {
            const toRef = setTimeout(() => {
                setShowScrapingStatus(false);
                clearTimeout(toRef);
            }, 10000);
        }
    }, [scrapingStatus?.status]);

    useEffect(
        () => {
            const options = getScrapedResultsColumns({
                finish: finish,
                style: style,
                grade: grade,
                category: category,
                package: packages,
                subcategory: [],
                supplier: supplier,
            });
            setColumns(options);

            const setEdit = setCategoriesToEdit({
                finish: finish,
                style: style,
                grade: grade,
                subcategory: [],
                category: category,
            });
            setBulkEdit(setEdit);
        },
        //eslint-disable-next-line react-hooks/exhaustive-deps
        //@ts-ignore
        [finish, style, grade, category, packages, subcategory, supplier],
    );

    useEffect(() => {
        if (jobdetails?.data && jobdetails?.data.length > 0 && allSubCats.length > 0) {
            const statusDetails = setSKUStatus({
                jobdetails: jobdetails?.data,
                allSubCats: allSubCats,
            });
            setSkuStatus(statusDetails);
            setData(jobdetails?.data);
            if (!(checkedIndexes?.length > 0)) setTableData(jobdetails?.data);

            //If sub category is missing from any of the job details fetched, mark the data as error
            const subCategoryMap: any = {};
            allSubCats.forEach((subCategory: any) => (subCategoryMap[subCategory] = 1));
            jobdetails?.data.forEach((row: any) => {
                if (!(row.result && subCategoryMap[row.result.subcategory])) {
                    setErrorsPresent(true);
                }
            });
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobdetails, allSubCats]);

    useEffect(() => {
        //When the SKUs from scraper table are deleted, updated SKU count of the scraper group as well
        if (skusWithCount?.skus) {
            setSkus(skusWithCount?.skus);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skusWithCount]);

    useEffect(() => {
        if (showDialog.open) {
            setTimeout(() => {
                onClose(), setRefreshScrapedata(false);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [showDialog]);

    useEffect(() => {
        //eslint-disable-next-line
        let statusInterval: any;
        if (!jobdetails) {
            if (!statusInterval) {
                statusInterval = setInterval(async () => {
                    const response: IScrapingStatusResponse = await client.query(
                        "getJobStatus",
                        getJobStatus,
                        { job_id: jobId },
                    );
                    setscrapingStatus((s) => ({ ...s, ...response }));
                    if (response?.status === "success") {
                        clearStatusInterval();
                    }
                }, 5000);
            }
        } else if (!allSubCats.length) {
            onScreenLoad();
        }
        function clearStatusInterval() {
            clearInterval(statusInterval);
        }
        async function onScreenLoad() {
            const res = await client.query("getAllSubCategories", getAllSubCategories);

            if (res) {
                dispatch(actions.packageManager.updateStoreWithData({ allSubCats: res }));
            }
        }
        return () => clearInterval(statusInterval);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getScrapeDetails = () => {
        const onScreenLoad = async () => {
            const res = await client.query("getAllSubCategories", getAllSubCategories);

            if (res) {
                dispatch(actions.packageManager.updateStoreWithData({ allSubCats: res }));
            }
        };

        if (!(allSubCats.length > 0)) {
            onScreenLoad();
        }

        const fetchData = async () => {
            await dispatch(
                actions.scraperService.getScrapeJobDetails({
                    job_id: jobId,
                    skuStatus: scrapingStatus?.status,
                    deletedList: jobdetails?.deletedList,
                }),
            );

            await dispatch(
                actions.scraperService.fetchSKUsWithCountStart({
                    job_id: jobId,
                }),
            );
        };

        fetchData();
    };

    useEffect(() => {
        if (scrapingStatus?.completed > 0 || scrapingStatus?.failed > 0) {
            getScrapeDetails();
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrapingStatus.completed, scrapingStatus.failed]);

    //Functions

    const handleClickAway = (id: number) => {
        setAnchorEl({ id: id, value: null });
    };

    const handleClick = (id: number, event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(
            anchorEl?.value && anchorEl?.id === id
                ? { id: id, value: null }
                : { id: id, value: event.currentTarget },
        );
    };

    const onCellValueChange = (
        list: {
            skuNumber: string;
            id: number;
            key: string;
            value: string;
        }[],
    ) => {
        let gSupplier = "";
        let skuNumber = "";
        const selectedItemsResults: any = [];
        let skuStatusCopy = skuStatus;
        let tableDataCopy = cloneDeep(tableData);
        const updatedData = cloneDeep(data).map((product: any) => {
            // If the scraper table data changes, find the index of tableData which has same sku number and id as the input
            let selectedObj: any = {};
            let foundIndex = list.findIndex((l) => l.id === product?.id);
            let id = 0;
            let key = "";
            let value = "";
            if (foundIndex >= 0) {
                skuNumber = list[foundIndex].skuNumber;
                id = list[foundIndex].id;
                key = list[foundIndex].key;
                value = list[foundIndex].value;
            }

            let index = tableDataCopy.findIndex((item) => item.id === id);

            if (product.id === id) {
                selectedObj.id = product.id;
                selectedObj.description = product.result?.description ?? "";
                selectedObj.finish = product.result?.finish ?? "";
                selectedObj.grade = product.result?.grade ?? "";
                selectedObj.item_number = product.result?.item_number ?? "";
                selectedObj.manufacturer_name = product.result?.manufacturer_name ?? "";
                selectedObj.model_number = product.result?.model_number ?? "";
                selectedObj.price = product.result?.price ?? "";
                selectedObj.style = product.result?.style ?? "";
                selectedObj.subcategory = product.result?.subcategory ?? "";
                selectedObj.category = product.result?.category ?? "";
                selectedObj.product_thumbnail_url = product.result?.product_thumbnail_url ?? "";
                selectedObj.supplier = product.result?.supplier ?? "";
                selectedObj[key] = value;

                if (key === "subcategory") {
                    //@ts-ignore
                    let keys = Object.keys(skuStatusCopy);

                    if (keys !== undefined && keys?.includes(skuNumber)) {
                        //@ts-ignore
                        let skuJobs: any = skuStatusCopy?.[skuNumber];
                        let index = skuJobs?.findIndex((job: any) => job.id === id);
                        if (index !== -1) skuJobs[index].status = "success";
                        setSkuStatus(skuStatusCopy);
                    }
                    gSupplier = product.vendor;
                    const changeFromSystemSubcategory = !!allSubCats.find(
                        (subcategory) => subcategory === product.subcategory,
                    );

                    const subCatObj = {
                        vendor: gSupplier,
                        subcategory: value,
                        vendor_subcategory: product.result.vendor_subcategory,
                    };
                    if (changeFromSystemSubcategory || value?.trim() === "") {
                        product.result.subcategory = value;
                    }
                    setModifiedData((prev) => {
                        /**
                         * Change from Door Handles to Door Hardware (Known subcategory)
                         * Change from Door Hardware to Dummy Door Hardware (Know subcategory)
                         * Result must be Door Handles -> Dummy Door Hardware
                         */
                        let s = cloneDeep(prev);
                        const index = s.subcategories.findIndex(
                            (i) =>
                                i.vendor === gSupplier &&
                                i.vendor_subcategory === product.vendor_subcategory,
                        );
                        if (
                            (subCatObj.subcategory?.trim() ?? "") != "" &&
                            (subCatObj.vendor_subcategory?.trim() ?? "") != ""
                        ) {
                            if (index != -1) {
                                s.subcategories[index] = subCatObj;
                            } else {
                                s.subcategories.push(subCatObj);
                            }
                        }
                        return s;
                    });
                }
                if (!product.result) {
                    product.result = {};
                }
                product.result[key] = value;
                // if table data has index same as the modified data, update the specific table data with updated data
                if (index >= 0) {
                    tableDataCopy[index] = product;
                }
                selectedItemsResults.push(selectedObj);
            }
            return product;
        });
        if (!(checkedIndexes?.length > 0)) setTableData(tableDataCopy);
        setData(updatedData);
        selectedItemsResults.forEach(async (obj: any) => {
            await setModifiedData((prev: any) => {
                let s: any = { ...prev };
                const index = s.data.findIndex((i: any) => i.id == obj.id);
                if (index != -1) {
                    s.data[index] = obj;
                } else {
                    s.data.push(obj);
                }
                return s;
            });
        });

        const updatedJobDetails: any = { data: updatedData, job: jobdetails.job };

        //Update job deatils state in Redux store if user has updated any SKU

        dispatch(
            actions.scraperService.updateJobDetailsSuccess({
                job_id: jobId,
                deleteList: deleteList,
                latestData: updatedJobDetails,
            }),
        );
    };

    const SaveJobDetails = () => {
        const updatedJobDetails: any = { data: data, job: jobdetails.job };
        const subCategoryMap: any = {};
        allSubCats.forEach((subCategory: any) => (subCategoryMap[subCategory] = 1));
        const errors = [] as Array<any>;
        data.forEach((row: any) => {
            if (row.result && subCategoryMap[row.result.subcategory] != 1) {
                errors.push(row);
            }
        });
        if (errors.length > 0) {
            window.alert(
                `${SCRAPED_SKUS_RESULTS.ALERT} ${errors.length} ${SCRAPED_SKUS_RESULTS.ITEMS}`,
            );
            return;
        }
        setErrorsPresent(false);
        dispatch(
            actions.scraperService.saveJobDetailsStart({
                job_id: jobId,
                subcategories: modifiedData.subcategories,
                data: modifiedData.data,
                deleteList: deleteList,
                latestData: updatedJobDetails,
            }),
        );
        setShowDialog({ open: true, message: "Changes saved.", icon: Success });
        setRefreshScrapedata(true);
    };

    useEffect(() => {
        if (refreshScrapeData) {
            getScrapeDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshScrapeData]);
    const OnExportSaveHandler = () => {
        setPackageSaveModal(false);
        setShowDialog({ open: true, message: "Package Created", icon: Success });
    };

    const OnExportFailedHandler = () => {
        dispatch(actions.common.openSnack({ variant: "error", message: "Package export failed." }));
    };

    //Initilisations
    const imageStyle = {
        height: "3rem",
        width: "3rem",
        display: "block",
        border: `0.5px solid ${AppTheme.table.border}`,
    };

    const hasSelectedItems = tableData
        ?.map((obj: any) => {
            let s = null;
            if (obj.isSelected) {
                s = obj;
            }
            return s;
        })
        .filter((i) => i != null);

    if ((loading || scrapingStatus.completed === 0) && scrapingStatus.status !== "success") {
        let statusDesc =
            scrapingStatus.completed === 0
                ? scrapingStatus.status === "fetching"
                    ? LOADER.FETCHING_MESSAGE
                    : LOADER.WAITING_MESSAGE
                : LOADER.SERVER_MESSAGE;
        return (
            <BaseDialog
                sx={{ borderRadius: "0.5rem", boxShadow: "none", opacity: "unset" }}
                hideBackdrop={false}
                open={true}
                content={
                    <Grid container>
                        <Grid
                            item
                            sx={{
                                width: "34rem",
                                height: "19rem",
                                textAlign: "center",
                            }}
                        >
                            <Card
                                sx={{
                                    width: "4.3rem",
                                    height: "4.3rem",
                                    margin: "2.8rem 15rem 1.6rem 15rem",
                                }}
                            >
                                <CardMedia component="img" image={loader} alt="loading..." />
                            </Card>
                            {scrapingStatus.status !== "success" && (
                                <Typography variant="heading">{LOADER.HEADING}</Typography>
                            )}
                            <Typography
                                variant="loaderText"
                                color={AppTheme.text.light}
                                sx={{ display: "block", marginTop: "0.8rem" }}
                            >
                                {statusDesc}
                            </Typography>
                            <PrimaryButton
                                sx={{ marginTop: "1.1rem", marginBottom: "2.8rem" }}
                                onClick={() => navigate("/scraper")}
                            >
                                <Typography>{SCRAPED_SKUS_RESULTS.GO_TO_HOME}</Typography>
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                }
                setOpen={() => {}}
                button={undefined}
            />
        );
    }
    const onClose = () => {
        setShowDialog((prev) => {
            if (prev.message === "Package Created") {
                navigate("/scraper", { state: "no warning" });
            }
            return { open: false, message: "", icon: Success };
        });
    };

    return (
        <>
            <DialogBox
                // @ts-ignore
                showDialog={showPrompt}
                confirmNavigation={confirmNavigation}
                cancelNavigation={cancelNavigation}
            />
            <Grid container sx={{ backgroundColor: theme.background.scrappedDetails }}>
                <ScraperDialog
                    open={showDialog.open}
                    onClose={onClose}
                    message={showDialog.message}
                />
                <Grid item sm={12}>
                    <NavigationBar
                        fileName={fileName}
                        margin="2rem"
                        content={
                            <>
                                <Grid container sx={{ gap: "0.6rem" }} alignItems="center">
                                    {showScrapingStatus && (
                                        <>
                                            {scrapingStatus?.status === "progress" && (
                                                <Grid item>
                                                    <img
                                                        src={loader}
                                                        alt="loading..."
                                                        style={{
                                                            width: "1.8rem",
                                                            height: "1.8rem",
                                                        }}
                                                    />
                                                </Grid>
                                            )}
                                            {scrapingStatus?.status === "success" && (
                                                <Grid item>
                                                    <Grid container>
                                                        <Grid item>
                                                            <SuccessIcon
                                                                color={theme.palette.success.light}
                                                                sx={{
                                                                    width: "1.4rem",
                                                                    height: "1.4rem",
                                                                    marginRight: "0.6rem",
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography
                                                                variant="buttonTypography"
                                                                color={theme.palette.success.light}
                                                            >
                                                                {SCRAPED_STAGE.COMPLETED}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            )}

                                            <Grid item textAlign="center">
                                                <Typography
                                                    variant="scrapingStage"
                                                    color={theme.palette.text.primary}
                                                >
                                                    {SCRAPED_STAGE.SCRAPED}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        width: "3rem",
                                                        height: "3rem",
                                                        borderRadius: "0.3rem",
                                                        border: "1px solid #EEEEEE",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="tableData"
                                                        color={theme.palette.success.light}
                                                    >
                                                        {scrapingStatus.completed}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item textAlign="center">
                                                <Typography variant="scrapingStage">
                                                    {SCRAPED_STAGE.ERROR}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        width: "3rem",
                                                        height: "3.1rem",
                                                        borderRadius: "0.3rem",
                                                        border: "1px solid #EEEEEE",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="tableData"
                                                        color={theme.error.scraperStage}
                                                    >
                                                        {scrapingStatus.failed}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item textAlign="center">
                                                <Typography variant="scrapingStage">
                                                    {SCRAPED_STAGE.TOTAL}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        width: "3rem",
                                                        height: "3.1rem",
                                                        borderRadius: "0.3rem",
                                                        border: "1px solid #EEEEEE",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="tableData"
                                                        color={theme.button.export.backgroundColor}
                                                    >
                                                        {scrapingStatus.total}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Divider
                                                    orientation="vertical"
                                                    sx={{
                                                        border: `1px solid ${AppTheme.border.divider} `,
                                                        height: "1.2rem",
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item>
                                        <Grid container flexDirection={"row"} gap="5px">
                                            {hasSelectedItems?.length > 0 &&
                                                bulkEdit?.map((category, index) => {
                                                    return (
                                                        <BulkEdit
                                                            key={index}
                                                            category={category}
                                                            tableData={tableData}
                                                            setShowDialog={setShowDialog}
                                                            index={index}
                                                            onCellValueChange={onCellValueChange}
                                                        />
                                                    );
                                                })}
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        {hasSelectedItems.length > 0 && (
                                            <SecondaryButton
                                                variant="contained"
                                                onClick={() =>
                                                    removeSelected(
                                                        data,
                                                        setData,
                                                        tableData,
                                                        setTableData,
                                                        skus,
                                                        setSkus,
                                                        deleteList,
                                                        setDeleteList,
                                                        setShowDialog,
                                                        dispatch,
                                                        jobdetails.job,
                                                    )
                                                }
                                            >
                                                <Typography variant="button">
                                                    {ButtonLabels.DELETE}
                                                </Typography>
                                            </SecondaryButton>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <Grid container flexDirection={"row"} gap="5px">
                                            {SCRAPED_SKUS_RESULTS.FILTERS.map(
                                                (filterText, index) => {
                                                    return (
                                                        <ScraperErrorFilter
                                                            key={index}
                                                            filterText={filterText}
                                                            isNotFoundOrIncomplete={
                                                                isNotFoundOrIncomplete
                                                            }
                                                            setIsNotFoundOrIncomplete={
                                                                setIsNotFoundOrIncomplete
                                                            }
                                                            jobDetails={data}
                                                            setData={setTableData}
                                                            skusWithCount={skus}
                                                            isChecked={isChecked}
                                                            setIsChecked={setIsChecked}
                                                            checkedIndexes={checkedIndexes}
                                                            setCheckedIndexes={setCheckedIndexes}
                                                            allSubCats={allSubCats}
                                                        />
                                                    );
                                                },
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <PrimaryButton variant="contained" onClick={SaveJobDetails}>
                                            <Typography variant="button">
                                                {ButtonLabels.SAVE}
                                            </Typography>
                                        </PrimaryButton>
                                    </Grid>
                                    <Grid item sm={1}>
                                        {!errorsPresent && scrapingStatus.status === "success" && (
                                            <PrimaryButton
                                                variant="contained"
                                                onClick={() =>
                                                    exportAsPackage(
                                                        data,
                                                        allSubCats,
                                                        setPackageSaveModal,
                                                    )
                                                }
                                            >
                                                <Typography variant="button">
                                                    {ButtonLabels.EXPORT_AS_PACKAGE}
                                                </Typography>
                                            </PrimaryButton>
                                        )}
                                    </Grid>
                                </Grid>
                            </>
                        }
                    />
                </Grid>
                <Grid item sm={12} container margin={"32px"}>
                    <Grid item sm={2.5} md={2.5} xl={2.5} lg={2.5}>
                        <ScraperSkuGroups
                            jobDetails={data}
                            data={tableData}
                            setData={setTableData}
                            skusWithCount={skus}
                            isChecked={isChecked}
                            setIsChecked={setIsChecked}
                            checkedIndexes={checkedIndexes}
                            setCheckedIndexes={setCheckedIndexes}
                            skuStatus={skuStatus}
                            isNotFoundOrIncomplete={isNotFoundOrIncomplete}
                            allSubCats={allSubCats}
                            // allCategories={allCategories}
                        />
                    </Grid>
                    <Grid item sm={9.3} md={9.3} xl={9.3} lg={9.3}>
                        <ScraperTable
                            data={data}
                            setData={setData}
                            tableData={tableData}
                            setTableData={setTableData}
                            imageStyle={imageStyle}
                            skuRows={paginatedData?.map((data: any) => {
                                let skuNumber =
                                    !data?.properties.sku_number ||
                                    String(data?.properties.sku_number).trim() == ""
                                        ? "URLs"
                                        : data?.properties.sku_number;
                                return {
                                    ...data?.result,
                                    id: data.id,
                                    url: data.url,
                                    status: data.status,
                                    isSelected: data?.isSelected,
                                    skuNumber: skuNumber,
                                };
                            })}
                            containerStyle={{
                                margin: "0.4rem 0 0 0.5rem",
                                borderRadius: "0.5rem 0.5rem 0px 0px",
                                border: "1px solid rgba(0, 0, 0, 0.11)",
                                boxShadow: `-1px -.5px 5px .5px ${AppTheme.background.boxShadow}`,
                            }}
                            checkBoxStyle={{
                                border: `0.5px solid ${AppTheme.palette.secondary.dark}`,
                                borderRadius: "0.3rem",
                                backgroundColor: AppTheme.palette.secondary.light,
                                width: "1.4rem",
                                height: "1.4rem",
                            }}
                            columns={columns}
                            anchorEl={anchorEl}
                            setAnchorEl={setAnchorEl}
                            handleClick={handleClick}
                            onChange={onCellValueChange}
                            handleClickAway={handleClickAway}
                            categoriesInfo={categoriesInfo}
                        />
                        <BasePagination noOfPages={totalNoOfPages} setPage={setPage} />
                    </Grid>
                    <SavePackageModal
                        isEditMode={false}
                        isOpen={packageSaveModalOpen}
                        onFailed={OnExportFailedHandler}
                        askOwnershipGroup={true}
                        onSave={OnExportSaveHandler}
                        extraMetadata={{ scraper_job_id: jobId }}
                        onClose={() => {
                            setPackageSaveModal(false);
                        }}
                        setShowDialog={setPackageSaveModal}
                        isScraper
                    />
                    <Snackbar
                        open={snackbar.open}
                        onClose={() => dispatch(actions.common.closeSnack())}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                        <Alert
                            onClose={() => dispatch(actions.common.closeSnack())}
                            severity={snackbar.variant}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Grid>
            </Grid>
        </>
    );
};

export default ScrapedSKUSResults;
