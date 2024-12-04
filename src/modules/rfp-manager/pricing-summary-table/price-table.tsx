// import { Divider, Grid } from "@mui/material";
// import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
// import BaseTabs from "components/base-tabs";
// import BaseDataGrid from "components/data-grid";
import React from "react";
// import { useSearchParams } from "react-router-dom";
// import { checkIfItemIsModifiedForCategory } from "../helper";
// import AddPrice from "./add-price";
// import { commonColumns, wtdAvgColumn, aggregateColumn } from "./columns";

// const PriceTable = () => {
//     const [currentTab, setCurrentTab] = React.useState<string>(getTab());
//     const [searchParams, setSearchParams] = useSearchParams();
//     const onTabChanged = (event: React.ChangeEvent<{}>, newValue: string) => {
//         setCurrentTab(newValue);
//     };
//     const tabs = [
//         {
//             label: "Wtd Average",
//             value: "wtd_avg",
//         },
//         {
//             label: "Aggregate",
//             value: "aggregate",
//         },
//     ];
//     const getTab = () => {
//         let tab = searchParams.get("tab");
//         let isValid = tabs.find((t) => t.value === tab);
//         if (isValid) return isValid.value;
//         else return tabs[0].value;
//     };

//     const categoryColumns: Array<GridColDef> = React.useMemo(
//         () =>
//             categories?.map((category: any) => {
//                 return {
//                     field: category,
//                     width: 200,
//                     headerName: category,
//                     renderCell(params: GridRenderCellParams) {
//                         let catIndex = params.row?.categories?.findIndex(
//                             (list: any) => list.category === category,
//                         );
//                         let isModified = checkIfItemIsModifiedForCategory(
//                             catIndex,
//                             params.row?.categories,
//                         );

//                         return (
//                             <>
//                                 {(catIndex !== -1 && params.row?.categories[catIndex]?.category) ===
//                                     category &&
//                                 params.row?.categories[catIndex]?.items?.length > 0 ? (
//                                     AddPrice(
//                                         params,
//                                         navigate,
//                                         role!,
//                                         userID!,
//                                         groupedBidItems,
//                                         projectID!,
//                                         selectedVersion!,
//                                         bidResponseItem!,
//                                         bidRequest!,
//                                         isModified!,
//                                         organization_id!,
//                                         // Url contains org_id and version when tb admin accesses the contractor bidbook
//                                         org_id ? true : false!,
//                                         selectedVersion !== "Latest"
//                                             ? selectedVersion?.split(" ")?.[1]
//                                             : selectedVersion!,
//                                         searchParams.get("tab")!,
//                                     )
//                                 ) : (
//                                     <NotInScope />
//                                 )}
//                             </>
//                         );
//                     },
//                 };
//             }),
//         //eslint-disable-next-line
//         [categories, groupedBidItems, searchParams],
//     );

//     return (
//         <Grid container>
//             <Grid item>
//                 <BaseTabs
//                     currentTab={currentTab}
//                     onTabChanged={onTabChanged}
//                     //@ts-ignore
//                     tabList={tabs}
//                     tabColor="#000000"
//                     otherStyles={{
//                         ".MuiTab-root.MuiButtonBase-root": {
//                             padding: 0,
//                             margin: 0,
//                         },
//                         ".MuiTabs-flexContainer": {
//                             gap: 4,
//                         },
//                     }}
//                 />
//                 <Divider sx={{ margin: 0, padding: 0 }}></Divider>
//             </Grid>
//             <Grid item xs>
//                 {
//                     <BaseDataGrid
//                         columns={[
//                             ...commonColumns,
//                             ...(currentTab === tabs[0].value
//                                 ? wtdAvgColumn(renoUnits, considerAlternates)
//                                 : aggregateColumn(considerAlternates)),
//                             ...(categoryColumns?.length > 0 ? categoryColumns : []),
//                         ]}
//                         rows={rows ?? []}
//                         rowsPerPageOptions={[]}
//                         hideFooter={true}
//                         getRowId={(row: any) =>
//                             `${row?.fp_name}-${row?.inventory_name}-${row?.sub_group_name}`
//                         }
//                         sx={{
//                             "&.MuiDataGrid-root .MuiDataGrid-cell": {
//                                 padding: "0px",
//                             },
//                             "& .modified-common.negative": {
//                                 backgroundColor: "#F0F0F0",
//                             },
//                             "& .modified-common.positive": {
//                                 backgroundColor: "#FFF5EA",
//                             },
//                         }}
//                     />
//                 }
//             </Grid>
//         </Grid>
//     );
// };

// export default PriceTable;
