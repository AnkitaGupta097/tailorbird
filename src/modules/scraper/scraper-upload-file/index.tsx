/* eslint-disable jsx-a11y/label-has-associated-control*/
import {
    Button,
    Typography,
    Grid,
    TextField,
    TextFieldProps,
    styled,
    Card,
    CardMedia,
} from "@mui/material";
import React, { DragEvent, useEffect, useState } from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import { shallowEqual } from "react-redux";
import actions from "../../../stores/actions";
import BaseDialog from "../../../components/base-dialog";
import { fileUpload } from "../constant";
import loader from "../../../assets/icons/loader.gif";
import AppTheme from "../../../styles/theme";
import { useNavigate } from "react-router-dom";
import OwnerShip from "components/ownership-dropdown";
import { landingPageConstants } from "../../package-manager/constants";
import { IOrg } from "../../package-manager/interfaces";

const UploadFileTextField = styled(TextField)<TextFieldProps>(() => ({
    width: "100%",
    borderRadius: 0,
    margin: "1.25rem 0rem 1.25rem 0rem",
    color: "primary",
    id: "standard-basic",
}));

const UploadFile = (props: { open: boolean; handleClose: () => void; setOpen: any }) => {
    //Redux
    const dispatch = useAppDispatch();

    //Navigation
    const nav = useNavigate();

    //Initialization
    const initialUploadModalState = {
        file: null,
        name: "",
        description: "",
        ownership: {
            id: "",
            name: "",
            email: "",
            address: "",
            createdBy: "",
            contactNumber: "",
            label: "",
        },
    };

    //States
    const [inputErrors, setInputErrors] = useState({
        isNameError: false,
        isOwnershipError: false,
    });
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [packageMetaData, setpackageMetaData] = useState<{
        file: File | null;
        name: string;
        ownership: IOrg;
        description: string;
    }>(initialUploadModalState);
    const [uploadSuccess, setuploadSuccess] = useState(false);

    //Redux
    const { loading, data, uploading } = useAppSelector((state) => {
        return {
            loading: state.scraperService.scraper.loading,
            uploading: state.scraperService.scraper.uploading,
            data: state.scraperService.scraper.data,
        };
    }, shallowEqual);

    //Hooks
    useEffect(() => {
        return () => handleJobUploadModalOpen(false);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (uploading.status == "success" && uploading.url) {
            setuploadSuccess(true);
            setTimeout(() => handleJobUploadModalOpen(false), 2000);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploading]);

    useEffect(() => {
        uploadSuccess &&
            props?.open &&
            nav(`/scraper/highlight_results/${data[data.length - 1].job_id}`);
        //eslint-disable-next-line
    }, [uploadSuccess]);

    //Functions
    const handlePackageMetadata = (attr: string, val: File | IOrg) => {
        setpackageMetaData({
            ...packageMetaData,
            [attr]: val,
        });
    };
    const handleJobUploadModalOpen = (value: boolean) => {
        if (!value) {
            resetAll();
        }
        dispatch(actions.scraperService.uploadNewJobFailure());
        props?.setOpen(value);
    };
    function resetAll() {
        setpackageMetaData(initialUploadModalState);
        setuploadSuccess(false);
    }
    const handleFileUpload = async () => {
        let _inputErrors = { ...inputErrors };
        const filePath = "scraper";
        _inputErrors = {
            ..._inputErrors,
            isNameError: packageMetaData?.name?.trim() == "",
            isOwnershipError:
                packageMetaData?.ownership?.name?.trim() == "" ||
                packageMetaData?.ownership === null ||
                packageMetaData?.ownership?.id == null,
        };
        if (_inputErrors.isNameError || _inputErrors.isOwnershipError) {
            setInputErrors({ ..._inputErrors });
            return;
        }
        setInputErrors({
            ...inputErrors,
            isNameError: false,
            isOwnershipError: false,
        });
        dispatch(
            actions.scraperService.uploadNewJobStart({
                name: packageMetaData?.name,
                ownership_name: packageMetaData?.ownership?.name,
                ownership_group_id: packageMetaData?.ownership?.id,
                description: packageMetaData?.description,
                fileName: packageMetaData?.file?.name,
                filePath: filePath,
                file: packageMetaData?.file,
            }),
        );
    };
    const onDrop = (e: DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (inputRef.current && e.dataTransfer.files.length > 0) {
            inputRef.current.files = null;
            inputRef.current.files = e.dataTransfer.files;
            handlePackageMetadata("file", e.dataTransfer.files[0]);
        }
    };
    const onDragOver = (e: DragEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const onDragEnter = (e: DragEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
    };

    return (
        <BaseDialog
            hideBackdrop={true}
            button={undefined}
            sx={{
                ".MuiPaper-root": {
                    maxWidth: "30.125rem",
                },
            }}
            content={
                loading ? (
                    <BaseDialog
                        sx={{ borderRadius: "8px", boxShadow: "none", opacity: "unset" }}
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
                                            margin: "6rem 15rem 1.6rem 15rem",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={loader}
                                            alt="loading..."
                                        />
                                    </Card>
                                    <Typography variant="tableData" color={AppTheme.text.light}>
                                        {fileUpload.inProgressText}
                                    </Typography>
                                </Grid>
                            </Grid>
                        }
                        setOpen={() => {}}
                        button={undefined}
                    />
                ) : (
                    <React.Fragment>
                        {uploadSuccess && (
                            <Typography
                                sx={{ textAlign: "center" }}
                                variant="tableData"
                                color={AppTheme.text.light}
                            >
                                {fileUpload.uploadedJobText}
                            </Typography>
                        )}
                        {!uploadSuccess && (
                            <Grid container direction={"column"}>
                                <Grid item xs={12}>
                                    <Typography color={AppTheme.text.light} variant="tableData">
                                        {fileUpload.textFieldLabels.name}
                                    </Typography>
                                    <UploadFileTextField
                                        value={packageMetaData["name"]}
                                        onChange={(event: any) => {
                                            handlePackageMetadata("name", event.target.value);
                                        }}
                                        error={!!inputErrors?.isNameError}
                                        helperText={
                                            !!inputErrors?.isNameError && "Name is mandatory field"
                                        }
                                    />
                                    <Typography color={AppTheme.text.light} variant="tableData">
                                        {fileUpload.textFieldLabels.ownership}
                                    </Typography>
                                    <OwnerShip
                                        autocompleteSx={{
                                            width: "100%",
                                            borderRadius: 0,
                                            margin: "1.25rem 0rem 1.25rem 0rem",
                                            color: "primary",
                                            id: "standard-basic",
                                        }}
                                        setState={(val?: IOrg) => {
                                            //@ts-ignore
                                            handlePackageMetadata("ownership", val);
                                        }}
                                        value={packageMetaData?.["ownership"]}
                                        placeholder={landingPageConstants.OWNERSHIP_GROUP}
                                        error={!!inputErrors?.isOwnershipError}
                                        helperText={
                                            !!inputErrors?.isOwnershipError &&
                                            "Ownership group is mandatory field"
                                        }
                                    />
                                    <Typography variant="tableData" color={AppTheme.text.light}>
                                        {fileUpload.textFieldLabels.description}
                                    </Typography>
                                    <UploadFileTextField
                                        multiline
                                        value={packageMetaData["description"]}
                                        onChange={(event: any) => {
                                            handlePackageMetadata(
                                                "description",
                                                event.target.value,
                                            );
                                        }}
                                    />
                                </Grid>

                                <label
                                    htmlFor="scraper_upload"
                                    style={{ width: "100%", height: "100%", marginTop: "1.25rem" }}
                                >
                                    <Button
                                        sx={{
                                            height: "7.6rem",
                                            display: "flex",
                                            backgroundColor: "rgba(223, 224, 235, 0.1)",
                                            boxShadow: "none",
                                            flexDirection: "column",
                                            border: `1px solid ${AppTheme.palette.secondary.main}`,
                                        }}
                                        disabled={false}
                                        onDrop={onDrop}
                                        onDragOver={onDragOver}
                                        onDragEnter={onDragEnter}
                                        component={"span"}
                                    >
                                        <input
                                            hidden
                                            id={"scraper_upload"}
                                            type="file"
                                            accept=".xlsx, .xlsm, .pdf, .docx"
                                            onChange={(event) => {
                                                if (event && event.target && event.target.files)
                                                    handlePackageMetadata(
                                                        "file",
                                                        event?.target?.files[0],
                                                    );
                                            }}
                                            ref={inputRef}
                                        />
                                        <CloudUploadOutlinedIcon
                                            style={{ color: "#E2E2E2", fontSize: "2.9rem" }}
                                        />
                                        <Typography
                                            variant="tableData"
                                            color={AppTheme.text.light}
                                            style={{ whiteSpace: "pre-line", textAlign: "center" }}
                                        >
                                            {packageMetaData.file?.name ||
                                                `Drop your file here. 
                                                (Formats: .pdf / .doc / .xls)`}
                                        </Typography>
                                    </Button>
                                </label>
                            </Grid>
                        )}
                    </React.Fragment>
                )
            }
            open={props?.open}
            setOpen={props?.setOpen}
            actions={
                !loading &&
                !uploadSuccess && (
                    <React.Fragment>
                        <Button
                            variant="contained"
                            onClick={props?.handleClose}
                            sx={{
                                flex: 0.5,
                                textTransform: "none",
                                width: "13.6rem",
                                height: "3.1rem",
                                margin: "1rem 0 1.7rem 1rem",
                                borderRadius: "0.3rem",
                            }}
                            color="secondary"
                        >
                            <Typography variant="tableData">
                                {fileUpload.actionsText.cancel}
                            </Typography>
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleFileUpload}
                            sx={{
                                flex: 0.5,
                                textTransform: "none",
                                width: "13.6rem",
                                height: "3.1rem",
                                margin: "1rem 1rem 1.7rem 0",
                                borderRadius: "0.3rem",
                            }}
                            color="primary"
                        >
                            <Typography variant="tableData">
                                {fileUpload.actionsText.submit}
                            </Typography>
                        </Button>
                    </React.Fragment>
                )
            }
        />
    );
};

export default UploadFile;
