import { GridColumns, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import React, { useEffect, useState, useMemo } from "react";
import AdminTemplate from "../common/admin-template";
import ContractorDialog from "./contractor-dialog";
import DeleteIcon from "../../../assets/icons/icon_delete.svg";
import EditIcon from "../../../assets/icons/icon_edit.svg";
import { Typography } from "@mui/material";
import { menuOptions } from "../common/utils/constants";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { IOrganization } from "../common/utils/interfaces";
import { useNavigate } from "react-router-dom";

const ContractorsTab: React.FC = () => {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { contractors, saved, error, loading } = useAppSelector((state) => ({
        contractors: state.ims.ims.contractors,
        saved: state.ims.ims.saved,
        error: state.ims.ims.error,
        loading: state.ims.ims.loading,
    }));
    const [searchText, setSearchText] = useState<string>("");
    const [selectedContractor, setSelectedContractor] = useState<any>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    let rows: any[] = contractors.map((contractor: IOrganization) => ({
        id: contractor.id,
        contractor: contractor.name,
        street_name: contractor?.street_name,
        city: contractor?.city,
        zip_code: contractor?.zip_code,
        state: contractor?.state,
        google_workspace_email: contractor.google_workspace_email,
    }));
    const [displayedRows, setDisplayedRow] = useState<any[]>(rows);

    // Handlers
    const onDelete = (id: string) => {
        setSelectedContractor(contractors.find((row) => row.id == id));
        setIsDelete(true);
    };

    const onEdit = (id: string) => {
        setSelectedContractor(contractors.find((row) => row.id == id));
        setIsEdit(true);
    }; //eslint-disable-next-line

    //Columns
    const ContractorColumns: GridColumns = useMemo(
        () => [
            {
                field: "contractor",
                headerName: "Contractor",
                flex: 4,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.contractor}</Typography>
                ),
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
                            onClick={() => {
                                onEdit?.(params.id as string);
                            }}
                            showInMenu
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
                                onDelete?.(params.id as string);
                            }}
                            disabled
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                    ];
                },
            },
        ], //eslint-disable-next-line
        [contractors, onDelete, onEdit, selectedContractor],
    );

    // Use Effects
    useEffect(() => {
        dispatch(actions.imsActions.fetchContractorStart({}));
        return () => {
            dispatch(actions.imsActions.resetState({}));
            setOpenDialog(false);
        };
        //eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (searchText === "") setDisplayedRow(rows);
        else
            setDisplayedRow(
                rows.filter((row) =>
                    row.contractor.toLowerCase().includes(searchText.toLowerCase()),
                ),
            );
        //eslint-disable-next-line
    }, [contractors, searchText]);

    useEffect(() => {
        if (selectedContractor) {
            setOpenDialog(true);
        }
    }, [selectedContractor]);

    useEffect(() => {
        if (saved || error) {
            setTimeout(() => {
                setOpenDialog(false);
                setIsDelete(false);
                setIsEdit(false);
                setSelectedContractor(null);
                dispatch(actions.imsActions.resetState({}));
            }, 2000);
        }
        //eslint-disable-next-line
    }, [saved, error]);

    return (
        <>
            <>
                <ContractorDialog
                    onClose={() => {
                        setOpenDialog(false);
                        setSelectedContractor(null);
                        setTimeout(() => {
                            setIsEdit(false);
                            setIsDelete(false);
                        }, 200);
                    }}
                    open={openDialog}
                    isEdit={isEdit}
                    isDelete={isDelete}
                    data={selectedContractor}
                />
                <AdminTemplate
                    onClick={() => {
                        setIsEdit(false);
                        setIsDelete(false);
                        setSelectedContractor(null);
                        setOpenDialog(true);
                    }}
                    title="Contractors"
                    buttonText="Contractor"
                    columns={ContractorColumns}
                    rows={displayedRows}
                    rowsPerPage={[10, 20, 30]}
                    onSearch={(searchText: string) => {
                        setSearchText(searchText);
                    }}
                    disabled={loading}
                    onRowClick={(rowData: any) => {
                        navigate(`/admin/${rowData.row.id}`, {
                            state: {
                                details: rowData.row,
                                ischildren: true,
                            },
                        });
                    }}
                />
            </>
        </>
    );
};
export default ContractorsTab;
