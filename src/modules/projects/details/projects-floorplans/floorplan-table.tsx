import React, { useEffect, useState } from "react";
import {
    Grid,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    styled,
    TablePagination,
    Box,
    TableCellProps,
    InputBase,
    TableRowProps,
    SvgIcon,
} from "@mui/material";
import BaseIconButton from "../../../../components/base-icon-button";
import AddIcon from "../../../../assets/icons/icon-add.svg";
import { TypographyProps } from "@mui/system";
import BaseButton from "../../../../components/base-button";
import {
    COMMON_HEADERS,
    generateInventoryList,
    generateSubGroupMapper,
    generateNewInventoryList,
} from "./service";
import { PROJECT_TYPE } from "../../constant";
import { ReactComponent as CorrectIcon } from "../../../../assets/icons/icon-correct.svg";
import { ReactComponent as ExclamationIcon } from "../../../../assets/icons/icon-exclamation.svg";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import actions from "../../../../stores/actions";
import { useParams } from "react-router-dom";
import { USER_DETAILS } from "../../constant";
import { isEmpty, find } from "lodash";
import BaseDialog from "../../../../components/base-dialog";
import InventoryMixTable from "./inventory-mix-table";

interface IPlanData {
    headers: any;
    data: any[];
    showAddIcon: boolean;
    isDefined: boolean;
    showButton: boolean;
    isEdit: boolean;
    groupNames: string[];
}

interface IFloorplanTable {
    planData: IPlanData;
    setPlanData: any;
    title: string;
    type: string;
    defaultPlanData?: IPlanData;
}

const TitleSection = styled(Box)({
    width: "100%",
    display: "flex",
    gap: "10px",
    borderBottom: "1px solid #DFE0EB",
});

const TableTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
    marginLeft: "32px",
    borderBottom: `2px solid ${theme.palette.primary.main}`,
}));

const StyledTableRow = styled(TableRow)<TableRowProps>(() => ({
    "@keyframes flashing": {
        from: {
            backgroundColor: "#ffecb3",
        },
        to: {
            backgroundColor: "inherit",
        },
    },
}));

const ActiveCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.primary.main,
    color: theme.palette.text.secondary,
    height: "3rem",
}));

const RegularCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.secondary.main,
    color: theme.palette.text.primary,
    height: "3rem",
}));

const ActiveDataCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main,
}));

const SInput = styled(InputBase)(() => ({
    "& .MuiInputBase-input": {
        borderRadius: 5,
        backgroundColor: "#fcfcfb",
        border: "1px solid #CCCCCC",
        fontSize: 16,
        padding: "5px 8px",
    },
}));

