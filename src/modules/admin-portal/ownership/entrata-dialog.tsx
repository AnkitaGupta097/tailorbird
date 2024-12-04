import { Grid, Typography } from "@mui/material";
import BaseTextField from "components/text-field";
import React, { useEffect, useState } from "react";
import OwnershipDialogIcon from "../../../assets/icons/icon-user-dialog.svg";
import CommonDialog from "../common/dialog";
import { OwnershipDialogConstants } from "../common/utils/constants";
import { IOwnershipDialog } from "../common/utils/interfaces";
import { useAppDispatch, useAppSelector } from "stores/hooks";
// import actions from "stores/actions";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
// import { Buffer } from "buffer";

const CREATE_ENTRATA_CONFIG = gql`
    mutation CreateEntrataConfig($input: EntrataConfig) {
        createEntrataConfig(input: $input)
    }
`;

export const GET_ENTRATA_PROPERTIES = gql`
    query Query($ownershipId: String) {
        getEntrataProperties(ownership_id: $ownershipId)
    }
`;

interface IEntrataDialog extends IOwnershipDialog {
    isSaved: boolean;
    setSaved: React.Dispatch<React.SetStateAction<boolean>>;
    err: boolean;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IEntrataConfig {
    password: string;
    url: string;
    username: string;
    ownership_id: string;
}
//eslint-disable-next-line
const EntrataDialog = ({
    open,
    onClose,
    data,
    isDelete,
    isSaved,
    setSaved,
    err,
    setError,
}: IEntrataDialog) => {
    const [entrataConfig, setConfig] = useState<IEntrataConfig>({
        password: "",
        url: "",
        username: "",
        ownership_id: "",
    });
    // const [ownershipError, setOwnershipError] = useState<boolean>(false);
    const [isLoading, setLoading] = useState(false);
    //eslint-disable-next-line
    const dispatch = useAppDispatch();
    //eslint-disable-next-line
    const { loading, saved, error } = useAppSelector((state) => ({
        loading: state.ims.ims.loading,
        saved: state.ims.ims.saved,
        error: state.ims.ims.error,
        ownerships: state.ims.ims.ownerships,
    }));
    const [createConfig] = useMutation(CREATE_ENTRATA_CONFIG);
    const [getEntrataProperties] = useLazyQuery(GET_ENTRATA_PROPERTIES, {
        variables: { ownershipId: entrataConfig.ownership_id },
    });

    const onSave = () => {
        setLoading(true);
        createConfig({
            variables: {
                input: {
                    ...entrataConfig,
                },
            },
        })
            .then(async () => {
                // const token = `${entrataConfig.username}:${entrataConfig.password}`;
                // const encodedToken = Buffer.from(token).toString("base64");
                const { data: entrataPropertiesData, error: entrataError } =
                    await getEntrataProperties({
                        variables: {
                            ownershipId: entrataConfig.ownership_id,
                        },
                    });
                console.log(
                    entrataPropertiesData?.getEntrataProperties?.response?.result?.PhysicalProperty
                        ?.Property,
                    "entrataPropertiesData",
                );

                if (entrataError) {
                    throw entrataError;
                }

                setLoading(false);
                setSaved(true);
                setConfig({
                    password: "",
                    url: "",
                    username: "",
                    ownership_id: "",
                });
                setError(false);
            })
            .catch((err) => {
                console.log(err, "error");
                setError(true);
                setLoading(false);
                setConfig({
                    password: "",
                    url: "",
                    username: "",
                    ownership_id: "",
                });
            });
    };
    // const isValidUrl = (url?: string) => {
    //     //eslint-disable-next-line
    //     if (!url || url === "") return true;
    //     // if (!url || url === "" || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(url))
    //     //eslint-disable-next-line
    //     if (
    //         !/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
    //             url,
    //         )
    //     )
    //         return false;
    //     return true;
    // };

    useEffect(() => {
        if (data?.id)
            setConfig({
                ...entrataConfig,
                ownership_id: data.id,
            });
        //eslint-disable-next-line
    }, [data]);

    return (
        <>
            <CommonDialog
                open={open}
                onClose={onClose}
                title={"Entrata"}
                iconSrc={OwnershipDialogIcon}
                onSave={onSave}
                deleteDialog={isDelete}
                deleteText={OwnershipDialogConstants.DELETE_TEXT}
                error={err}
                saved={isSaved}
                loading={isLoading}
                saveLabel={"Connect"}
                errorText={"Some Error Occured."}
                loaderText={"Connecting Entrata Please wait..."}
                savedText={"Entrata Account Connected Successfully"}
                // onDelete={() => {
                //     dispatch(
                //         actions.imsActions.deleteOrganizationStart({
                //             id: data.id,
                //             type: "Ownership",
                //         }),
                //     );
                // }}
                width="40rem"
                minHeight="20rem"
            >
                <Grid container direction="column" spacing="1rem">
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={12}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {"Entrata Url"}
                                        </Typography>
                                    }
                                    fullWidth
                                    onChange={(e: any) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            url: e.target.value.trim(),
                                        }))
                                    }
                                    size="small"
                                    value={entrataConfig.url}
                                    // error={ownershipError}
                                    placeholder={"eg. https://YOUR_DOMAIN.entrata.com"}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {"Username"}
                                        </Typography>
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(e: any) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            username: e.target.value.trim(),
                                        }))
                                    }
                                    value={entrataConfig.username}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {"Password"}
                                        </Typography>
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(e: any) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            password: e.target.value.trim(),
                                        }))
                                    }
                                    value={entrataConfig.password}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem"></Grid>
                    </Grid>
                </Grid>
            </CommonDialog>
        </>
    );
};
export default EntrataDialog;
