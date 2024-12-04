import React, { useEffect, useState } from "react";
import { chain, isUndefined, map, sumBy } from "lodash";
import { useParams } from "react-router-dom";
import { productionTabUrl } from "../constants";
import { Divider, Grid, Stack, Typography, Link, TextField, InputAdornment } from "@mui/material";
import BaseDataGridPro from "components/data-grid-pro";
import {
    DataGridProProps,
    useGridApiContext,
    GridRenderCellParams,
    GRID_TREE_DATA_GROUPING_FIELD,
} from "@mui/x-data-grid-pro";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getRoundedOffAndFormattedAmount } from "../helper";
import { Search, ChangeHistory } from "@mui/icons-material";

import { ReactComponent as HandshakeIcon } from "../../../assets/icons/Handshake.svg";
import BaseChip from "components/chip";
import { useProductionContext } from "context/production-context";
import BaseLoader from "components/base-loading";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { shallowEqual } from "react-redux";

const CustomGroupedCell = (props: any) => {
    const { id, field, rowNode } = props;

    const apiRef = useGridApiContext();

    const handleClick = (event: any) => {
        if (rowNode.type !== "group") {
            return;
        }

        apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
        apiRef.current.setCellFocus(id, field);
        event.stopPropagation();
    };

    const hasChildren = rowNode.children && rowNode.children.length > 0;
    return (
        <Stack
            direction={"row"}
            onClick={handleClick}
            marginLeft={!hasChildren ? "30px" : undefined}
        >
            {hasChildren &&
                (rowNode.childrenExpanded ? (
                    <ExpandMoreIcon sx={{ height: "20px", width: "20px" }} />
                ) : (
                    <ChevronRightIcon sx={{ height: "20px", width: "20px" }} />
                ))}
            <Typography
                variant="text_14_semibold"
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 0.6rem",
                    whiteSpace: "normal",
                }}
            >
                {hasChildren
                    ? `${props.row?.fp_name} - ${props.row?.total_units ?? 0} units`
                    : props.row?.fp_name}
            </Typography>
        </Stack>
    );
};

