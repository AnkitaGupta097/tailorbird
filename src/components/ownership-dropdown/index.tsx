import React, { useEffect, useState } from "react";
import {
    Autocomplete,
    TextField,
    createFilterOptions,
    Stack,
    CardMedia,
    Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BaseDialog from "../base-dialog";
import question from "../../assets/icons/question.png";
import { AddOrganisation } from "../../stores/packages/creation/queries";
import { useMutation } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { shallowEqual } from "react-redux";
import actions from "../../stores/actions";
import { IOrg, IOwnership } from "../../modules/package-manager/interfaces";
import { ownership } from "../../modules/package-manager/constants";
import { PrimaryButton, SecondaryButton } from "../../modules/scraper/scraper-file-highlighter";
import { getUsername } from "stores/scraper/service/scraper-operation";

const filter = createFilterOptions<IOrg>();

const OwnerShip: React.FC<IOwnership> = ({
    disabled,
    setState,
    placeholder,
    value,
    helperText,
    error,
    autocompleteSx,
    size,
    org_type,
    filterOrgs,
    exceptContractors,
}) => {
    // const theme = useTheme();
    const dispatch = useAppDispatch();
    let { organizations } = useAppSelector(
        (state) => ({
            snackbar: state.common.snackbar,
            organizations: state.tpsm.organization,
        }),
        shallowEqual,
    );

    const [filteredOrgs, setFilteredOrgs] = useState([]);

    useEffect(() => {
        if (filterOrgs) {
            if (organizations?.length && !filteredOrgs.length) {
                let filOrganizations = organizations.filter((elm: any) => {
                    return elm?.organization_type?.includes("OWNERSHIP_GROUP");
                });
                setFilteredOrgs(filOrganizations);
            }
        } else {
            setFilteredOrgs(
                organizations?.filter((org: any) =>
                    org?.organization_type?.includes("OWNERSHIP_GROUP"),
                ),
            );
        }
        //eslint-disable-next-line
    }, [filterOrgs, organizations]);

    const [open, setOpen] = React.useState<boolean>(false);
    const [newOwnerShip, setNewOwnership] = React.useState<string>("");
    const [createOrganization] = useMutation(AddOrganisation, {
        async onCompleted() {
            dispatch(actions.tpsm.fetchOrganizationStart({}));
            dispatch(
                actions.common.openSnack({
                    message: ownership.OWNERSHIP_ADDED,
                    variant: "success",
                }),
            );
        },
        onError() {
            dispatch(
                actions.common.openSnack({
                    message: ownership.FAILED,
                    variant: "error",
                }),
            );
            setNewOwnership("");
        },
    });
    useEffect(() => {
        if (newOwnerShip !== "") {
            let opt = filteredOrgs?.find((option: IOrg) => option.name === newOwnerShip);
            setState?.(opt);
            setNewOwnership("");
        }
        //eslint-disable-next-line
    }, [filteredOrgs]);

    const onNo = () => {
        setNewOwnership("");
        setOpen(false);
    };

    const onYes = () => {
        setOpen(false);
        createOrganization({
            variables: {
                payload: {
                    name: newOwnerShip,
                    street_name: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    contact_number: "",
                    created_by: getUsername(),
                },
            },
        });
    };
    useEffect(() => {
        dispatch(actions.tpsm.fetchOrganizationStart({}));
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
                                {ownership.ARE_YOU_SURE}
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
                                    {ownership.NO}
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={onYes}
                                    sx={{ width: "auto", minWidth: "0", padding: "1rem 1.25rem" }}
                                >
                                    {ownership.YES}
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                    </React.Fragment>
                }
                open={open}
                setOpen={onNo}
            />
            <Autocomplete
                sx={autocompleteSx}
                disabled={disabled}
                fullWidth
                freeSolo
                value={value ?? null}
                getOptionLabel={(option: IOrg | string) => {
                    if (typeof option === "string") {
                        return option;
                    }
                    if (option?.label) return option?.label;
                    if (option?.name) return option?.name;
                    return "";
                }}
                clearOnBlur
                selectOnFocus
                onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                        // do nothing
                    } else if (newValue?.label?.toLowerCase().startsWith("create")) {
                        setNewOwnership(newValue.name);
                        setOpen(true);
                    } else {
                        setState?.(newValue);
                    }
                }}
                popupIcon={<KeyboardArrowDownIcon />}
                options={filteredOrgs ?? []}
                forcePopupIcon
                renderInput={(params) => (
                    <TextField
                        placeholder={placeholder}
                        {...params}
                        variant="outlined"
                        helperText={helperText}
                        error={error}
                        size={size}
                    />
                )}
                filterOptions={(organizations, params) => {
                    org_type &&
                        (organizations = organizations.filter((org: any) =>
                            org?.organization_type?.includes("OPERATOR"),
                        ));
                    exceptContractors &&
                        (organizations = organizations.filter((org: any) => {
                            return org.organization_type?.length;
                        }));
                    const filtered = filter(organizations, params);
                    return filtered;
                }}
            />
        </React.Fragment>
    );
};
export default OwnerShip;
