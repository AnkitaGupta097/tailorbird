import React, { useEffect, useMemo, useState } from "react";
import {
    Grid,
    Paper,
    // Table,
    // TableBody,
    // TableCell,
    // TableContainer,
    Typography,
    // TableHead,
    // IconButton,
    // TableRow,
    Stack,
    // MenuItem,
    // Box,
    // Menu,
    // useTheme,
} from "@mui/material";
import BaseDataGrid from "components/data-grid";
import { PROPERTY_TYPE } from "../constant";
import { useAppSelector, useAppDispatch } from "../../../stores/hooks";
import ContentPlaceholder from "../../../components/content-placeholder";
import { isEmpty, find } from "lodash";
import actions from "../../../stores/actions";
import moment from "moment";
import { useNavigate } from "react-router-dom";
// import TablePaginationProperty from "../../../components/base-table-pagination-properties";
// import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import ArchiveIcon from "../../../assets/icons/icon-archive.svg";
import RestoreIcon from "../../../assets/icons/icon-restore.svg";
import BaseLoader from "../../../components/base-loading";
import ConfirmationModal from "../../../components/confirmation-modal";
import { graphQLClient } from "../../../utils/gql-client";
import { useSnackbar } from "notistack";
import BaseSnackbar from "../../../components/base-snackbar";
import { GridColumns, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import {
    DELETE_PROPERTY,
    RESTORE_PROPERTY,
} from "../../../stores/projects/properties/property-queries";

// interface IColumn {
//     id: "name" | "type" | "ownershipGroupId" | "address" | "projectType" | "createdAt" | "action";
//     label: string;
//     width?: string;
//     align?: "right";
// }
// export interface IPropertyDetails {
//     id: string;
//     name: string;
//     organization_id: string;
//     address: string;
//     ownershipGroupId: any;
//     type: string;
//     createdAt: string;
// }

// const columns: readonly IColumn[] = [
//     { id: "name", label: "Property Name", width: "15%" },
//     { id: "type", label: "Property Type", width: "15%" },
//     {
//         id: "address",
//         label: "Address",
//         width: "25%",
//     },
//     {
//         id: "ownershipGroupId",
//         label: "Ownership Group",
//         width: "20%",
//     },

//     {
//         id: "createdAt",
//         label: "Creation Date",
//         width: "15%",
//     },
//     {
//         id: "action",
//         label: "Action",
//         width: "10%",
//     },
// ];

interface IPropertiesListTable {
    properties: any;
    type: String;
    setPropertyModal?: any;
    searchText?: any;
    // filterList?: any;
}

const PropertiesListTable = ({
    properties,
    type,
    setPropertyModal,
    searchText,
}: // filterList,
IPropertiesListTable) => {
    // const theme = useTheme();
    console.log(properties, "!!");
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { organization, deleteProcess, restoreProcess, isLoading } = useAppSelector((state) => {
        return {
            organization: state.tpsm.organization,
            deleteProcess: state.property.archive_properties.loading,
            isLoading: state.property?.loading,
            restoreProcess: state.property.archive_properties.loading,
        };
    });
    // const [page, setPage] = React.useState(1);
    // const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    // const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [confirm, setConfirm] = React.useState(false);
    const [propertyId, setPropertyId] = React.useState("");

    // const closeMenu = (): void => {
    //     setAnchor(null);
    // };

    const onPropertyDelete = async () => {
        setConfirm(false);
        dispatch(actions.property.deletePropertyStart(""));
        try {
            const res = await graphQLClient.mutate("deleteProperty", DELETE_PROPERTY, {
                propertyId: propertyId,
            });
            enqueueSnackbar("", {
                variant: "success",
                action: (
                    <BaseSnackbar variant="success" title={"Property archived successfully."} />
                ),
            });
            dispatch(actions.property.deletePropertySuccess(res));
        } catch (error) {
            dispatch(actions.property.deletePropertyError(error));
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title={"Unable to archive the property."} />,
            });
        }
    };

    const restoreProperty = async () => {
        // setAnchor(null);
        setConfirm(false);
        dispatch(actions.property.restorePropertyStart(""));
        try {
            const res = await graphQLClient.mutate("updateProperty", RESTORE_PROPERTY, {
                propertyId: propertyId,
                isActive: true,
            });
            enqueueSnackbar("", {
                variant: "success",
                action: (
                    <BaseSnackbar variant="success" title={"Property restored successfully."} />
                ),
            });
            dispatch(actions.property.restorePropertySuccess(res));
            dispatch(actions.property.fetchAllPropertyStart(""));
        } catch (error) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title={"Unable to restore the property."} />,
            });
        }
    };

    console.log(properties);

    const organizationMap =
        organization && new Map(organization.map((org: any) => [org.id, org.name]));

    let rows: any[] = properties
        ?.slice()
        ?.sort((s1: any, s2: any) => Date.parse(s1.createdAt) - Date.parse(s2.createdAt))
        ?.reverse()
        ?.map((property: any) => ({
            id: property.id,
            name: property.name,
            // createdBy: getCreatedByName(project?.userId),
            createdAt: property?.createdAt,
            ownershipGroupId: property?.ownershipGroupId,
            ownershipGroup:
                property?.ownershipGroupId && organizationMap?.get(property?.ownershipGroupId),
            // address: `${project?.streetAddress} ${project?.city ? "," : ""}${project?.city}${
            //     project?.state ? "," : ""
            // }${project?.state}${project?.zipcode ? "-" : ""}${project?.zipcode}`,
            type: property?.type,
            address: property?.address,
            creationDate: moment.parseZone(property?.createdAt).local().format("L LT"),
        }));

    console.log(rows, "rows!");

    const [displayedRows, setDisplayedRows] = useState<any[]>(rows);

    useEffect(() => {
        console.log(rows, "rows", searchText);
        if (searchText == "") setDisplayedRows(rows);
        else
            setDisplayedRows(
                rows.filter(
                    (row) =>
                        row.address?.toLowerCase().includes(searchText) ||
                        row.name?.toLowerCase().includes(searchText) ||
                        row.ownershipGroup?.toLowerCase().includes(searchText),

                    // find(organization, {
                    //     id: row.ownershipGroupId,
                    // })
                    //     ?.name?.toLowerCase()
                    // .includes(searchText),
                ),
            );
        //eslint-disable-next-line
    }, [properties, searchText /*filterList*/]);

    // useEffect(() => {
    // let filterValue: any = [];
    // mapValues(filterList, (value, type) => {
    //     if (value) {
    //         filterValue.push(type);
    //     }
    // });
    // if (filterValue.length > 0) {
    //     setDisplayedRows(
    //         rows
    //             ?.filter((property: any) => {
    //                 return filterValue.includes(property.type);
    //             })
    //             ?.filter((row: any) => {
    //                 const lowerCaseSearchText = searchText && searchText.trim().toLowerCase();
    //                 return lowerCaseSearchText
    //                     ? row.address?.toLowerCase().includes(searchText) ||
    //                           row.name?.toLowerCase().includes(searchText) //||
    //                     : //   find(organization, {
    //                       //       id: row.ownershipGroupId,
    //                       //   })
    //                       //       ?.name?.toLowerCase()
    //                       //   .includes(searchText)
    //                       true;
    //             }),
    //     );
    // } else if (searchText != "") {
    //     setDisplayedRows(rows);
    // }
    //eslint-disable-next-line
    // }, [properties, filterList]);

    const PropertyListColumns: GridColumns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Property Name",
                flex: 0.8,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.name}</Typography>
                ),
            },
            {
                field: "type",
                headerName: "Property Type",
                flex: 0.6,
                renderCell: (params: GridRenderCellParams) => (
                    // <Typography variant="text_14_regular">
                    //     {
                    //         // params.row.type
                    //         find(PROPERTY_TYPE, {
                    //             value: params.row.type,
                    //         })?.label
                    //     }
                    // </Typography>

                    <Typography
                        style={{
                            boxSizing: "border-box",

                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            padding: "2px 8px",
                            gap: "10px",

                            width:
                                params.row.type === "GARDEN STYLE"
                                    ? "95px"
                                    : params.row.type === "MID RISE"
                                    ? "70px"
                                    : "76px",
                            height: "24px",

                            border:
                                params.row.type === "GARDEN STYLE"
                                    ? "1px solid #00B779"
                                    : params.row.type === "MID RISE"
                                    ? "1px solid #0088C7"
                                    : "1px solid #B86800",
                            borderRadius: "4px",

                            flex: "none",
                            order: "0",
                            flexGrow: "0",
                        }}
                    >
                        <Typography
                            style={{
                                // position: "absolute",
                                left: "8.42%",
                                right: "8.42%",
                                top: "8.33%",
                                bottom: "8.33%",

                                fontFamily: "'Roboto'",
                                fontStyle: "normal",
                                fontWeight: "400",
                                fontSize: "14px",
                                lineHeight: "20px",

                                display: "flex",
                                alignItems: "center",

                                color:
                                    params.row.type === "GARDEN STYLE"
                                        ? "#00B779"
                                        : params.row.type === "MID RISE"
                                        ? "#0088C7"
                                        : "#B86800",
                            }}
                        >
                            {
                                find(PROPERTY_TYPE, {
                                    value: params.row.type,
                                })?.label
                            }
                        </Typography>
                    </Typography>
                ),
            },
            {
                field: "address",
                headerName: "Address",
                flex: 1.75,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.address}</Typography>
                ),
            },
            {
                field: "ownershipGroupId",
                headerName: "Ownership Group",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.ownershipGroup || ""}
                    </Typography>
                ),
            },
            {
                field: "creationAt",
                headerName: "Creation Date",
                flex: 0.65,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.creationDate}</Typography>
                ),
            },
            {
                field: "actions",
                headerName: "Action",
                flex: 0.45,
                type: "actions",
                //eslint-disable-next-line
                getActions: (params) => {
                    return [
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-${params.row?.id}`}
                            label={type == "general" ? "Archive" : "Restore"}
                            icon={
                                <img
                                    src={type == "general" ? ArchiveIcon : RestoreIcon}
                                    alt="Delete Icon"
                                />
                            }
                            onClick={() => {
                                setConfirm(true);
                                setPropertyId(params.row?.id);
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                    ];
                },
            },
        ], //eslint-disable-next-line
        [properties],
    );

    // useEffect(() => {
    //     setPage(1);
    //     setRowsPerPage(10);
    // }, [projects]);

    // const totalNoOfPages = Math.ceil(projects?.length / rowsPerPage);
    // const index = page - 1;

    if (isEmpty(properties) && type == "archive") {
        return <Typography variant="text_16_semibold">No data found</Typography>;
    }

    return (
        <Grid container>
            <Grid item md={12} style={{ marginTop: 10 }}>
                <Paper elevation={3}>
                    {/* <TableContainer>
                        <Table>
                            <TableHead
                                style={{
                                    backgroundColor: "#EEEEEE",
                                    paddingTop: "15px",
                                    paddingBottom: "15px",
                                    borderBottom: "2px solid #234947",
                                }}
                            >
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ width: column.width }}
                                        >
                                            <Typography variant="text_14_semibold">
                                                {column.label}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(isEmpty(projects) || isLoading) && type == "general" && (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            {isLoading ? (
                                                <Box style={{ height: 250 }}>
                                                    <BaseLoader />
                                                </Box>
                                            ) : (
                                                <Stack sx={{ marginTop: "20px" }}>
                                                    {isEmpty(projects) && (
                                                        <ContentPlaceholder
                                                            onLinkClick={() =>
                                                                setPropertyModal(true)
                                                            }
                                                            text="No properties created."
                                                            aText="Create a property."
                                                            height="250px"
                                                        />
                                                    )}
                                                </Stack>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!isEmpty(projects) &&
                                    projects
                                        .slice(
                                            index * rowsPerPage,
                                            index * rowsPerPage + rowsPerPage,
                                        )
                                        .map((projectDetails: any) => {
                                            console.log(projectDetails, "1!!!!1");
                                            const {
                                                id,
                                                name,
                                                address,
                                                ownershipGroupId,
                                                type,
                                                createdAt,
                                            }: IProjectDetails = projectDetails;
                                            return (
                                                <TableRow
                                                    key={id}
                                                    hover
                                                    onClick={() => {
                                                        type == "general"
                                                            ? navigate(`/projects/${id}/overview`)
                                                            : null;
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography variant="text_14_regular">
                                                            {name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            style={{
                                                                boxSizing: "border-box",

                                                                

                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "flex-start",
                                                                padding: "2px 8px",
                                                                gap: "10px",

                                                                width:
                                                                    type === "GARDEN STYLE"
                                                                        ? "95px"
                                                                        : type === "MID RISE"
                                                                        ? "70px"
                                                                        : "76px",
                                                                height: "24px",


                                                                border:
                                                                    type === "GARDEN STYLE"
                                                                        ? "1px solid #00B779"
                                                                        : type === "MID RISE"
                                                                        ? "1px solid #0088C7"
                                                                        : "1px solid #B86800",
                                                                borderRadius: "4px",

                                                                flex: "none",
                                                                order: "0",
                                                                flexGrow: "0",
                                                            }}
                                                        >
                                                            <Typography
                                                                style={{
                                                                    // position: "absolute",
                                                                    left: "8.42%",
                                                                    right: "8.42%",
                                                                    top: "8.33%",
                                                                    bottom: "8.33%",


                                                                    fontFamily: "'Roboto'",
                                                                    fontStyle: "normal",
                                                                    fontWeight: "400",
                                                                    fontSize: "14px",
                                                                    lineHeight: "20px",

                                                                    display: "flex",
                                                                    alignItems: "center",


                                                                    color:
                                                                        type === "GARDEN STYLE"
                                                                            ? "#00B779"
                                                                            : type === "MID RISE"
                                                                            ? "#0088C7"
                                                                            : "#B86800",
                                                                }}
                                                            >
                                                                {
                                                                    find(PROPERTY_TYPE, {
                                                                        value: type,
                                                                    })?.label
                                                                }
                                                            </Typography>
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="text_14_regular">
                                                            {address}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="text_14_regular">
                                                            {ownershipGroupId}
                                                            {/* && organizationMap?.get(
                                                                    ownershipGroupId,
                                                                )} */}
                    {/* </Paper></Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="text_14_regular">
                                                            {moment
                                                                .parseZone(createdAt)
                                                                .local()
                                                                .format("L LT")}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <IconButton
                                                            id="demo-positioned-button"
                                                            aria-controls={"demo-positioned-menu"}
                                                            onClick={(e: any) => {
                                                                e.stopPropagation();
                                                                setAnchor(e.target);
                                                                setPropertyId(id);
                                                            }}
                                                        >
                                                            <PendingOutlinedIcon
                                                                sx={{
                                                                    transform: "rotate(90deg)",
                                                                    fontSize: "25px",
                                                                }}
                                                                htmlColor={
                                                                    theme.palette.text.primary
                                                                }
                                                            />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                            </TableBody>
                            {!isEmpty(projects) && (
                                <TablePaginationProperty
                                    page={page}
                                    noOfPages={totalNoOfPages}
                                    setPage={setPage}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    columnsLength={columns?.length}
                                />
                            )}
                        </Table>
                    </TableContainer>
                    <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchor}
                        open={Boolean(anchor)}
                        onClose={closeMenu}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                setAnchor(null);
                                setConfirm(true);
                            }}
                        >
                            {type == "general" ? "Archive" : "Restore"}
                        </MenuItem>
                    </Menu> */}
                    <BaseDataGrid
                        columns={PropertyListColumns}
                        rows={displayedRows}
                        rowsPerPageOptions={[10, 20, 30]}
                        loading={isLoading}
                        onRowClick={(rowData: any) => {
                            type == "general"
                                ? navigate(`/admin-properties/${rowData.id}/overview`)
                                : null;
                        }}
                        disableColumnMenu={false}
                        components={{
                            NoRowsOverlay: () => (
                                <Stack sx={{ margin: "10px" }}>
                                    <ContentPlaceholder
                                        onLinkClick={() => {
                                            setPropertyModal(true);
                                        }}
                                        text={
                                            searchText !== ""
                                                ? "No results found."
                                                : "No properties created."
                                        }
                                        aText=""
                                        height="90px"
                                    />
                                </Stack>
                            ),
                        }}
                        hideFooter={properties?.lengthv > 10 ? true : false}
                        getRowId={(row: any) => row.id}
                    />
                </Paper>
            </Grid>
            <ConfirmationModal
                text={
                    type == "general"
                        ? "Are you sure, you want to archive this property?"
                        : "Are you sure, you want to restore this property?"
                }
                onCancel={() => setConfirm(false)}
                onProceed={type == "general" ? onPropertyDelete : restoreProperty}
                open={confirm}
                variant={type == "general" ? "deletion" : ""}
                cancelText={type == "general" ? "Cancel" : "No"}
                actionText="yes"
            />
            {(deleteProcess || restoreProcess) && <BaseLoader />}
        </Grid>
    );
};

export default PropertiesListTable;
