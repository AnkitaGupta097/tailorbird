import React, { useEffect, useState, useMemo } from "react";
import { Typography } from "@mui/material";
import { useAppSelector } from "../../../stores/hooks";
import { IPackagesTable } from "../interfaces";
import { useNavigate } from "react-router-dom";
import PackageDetailDialog from "./package-details-dialog";
import { ReactComponent as KebabMenu } from "../../../assets/icons/kebab-menu.svg";
import BaseSvgIcon from "components/svg-icon";
import SettingsIcon from "../../../assets/icons/icon-settings.svg";
import EditIcon from "../../../assets/icons/icon_edit.svg";
import BaseDataGrid from "components/data-grid";
import { GridColumns, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import moment from "moment";

export const KebabMenuIcon = () => <BaseSvgIcon svgPath={<KebabMenu />} />;

const PackagesTable: React.FC<IPackagesTable> = ({ packages, onSave, searchText }) => {
    const { loading } = useAppSelector((state) => ({
        loading: state.packageManager.packages.loading,
    }));
    const nav = useNavigate();
    const [selectedPkgForModal, setSelectedPkgForModal] = React.useState<any>();
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);

    let rows: any[] = packages
        .slice()
        .sort((s1: any, s2: any) => Date.parse(s1.updatedOn) - Date.parse(s2.updatedOn))
        .reverse()
        .map((packageData: any) => ({
            id: packageData.package_id,
            name: packageData.name,
            ownership: packageData?.ownership_group_name,
            description: packageData?.description,
            createdBy: packageData?.created_by,
            createdAt: packageData?.date_created,
            updatedAt: packageData?.date_updated,
        }));
    const [displayedRows, setDisplayedRows] = useState<any[]>(rows);

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
                field: "ownership",
                headerName: "Ownership",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.ownership}</Typography>
                ),
            },
            {
                field: "description",
                headerName: "Summary",
                flex: 1.5,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.description}</Typography>
                ),
            },
            {
                field: "createdBy",
                headerName: "Created by",
                flex: 0.5,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.createdBy}</Typography>
                ),
            },
            {
                field: "createdAt",
                headerName: "Created At",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.createdAt
                            ? moment.parseZone(params.row.createdAt).local().format("L LT")
                            : ""}
                    </Typography>
                ),
            },

            {
                field: "updatedAt",
                headerName: "Last Updated On",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.updatedAt
                            ? moment.parseZone(params.row.updatedAt).local().format("L LT")
                            : ""}
                    </Typography>
                ),
            },

            {
                field: "actions",
                headerName: "Action",
                type: "actions",
                //eslint-disable-next-line
                getActions: (params: any) => {
                    return [
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-${params.row?.id}`}
                            label={"Settings"}
                            icon={<img src={SettingsIcon} alt="Settings Icon" />}
                            onClick={() => {
                                setOpenDialog(true);
                                setSelectedPkgForModal(
                                    packages.find((item: any) => item.package_id == params.row?.id),
                                );
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-edit-${params.row?.id}`}
                            icon={<img src={EditIcon} alt="Edit Icon" />}
                            label={"Manage"}
                            onClick={() => {
                                nav(`/packages/edit?packageId=${params.row.id}`);
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                    ];
                },
            },
        ], //eslint-disable-next-line
        [packages],
    );

    useEffect(() => {
        if (searchText === "") setDisplayedRows(rows);
        else
            setDisplayedRows(
                rows.filter(
                    (row) =>
                        row.name.toLowerCase().includes(searchText?.toLowerCase()) ||
                        row?.ownership?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
                        row?.description?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
                        row?.createdBy?.toLowerCase()?.includes(searchText?.toLowerCase()),
                ),
            );
        //eslint-disable-next-line
    }, [packages, searchText]);

    return (
        <React.Fragment>
            <PackageDetailDialog
                pkg={selectedPkgForModal}
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setSelectedPkgForModal(null);
                }}
                onSave={onSave}
            />
            <BaseDataGrid
                columns={ScopeListColumns}
                rows={displayedRows}
                rowsPerPageOptions={[10, 20, 30]}
                loading={loading}
                onRowClick={null}
                disableColumnMenu={false}
                getRowId={(row: any) => row.id}
            />
        </React.Fragment>
    );
};

export default PackagesTable;
