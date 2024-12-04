import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Autocomplete,
    Divider,
    Grid,
    Modal,
    TextField,
    Typography,
    styled,
    Card,
    CardMedia,
} from "@mui/material";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { initialErrors, initialState } from "../../create-sku-modal/common/constants";
import { handleSubmit } from "../../create-sku-modal/common/helper";
import { ICreateSKUState, IErrors } from "../../interfaces";
import { shallowEqual } from "react-redux";
import { graphQLClient as client } from "../../../../utils/gql-client";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import { AddNewSKUModalConstants } from "../../constants";
import { IAddNewSKUModalV2Props } from "../../interfaces";
import { closeHandler } from "../common/helper";
import LabelTextField from "../common/labeltext-field";
import SKUlinkInputComponent from "../sku-link-component";
import actions from "../../../../stores/actions";
import BaseDialog from "../../../../components/base-dialog";
import loader from "../../../../assets/icons/loader.gif";
import AppTheme from "../../../../styles/theme";
import { CancelButton, PrimaryButton } from "../../common";
import { getJobStatus } from "../../../../queries/b2b-project/b2b-project-query";
import { Add } from "@mui/icons-material";
import SubCategoryTile from "./tile";
import { range } from "lodash";

export const CustomTextField = styled(TextField)({
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: AppTheme.buttons.primary,
    },
});

