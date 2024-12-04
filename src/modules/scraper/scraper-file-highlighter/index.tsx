import { Button, Card, CardMedia, Grid, styled, Typography, useTheme } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { IScrapingStatusResponse } from "../interface";
import NavigationBar from "./navigation-bar";
import TextHighlightGrid from "./scraper-modal-grid";
import { useNavigate, useParams } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import { client } from "../../../stores/gql-client";
import { getJobStatus } from "../../../stores/scraper/service/scraper-queries";
import { getExtractedText } from "../../../stores/scraper/pdf-scraper/pdf-scraper-queries";
import actions from "../../../stores/actions";
import BaseDialog from "../../../components/base-dialog";
import loader from "../../../assets/icons/loader.gif";
import { ButtonLabels } from "../constant";

export const PrimaryButton = styled(Button)(({ theme }) => ({
    borderRadius: "5px",
    minWidth: "9rem",
    minHeight: "3.125rem",
    background: theme.palette.primary.main,
    color: theme.text.white,
    textTransform: "none",
    "&:hover": {
        background: theme.palette.primary.main,
    },
}));
export const SecondaryButton = styled(PrimaryButton)(({ theme }) => ({
    background: theme.palette.secondary.main,
    color: theme.text.dark,
    "&:hover": {
        background: theme.palette.secondary.main,
    },
}));

const ScrapperTextHighLighter: FC = () => {
    // hooks
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const onClose = () => navigate(`/scraper`);
    const { jobId } = useParams();
    const [skus, setSkus] = useState<Array<string>>([]);
    const [isFileUrlNull, setIsFileUrlNull] = useState(true);

    if (!jobId) {
        navigate("/scraper", { replace: true });
    }
    //eslint-disable-next-line
    const { snackbar, pdfUploadData, loading, saving } = useAppSelector((state) => {
        return {
            loading: state.scraperService.pdfscraper.loading,
            saving: state.scraperService.pdfscraper.saving,
            snackbar: state.common.snackbar,
            pdfUploadData: state.scraperService.pdfscraper.data[jobId ?? ""],
        };
    }, shallowEqual);

    useEffect(() => {
        if (pdfUploadData?.skus) {
            const skuList = pdfUploadData?.skus.map((item: any) => {
                if (item.sku != null) {
                    return item.sku;
                } else if (item.url_text != null) {
                    return item.url;
                } else return null;
            });
            //eslint-disable-next-line
            const finalList = skuList?.filter((i: string | null) => i != null);
            setSkus(finalList ?? []);
        }
    }, [pdfUploadData]);

    useEffect(() => {
        let response: any = null;
        let statusInterval: any;
        async function jobStatus() {
            const isJobStarted: IScrapingStatusResponse = await client.query(
                "getJobStatus",
                getJobStatus,
                { job_id: jobId },
            );
            return isJobStarted.status;
        }
        if (!pdfUploadData) {
            if (!statusInterval) {
                statusInterval = setInterval(async () => {
                    const status = await jobStatus();
                    if (status == "success" || status == "progress") {
                        navigate(`/scraper/${jobId}/results`);
                        clearInterval(statusInterval);
                    } else if (status == "submitted") {
                        response = await client.query("getExtractedText", getExtractedText, {
                            job_id: jobId,
                        });
                        if (response?.spec_file?.parsed_file_reference) {
                            gotSuccess();
                        } else {
                            setIsFileUrlNull(true);
                        }
                    }
                }, 5000);
            }
        } else {
            setIsFileUrlNull(false);
            clearInterval(statusInterval);
        }
        async function gotSuccess() {
            if (response?.spec_file?.parsed_file_reference) {
                const fileContent = await fetch(response?.spec_file?.parsed_file_reference)
                    .then((r) => {
                        return r.text();
                    })
                    .then((text) => text);
                dispatch(
                    actions.scraperService.fetchPdfScraperStart({
                        job_id: jobId,
                        spec_file: response?.spec_file,
                        fileContent: fileContent,
                    }),
                );
            }
            clearInterval(statusInterval);
            setIsFileUrlNull(false);
        }
        return () => clearInterval(statusInterval);
        //eslint-disable-next-line
    }, []);

    const handleSaveSKUS = async (notes: string[]) => {
        dispatch(actions.scraperService.updateSelectedSkusStart({ skus: notes, job_id: jobId }));
        navigate(`/scraper/highlight_results/${jobId}/results`);
    };

    if (loading || isFileUrlNull) {
        return (
            <BaseDialog
                button={undefined}
                open={loading || isFileUrlNull}
                setOpen={() => {}}
                content={
                    <BaseDialog
                        sx={{ borderRadius: "8px", boxShadow: "none", opacity: "unset" }}
                        hideBackdrop={false}
                        open={loading || isFileUrlNull}
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
                                            margin: "6rem 15rem 1.6rem 15rem",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={loader}
                                            alt="loading..."
                                        />
                                    </Card>
                                    <Typography variant="body1" color={theme.text.light}>
                                        {saving
                                            ? "Saving selected skus..."
                                            : "Your file is being processed it will take a few minutes."}
                                    </Typography>
                                </Grid>
                            </Grid>
                        }
                        setOpen={() => {}}
                        button={undefined}
                    />
                }
            />
        );
    }

    return (
        <Grid container sx={{ backgroundColor: theme.background.scrappedDetails }}>
            <Grid item>
                <NavigationBar
                    skus={skus}
                    fileName={pdfUploadData?.spec_file.file_name}
                    margin="10rem"
                    content={
                        <React.Fragment>
                            <SecondaryButton variant="contained" onClick={onClose}>
                                <Typography variant="button">{ButtonLabels.CLOSE}</Typography>
                            </SecondaryButton>
                            <PrimaryButton
                                variant="contained"
                                onClick={() => handleSaveSKUS(skus.filter((sku) => sku !== ""))}
                            >
                                <Typography variant="button">
                                    {ButtonLabels.SEARCH_ITEMS}
                                </Typography>
                            </PrimaryButton>
                        </React.Fragment>
                    }
                />
            </Grid>
            <Grid
                item
                sx={{
                    background: theme.background.white,
                    margin: "2rem 10rem",
                    borderRadius: "8px",
                    boxShadow: "0 0 111px 0 rgba(0,0,0,0.1)",
                }}
                xs
            >
                <TextHighlightGrid
                    highlightedText={skus}
                    setHighlightedText={setSkus}
                    fileContent={pdfUploadData?.fileContent}
                />
            </Grid>
        </Grid>
    );
};
export default ScrapperTextHighLighter;
