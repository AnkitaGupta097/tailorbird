import React, { useEffect, useState, useMemo } from "react";
import { IRenovation } from "../../../../../../../stores/projects/details/budgeting/base-scope";
import BaseDialog from "../../../../../../../components/base-dialog";
import BaseIconMenu from "../../../../../../../components/base-icon-menu";
import {
    Skeleton,
    MenuItem,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    styled,
    TableRowProps,
    TableContainer,
    Typography,
    CircularProgress,
    Grid,
    TextField,
    Autocomplete,
    Box,
    GridProps,
    InputAdornment,
    OutlinedInput,
    OutlinedInputProps,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EllipseIcon from "../../../../../../../assets/icons/icon-ellipses.svg";
import RenoDetails from "../reno-details";
import { TABLE_SKU_OPTIONS } from "../../../constants";
import FlooringTable from "./flooring-costs";
import { useAppDispatch, useAppSelector } from "../../../../../../../stores/hooks";
import actions from "../../../../../../../stores/actions";
import { cloneDeep, debounce } from "lodash";
// import { useParams } from "react-router-dom";
interface IRenoTable {
    renoItems: IRenovation[];
    // eslint-disable-next-line
    setRenoItem: (v: any) => void;
    // eslint-disable-next-line
    setRenoItems: (v: any) => void;
    page: number;
    itemsPerPage: number;
    isPageView: boolean;
    isHoverDisabled?: boolean;
    scopeType?: any;
}

const RenoTableRow = styled(TableRow)<TableRowProps>(() => ({
    "&:hover": {
        background: "#eee",
    },
    "&.disabled": {
        background: "#DAF3FF",
    },
    border: "1px solid #EEEEEE",
    backgroundColor: "#fff",

    "@keyframes flashing": {
        from: {
            backgroundColor: "#ffecb3",
        },
        to: {
            backgroundColor: "inherit",
        },
    },
}));

const StyledSkuContent = styled(Grid)<GridProps>(() => ({
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
    minWidth: "700px",
    padding: "10px",
}));
const NoContent = styled(Box)`
    color: orangered;
    font-family: "IBM Plex Sans : Semibold : 18";
    align-self: "center";
`;

const StyledTextField = styled(OutlinedInput)<OutlinedInputProps>(({ theme }) => ({
    height: "1.35rem",
    width: "4.5rem",
    paddingLeft: 0,
    display: "flex",
    alignItems: "center",
    input: {
        fontFamily: "IBM Plex Sans Regular",
        fontWeight: "400",
        fontSize: "0.87rem",
        lineHeight: "1.125rem",
    },
    div: {
        marginRight: 0,
        marginLeft: "5px",
        marginTop: "-2.5px",
        p: {
            color: theme.palette.text.primary,
        },
    },
}));

const RenoTable = ({
    renoItems,
    setRenoItem,
    setRenoItems,
    page,
    itemsPerPage,
    isPageView,
    isHoverDisabled = false,
    scopeType,
}: IRenoTable) => {
    const dispatch = useAppDispatch();
    // const { projectId } = useParams();
    const {
        materialOptions,
        materialsLoading,
        materialsForSearch,
        basePackage,
        subGroups,
        projectDetails,
        altPackage,
    } = useAppSelector((state) => ({
        materialOptions: state.budgeting.details.baseScope.materialOptions,
        materialsLoading: state.budgeting.details.baseScope.materialOptions.loading,
        materialsForSearch: state.budgeting.details.baseScope.materialsForSearch,
        basePackage: state.budgeting.details.basePackage.data,
        altPackage: state.budgeting.details.altScope.altPackages.data,
        subGroups: state.budgeting.details.flooringScope.subGroups,
        projectDetails: state.projectDetails.data,
    }));
    const [open, setOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dialogContentTitle, setDialogContentTitle] = useState("");
    const [skuRow, setSkuRow] = useState<any>();
    const [pageItems, setPageItems] = useState<any>();
    const [selectedSku, setSelectedSku] = useState<any>();

    useEffect(() => {
        if (isPageView) {
            setPageItems(renoItems.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage));
        } else {
            setPageItems(renoItems);
        }
        // eslint-disable-next-line
    }, [isPageView, page, renoItems]);

    const packageId = useMemo(() => {
        if (scopeType === "baseScope") {
            return basePackage?.[0]?.id;
        }
        if (scopeType === "altScope") {
            return altPackage?.[0]?.id;
        }
    }, [scopeType, basePackage, altPackage]);

    const onImageClick = (row: any, option: string) => {
        setSkuRow(row);
        if (row.workType === "Material") {
            dispatch(
                actions.budgeting.fetchMaterialOptionsStart({
                    category: row.category,
                    subcategory: row.subcategory,
                    packageId: packageId,
                    version: parseFloat(projectDetails.system_remarks.container_version ?? "1.0")
                        .toFixed(1)
                        .toString(),
                }),
            );
        } else {
            dispatch(
                actions.budgeting.fetchLaborOptionsStart({
                    category: row.category,
                    subcategory: row.subcategory,
                    packageId: packageId,
                    version: parseFloat(projectDetails.system_remarks.container_version ?? "1.0")
                        .toFixed(1)
                        .toString(),
                }),
            );
        }

        setOpen(true);
        setDialogContentTitle(option);
    };

    const onOptionsClick = (option: string, row: any) => {
        setIsMenuOpen(false);
        setSkuRow(row);
        setDialogContentTitle(option);
        if (option.toLowerCase() === "remove sku") {
            dispatch(
                actions.budgeting.updateRenovationItemStart({
                    id: row.id,
                    removeSku: true,
                    scopeType,
                }),
            );
        } else if (option.toLowerCase() !== "remove sku") {
            setOpen(true);
        }
    };

    const onSkuSearch = (e: any) => {
        if (e.target.value.length > 2) {
            dispatch(
                actions.budgeting.fetchMaterialsForSearchStart({
                    category: skuRow.category,
                    subcategory: skuRow.subcategory,
                    description: e.target.value,
                    version: parseFloat(projectDetails.system_remarks.container_version ?? "1.0")
                        .toFixed(1)
                        .toString(),
                }),
            );
        }
    };

    const onSkuSelected = (e: any, newVal: any) => {
        dispatch(
            actions.budgeting.updateRenovationItemStart({
                id: skuRow.id,
                skuId: newVal?.materialId || newVal.laborId,
                workPrice: newVal.unitCost,
                imageUrl: newVal.imageUrl,
                scopeType,
                description: newVal.description,
                location: newVal?.materialId
                    ? skuRow.qualifier || skuRow.location
                    : newVal?.location,
                manufacturer: newVal?.manufacturer,
                modelNo: newVal?.modelNo,
                supplier:
                    newVal?.suppliers &&
                    newVal.suppliers.length &&
                    newVal.suppliers[0].supplier_name,
                itemNo: newVal?.suppliers && newVal.suppliers.length && newVal.suppliers[0].sku_id,
            }),
        );
        setOpen(false);
        setSelectedSku(newVal);
    };

    const onUnitCostChange = (e: any, id: string) => {
        setPageItems((s: any) => {
            const sCopy = cloneDeep(s);
            const sIdx = sCopy.findIndex((item: any) => item.id === id);
            if (sIdx >= 0) sCopy[sIdx].unitCost = e.target.value;
            setRenoItems((rs: any) => {
                const rsCopy = cloneDeep(rs);
                const rsIdx = rsCopy.findIndex((item: any) => item.id === id);
                if (rsIdx >= 0) rsCopy[rsIdx].unitCost = e.target.value;
                return rsCopy;
            });
            return sCopy;
        });
    };

    const updateCosts = (e: any, item: any) => {
        if (parseFloat(item.unitCost) !== item.initialCost) {
            dispatch(
                actions.budgeting.updateRenovationItemStart({
                    id: item.id,
                    description: item.description,
                    skuId: item.workId,
                    scopeType,
                    imageUrl: item.imageUrl,
                    workPrice: parseFloat(item.unitCost) || 0,
                }),
            );
            // if (scopeType == "altScope") {
            //     dispatch(actions.budgeting.fetchAltScopeStart({ projectId }));
            // }
        }
    };

    const menuContent = (row: any) => {
        let menuItems: any = [];
        TABLE_SKU_OPTIONS.map((option) => {
            if (row.workId && option.toLowerCase() !== "add sku") {
                menuItems.push(
                    <MenuItem onClick={() => onOptionsClick(option, row)} key={option}>
                        {option}
                    </MenuItem>,
                );
            }
            if (
                !row.workId &&
                option.toLowerCase() !== "remove sku" &&
                option.toLowerCase() !== "floorplan costs"
            ) {
                menuItems.push(
                    <MenuItem onClick={() => onOptionsClick(option, row)} key={option}>
                        {option}
                    </MenuItem>,
                );
            }
        });
        return menuItems;
    };

    const onRowClicked = (item: any) => {
        if (!isHoverDisabled) {
            setRenoItem(item);
        }
    };

    const imageContent = () => (
        <React.Fragment>
            {materialsLoading ? (
                <CircularProgress />
            ) : materialOptions.data?.length > 0 ? (
                <Grid sx={{ display: "flex", gap: "10px" }}>
                    {materialOptions.data?.map((option, idx) => (
                        <Grid
                            onClick={(e) => onSkuSelected(e, option)}
                            key={`${option.materialId}-${idx}`}
                        >
                            <RenoDetails
                                renoItem={option}
                                hasBorder={true}
                                workId={skuRow.workId}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <NoContent>{"Materials not found for the selected item...!!"}</NoContent>
            )}
        </React.Fragment>
    );
    const skuContent = () => (
        <StyledSkuContent>
            <Typography variant="labelText">Search in Tailorbird database:</Typography>
            <Autocomplete
                options={materialsForSearch.data ?? []}
                renderInput={(params: any) => (
                    <TextField {...params} onChange={debounce(onSkuSearch, 600)} />
                )}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                        <Skeleton
                            variant="rectangular"
                            width={25}
                            height={25}
                            className="Reno-details-image"
                            sx={{ marginRight: "5px" }}
                        />
                        {option?.manufacturer} - {option?.description}
                        <Box sx={{ marginLeft: "auto" }}>(${option.unitCost})</Box>
                    </Box>
                )}
                filterOptions={(options) => options}
                getOptionLabel={(option: any) => (option.name ? option.name : "")}
                onChange={onSkuSelected}
                value={selectedSku?.name ?? ""}
                style={{ width: "100%" }}
            />
        </StyledSkuContent>
    );

    const content =
        dialogContentTitle === "image" ? (
            imageContent()
        ) : dialogContentTitle.toLowerCase().includes("sku") ? (
            skuContent()
        ) : (
            <FlooringTable renoId={skuRow?.id} />
        );
    const header =
        dialogContentTitle === "image" ? (
            <Typography variant="dialogHeader" sx={{ padding: "10px" }}>
                Select a SKU
            </Typography>
        ) : dialogContentTitle.toLowerCase().includes("sku") ? (
            <Typography variant="dialogHeader" sx={{ padding: "10px" }}>
                Add a SKU
            </Typography>
        ) : (
            <Typography variant="dialogHeader">
                {skuRow?.category}: {skuRow?.subcategory}
            </Typography>
        );

    const renderHeaders = () => {
        return (
            <TableHead>
                <TableRow>
                    <TableCell sx={{ backgroundColor: "#F6F7F8" }}>
                        <Typography variant="tableData">Image</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#F6F7F8" }}>
                        <Typography variant="tableData">Subcategory</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#F6F7F8" }}>
                        <Typography variant="tableData">Description</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#F6F7F8" }}>
                        <Typography variant="tableData">Worktype</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#F6F7F8" }}>
                        <Typography variant="tableData">UOM</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#F6F7F8" }}>
                        <Typography variant="tableData">Price Per Unit</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#F6F7F8" }}></TableCell>
                </TableRow>
            </TableHead>
        );
    };

    const getSubgroup = (groupId: any) => {
        let groupName = subGroups.data.filter((item: any) => item.id == groupId);
        return groupName?.length > 0 ? groupName[0].name : "";
    };

    const renderBody = () => {
        return pageItems ? (
            <TableBody>
                {pageItems?.map((item: any) => (
                    <RenoTableRow
                        sx={{
                            animation: item.updated ? "flashing 1.5s ease-in infinite" : "none",
                        }}
                        key={`${item.category}-${item.id}`}
                        className={`${!item.workId ? "disabled" : ""}`}
                        onMouseOver={() => onRowClicked(item)}
                    >
                        <TableCell
                            onClick={() => onImageClick(item, "image")}
                            sx={{
                                borderLeft: `${item.hasSkus ? "4px solid #004D71" : ""}`,
                                paddingLeft: `${item.hasSkus ? "12px" : "16px"}`,
                                cursor: "pointer",
                            }}
                        >
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    width={30}
                                    height={30}
                                    style={{
                                        border: "0.5px solid #DEDEDE",
                                        padding: "2px",
                                        borderRadius: "5px",
                                    }}
                                    className="Reno-table-reno-details-image"
                                    alt={`${item.subcategory} product`}
                                />
                            ) : (
                                <HelpOutlineIcon
                                    width={30}
                                    className="Reno-table-reno-details-image"
                                    height={30}
                                    style={{
                                        border: "0.5px solid #DEDEDE",
                                        color: "#757575",
                                        padding: "4px",
                                        borderRadius: "5px",
                                        backgroundColor: "#fff",
                                    }}
                                />
                            )}
                        </TableCell>
                        {getSubgroup(item.subGroupId) != "" ? (
                            <TableCell>
                                <Grid
                                    sx={{
                                        display: "grid",
                                        gridAutoFlow: "column",
                                        columnGap: "5px",
                                    }}
                                >
                                    <Typography variant="tableData">{item.subcategory}</Typography>
                                    <Typography variant="tableData">
                                        ({getSubgroup(item.subGroupId)})
                                    </Typography>
                                </Grid>
                            </TableCell>
                        ) : (
                            <TableCell>
                                <Typography variant="tableData">{item.subcategory}</Typography>
                            </TableCell>
                        )}
                        <TableCell>
                            <Typography variant="summaryText">{item.description}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="tableData">{item.workType}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="tableData">{item.uom}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="tableData">
                                {item.workId ? (
                                    <StyledTextField
                                        value={item.unitCost ?? ""}
                                        onChange={(e) => onUnitCostChange(e, item.id)}
                                        onBlur={(e) => updateCosts(e, item)}
                                        startAdornment={
                                            <InputAdornment position="start">$</InputAdornment>
                                        }
                                    />
                                ) : (
                                    "-"
                                )}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <BaseIconMenu
                                content={menuContent(item)}
                                icon={EllipseIcon}
                                parentClassName={`Reno-Table-card`}
                                isMenuOpen={isMenuOpen}
                                setIsMenuOpen={setIsMenuOpen}
                                sx={{
                                    button: {
                                        background: "transparent !important",
                                        filter: "invert(1)",
                                    },
                                }}
                            />
                        </TableCell>
                    </RenoTableRow>
                ))}
            </TableBody>
        ) : null;
    };

    const minWidth =
        dialogContentTitle === "image"
            ? "18.75rem"
            : dialogContentTitle.toLowerCase().includes("sku")
            ? "10rem"
            : "30rem";
    const minHeight =
        dialogContentTitle === "image"
            ? "10rem"
            : dialogContentTitle.toLowerCase().includes("sku")
            ? "10rem"
            : "33rem";

    return (
        <TableContainer
            sx={{
                border: "0.065rem solid #eee",
                boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                borderRadius: "5px",
            }}
        >
            <Table stickyHeader>
                {renderHeaders()}
                {renderBody()}
            </Table>
            <BaseDialog
                button={""}
                content={content}
                actions={undefined}
                header={header}
                open={open}
                setOpen={setOpen}
                sx={{
                    ".MuiPaper-root": { minWidth, minHeight },
                }}
            />
        </TableContainer>
    );
};

export default React.memo(RenoTable);
