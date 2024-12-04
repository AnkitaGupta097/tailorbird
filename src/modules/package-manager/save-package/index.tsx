import { useLazyQuery, useMutation } from "@apollo/client";
import { Grid, Modal, Typography, styled, useTheme, Divider } from "@mui/material";
import { GET_ALL_OWNERSHIPS } from "../../../queries/b2b/project/project";
import { UpdatePackage } from "../../../queries/b2b-project/b2b-project-query";
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { SavePackageModalConstants } from "../constants";
import { IOrg, ISavePackageModal } from "../interfaces";
import { isEmpty } from "../create-sku-modal/common/helper";
import LabelTextField from "../create-sku-modal/common/labeltext-field";
import { getUserData } from "../../../utils/store-helpers";
import { CancelButton, PrimaryButton } from "../common";
import { Organization } from "../interfaces";
import AppTheme from "../../../styles/theme";
import OwnerShip from "../../../components/ownership-dropdown";
import { useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import actions from "stores/actions";
import { createNewPackageFromScraper } from "stores/scraper/service/scraper-queries";

const InnerGridContainer = styled(Grid)({
    padding: "0.65rem 2rem",
    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.1)",
    width: "30.125rem",
    margin: "0 auto",
});

const SavePackageModal: FC<ISavePackageModal> = ({
    isOpen,
    onClose,
    isEditMode,
    onFailed,
    extraMetadata,
    askOwnershipGroup,
    onSave,
    metadata,
    setShowDialog,
    isScraper,
}) => {
    const [inputErrors, setInputErrors] = useState({
        Name: { error: false, errMsg: "This field is required." },
        "Ownership Group": { error: false, errMsg: "This field is required." },
        Description: { error: false, errMsg: "This field is required" },
    });

    const [packageMetadata, setPackageMetadata] = useState({} as any);
    const [disableSave, setDisableSave] = useState(true);
    const [saveInProgress, setSaveInProgress] = useState(false);
    const [ownershipGroup, setOwnershipGroup] = useState({} as any);
    const handlePackageMetadata = useCallback(
        (key: keyof typeof packageMetadata, value: any) => {
            packageMetadata[key] = value;
            setPackageMetadata({ ...packageMetadata });
        },
        [packageMetadata],
    );
    const navState = useLocation().state as any;
    const search = useLocation().search;
    const isAlt = new URLSearchParams(search).get("is_alternate") ?? undefined;
    const projectId = new URLSearchParams(search).get("projectId") ?? undefined;
    const { projectDetails } = useAppSelector((state) => {
        return {
            projectDetails: state.projectDetails.data,
        };
    });
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const [createScraperPackage] = useMutation(createNewPackageFromScraper, {
        onCompleted() {
            onSave?.();
        },
        onError(e) {
            onFailed?.(e);
        },
    });
    useEffect(() => {
        return () => setDisableSave(false);
    }, []);

    useEffect(() => {
        setInputErrors((errorData: any) => {
            return {
                ...errorData,
                Name: {
                    ...errorData.Name,
                    error: isEmpty(packageMetadata.name),
                },

                Description: {
                    ...errorData.Description,
                    error: isEmpty(packageMetadata["description"]),
                },
            };
        });

        // return () => setDisableSave(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [packageMetadata]);

    useEffect(() => {
        const allErrorsFalse = Object.values(inputErrors).every(
            (prop: any) => prop.error === false,
        );
        setDisableSave(!allErrorsFalse);
    }, [inputErrors]);
    const handleSavePackage = async () => {
        setSaveInProgress(true);
        const userData = getUserData();
        const email = localStorage.getItem("email");
        let name = "";
        if (userData && userData.name) {
            name = "";
        } else if (email) {
            name = email.split(`@`)[0];
        }
        if (!isEditMode) {
            if (projectDetails && isAlt) {
                handlePackageMetadata("name", projectDetails?.name);
            }
        } else {
            handlePackageMetadata("name", metadata["name"]);
        }
        let input = {
            created_by: name,
            ...packageMetadata,
            ...extraMetadata,
        };
        if (askOwnershipGroup) {
            input["ownership_group_id"] = ownershipGroup?.id;
            input["ownership_group_name"] = ownershipGroup?.name;
        }
        input["is_alternate"] = isAlt === "true";
        if (!isEditMode) {
            if (!isScraper) {
                dispatch(actions.packageManager.createPackageStart({ input }));
            } else {
                let ip = {
                    name: input.name,
                    description: input.description,
                    ownership_group_id: input.ownership?.id ?? input.ownership_group_id,
                    ownership_group_name: input.ownership?.name ?? input.ownership_group_name,
                    created_by: localStorage.getItem("email")?.split("@")[0] ?? null,
                    user_id: localStorage.getItem("user_id") ?? null,
                    scraper_job_id: input.scraper_job_id,
                };
                await createScraperPackage({ variables: { input: ip } });
            }
        } else {
            input = {
                package_id: extraMetadata["package_id" as keyof typeof extraMetadata],
                name: packageMetadata["name"],
                description: packageMetadata["description"],
                item_ids: extraMetadata["item_ids" as keyof typeof extraMetadata] ?? [],
            };
            await updatePackage({
                variables: { input },
            });
        }
        setSaveInProgress(false);
        setShowDialog(false);
    };

    const [updatePackage] = useMutation(UpdatePackage, {
        onCompleted() {
            onSave?.();
        },
        onError(e) {
            onFailed?.(e);
        },
    });

    const [getAllOrganizationData, { loading: loadingOrgData, data: ownershipData }] = useLazyQuery(
        GET_ALL_OWNERSHIPS,
        {
            fetchPolicy: "network-only",
            onCompleted(response) {
                if (metadata) {
                    const { ownership_group_id } = metadata;
                    const ownershipGroup = response.getAllOrganizations.find(
                        (d: Organization) => d.id === ownership_group_id,
                    );
                    setOwnershipGroup(ownershipGroup);
                }
            },
        },
    );

    //Hooks
    useEffect(() => {
        if (projectId) {
            dispatch(actions.projectDetails.fetchProjectDetailsStart(projectId));
            getAllOrganizationData();
        }
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (isOpen && askOwnershipGroup === true) {
            getAllOrganizationData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (projectDetails && projectId && ownershipData) {
            handlePackageMetadata(
                "name",
                `${projectDetails.name} ${isAlt === "true" ? ": Alt Package" : ": Base Package"}`,
            );
            setOwnershipGroup(() => {
                return ownershipData.getAllOrganizations.find(
                    (owner: IOrg) => owner.id === projectDetails?.ownershipGroupId,
                );
            });
        }
        //eslint-disable-next-line
    }, [projectDetails, ownershipData]);

    useEffect(() => {
        if (metadata) {
            let { name, description } = metadata;
            handlePackageMetadata(
                "name",
                `${name} ${navState ? (navState.isAlt ? ": Alt Package" : ": Base Package") : ""}`,
            );
            handlePackageMetadata("description", description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metadata]);

    const getValue = (column: string) => {
        if (column === "Ownership Group") return ownershipGroup;
        else return [];
    };

    const setState = (column: string, value: any) => {
        if (column === "Ownership Group") return setOwnershipGroup(value);
        else return [];
    };

    return (
        <React.Fragment>
            <Modal
                open={isOpen}
                onClose={() => onClose()}
                style={{ margin: "auto", maxHeight: "95vh", overflow: "auto" }}
            >
                <Grid
                    container
                    direction="column"
                    sx={{
                        margin: "1.5rem auto",
                        maxWidth: "482px",
                        background: theme.background.white,
                        borderRadius: "5px",
                    }}
                >
                    <Grid item sx={{ marginBottom: "0.5rem" }} mt="0.5rem" ml="2rem">
                        <Typography variant="subtitle2">
                            {isEditMode
                                ? SavePackageModalConstants.EDIT_PACKAGE
                                : SavePackageModalConstants.CREATE_PACKAGE}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <InnerGridContainer container direction="column">
                            {SavePackageModalConstants.COLUMN_NAMES.map((column, idx) => {
                                let autoCompleteColumns = ["Ownership Group"];
                                if (autoCompleteColumns.indexOf(column) < 0)
                                    return (
                                        <React.Fragment key={idx}>
                                            <Grid
                                                item
                                                style={{
                                                    marginTop: "1.25rem",
                                                }}
                                                key={column}
                                            >
                                                <LabelTextField
                                                    label={column}
                                                    disabled={
                                                        column !== "Description" &&
                                                        (isEditMode || Boolean(projectId))
                                                    }
                                                    multiline={column === "Description"}
                                                    rows={column === "Description" ? 2 : 1}
                                                    required
                                                    labelStyle={{
                                                        fontWeight: "400",
                                                        color: AppTheme.text.light,
                                                    }}
                                                    textFieldProps={{
                                                        placeholder: column,
                                                        fullWidth: true,
                                                        onChange(
                                                            e: ChangeEvent<
                                                                | HTMLInputElement
                                                                | HTMLTextAreaElement
                                                            >,
                                                        ) {
                                                            handlePackageMetadata(
                                                                column.toLowerCase(),
                                                                e.target.value,
                                                            );
                                                        },
                                                        value: packageMetadata[
                                                            column.toLowerCase()
                                                        ],
                                                    }}
                                                    helperText={
                                                        inputErrors[
                                                            column as keyof typeof inputErrors
                                                        ]?.error
                                                            ? inputErrors[
                                                                  column as keyof typeof inputErrors
                                                              ]?.errMsg
                                                            : undefined
                                                    }
                                                    error={
                                                        inputErrors[
                                                            column as keyof typeof inputErrors
                                                        ]?.error
                                                    }
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    );
                                else
                                    return (
                                        <Grid
                                            item
                                            style={{
                                                marginTop: "1.25rem",
                                            }}
                                            key={column}
                                        >
                                            <LabelTextField
                                                label={column}
                                                required={column !== "Package Type"}
                                                labelStyle={{
                                                    fontWeight: "400",
                                                    color: AppTheme.text.light,
                                                }}
                                                dropDownMenu={
                                                    <OwnerShip
                                                        disabled={isEditMode || Boolean(projectId)}
                                                        placeholder={column}
                                                        loading={loadingOrgData}
                                                        setState={(val: IOrg) =>
                                                            setState(column, val)
                                                        }
                                                        value={getValue(column) ?? null}
                                                        helperText={
                                                            !!inputErrors[
                                                                column as keyof typeof inputErrors
                                                            ]?.error &&
                                                            inputErrors[
                                                                column as keyof typeof inputErrors
                                                            ]?.errMsg
                                                        }
                                                        error={
                                                            !!inputErrors[
                                                                column as keyof typeof inputErrors
                                                            ]?.error
                                                        }
                                                    />
                                                }
                                            />
                                        </Grid>
                                    );
                            })}

                            <Grid
                                item
                                style={{
                                    marginTop: "1.25rem",
                                    marginBottom: "1.25rem",
                                }}
                            >
                                <Grid
                                    container
                                    style={{ width: "100%" }}
                                    direction="row"
                                    justifyContent="flex-end"
                                >
                                    <Grid item style={{ marginRight: "1rem" }}>
                                        <CancelButton variant="contained" onClick={() => onClose()}>
                                            {SavePackageModalConstants.CANCEL}
                                        </CancelButton>
                                    </Grid>
                                    <Grid item>
                                        <PrimaryButton
                                            variant="contained"
                                            onClick={() => {
                                                handleSavePackage();
                                            }}
                                            disabled={disableSave || saveInProgress}
                                        >
                                            {SavePackageModalConstants.SAVE}
                                        </PrimaryButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </InnerGridContainer>
                    </Grid>
                </Grid>
            </Modal>
        </React.Fragment>
    );
};

export default SavePackageModal;
