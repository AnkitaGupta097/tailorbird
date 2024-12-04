import { GridColumns, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import { Typography, Tooltip } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import AdminTemplate from "../common/admin-template";
import OwnershipDialog from "./ownership-dialog";
import DeleteIcon from "../../../assets/icons/icon_delete.svg";
import EditIcon from "../../../assets/icons/icon_edit.svg";
import { menuOptions } from "../common/utils/constants";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { IOrganization } from "../common/utils/interfaces";
import { useNavigate, useLocation } from "react-router-dom";
import LanIcon from "@mui/icons-material/Lan";
import EntrataDialog from "./entrata-dialog";
import { OwnershipDialogConstants } from "../common/utils/constants";

const OwnershipTab = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isEntrata, setIsEntrata] = useState<boolean>(false);
    const [isSaved, setSaved] = useState(false);
    const dispatch = useAppDispatch();
    const { ownerships, saved, error, loading, users } = useAppSelector((state) => ({
        ownerships: state.ims.ims.ownerships,
        error: state.ims.ims.error,
        saved: state.ims.ims.saved,
        loading: state.ims.ims.loading,
        users: state.ims.ims.users,
    }));
    //eslint-disable-next-line
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>("");

    //eslint-disable-next-line
    const { pathname, state } = useLocation();
    const [selectedOwnership, setSelectedOwnership] = useState<any>(null);
    const [selectedOwnershipEntrata, setSelectedOwnershipEntrata] = useState<any>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    let rows: any[] = ownerships.map((ownership: IOrganization) => ({
        id: ownership.id,
        ownership: ownership.name,
        street_name: ownership?.street_name,
        ownership_url: ownership?.ownership_url,
        city: ownership?.city,
        zip_code: ownership?.zip_code,
        state: ownership?.state,
        primary_tb_contact: ownership?.primary_tb_contact,
        organization_type: ownership?.organization_type,
        google_workspace_email: ownership?.google_workspace_email,
    }));
    const [displayedRows, setDisplayedRow] = useState<any[]>(rows);
    const [err, setError] = useState(false);

    //eslint-disable-next-line
    const onEdit = (id: string, params: any) => {
        // if (pathname.split("/").length === 2) {
        //     console.log(pathname.substring(0, pathname.length) + "/" + id, "here!");
        navigate(`/admin/ownerships/${id}`);
        // } else {
        //     console.log(`${pathname.substring(0, pathname.lastIndexOf("/"))}/${id}`, "here@");
        //     navigate(`${pathname.substring(0, pathname.lastIndexOf("/"))}/${id}`);
        // }
        // setIsEdit(true);
        // setSelectedOwnership(ownerships.find((ownership) => ownership.id === id));
    };
    const usersById: any = users.reduce((acc: any, user: any) => {
        acc[user.id] = user;
        return acc;
    }, {});
    // Action handlers
    // const onEdit = (id: string) => {
    //     setIsEdit(true);
    //     setSelectedOwnership(ownerships.find((ownership) => ownership.id === id));
    // };

    const onEntrataConnect = (id: string) => {
        setSaved(false);
        setIsEntrata(true);
        setSelectedOwnershipEntrata(ownerships.find((ownership) => ownership.id === id));
    };

    const onDelete = (id: string) => {
        setIsDelete(true);
        setSelectedOwnership(ownerships.find((ownership) => ownership.id === id));
    };

    // Columns
    const OwnershipColumns: GridColumns = useMemo(
        () => [
            {
                field: "ownership",
                headerName: "Organization",
                flex: 4,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.ownership}</Typography>
                ),
            },
            {
                field: "tailorbird_contact",
                headerName: "Primary Tailorbird Contact",
                flex: 4,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {usersById[params.row.primary_tb_contact]?.name}
                    </Typography>
                ),
            },
            {
                field: "location",
                headerName: "Location",
                flex: 4,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.street_name} &nbsp;
                        {params.row.city} &nbsp;
                        {params.row.state} &nbsp;
                        {params.row.zip_code} &nbsp;
                    </Typography>
                ),
            },
            {
                field: "org_type",
                headerName: "Organization Type",
                flex: 4,
                renderCell: (params: GridRenderCellParams) => {
                    console.log(params);
                    return (
                        <Tooltip
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
                    );
                },
            },
            {
                field: "google_workspace_email",
                headerName: "Google Workspace Email",
                flex: 4,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.google_workspace_email}
                    </Typography>
                ),
            },
            {
                field: "actions",
                headerName: "Action",
                type: "actions",
                //eslint-disable-next-line
                getActions: (params) => {
                    return [
                        <GridActionsCellItem
                            placeholder=""
                            key="edit"
                            icon={<img src={EditIcon} alt="Edit Icon" />}
                            label={menuOptions.EDIT}
                            showInMenu
                            onClick={() => {
                                onEdit(params.id as string, params);
                            }}
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key="connect_entrata"
                            icon={<LanIcon />}
                            label={"Connect Entrata"}
                            showInMenu
                            onClick={() => {
                                onEntrataConnect(params.id as string);
                            }}
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key="Delete"
                            icon={<img src={DeleteIcon} alt="Delete Icon" />}
                            label={menuOptions.DELETE}
                            showInMenu
                            onClick={() => {
                                onDelete(params.id as string);
                            }}
                            disabled
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                    ];
                },
            },
        ], //eslint-disable-next-line
        [ownerships, onDelete, onEdit, selectedOwnership],
    );

    // Use Effects
    useEffect(() => {
        dispatch(actions.imsActions.fetchOwnershipStart({}));
        return () => {
            dispatch(actions.imsActions.resetState({}));
            setOpenDialog(false);
        }; //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (selectedOwnership) {
            setOpenDialog(true);
        }
    }, [selectedOwnership]);

    useEffect(() => {
        if (saved || error) {
            setTimeout(() => {
                setOpenDialog(false);
                setIsDelete(false);
                setIsEdit(false);
                setSelectedOwnership(null);
                dispatch(actions.imsActions.resetState({}));
            }, 2000);
        }
        //eslint-disable-next-line
    }, [saved, error]);

    useEffect(() => {
        if (searchText === "") setDisplayedRow(rows);
        else
            setDisplayedRow(
                rows.filter((row) =>
                    row.ownership.toLowerCase().includes(searchText.toLowerCase()),
                ),
            );
        //eslint-disable-next-line
    }, [ownerships, searchText]);

    return (
        <>
            <>
                <OwnershipDialog
                    onClose={() => {
                        setOpenDialog(false);
                        setSelectedOwnership(null);
                        setTimeout(() => {
                            setIsEdit(false);
                            setIsDelete(false);
                        }, 200);
                        dispatch(actions.imsActions.fetchOwnershipStart({}));
                    }}
                    open={openDialog}
                    isEdit={isEdit}
                    data={selectedOwnership}
                    isDelete={isDelete}
                />
                <EntrataDialog
                    onClose={() => {
                        setIsEntrata(false);
                        setSelectedOwnership(null);
                        setError(false);
                    }}
                    open={isEntrata}
                    isEdit={isEdit}
                    data={selectedOwnershipEntrata}
                    isDelete={isDelete}
                    isSaved={isSaved}
                    setSaved={setSaved}
                    err={err}
                    setError={setError}
                />
                <AdminTemplate
                    onClick={() => {
                        setIsEdit(false);
                        setIsDelete(false);
                        setSelectedOwnership(null);
                        setOpenDialog(true);
                    }}
                    title="Ownership and Other Demand Organizations"
                    buttonText="Organization"
                    columns={OwnershipColumns}
                    rows={displayedRows}
                    rowsPerPage={[10, 20, 30]}
                    onSearch={(searchText: string) => {
                        setSearchText(searchText);
                    }}
                    disabled={loading}
                />
            </>
        </>
    );
};
export default OwnershipTab;
