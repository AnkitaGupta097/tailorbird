import {
    Autocomplete,
    CardMedia,
    createFilterOptions,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import actions from "../../../../../stores/actions";
import { useAppDispatch } from "stores/hooks";
import question from "../../../../../assets/icons/question.png";
import BaseDialog from "components/base-dialog";
import { PrimaryButton } from "modules/package-manager/common";
import { SecondaryButton } from "modules/scraper/scraper-file-highlighter";
import { CREATE_NEW_CATEGORY } from "../../common/constant";

const filter = createFilterOptions<any>();

const CreateNewCategory = (props: any) => {
    const dispatch = useAppDispatch();

    const [open, setOpen] = React.useState<boolean>(false);
    const [newCategory, setNewCategory] = React.useState<{
        finish: string;
        style: string;
        grade: string;
    }>({
        finish: "",
        style: "",
        grade: "",
    });
    const onNo = () => {
        //@ts-ignore
        newCategory[props?.name] = "";
        setNewCategory(newCategory);
        setOpen(false);
    };

    const onYes = () => {
        dispatch(
            actions.scraperService.updateDataForSearchFiltersStart({
                update: props?.name,
                //@ts-ignore
                value: newCategory[props?.name],
            }),
        );
        setOpen(false);
        dispatch(
            actions.common.openSnack({
                message: `${props?.name} ${CREATE_NEW_CATEGORY.CATEGORY_ADDED}`,
                variant: "success",
            }),
        );
    };

    useEffect(() => {
        //@ts-ignore
        if (newCategory[props?.name] !== "") {
            let opt = props?.options?.find(
                //@ts-ignore
                (option: any) => option?.name === newCategory?.[props?.name],
            );

            if (opt !== undefined) props?.setState?.(opt);
            //@ts-ignore
            newCategory[props?.name] = "";
            setNewCategory(newCategory);
        }
        //eslint-disable-next-line
    }, [newCategory]);

    useEffect(() => {
        dispatch(
            actions.scraperService.fetchDataForSearchFiltersStart({
                input: {},
            }),
        );
        //eslint-disable-next-line
    }, []);

    return (
        <React.Fragment>
            <BaseDialog
                button={null}
                content={
                    <React.Fragment>
                        <Stack alignItems="center" justifyContent="center" p="1rem">
                            <CardMedia
                                component="img"
                                src={question}
                                alt="question"
                                style={{ height: "8rem", width: "8rem" }}
                            />
                            <Typography variant="loaderText" maxWidth="50%" textAlign="center">
                                {`${CREATE_NEW_CATEGORY.ARE_YOU_SURE} ${props?.name}`}
                            </Typography>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={8}
                                mt="1rem"
                            >
                                <SecondaryButton
                                    sx={{ width: "auto", minWidth: "0", padding: "1rem 1.25rem" }}
                                    onClick={onNo}
                                >
                                    {CREATE_NEW_CATEGORY.NO}
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={onYes}
                                    sx={{ width: "auto", minWidth: "0", padding: "1rem 1.25rem" }}
                                >
                                    {CREATE_NEW_CATEGORY.YES}
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                    </React.Fragment>
                }
                open={open}
                setOpen={onNo}
            />
            <Autocomplete
                sx={props?.autocompleteSx}
                disabled={props?.disabled}
                fullWidth
                freeSolo
                value={props?.value ?? null}
                clearOnBlur
                selectOnFocus
                getOptionLabel={(option: any) => {
                    if (typeof option === "string") {
                        return option;
                    }
                    if (option?.label) return option?.label;
                    if (option?.name) return option?.name;
                    return "";
                }}
                onChange={(event, newValue) => {
                    if (newValue?.label?.toLowerCase().startsWith("create")) {
                        //@ts-ignore
                        newCategory[props?.name] = newValue.name;
                        setNewCategory(newCategory);
                        setOpen(true);
                        props?.setState?.(newValue);
                    } else {
                        props?.setState?.(newValue);
                    }
                }}
                popupIcon={<KeyboardArrowDownIcon />}
                options={props?.options}
                forcePopupIcon
                renderInput={(params) => (
                    <TextField placeholder={props?.placeholder} {...params} variant="outlined" />
                )}
                filterOptions={(category, params) => {
                    const filtered = filter(category, params);

                    if (params.inputValue.trim() !== "") {
                        let element = filtered.find((val) => val === params.inputValue.trim());
                        !element &&
                            filtered.push({
                                name: params.inputValue.trim(),
                                label: `Create "${params.inputValue.trim()}" ${props?.name}`,
                            });
                    }

                    return filtered;
                }}
            />
        </React.Fragment>
    );
};
export default CreateNewCategory;