const LiveAgreement = () => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const [liveAgreementTotalCost, setLiveAgreementTotalCost] = useState<any>(undefined);
    const { liveAgreement, loading } = useAppSelector(
        (state) => ({
            liveAgreement: state.agreementState.liveAgreement,
            loading: state.agreementState.loading,
        }),
        shallowEqual,
    );

    const [rows, setRows] = useState<any>([]);
    const { isRFPProject } = useProductionContext();

    const groupingColDef: DataGridProProps["groupingColDef"] = {
        headerName: "Floor Plans",
        renderCell: (params: any) => <CustomGroupedCell {...params} />,
    };

    useEffect(() => {
        if (isUndefined(liveAgreement)) {
            dispatch(
                actions.production.agreements.fetchLiveAgreementStart({
                    projectId,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (liveAgreement) {
            setLiveAgreementTotalCost(
                chain(liveAgreement.floor_plans).flatMap("scopes").sumBy("price").value(),
            );
            setRows(getRows());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liveAgreement]);

    const scopeColumns = () => {
        return (
            liveAgreement?.scope_names?.map((scope_name: any, index: number) => {
                return {
                    field: scope_name,
                    width: index === 0 ? 300 : 200,
                    align: "center",
                    headerAlign: "center",
                    headerName: scope_name,
                    renderCell(params: GridRenderCellParams) {
                        let catIndex = params.row?.scopes?.findIndex(
                            (scope: any) => scope.scope_name === scope_name,
                        );

                        return (
                            <>
                                {catIndex !== -1 && (
                                    <div>
                                        {`$${getRoundedOffAndFormattedAmount(
                                            params?.row?.scopes[catIndex].price,
                                        )}`}
                                    </div>
                                )}
                            </>
                        );
                    },
                };
            }) ?? []
        );
    };

    const getAllFloorPlanData = () => {
        return {
            fp_name: "All floor plan",
            scopes: chain(liveAgreement.floor_plans)
                .flatMap("scopes")
                .groupBy("scope_name")
                .map((scope, scope_name) => ({
                    scope_name,
                    price: sumBy(scope, "price"),
                }))
                .value(),
            units: chain(liveAgreement.floor_plans).flatMap("units").value(),
        };
    };

    const getRows = () => {
        if (
            !liveAgreement ||
            !liveAgreement.floor_plans ||
            liveAgreement.floor_plans.length === 0
        ) {
            return [];
        }

        const rows: any = [];
        // eslint-disable-next-line no-unsafe-optional-chaining
        const floorPlanData = [getAllFloorPlanData(), ...(liveAgreement?.floor_plans ?? [])];

        floorPlanData.forEach((fp: any) => {
            const { fp_name, scopes } = fp;
            rows.push({
                fp_name,
                total_units: fp?.units?.length,
                scopes,
                path: [fp_name],
                id: fp_name,
            });
            fp.units.forEach((unit: any) => {
                const { unit_name, scopes } = unit;
                rows.push({
                    fp_name: unit_name,
                    scopes,
                    path: [fp_name, unit_name],
                    id: `${fp_name}-${unit_name}`,
                    parent_id: fp_name,
                });
            });
        });
        return rows;
    };

    const onChangeUnitInput = (value: string) => {
        const initialRows = getRows();
        const units = initialRows.filter(
            (row: any) => row.parent_id && row.fp_name.includes(value),
        );
        const parentIds = map(units, "parent_id");
        const floor_plans = initialRows.filter((row: any) => parentIds.includes(row.id));
        setRows([...floor_plans, ...units]);
    };

    return (
        <>
            {loading ? (
                <BaseLoader />
            ) : (
                <Grid
                    container
                    direction={"column"}
                    sx={{
                        alignItems: "flex-start",
                    }}
                    rowSpacing={4}
                >
                    <Grid item>
                        <Stack direction={"row"}>
                            <Stack direction="column" gap={"16px"}>
                                <Link
                                    href={`${productionTabUrl(projectId, isRFPProject)}/agreements`}
                                    underline="always"
                                    sx={{
                                        alignItems: "center",
                                        color: "#004D71",
                                        fontFamily: "Roboto",
                                        marginLeft: "0",
                                    }}
                                >
                                    <Typography variant="text_16_regular">
                                        {"Agreements"}
                                    </Typography>
                                </Link>
                                <Divider
                                    sx={{
                                        width: "1392px",
                                        height: "1px",
                                        flexShrink: 0,
                                        fill: "#C9CCCF",
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item width="100%">
                        <Grid container columnGap={4}>
                            <Grid item maxHeight={"20px"}>
                                <HandshakeIcon />
                            </Grid>
                            <Grid item>
                                <Typography variant="keyText">
                                    Agreement Amount: $
                                    {!isUndefined(liveAgreementTotalCost)
                                        ? getRoundedOffAndFormattedAmount(liveAgreementTotalCost)
                                        : "-"}
                                </Typography>
                            </Grid>
                            <Grid item marginLeft="auto">
                                <BaseChip
                                    label="Live Agreement"
                                    sx={{ borderRadius: "4px", fontSize: "14px" }}
                                    icon={<ChangeHistory />}
                                    size="small"
                                    bgcolor="#DDCBFB"
                                    textColor="#410099"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item width={"100%"}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            placeholder="Search by Unit"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e: any) => onChangeUnitInput(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs width="100%" height={"520px"}>
                        {
                            <BaseDataGridPro
                                hideToolbar
                                autoHeight={false}
                                initialState={{
                                    pinnedColumns: {
                                        left: [GRID_TREE_DATA_GROUPING_FIELD],
                                    },
                                }}
                                treeData
                                columns={[...scopeColumns()]}
                                getTreeDataPath={(row: any) => row.path}
                                rows={rows ?? []}
                                rowsPerPageOptions={[]}
                                hideFooter={true}
                                groupingColDef={groupingColDef}
                                sx={{
                                    "& .MuiDataGrid-pinnedColumns": {
                                        backgroundColor: "#F0F0F0",
                                    },
                                    "& .MuiDataGrid-columnHeader": {
                                        backgroundColor: "#F0F0F0",
                                    },
                                    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                                        outline: "none",
                                    },
                                    "&.MuiDataGrid-root .MuiDataGrid-cell": {
                                        padding: "0px",
                                    },
                                    "& .modified-common.negative": {
                                        backgroundColor: "#F0F0F0",
                                    },
                                    "& .modified-common.positive": {
                                        backgroundColor: "#FFF5EA",
                                    },
                                }}
                            />
                        }
                    </Grid>
                </Grid>
            )}
        </>
    );
};

export default LiveAgreement;
