/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Grid, Typography, Box } from "@mui/material";
import DeleteIcon from "../../../assets/icons/icon_delete.svg";
import EditIcon from "../../../assets/icons/icon_edit.svg";
import SettingsIcon from "../../../assets/icons/icon-settings.svg";
import CopyIcon from "../../../assets/icons/icon-copy.svg";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import actions from "../../../stores/actions";
import BaseDeleteDialog from "../../../components/base-delete-dialog";
import { useNavigate } from "react-router-dom";
import BaseDataGrid from "components/data-grid";
import { GridColumns, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
interface ITableProps {
    open: boolean;
    // eslint-disable-next-line no-unused-vars
    setOpen: (args: boolean) => void;
    createScopeData?: any;
    setCreateScopeData?: any;
    scopeData?: any;
    setScopeData?: any;
    scopeFilter?: string[];
    searchText?: string;
}

const ScopesTable = (props: ITableProps) => {
    const { scopes, loading, allUsers } = useAppSelector((state) => ({
        scopes: state.scopes.scopeLibraries,
        loading: state.scopes.loading,
        allUsers: state.tpsm.all_User?.users,
    }));
    const [deleteScopeId, setDeleteScopeId] = useState("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const getCreatedByName = (createdBy: any) => {
        let user = allUsers?.find((user: any) => user.id == createdBy);
        return user?.name || createdBy;
    };

    let rows: any[] = scopes
        .slice()
        .sort((s1: any, s2: any) => Date.parse(s1.updatedOn) - Date.parse(s2.updatedOn))
        .reverse()
        .map((scope: any) => ({
            id: scope.id,
            name: scope.name,
            description: scope?.description,
            createdBy: getCreatedByName(scope?.createdBy),
            scopeType: scope?.scopeType,
            ownership: scope?.ownership,
            projectsReferred: scope.projectsReferred,
            projectType: scope?.projectType,
            containerVersion: scope?.containerVersion,
            ownershipGroupId: scope?.ownershipGroupId,
        }));
    const [displayedRows, setDisplayedRows] = useState<any[]>(rows);

    const onDelete = () => {
        dispatch(actions.scopes.deleteScopeLibraryStart({ id: deleteScopeId }));
        // dispatch(actions.scopes.fetchScopeLibrariesListStart({}));
    };

    const onEditorClick = (isEdit: any, newScopeData: any) => {
        navigate(`${newScopeData.containerVersion || "v2.0"}/${newScopeData.id}/edit`);
        props.setScopeData({
            ...newScopeData,
            isEdit,
            id: isEdit ? newScopeData.id : null,
        });
        if (isEdit) {
            dispatch(actions.scopes.fetchScopeLibraryStart({ id: newScopeData.id }));
            if (newScopeData?.containerVersion == "2.0") {
                dispatch(
                    actions.scopes.fetchMergeRenoItemByOwnershipStart({
                        organizationId: newScopeData?.ownershipGroupId,
                    }),
                );
            }
        } else {
            dispatch(
                actions.scopes.fetchMDMContainerTreeStart({
                    projectType: newScopeData?.projectType || "INTERIOR",
                }),
            );
        }
    };

    //Columns
    const ScopeListColumns: GridColumns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Name",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.name}</Typography>
                ),
            },
            {
                field: "description",
                headerName: "Summary",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.description}</Typography>
                ),
            },
            {
                field: "createdBy",
                headerName: "Created by",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.createdBy}</Typography>
                ),
            },
            {
                field: "scopeType",
                headerName: "Type",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.scopeType}</Typography>
                ),
            },
            {
                field: "ownership",
                headerName: "Ownership",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.ownership}</Typography>
                ),
            },
            {
                field: "projectsReferred",
                headerName: "Projects",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.projectsReferred}</Typography>
                ),
            },
            {
                field: "projectType",
                headerName: "Project Type",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.projectType}</Typography>
                ),
            },
            {
                field: "containerVersion",
                headerName: "Container Version",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.containerVersion}</Typography>
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
                            key={`menu-settings-${params.row?.id}`}
                            label={"Settings"}
                            icon={<img src={SettingsIcon} alt="Settings Icon" />}
                            onClick={() => {
                                props.setCreateScopeData({
                                    ...props.createScopeData,
                                    ...params.row,
                                    type: params.row.scopeType,
                                    isSettingsFlow: true,
                                });
                                props.setOpen(!props.open);
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-edit-${params.row?.id}`}
                            icon={<img src={EditIcon} alt="Edit Icon" />}
                            label={"Edit Scope"}
                            onClick={() => {
                                onEditorClick(true, params.row);
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-delete-${params.row?.id}`}
                            icon={<img src={DeleteIcon} alt="Delete Icon" />}
                            label={"Delete Scope"}
                            onClick={() => {
                                setDeleteScopeId(params.row?.id);
                                setShowDeleteConfirmation(!params.row?.showDeleteConfirmation);
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-copy-${params.row?.id}`}
                            label={"Create a copy"}
                            icon={<img src={CopyIcon} alt="Copy Icon" />}
                            onClick={() => {
                                const user = JSON.parse(
                                    localStorage.getItem("user_details") || "{}",
                                );
                                const currentScopeData = params.row;
                                dispatch(
                                    actions.scopes.copyScopeLibraryStart({
                                        id: currentScopeData.id,
                                        createdBy: user.id ?? "uuid_user_1",
                                    }),
                                );
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                    ];
                },
            },
        ], //eslint-disable-next-line
        [scopes, onDelete],
    );

    useEffect(() => {
        if (props.searchText === "") setDisplayedRows(rows);
        else
            setDisplayedRows(
                rows.filter((row) =>
                    row.name.toLowerCase().includes(props?.searchText?.toLowerCase()),
                ),
            );
        //eslint-disable-next-line
    }, [scopes, props.searchText]);

    useEffect(() => {
        setDisplayedRows(
            rows
                ?.filter((scope: any) => {
                    return props?.scopeFilter?.length
                        ? props?.scopeFilter?.includes(scope?.scopeType?.toLowerCase())
                        : true;
                })
                ?.filter((scope: any) => {
                    const lowerCaseSearchText =
                        props.searchText && props.searchText.trim().toLowerCase();
                    return lowerCaseSearchText
                        ? scope.name.toLowerCase().includes(lowerCaseSearchText) ||
                              scope.scopeType.toLowerCase().includes(lowerCaseSearchText) ||
                              scope.ownership?.toLowerCase().includes(lowerCaseSearchText)
                        : true;
                }),
        );
        //eslint-disable-next-line
    }, [scopes, props?.scopeFilter]);

    return (
        <Grid container marginLeft="38px" width="95%">
            <Grid item md={12} style={{ marginTop: "10px", marginBottom: "30px" }}>
                <Grid item sm>
                    <BaseDataGrid
                        columns={ScopeListColumns}
                        rows={displayedRows}
                        rowsPerPageOptions={[10, 20, 30]}
                        loading={loading}
                        onRowClick={null}
                        disableColumnMenu={false}
                    />
                </Grid>
                {showDeleteConfirmation && (
                    <BaseDeleteDialog
                        open={showDeleteConfirmation}
                        setOpen={setShowDeleteConfirmation}
                        confirmationText="Are you sure you want to delete this scope?"
                        noLabel="Cancel"
                        yesLabel="Delete"
                        onNoClick={() => {
                            setShowDeleteConfirmation(!showDeleteConfirmation);
                        }}
                        onYesClick={() => {
                            onDelete();
                            setShowDeleteConfirmation(!showDeleteConfirmation);
                        }}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default ScopesTable;
