import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    Button,
    Grid,
    // CircularProgress as Loader,
} from "@mui/material";
import { ReactComponent as Reset } from "../../../../../assets/icons/reset-icon.svg";
import loaderProgress from "../../../../../assets/icons/blink-loader.gif";
import { useAppSelector, useAppDispatch } from "../../../../../stores/hooks";
import AppTheme from "../../../../../styles/theme";
import ColumnList from "../common/cloumn-list";
import actions from "../../../../../stores/actions";
import { filter, isEmpty, map } from "lodash";
import { useParams } from "react-router-dom";

interface IColumnMapModal {
    /* eslint-disable-next-line */
    isOpen: boolean;
    handleClose: any;
}

const ColumnMapModal = ({ isOpen, handleClose }: IColumnMapModal) => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const { rentRollDb, propertyDetails } = useAppSelector((state) => {
        return {
            rentRollDb: state.projectOverview.rentRollDb,
            propertyDetails: state.propertyDetails.data,
        };
    });
    const { loading, data } = rentRollDb;
    const [selectedColumn, setSelectedColumn] = useState<any>([]);
    const [mappingError, setMappingError] = useState<any>(false);
    const [values, setValues] = useState<any>({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" });

    useEffect(() => {
        if (data?.error && data?.column == null) {
            handleClose();
        }
        // eslint-disable-next-line
    }, [data]);

    const onSelection = (columnName: any, index: number) => {
        const columnValues = { ...values, [index]: columnName ? columnName : "" };
        setSelectedColumn(
            filter(
                map(columnValues, (val) => val),
                (name) => !isEmpty(name),
            ),
        );
        setValues({ ...columnValues, [index]: columnName ? columnName : "" });
    };

    const onReset = () => {
        setSelectedColumn([]);
        setValues({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" });
    };

    const onColumnSave = () => {
        if (values[0] == "" || values[1] == "" || values[2] == "" || values[3] == "") {
            setMappingError(true);
            setTimeout(() => setMappingError(false), 3000);
            return false;
        } else {
            setSelectedColumn([]);
            setValues({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" });
            console.log(values, "projects");
            dispatch(
                actions.projectOverview.updateRentRollColumnStart({
                    projectId: projectId
                        ? projectId
                        : propertyDetails.projects.find((elm: any) => elm.type === "DEFAULT").id,
                    ...values,
                }),
            );
            handleClose();
        }
    };

    return (
        <Dialog
            open={isOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="file-upload-modal"
        >
            <DialogTitle id="alert-dialog-title">
                <Typography variant="text_18_semibold">Import Settings</Typography>
            </DialogTitle>

            <DialogContent>
                <Typography variant="text_16_regular">
                    From the uploaded CSV / XLSX file, please select the source columns that
                    correspond to the destination columns below. If there is no corresponding
                    column, don’t make any selection.
                </Typography>
                <Box mb={6} mt={6} display="flex" justifyContent="center">
                    {loading ? (
                        <Box>
                            <img
                                src={loaderProgress}
                                alt="file-status"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                }}
                            />
                        </Box>
                    ) : (
                        <Grid container>
                            <Grid item md={12}>
                                {data && (
                                    <>
                                        <ColumnList
                                            columnName="UNIT Column"
                                            options={data.columns}
                                            onSelection={onSelection}
                                            selectedColumn={selectedColumn}
                                            index={0}
                                            value={values[0]}
                                        />
                                        <ColumnList
                                            columnName="FLOORPLAN NAME Column"
                                            options={data.columns}
                                            onSelection={onSelection}
                                            selectedColumn={selectedColumn}
                                            index={1}
                                            value={values[1]}
                                        />
                                        <ColumnList
                                            columnName="FLOORPLAN TYPE Column"
                                            options={data.columns}
                                            onSelection={onSelection}
                                            selectedColumn={selectedColumn}
                                            index={2}
                                            value={values[2]}
                                        />
                                        <ColumnList
                                            columnName="COMMERCIAL NAME Column"
                                            options={data.columns}
                                            onSelection={onSelection}
                                            selectedColumn={selectedColumn}
                                            index={5}
                                            value={values[5]}
                                        />
                                        <ColumnList
                                            columnName="UNIT TYPE Column"
                                            options={data.columns}
                                            onSelection={onSelection}
                                            selectedColumn={selectedColumn}
                                            index={6}
                                            value={values[6]}
                                        />
                                        <ColumnList
                                            columnName="SQFT Column"
                                            options={data.columns}
                                            selectedColumn={selectedColumn}
                                            onSelection={onSelection}
                                            index={3}
                                            value={values[3]}
                                        />
                                        <ColumnList
                                            columnName="INVENTORY Column"
                                            options={data.columns}
                                            onSelection={onSelection}
                                            selectedColumn={selectedColumn}
                                            index={4}
                                            value={values[4]}
                                        />
                                    </>
                                )}
                            </Grid>
                            {mappingError && (
                                <Grid item md={12} mb={6}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                color: AppTheme.jobStatus.error.textColor,
                                            }}
                                            variant="text_16_regular"
                                            className="label-error"
                                        >
                                            Column mapping required*
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                            <Grid item md={7}>
                                <Button
                                    variant="contained"
                                    startIcon={<Reset />}
                                    style={{
                                        height: "40px",
                                        color: AppTheme.text.dark,
                                        backgroundColor: AppTheme.palette.secondary.main,
                                    }}
                                    onClick={onReset}
                                >
                                    Reset
                                </Button>
                            </Grid>
                            <Grid item md={5} display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{ height: "100%", marginRight: "15px" }}
                                    onClick={() => {
                                        onReset();
                                        handleClose();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{ height: "100%" }}
                                    onClick={onColumnSave}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ColumnMapModal;