const AddNewSKUModalV2: FC<IAddNewSKUModalV2Props> = ({
    subcategoryPairs,
    open,
    allSubCategories,
    setCreateSKUModal,
    onSubmit,
    setPackageDataExpand,
    setPackageSelectionExpand,
    version,
}) => {
    //Redux
    const { loading, dataFromLink } = useAppSelector((state) => {
        return {
            dataFromLink: state.scraperService.scraper.dataFromLink,
            loading: state.mdm.materials.loading,
        };
    }, shallowEqual);
    const dispatch = useAppDispatch();

    //States
    const [validation, setValidation] = useState({ error: false, errorMsg: "" });
    const [inputErrors, setInputErrors] = useState<IErrors>(initialErrors);
    const [inputs, setInputs] = useState<ICreateSKUState>(initialState);
    const [link, setLink] = useState("");
    const [noOfSubCats, setNoOfSubCats] = useState<number>(1);

    //Functions
    const handleLinkSubmit = async () => {
        if (isValidURL(link)) {
            //vaidation successful, reset validation error to false
            setValidation((prevState) => ({
                ...prevState,
                error: false,
                errorMsg: "",
            }));
            dispatch(actions.scraperService.fetchScrapeDataFromLinkStart(link));
        } else {
            setValidation((prevState) => ({
                ...prevState,
                error: true,
                errorMsg: "Invalid URL entered",
            }));
        }
    };

    const isValidURL = (link: string) => {
        try {
            return Boolean(new URL(link));
        } catch (e) {
            return false;
        }
    };

    const onCloseHandler = () => {
        if (dataFromLink.status === "submitted") {
            return;
        } else {
            closeHandler(setCreateSKUModal);
        }
    };

    const handleClick = () => {
        setPackageSelectionExpand(true);
        setPackageDataExpand(false);
        handleSubmit({
            inputErrors: inputErrors,
            inputs: inputs,
            setInputs: setInputs,
            setInputErrors: setInputErrors,
            setLink: setLink,
            dispatch: dispatch,
            setCreateSKUModal: setCreateSKUModal,
            onSubmit: onSubmit,
            setExpanded: setPackageSelectionExpand,
            setNoOfSubCats: setNoOfSubCats,
            version: version,
        });
    };

    //Hooks
    useEffect(() => {
        let statusInterval: any = null;
        if (dataFromLink.status === "submitted" && dataFromLink.job_id) {
            statusInterval = setInterval(async () => {
                const response: { getJobStatus: { status: string } } = await client.query(
                    "getJobStatus",
                    getJobStatus,
                    { job_id: dataFromLink.job_id },
                );
                if (response?.getJobStatus.status === "success") {
                    gotSuccess();
                }
            }, 5000);
        }
        async function gotSuccess() {
            clearInterval(statusInterval);
            await dispatch(
                actions.scraperService.getLinkScrapeDataStart({
                    job_id: dataFromLink.job_id,
                }),
            );
        }

        if (dataFromLink.status === "success" && dataFromLink.response) {
            const data = dataFromLink.response.data[0].result;
            // If not known subcategory, consider empty
            const isKnownSubcategory = !!allSubCategories?.find(
                (subCategory) => subCategory === data.Subcategory,
            );
            let subCategory = !isKnownSubcategory ? "" : data.subcategory;
            setInputs((prev) => {
                let subCategories = [...prev.Subcategory];
                subCategories[0] = subCategory;
                let descRows = [...prev.Description];
                descRows[0] = data.description ?? "";
                const categories = [...prev.Category];
                categories[0] = data.category ?? "";
                return {
                    ...inputs,
                    Manufacturer: data.manufacturer_name,
                    ModelNumber: data.model_number,
                    Supplier: data.supplier,
                    ItemNumber: data.item_number,
                    Subcategory: subCategories,
                    Style: data.style,
                    Finish: data.finish,
                    Grade: data.grade,
                    Description: descRows,
                    Category: categories,
                };
            });
        }
        return () => clearInterval(statusInterval);
        // eslint-disable-next-line
    }, [dataFromLink, allSubCategories]);

    return (
        <Modal
            open={open}
            onClose={onCloseHandler}
            sx={{
                maxHeight: "80vh",
            }}
        >
            {dataFromLink.status === "fetching" ||
            dataFromLink.status === "submitted" ||
            loading ? (
                <BaseDialog
                    button={undefined}
                    content={
                        <React.Fragment>
                            <Grid container>
                                <Grid
                                    item
                                    sx={{
                                        width: "34rem",
                                        height: "19rem",
                                        textAlign: "center",
                                        marginTop: "7rem",
                                    }}
                                >
                                    <Card
                                        sx={{
                                            width: "4.3rem",
                                            height: "4.3rem",
                                            margin: "0rem 15rem 1.6rem 15rem",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={loader}
                                            alt="loading..."
                                        />
                                    </Card>
                                    <Typography variant="tableData" color={AppTheme.text.light}>
                                        {AddNewSKUModalConstants.SCRAPE_IN_PROGRESS}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    }
                    open={open}
                    setOpen={() => {}}
                />
            ) : (
                <React.Fragment>
                    <Grid
                        container
                        direction="column"
                        sx={{
                            margin: "7rem 3.5rem",
                            width: "95%",
                            height: "95%",
                            background: AppTheme.background.white,
                            borderRadius: "5px",
                            overflow: "scroll",
                        }}
                    >
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                sx={{
                                    padding: "1.25rem 1.875rem 1.25rem 1.875rem",
                                    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <SKUlinkInputComponent
                                    link={link}
                                    dataFromLink={dataFromLink}
                                    setLink={setLink}
                                    handleLinkSubmit={handleLinkSubmit}
                                    validation={validation}
                                    setInputs={setInputs}
                                />
                                <Grid item style={{ marginBottom: "1.875rem" }}>
                                    <Divider flexItem>{AddNewSKUModalConstants.OR}</Divider>
                                </Grid>
                                <Grid item style={{ marginBottom: "1.875rem" }}>
                                    <Typography>
                                        {AddNewSKUModalConstants.ADD_UPDATE_SKU}
                                    </Typography>
                                </Grid>

                                <Grid item>
                                    <Grid
                                        container
                                        style={{
                                            marginBottom: "1rem",
                                        }}
                                        spacing={3}
                                    >
                                        {AddNewSKUModalConstants.COLUMNS.map((column) => {
                                            if (column.name === "UOM") {
                                                return (
                                                    <Grid item key={column.label} xs={3}>
                                                        <LabelTextField
                                                            label={column.label}
                                                            dropDownMenu={
                                                                <React.Fragment>
                                                                    <Autocomplete
                                                                        disabled={loading}
                                                                        getOptionLabel={(
                                                                            option: string,
                                                                        ) => option}
                                                                        fullWidth
                                                                        onChange={(e, value) => {
                                                                            setInputs(
                                                                                (prevInput) => ({
                                                                                    ...prevInput,
                                                                                    [column.name]:
                                                                                        value,
                                                                                }),
                                                                            );
                                                                        }}
                                                                        popupIcon={
                                                                            <KeyboardArrowDownIcon />
                                                                        }
                                                                        options={
                                                                            AddNewSKUModalConstants.UOM_OPTIONS
                                                                        }
                                                                        renderInput={(params) => (
                                                                            <CustomTextField
                                                                                placeholder={
                                                                                    column.label
                                                                                }
                                                                                {...params}
                                                                                variant="outlined"
                                                                                helperText={
                                                                                    inputErrors[
                                                                                        column.name as keyof typeof inputErrors
                                                                                    ]?.error
                                                                                        ? inputErrors[
                                                                                              column.name as keyof typeof inputErrors
                                                                                          ]?.errMsg
                                                                                        : undefined
                                                                                }
                                                                                error={
                                                                                    !!inputErrors[
                                                                                        column.name as keyof typeof inputErrors
                                                                                    ]?.error
                                                                                }
                                                                            />
                                                                        )}
                                                                    />
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </Grid>
                                                );
                                            }
                                            return (
                                                <Grid item key={column.label} xs={3}>
                                                    <LabelTextField
                                                        label={column.label}
                                                        textFieldProps={{
                                                            placeholder: column.label,
                                                            fullWidth: true,
                                                            onChange(
                                                                e: ChangeEvent<
                                                                    | HTMLInputElement
                                                                    | HTMLTextAreaElement
                                                                >,
                                                            ) {
                                                                setInputs((input) => ({
                                                                    ...input,
                                                                    [column.name]: e.target.value,
                                                                }));
                                                            },
                                                            value: inputs[
                                                                column.name as keyof typeof inputErrors
                                                            ],
                                                        }}
                                                        helperText={
                                                            inputErrors[
                                                                column.name as keyof typeof inputErrors
                                                            ]?.error
                                                                ? inputErrors[
                                                                      column.name as keyof typeof inputErrors
                                                                  ]?.errMsg
                                                                : undefined
                                                        }
                                                        error={
                                                            !!inputErrors[
                                                                column.name as keyof typeof inputErrors
                                                            ]?.error
                                                        }
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Grid>

                                {range(noOfSubCats).map((index) => (
                                    //eslint-disable-next-line
                                    <SubCategoryTile
                                        subcategoryPairs={subcategoryPairs}
                                        index={index}
                                        inputs={inputs}
                                        setInputs={setInputs}
                                        options={allSubCategories}
                                        inputErrors={inputErrors}
                                        onDelete={(index: number) => {
                                            setNoOfSubCats((prev) => prev - 1);
                                            setInputs((prevInput: ICreateSKUState) => {
                                                let descRows = [...prevInput.Description];
                                                let subcategories = [...prevInput.Subcategory];
                                                let categories = [...prevInput.Category];
                                                descRows.splice(index, 1);
                                                subcategories.splice(index, 1);
                                                categories.splice(index, 1);
                                                return {
                                                    ...prevInput,
                                                    Subcategory: subcategories,
                                                    Description: descRows,
                                                    Category: categories,
                                                };
                                            });
                                            setInputErrors((prev: IErrors) => {
                                                let subCategoriesErrors =
                                                    prev.Subcategory.error.splice(index, 1);
                                                let descriptionErrors =
                                                    prev.Description.error.splice(index, 1);
                                                let categoryErrors = prev.Category.error.splice(
                                                    index,
                                                    1,
                                                );
                                                return {
                                                    ...prev,
                                                    Subcategory: {
                                                        errMsg: prev.Subcategory.errMsg,
                                                        error: subCategoriesErrors,
                                                    },
                                                    Description: {
                                                        errMsg: prev.Description.errMsg,
                                                        error: descriptionErrors,
                                                    },
                                                    Category: {
                                                        errMsg: prev.Category.errMsg,
                                                        error: categoryErrors,
                                                    },
                                                };
                                            });
                                        }}
                                        key={`${index}-subcategories`}
                                    />
                                ))}
                                <Grid item sx={{ marginBottom: "0.875rem" }}>
                                    <Grid container justifyContent="flex-end" spacing={2}>
                                        <Grid item>
                                            <CancelButton
                                                variant="contained"
                                                onClick={() => closeHandler(setCreateSKUModal)}
                                                color={"primary"}
                                            >
                                                {AddNewSKUModalConstants.CANCEL}
                                            </CancelButton>
                                        </Grid>
                                        <Grid item>
                                            <PrimaryButton
                                                variant="contained"
                                                onClick={() => {
                                                    handleClick();
                                                }}
                                            >
                                                {AddNewSKUModalConstants.SUBMIT}
                                            </PrimaryButton>
                                        </Grid>
                                        <Grid item>
                                            <PrimaryButton
                                                variant="contained"
                                                onClick={() => {
                                                    setNoOfSubCats((prev) => prev + 1);
                                                    setInputs((prevInput: ICreateSKUState) => {
                                                        let descRows = [
                                                            ...prevInput.Description,
                                                            "",
                                                        ];
                                                        let subcategories = [
                                                            ...prevInput.Subcategory,
                                                            "",
                                                        ];
                                                        const categories = [
                                                            ...prevInput.Category,
                                                            "",
                                                        ];
                                                        return {
                                                            ...prevInput,
                                                            Subcategory: subcategories,
                                                            Description: descRows,
                                                            Category: categories,
                                                        };
                                                    });
                                                }}
                                                sx={{
                                                    padding: "0 1rem",
                                                }}
                                                startIcon={<Add />}
                                            >
                                                {AddNewSKUModalConstants.ADD_NEW_SUBCAT_DESC}
                                            </PrimaryButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </React.Fragment>
            )}
        </Modal>
    );
};

export default AddNewSKUModalV2;
