/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { Box, Grid, InputAdornment, Link, TextField, Typography } from "@mui/material";
import "./forge-viewer.css";
import {
    GridColDef,
    GridRowsProp,
    DataGridProProps,
    GridRenderCellParams,
    GridCellParams,
} from "@mui/x-data-grid-pro";
import DataGridPro from "components/data-grid-pro";
import { Search } from "@mui/icons-material";
import { categorySortingOrder } from "stores/projects/details/budgeting/base-scope/constants";
// import projects from "modules/projects";

const TableDetailedStat = ({ data, prokey, currentSelection }: any) => {
    // function navigateToProject(id: string) {
    //     throw new Error("Function not implemented.");
    // }
    const [searchText, setSearchText] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };
    const sortedItems = (items: any) =>
        items.sort((a: any, b: any) => {
            const itemA = a.item.toLowerCase();
            const itemB = b.item.toLowerCase();
            return itemA.localeCompare(itemB);
        });
    function formatData(inputData: any) {
        return [].concat(
            ...inputData.map((item: any, index: number) => {
                const resultArray = [];
                if (item?.items) {
                    let sortedData = sortedItems([...item.items]);
                    resultArray.push(
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        ...sortedData
                            ?.filter((sIt: any) => sIt.count > 0)
                            ?.map((subItem: any, subIndex: number) => ({
                                id: `${index}-${subIndex}`,
                                category: [`${item.category}`, subItem.item],
                                count: subItem.count,
                                uom: subItem.uom,
                                item: subItem.item,
                            })),
                    );
                } else {
                    resultArray.push({
                        id: `${index}`,
                        category: [`${item.category}`],
                        count: item.count,
                        uom: item.uom,
                    });
                }
                return resultArray;
            }),
        );
    }
    const groupingColDef: DataGridProProps["groupingColDef"] = {
        headerName: "Item",
        flex: 0.5,
    };

    const columns: GridColDef[] = [
        {
            field: "count",
            headerName: "Quantity",
            flex: 0.2,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_medium" color={"#8c9196"}>
                    {params.row.count}
                </Typography>
            ),
        },
        {
            field: "uom",
            headerName: "UoM",
            flex: 0.2,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_medium" color={"#8c9196"}>
                    {params.row.uom}
                </Typography>
            ),
        },
    ];

    const breadCrumb = useMemo(() => currentSelection?.breadCrumb, [currentSelection]);
    const isAllUnits = useMemo(() => currentSelection?.isAllUnits, [currentSelection]);
    const allUnitsCount = useMemo(
        () => (isAllUnits ? data?.data[0]?.units || 0 : 0),
        [data, isAllUnits],
    );
    const detailStatsOfAllUnits = useMemo(
        () => (isAllUnits ? data?.data[0]?.detailed_stats || [] : []),
        [data, isAllUnits],
    );
    const getTreeDataPath: DataGridProProps["getTreeDataPath"] = (row) => row.category;

    const sortItems = (items: any[]) => {
        const sorteditems = items
            .slice()
            .map((t: any) => ({ ...t, initialCost: t.unitCost }))
            .sort((a: any, b: any) => {
                const categoryA = a.category.toLowerCase();
                const categoryB = b.category.toLowerCase();
                const positionA = categorySortingOrder.find(
                    (item: any) => item.name.toLowerCase() === categoryA,
                )?.position;
                const positionB = categorySortingOrder.find(
                    (item: any) => item.name.toLowerCase() === categoryB,
                )?.position;

                if (positionA !== undefined && positionB !== undefined) {
                    return positionA - positionB;
                } else if (positionA !== undefined) {
                    return -1;
                } else if (positionB !== undefined) {
                    return 1;
                } else {
                    return 0;
                }
            });
        return sorteditems;
    };
    const reformData = formatData(
        isAllUnits ? sortItems(detailStatsOfAllUnits) : sortItems(data.detailed_stats),
    );

    const filteredData = useMemo(() => {
        if (!searchText) return reformData;
        return reformData.filter(
            (item: any) => item.item && item.item.toLowerCase().includes(searchText.toLowerCase()),
        );
    }, [reformData, searchText]);

    return (
        <Grid
            container
            gridAutoFlow={"row"}
            gap={"1rem"}
            display={"grid"}
            className="customDataGrid"
            id={`${prokey}-detailedstats`}
            key={`${prokey}-detailedstats`}
            flex={1}
            padding={"0px 24px"}
            sx={{
                maxHeight: "61vh",
                minHeight: "61vh",
            }}
        >
            <Box gap={"1rem"}>
                <Grid container pt={6} pb={3} display="flex" alignItems="center" item>
                    {breadCrumb.map((crumb: string, index: number) => (
                        <React.Fragment key={index}>
                            <Typography variant="text_18_medium">
                                {index === 0
                                    ? crumb
                                    : crumb
                                          .split(" ")
                                          .map(
                                              (word) =>
                                                  word.charAt(0).toUpperCase() +
                                                  word.slice(1).toLowerCase(),
                                          )
                                          .join(" ")}
                            </Typography>
                            {index < breadCrumb.length - 1 && (
                                <Typography variant="text_18_medium" sx={{ margin: "0px 8px" }}>
                                    /{" "}
                                </Typography>
                            )}
                        </React.Fragment>
                    ))}
                </Grid>
                <Grid
                    container
                    gridAutoFlow={"column"}
                    gridTemplateColumns={"0.5fr 0.5fr"}
                    gap={"1rem"}
                    display={"grid"}
                >
                    <Box>
                        {isAllUnits ? (
                            <>
                                <Typography variant="text_14_regular" color={"#969696"}>
                                    {`This information covers ${allUnitsCount} units in the property`}
                                </Typography>
                                <br />
                                <Typography variant="text_14_regular" color={"#969696"}>
                                    (all units across all floorplans)
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Typography variant="text_14_regular" color={"#969696"}>
                                    {`Measurements for the ${
                                        breadCrumb?.length && breadCrumb[0]
                                    } floorplan `}
                                </Typography>
                                <br />
                                <Typography variant="text_14_regular" color={"#969696"}>
                                    {`Your property has ${data.units} units with the ${
                                        breadCrumb?.length && breadCrumb[0]
                                    } floorplan`}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <TextField
                        variant="outlined"
                        placeholder="Search"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ height: "inherit" }}
                        onChange={handleSearchChange}
                    />
                </Grid>
            </Box>
            <Box
                sx={{
                    maxHeight: "60vh",
                    minHeight: "372px",
                }}
                className="customDataGrid"
            >
                <DataGridPro
                    treeData
                    rows={filteredData}
                    columns={columns}
                    autoHeight={false}
                    getRowId={(row: any) => row.id}
                    getTreeDataPath={getTreeDataPath}
                    groupingColDef={groupingColDef}
                    defaultGroupingExpansionDepth={searchText ? -1 : 0}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    getCellClassName={(params: GridCellParams<any, any, any>) => {
                        let classes: any = [];
                        console.log("params", params);

                        if (
                            params.field == "__tree_data_group__" &&
                            params?.rowNode.type == "group"
                        ) {
                            classes.push("groupParent");
                        }
                        if (
                            params.field == "__tree_data_group__" &&
                            params?.rowNode.type == "leaf"
                        ) {
                            classes.push("groupChild");
                        }
                        return classes;
                    }}
                    hideToolbar
                    pagination={true}
                    rowsPerPageOptions={[5, 10, 20, 40]}
                />
            </Box>
        </Grid>
    );
};

export default TableDetailedStat;
