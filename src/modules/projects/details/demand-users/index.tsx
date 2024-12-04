import { Divider, Grid, Stack, Tooltip, Typography } from "@mui/material";
import BaseButton from "components/button";
import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import { getCustomErrorText } from "modules/rfp-manager/helper";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { useParams } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CommonDialog from "modules/admin-portal/common/dialog";
import moment from "moment";
import DataGridPro from "components/data-grid-pro";
import AddDemandUsers from "./add-demand-users";
import { OWNERSHIP_ROLES_MAP } from "modules/projects/constant";
import { OwnershipDialogConstants } from "../../../../modules/admin-portal/common/utils/constants";
import { ReactComponent as AddPerson } from "./../../../../assets/icons/add_person.svg";

const DemandUsers = () => {
    // Redux
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const { loading, error, errorText, loaderState, allDemandUsers, allOrgsWithUsers } =
        useAppSelector((state) => {
            return {
                allDemandUsers: projectId
                    ? state.rfpProjectManager.details?.[projectId]?.allDemandUsers || []
                    : [],
                allContractors: projectId
                    ? state.rfpProjectManager.details?.[projectId]?.ContractorList
                    : [],
                allOrgsWithUsers: projectId
                    ? state.rfpProjectManager.details?.[projectId]?.allOrgsWithUsers
                    : [],
                allTbAdmins: projectId
                    ? state.rfpProjectManager.details?.[projectId]?.AdminList
                    : [],
                loading: projectId ? state.rfpProjectManager.details?.[projectId]?.loading : false,
                error: projectId ? state.rfpProjectManager.details?.[projectId]?.error : false,
                errorText: projectId ? state.rfpProjectManager.details?.[projectId]?.errorText : "",
                loaderState: state.rfpProjectManager?.loaderState,
            };
        });
    const [openModal, setOpenModal] = useState<boolean>(false);

    let [loader, setLoader] = React.useState<{
        open: boolean;
        loaderText: string;
        errorText: string;
        saveText: string;
    }>({ open: false, loaderText: "", errorText: "", saveText: "" });

    useEffect(() => {
        dispatch(
            actions.rfpProjectManager.fetchAssignedUsersListStart({
                project_id: projectId,
                rfp_project_version: "2.0",
                is_demand_side: true,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            field: "name",
            headerName: "Name",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params.row?.name}</Typography>
            ),
        },
        {
            field: "role",
            headerName: "Role",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {OWNERSHIP_ROLES_MAP[params.row?.role as keyof typeof OWNERSHIP_ROLES_MAP]}
                </Typography>
            ),
        },
        {
            field: "org_name",
            headerName: "Organization Name",
            headerAlign: "left",
            align: "left",
            flex: 1,
            width: 300,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params?.row?.organization_name}</Typography>
            ),
        },
        {
            field: "org_type",
            headerName: "Organization Type",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip
                    //eslint-disable-next-line
                    title={params.row.organization_type?.map((type: string) => (
                        //eslint-disable-next-line
                        <Typography variant="text_14_regular">
                            {params.row.organization_type?.length > 0 &&
                                OwnershipDialogConstants.ORG_TYPES_MAP[
                                    type as keyof typeof OwnershipDialogConstants.ORG_TYPES_MAP
                                ]}
                        </Typography>
                    ))}
                >
                    <Typography variant="text_14_regular">
                        {params.row.organization_type?.length === 0
                            ? "-"
                            : params.row.organization_type?.length > 1
                            ? `${
                                  OwnershipDialogConstants.ORG_TYPES_MAP[
                                      params?.row
                                          ?.organization_type[0] as keyof typeof OwnershipDialogConstants.ORG_TYPES_MAP
                                  ]
                              } + ${params.row.organization_type?.length - 1}`
                            : OwnershipDialogConstants.ORG_TYPES_MAP[
                                  params?.row
                                      ?.organization_type[0] as keyof typeof OwnershipDialogConstants.ORG_TYPES_MAP
                              ]}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: "invited_on",
            headerName: "Invited On",
            headerAlign: "left",
            align: "left",
            flex: 0.5,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {moment(params?.row?.invited_on).format("MM/DD/YYYY")}
                </Typography>
            ),
        },
        {
            field: "delete",
            headerName: "Action",
            headerAlign: "center",
            align: "left",
            flex: 0.5,
            renderCell: (rowParams: GridRenderCellParams) => (
                <GridActionsCellItem
                    placeholder=""
                    key="Delete"
                    label={""}
                    icon={<DeleteOutlineOutlinedIcon htmlColor="#57B6B2" />}
                    showInMenu
                    onClick={() => {
                        dispatch(
                            actions.rfpProjectManager.removeUsersFromProjectStart({
                                contractors_list: [
                                    {
                                        contractor_id: rowParams?.row?.id,
                                        organization_id: rowParams?.row?.organization_id,
                                    },
                                ],
                                organization_id: rowParams?.row?.organization_id,
                                project_id: projectId,
                                rfp_project_version: "2.0",
                                is_demand_side: true,
                            }),
                        );
                        setTimeout(() => {
                            dispatch(
                                actions.rfpProjectManager.fetchAssignedUsersListStart({
                                    project_id: projectId,
                                    rfp_project_version: "2.0",
                                    is_demand_side: true,
                                }),
                            );
                        }, 1000);
                    }}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                />
            ),
        },
    ];

    useEffect(() => {
        if ((!loading || error) && !errorText?.length) {
            setTimeout(() => {
                setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
                setTimeout(() => {
                    dispatch(
                        actions.rfpProjectManager.resetState({
                            project_id: projectId,
                        }),
                    );
                }, 200);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [loading, error, errorText]);

    useEffect(() => {
        if (loaderState.open && !loading) {
            if (loaderState.errorText) {
                setLoader({
                    open: true,
                    loaderText: "",
                    errorText: loaderState.errorText,
                    saveText: "",
                });
            }
            setTimeout(() => {
                setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
                setTimeout(() => {
                    dispatch(
                        actions.rfpProjectManager.resetState({
                            project_id: projectId,
                        }),
                    );
                }, 200);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [loaderState, loading]);

    const resetStoreState = () => {
        if (!loading) {
            setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
            dispatch(
                actions.rfpProjectManager.resetState({
                    project_id: projectId,
                }),
            );
        }
    };

    return (
        <>
            <CommonDialog
                open={loader.open}
                onClose={resetStoreState}
                loading={loading}
                //@ts-ignore
                error={error}
                loaderText={loader.loaderText}
                errorText={errorText?.length ? getCustomErrorText(errorText) : loader.errorText}
                saved={!loading && !error}
                savedText={loader.saveText}
                width="40rem"
                minHeight="26rem"
                errorName={errorText?.length ? "Error:" : false}
            />
            <Grid container sx={{ paddingRight: "2.4rem" }} flexDirection="column">
                <Grid item md={12} sm={12}>
                    <Stack
                        direction={"row"}
                        justifyContent="flex-end"
                        spacing={3}
                        paddingTop={"1rem"}
                    >
                        <BaseButton
                            onClick={() => {
                                setOpenModal(true);
                            }}
                            label={"Demand Users"}
                            style={{ padding: "1rem" }}
                            variant="text_16_semibold"
                            classes={`primary default`}
                            startIcon={<AddPerson style={{ marginLeft: 5 }} />}
                        />
                    </Stack>
                </Grid>
                <Grid item md={12} sm={12}>
                    <Typography
                        variant="heading"
                        sx={{
                            fontSize: "18px",
                            fontWeight: "600",
                            lineHeight: "normal",
                            fontStyle: "normal",
                            borderBottom: "2px solid var(--primary-trust-blue-main-color, #004D71)",
                            color: "#000",
                            paddingBottom: "5px",
                            marginLeft: "2rem",
                        }}
                    >
                        Demand Users
                    </Typography>
                    <Divider sx={{ margin: 0, padding: 0.6 }}></Divider>
                </Grid>
                <Grid item md={12} sm={12} sx={{ marginLeft: "40px", marginTop: "16px" }}>
                    <DataGridPro
                        getRowId={(param: any) => param?.id}
                        columns={columns}
                        rows={allDemandUsers}
                        rowsPerPageOptions={[10, 20, 30]}
                        loading={loading}
                        pagination={true}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "name", sort: "asc" }],
                            },
                        }}
                        showNoRowsOverlay={true}
                        autoHeight={false}
                    />
                </Grid>
                <AddDemandUsers
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    contractorsList={allOrgsWithUsers}
                    project_id={projectId}
                    allDemandUsers={allDemandUsers}
                />
            </Grid>
        </>
    );
};

export default DemandUsers;
