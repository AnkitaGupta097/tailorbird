import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useLazyQuery, useMutation } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import { UPDATE_PROPERTY } from "stores/projects/properties/details/index/index-queries";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { GET_ENTRATA_VENDOR_LOCATIONS } from "./contractors-detail";

const VendorSearchDialog = ({ open, onClose, id }: any) => {
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [entrataData, setEntrataData] = useState([]);
    const [err, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updateProperty] = useMutation(UPDATE_PROPERTY);
    const { enqueueSnackbar } = useSnackbar();

    const handleSelect = () => {
        //@ts-ignore
        console.log(selectedProperty);
        updateProperty({
            variables: {
                propertyId: id,
                //@ts-ignore
                entrataPropertyId: selectedProperty?.PropertyID.toString(),
            },
        })
            .then(() => {
                enqueueSnackbar("", {
                    variant: "success",
                    action: (
                        <BaseSnackbar variant={"success"} title={"Property Mapped Successfully"} />
                    ),
                });
                setSelectedProperty(null);
                onClose();
            })
            .catch(() => {
                enqueueSnackbar("", {
                    variant: "error",
                    action: <BaseSnackbar variant={"error"} title={"Some Error Occurred."} />,
                });
                setSelectedProperty(null);
                onClose();
            });
    };

    const handleCancel = () => {
        setSelectedProperty(null);
        onClose();
    };

    const [getEntrataVendorLocations] = useLazyQuery(GET_ENTRATA_VENDOR_LOCATIONS, {
        variables: { ownershipId: "" },
    });

    const getData = async () => {
        console.log("hrllo");

        setLoading(true);
        const { data: entrataVendorsData, error: entrataError } = await getEntrataVendorLocations({
            variables: {
                ownershipId: id,
            },
        });
        console.log(entrataVendorsData, "entrataVendorsData");
        const data =
            entrataVendorsData?.getEntrataProperties?.response?.result?.PhysicalProperty?.Property;
        if (data && data.length > 0) setEntrataData(data);
        if (entrataError) {
            setError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            {err ? (
                <DialogContent>{"Not connected to Entrata"}</DialogContent>
            ) : (
                <>
                    {" "}
                    <DialogTitle>Search for a Property</DialogTitle>
                    <DialogContent sx={{ textAlign: "center" }}>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Autocomplete
                                options={entrataData}
                                //@ts-ignore
                                getOptionLabel={(option) => option.MarketingName}
                                onChange={(_, newValue: any) => setSelectedProperty(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Property" variant="outlined" />
                                )}
                            />
                        )}
                        {selectedProperty && (
                            //@ts-ignore
                            <div>Selected Property: {selectedProperty.MarketingName}</div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSelect} color="primary" disabled={!selectedProperty}>
                            Confirm
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default VendorSearchDialog;