const FloorplanTable = ({
    planData,
    setPlanData,
    title,
    type,
    defaultPlanData,
}: IFloorplanTable) => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const { subGroups, inventories, floorplans, projectDetails } = useAppSelector((state) => ({
        subGroups: state.projectFloorplans.floorplanSplits.subGroups,
        inventories: state.projectFloorplans.inventories,
        floorplans: state.projectFloorplans.floorplans,
        projectDetails: state.projectDetails.data,
    }));
    const { headers, data, showAddIcon, isDefined, showButton, isEdit, groupNames } = planData;
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [inventoryMix, setInventoryMix] = useState<any>({ inventoryList: [], count: 0 });
    const [hasInvMixError, setHasInvMixError] = React.useState(false);
    const [invNameError, setInvNameError] = React.useState(false);
    // const [isFSUpdate, setIsFSUpdate] = React.useState(false);

    useEffect(() => {
        const { data } = planData;
        setInventoryMix(generateInventoryList(inventories, data));
        // eslint-disable-next-line
    }, [planData, inventories]);

    // Floorplan create handler.
    const handleAddIconClick = () => {
        if (type === "floorplanSplit") {
            dispatch(actions.projectFloorplans.createFlooringSplitStart({ id: projectId }));
        } else if (type === "inventoryMix") {
            setInventoryMix(generateNewInventoryList(inventories, floorplans));
            setOpen(true);
        }
    };

    // Floorplan edit handler.
    const onEditFloorPlan = () => {
        if (isEdit) {
            if (type === "floorplanSplit") {
                const mapper = generateSubGroupMapper(subGroups, data);
                dispatch(
                    actions.projectFloorplans.updateFlooringSplitTableCountStart({
                        projectId,
                        updatedBy: USER_DETAILS?.id ? USER_DETAILS?.id : "user_user_id",
                        mapper,
                    }),
                );
            } else if (type === "inventoryMix") {
                dispatch(
                    actions.projectFloorplans.updateInventoryMixStart({
                        projectId,
                        updatedBy: USER_DETAILS.id ? USER_DETAILS.id : "user_user_id",
                        inventoryList: inventoryMix.inventoryList,
                    }),
                );
            }
            setPlanData({ ...planData, isEdit: false });
            setOpen(false);
        } else {
            setPlanData({ ...planData, isEdit: true });
        }
    };

    // Floorplan inventory data change handler
    const onFloorPlanDataChange = (e: any, index: number, keyIndex: string, fpId: string) => {
        const count = parseInt(e.target.value, 10);
        setPlanData((state: any) => {
            let stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy = {
                ...stateCopy,
                data: stateCopy.data.map((item: any) => {
                    if (item.floorplanId === fpId) {
                        return { ...item, [keyIndex]: isNaN(count) ? 0 : count };
                    }
                    return { ...item };
                }),
            };
            return stateCopy;
        });
    };

    const renderDataTotal = (row: any, keyIndex: string) => {
        let total = 0;
        groupNames.map((group: string) => (total += parseInt(row[group] ? row[group] : "0", 10)));
        let diff = parseInt(row["renoUnits"] ? row["renoUnits"] : "0", 10) - total;
        return keyIndex === "renoUnits" ? (
            <React.Fragment>
                {diff !== 0 ? (
                    <Typography style={{ color: "#BD0000", lineHeight: "0.7", marginLeft: "5px" }}>
                        ({diff})
                    </Typography>
                ) : null}
                <SvgIcon style={{ margin: "6px 0 0 5px" }}>
                    {diff !== 0 ? <ExclamationIcon /> : <CorrectIcon />}
                </SvgIcon>
            </React.Fragment>
        ) : null;
    };
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const tableData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const isFSUpdate1 = () => {
        const isUpdate = data.map((row) => {
            let diff =
                parseInt(row.renoUnits, 10) -
                (parseInt(row?.Upper ? row?.Upper : 0, 10) +
                    parseInt(row?.Ground ? row.Ground : 0, 10));
            return { update: diff === 0 ? false : true };
        });
        if (!isEdit) {
            return false;
        } else {
            return find(isUpdate, { update: true }) && type == "floorplanSplit" ? true : false;
        }
    };

    return (
        <React.Fragment>
            {headers?.name && data?.length ? (
                <Grid container>
                    <TitleSection>
                        <TableTitle className="floor-plan-header" variant="title">
                            {title}
                        </TableTitle>

                        {showAddIcon && (
                            <BaseIconButton
                                icon={AddIcon}
                                onClick={handleAddIconClick}
                                classes="floor-plan-add-icon"
                                sx={{ height: "25px", width: "25px", marginTop: "5px" }}
                            />
                        )}
                    </TitleSection>
                    {isDefined ? (
                        <Grid item md={12} marginLeft={8} marginRight={8} marginTop={4}>
                            <Table
                                sx={{
                                    borderCollapse: "separate",
                                    borderSpacing: "0.25rem 0",
                                }}
                            >
                                <TableHead>
                                    <TableRow>
                                        {Object.values(headers).map((header: any, idx: number) =>
                                            idx < 2 ? (
                                                <ActiveCell
                                                    key={`${header}-${idx}`}
                                                    sx={{
                                                        width: `${
                                                            100 / Object.keys(headers).length
                                                        }%`,
                                                    }}
                                                >
                                                    <Typography variant="tableHeaderText">
                                                        {header}
                                                    </Typography>
                                                </ActiveCell>
                                            ) : (
                                                <RegularCell
                                                    key={`${header}-${idx}`}
                                                    sx={{
                                                        width: `${
                                                            100 / Object.keys(headers).length
                                                        }%`,
                                                    }}
                                                >
                                                    <Typography variant="tableHeaderText">
                                                        {header}
                                                    </Typography>
                                                </RegularCell>
                                            ),
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((row: any, idx: number) => {
                                        let total = 0;
                                        groupNames.map(
                                            (group: string) =>
                                                (total += parseInt(
                                                    row[group] ? row[group] : "0",
                                                    10,
                                                )),
                                        );
                                        let diff =
                                            parseInt(row.renoUnits ? row.renoUnits : "0", 10) -
                                            total;
                                        return (
                                            <StyledTableRow
                                                key={`${row.id}-${idx}`}
                                                sx={{
                                                    animation:
                                                        type == "floorplanSplit" && diff !== 0
                                                            ? "flashing 1.5s ease-in infinite"
                                                            : "none",
                                                }}
                                            >
                                                {Object.keys(headers).map(
                                                    (dataKey: string, keyIndex: number) => {
                                                        return keyIndex < 2 ? (
                                                            <ActiveDataCell
                                                                key={`${dataKey}-${idx}`}
                                                            >
                                                                <Typography variant="tableData">
                                                                    {tableData[idx][dataKey]}
                                                                </Typography>
                                                            </ActiveDataCell>
                                                        ) : COMMON_HEADERS.includes(dataKey) ||
                                                          type === "floorplans" ||
                                                          type === "inventoryMix" ||
                                                          !isEdit ? (
                                                            <React.Fragment>
                                                                <TableCell
                                                                    key={`${dataKey}-${idx}`}
                                                                    sx={{
                                                                        padding: `${
                                                                            type ===
                                                                            "floorplanSplit"
                                                                                ? "0px 0px 0px 16px"
                                                                                : "16px"
                                                                        }`,
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="tableData"
                                                                        sx={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        {tableData[idx][dataKey]}
                                                                        {isEdit
                                                                            ? renderDataTotal(
                                                                                  row,
                                                                                  dataKey,
                                                                              )
                                                                            : null}
                                                                    </Typography>
                                                                </TableCell>
                                                            </React.Fragment>
                                                        ) : (
                                                            <TableCell
                                                                key={`${dataKey}-${idx}`}
                                                                style={{
                                                                    padding: `${
                                                                        type === "floorplanSplit"
                                                                            ? "0px 0px 0px 16px"
                                                                            : "16px"
                                                                    }`,
                                                                }}
                                                            >
                                                                <SInput
                                                                    value={
                                                                        tableData[idx]?.[dataKey]
                                                                            ? tableData[idx]?.[
                                                                                  dataKey
                                                                              ]
                                                                            : 0
                                                                    }
                                                                    onChange={(e) =>
                                                                        onFloorPlanDataChange(
                                                                            e,
                                                                            idx,
                                                                            dataKey,
                                                                            row.floorplanId,
                                                                        )
                                                                    }
                                                                    inputProps={{
                                                                        inputMode: "numeric",
                                                                        pattern: "[0-9]*",
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        );
                                                    },
                                                )}
                                            </StyledTableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {!isEmpty(data) && (
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            )}
                            {showButton ? (
                                <Box marginTop={4}>
                                    {type === "inventoryMix" ? (
                                        <BaseDialog
                                            button={
                                                <BaseButton
                                                    label={"Edit"}
                                                    onClick={() =>
                                                        setPlanData({ ...planData, isEdit: true })
                                                    }
                                                    type="active"
                                                />
                                            }
                                            content={
                                                <InventoryMixTable
                                                    inventoryMix={inventoryMix}
                                                    setInventoryMix={setInventoryMix}
                                                    setHasInvMixError={setHasInvMixError}
                                                    setInvNameError={setInvNameError}
                                                />
                                            }
                                            open={open}
                                            setOpen={setOpen}
                                            actions={
                                                <React.Fragment>
                                                    <BaseButton
                                                        label={"Cancel"}
                                                        onClick={() => setOpen(false)}
                                                        type="warning"
                                                    />
                                                    <BaseButton
                                                        label={isEdit ? "Update" : "Create"}
                                                        onClick={onEditFloorPlan}
                                                        type="active"
                                                        classes={
                                                            hasInvMixError || invNameError
                                                                ? "disabled"
                                                                : ""
                                                        }
                                                        disabled={hasInvMixError || invNameError}
                                                    />
                                                </React.Fragment>
                                            }
                                            header={
                                                <React.Fragment>Edit inventory Mix</React.Fragment>
                                            }
                                        />
                                    ) : (
                                        <React.Fragment>
                                            {!(
                                                projectDetails.projectType == PROJECT_TYPE[0].value
                                            ) && (
                                                <BaseButton
                                                    label={isEdit ? "Update" : "Edit"}
                                                    onClick={onEditFloorPlan}
                                                    type="active"
                                                    disabled={isFSUpdate1()}
                                                    style={{
                                                        cursor: isFSUpdate1()
                                                            ? "not-allowed"
                                                            : "pointer",
                                                    }}
                                                />
                                            )}
                                            {isEdit && (
                                                <BaseButton
                                                    label={"Cancel"}
                                                    onClick={() => {
                                                        setPlanData({
                                                            ...defaultPlanData,
                                                            isEdit: false,
                                                        });
                                                    }}
                                                    type="active"
                                                />
                                            )}
                                        </React.Fragment>
                                    )}
                                </Box>
                            ) : null}
                        </Grid>
                    ) : null}
                </Grid>
            ) : null}
        </React.Fragment>
    );
};

export default React.memo(FloorplanTable);
