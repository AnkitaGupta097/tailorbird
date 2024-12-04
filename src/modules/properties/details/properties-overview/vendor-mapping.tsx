// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_ALL_ORGANIZATION_BY_TYPE } from "stores/projects/details/rfp-manager/rfp-manager-queries";
import { useAppSelector } from "stores/hooks";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import BaseDataGrid from "components/data-grid";

export const GET_ENTRATA_VENDOR_LOCATIONS = gql`
    query Query($ownershipId: String) {
        getEntrataVendorLocations(ownership_id: $ownershipId)
    }
`;

export const CREATE_VENDOR_MAP = gql`
    mutation CreateVendorMap($input: [CreateVendorMap]) {
        createVendorMap(input: $input)
    }
`;

export const GET_VENDOR_MAP = gql`
    query getVendorMapping(
        $pmsType: String!
        $tailorbirdOrgId: String
        $tailorbirdPropertyId: String
    ) {
        getVendorMapping(
            pms_type: $pmsType
            tailorbird_org_id: $tailorbirdOrgId
            tailorbird_property_id: $tailorbirdPropertyId
        )
    }
`;

const VendorMapping = () => {
    const [rows, setRows] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [entrataVendors, setEntratavendors] = useState([]);
    const [vendorMappingData, setVendorMappingData] = useState([]);
    const [createVendorMap] = useMutation(CREATE_VENDOR_MAP);
    const [rowsPerPageOptions] = useState([5, 10, 25]);
    const { propertyDetails, loading } = useAppSelector((state) => {
        return {
            propertyDetails: state.propertyDetails.data,
            loading: state.propertyDetails.loading,
        };
    });
    const { data: tailorbirdVendors } = useQuery(GET_ALL_ORGANIZATION_BY_TYPE, {
        variables: {
            organizationType: "Contractor",
        },
    });
    const { data: vendorMapping, refetch: refetchMapping } = useQuery(GET_VENDOR_MAP, {
        variables: {
            pmsType: "entrata",
            tailorbirdPropertyId: propertyDetails?.id,
        },
    });

    const formatVendorMappingData = (vendorMappingData) => {
        return vendorMappingData.map((mapping) => {
            return {
                tailorbirdVendor: tailorbirdVendors?.getAllOrganizations?.find(
                    (vendor) => vendor.id === mapping.tailorbird_org_id,
                ),
                entrataVendor: entrataVendors?.find(
                    (vendor) => vendor.vendorId === mapping.pms_vendor_id,
                ),
                // id: mapping.id,
            };
        });
    };

    const columns = [
        {
            field: "name",
            headerName: "Org Name",
            width: 400,
            valueGetter: ({ row }) => row.tailorbirdVendor?.name,
        },
        {
            field: "vendorName",
            headerName: "Vendor Name",
            width: 400,
            valueGetter: ({ row }) => row.entrataVendor?.vendorName,
        },
        {
            field: "vendorId",
            headerName: "Vendor Id",
            width: 300,
            valueGetter: ({ row }) => row.entrataVendor?.vendorId,
        },
        {
            field: "locationId",
            headerName: "Location Id",
            width: 300,
            valueGetter: ({ row }) => row.entrataVendor?.locationId,
        },
    ];

    useEffect(() => {
        if (
            vendorMapping &&
            vendorMapping.getVendorMapping &&
            tailorbirdVendors &&
            entrataVendors
        ) {
            setVendorMappingData(formatVendorMappingData(vendorMapping.getVendorMapping));
        }
    }, [vendorMapping, tailorbirdVendors, entrataVendors]);

    const [getVendorLocations, { loading: vendorLoading }] = useLazyQuery(
        GET_ENTRATA_VENDOR_LOCATIONS,
        {
            variables: {
                ownershipId: propertyDetails?.ownershipGroupId,
            },
        },
    );
    const { enqueueSnackbar } = useSnackbar();
    const getVendors = async () => {
        const { data: vendorLocations } = await getVendorLocations({
            variables: {
                ownershipId: propertyDetails.ownershipGroupId,
            },
        });
        const locations = vendorLocations?.getEntrataVendorLocations?.response?.result?.Locations;
        const vendorsArray = Object.values(locations.Location).map((location) => ({
            vendorId: location.VendorId,
            vendorName: `${location.VendorName} (${location["@attributes"].Name}_${location["@attributes"].Id})`,
            locationId: location["@attributes"].Id,
        }));
        setEntratavendors(vendorsArray);
    };

    useEffect(() => {
        if (!loading) {
            if (propertyDetails?.ownershipGroupId) {
                getVendors();
            }
        }
    }, [loading]);

    const handleAddRow = () => {
        setRows([...rows, { tailorbirdVendor: null, entrataVendor: null, id: nextId }]);
        setNextId(nextId + 1);
    };

    const handleRemoveRow = (indexToRemove) => {
        setRows((prevRows) => prevRows.filter((_, index) => index !== indexToRemove));
    };

    const isSaveDisabled = rows.some((row) => !row.tailorbirdVendor || !row.entrataVendor);

    const handleSave = () => {
        const mappedData = rows.map((row) => ({
            tailorbird_vendor_id: row.tailorbirdVendor ? row.tailorbirdVendor.id : null,
            entrata_vendor_id: row.entrataVendor ? row.entrataVendor.vendorId : null,
            vendor_location_id: row.entrataVendor ? row.entrataVendor.locationId : null,
        }));
        console.log("Saving data:", mappedData);
        const pms_property_id = propertyDetails?.property_id_mappings?.filter(
            (f: any) => f.type === "entrata",
        );
        const input = mappedData.map((p: any) => {
            return {
                pms_property_id: pms_property_id[0]?.property_id,
                pms_type: "entrata",
                pms_vendor_id: p.entrata_vendor_id,
                tailorbird_org_id: p.tailorbird_vendor_id,
                tailorbird_property_id: propertyDetails?.id,
                vendor_location_id: p.vendor_location_id,
            };
        });

        createVendorMap({
            variables: {
                input,
            },
        })
            .then(() => {
                enqueueSnackbar("", {
                    variant: "success",
                    action: (
                        <BaseSnackbar variant={"success"} title={"Vendors Mapped Successfully"} />
                    ),
                });
                refetchMapping();
            })
            .catch(() => {
                enqueueSnackbar("", {
                    variant: "error",
                    action: <BaseSnackbar variant={"error"} title={"Some Error Occurred."} />,
                });
            });
    };

    const handleChange = (index, key, value) => {
        const newRows = [...rows];
        if (key === "entrataVendor") {
            newRows[index][key] = {
                vendorId: value.vendorId,
                locationId: value.locationId,
            };
        } else {
            newRows[index][key] = value;
        }
        setRows(newRows);
    };
    const data = vendorMappingData.map((item: any) => ({ ...item, id: item.tailorbirdVendor?.id }));

    return (
        <div>
            <Box sx={{ textAlign: "center" }} mt={3}>
                <Typography variant="title">Vendor Mapping</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end" margin={4}>
                <Button variant="contained" color="primary" onClick={handleAddRow}>
                    Add Row
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSave}
                    style={{ marginLeft: 10 }}
                    disabled={isSaveDisabled}
                >
                    Save
                </Button>
            </Box>
            {rows.map((row, index) => (
                <Grid
                    container
                    spacing={4}
                    key={row.id}
                    display={"flex"}
                    justifyContent={"center"}
                    mt={1}
                >
                    <Grid item xs={4}>
                        <Autocomplete
                            fullWidth
                            options={tailorbirdVendors?.getAllOrganizations ?? []}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, newValue) =>
                                handleChange(index, "tailorbirdVendor", newValue)
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tailorbird Vendor"
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: { color: "black" },
                                    }}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            loading={vendorLoading}
                            fullWidth
                            options={entrataVendors}
                            getOptionLabel={(option) => option.vendorName}
                            onChange={(_, newValue) =>
                                handleChange(index, "entrataVendor", newValue)
                            }
                            isOptionEqualToValue={(option, value) => {
                                return option.vendorId === value.vendorId;
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Entrata Vendor"
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {vendorLoading ? (
                                                    <CircularProgress color="inherit" size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                    InputLabelProps={{
                                        style: { color: "black" },
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton variant="contained" onClick={() => handleRemoveRow(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            {
                <Box mt={4}>
                    <BaseDataGrid
                        loa
                        rows={data}
                        columns={columns}
                        rowsPerPageOptions={rowsPerPageOptions}
                        checkboxSelection
                        disableSelectionOnClick
                        loading={vendorLoading}
                        // onSelectionModelChange={(newSelection: string[]) => {
                        //     setSelected(newSelection);
                        // }}
                        // selectionModel={selected}
                        // components={{
                        //     BaseCheckbox: BaseCheckbox,
                        // }}
                    />
                </Box>
            }
        </div>
    );
};

export default VendorMapping;
