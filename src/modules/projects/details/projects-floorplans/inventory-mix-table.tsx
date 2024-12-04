import React, { useEffect, useState } from "react";
import {
    TextField,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Grid,
    // CircularProgress as Loader,
    styled,
    TableCellProps,
    Typography,
    TextFieldProps,
    TableRowProps,
} from "@mui/material";
import { cloneDeep, find, map, sum } from "lodash";
import { PROJECT_TYPE } from "../../constant";
import MinusIcon from "../../../../assets/icons/icon-minus.svg";
import ExclamationIcon from "../../../../assets/icons/icon-exclamation.svg";
import CorrectIcon from "../../../../assets/icons/icon-correct.svg";
import AddIcon from "../../../../assets/icons/icon-add.svg";
import { useAppSelector } from "../../../../stores/hooks";
import BaseIconButton from "../../../../components/base-icon-button";

interface IInventoryMixTable {
    inventoryMix: any;
    setInventoryMix: any;
    setHasInvMixError?: any;
    setInvNameError?: any;
}

const ActiveCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.primary.main,
    color: theme.palette.text.secondary,
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

const RegularCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.secondary.main,
    color: theme.palette.text.primary,
    ".Variation-takeoff-issue,.Variation-takeoff-correct": {
        display: "flex",
        marginLeft: "5px",
    },
    ".Variation-table-error-count": {
        display: "flex",
        marginLeft: "5px",
    },
}));

const ActiveDataCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main,
}));

const StyledTextField = styled(TextField)<TextFieldProps>(() => ({
    input: {
        fontFamily: "IBM Plex Sans Regular",
        fontWeight: "400",
        fontSize: "0.87rem",
        lineHeight: "1.125rem",
    },
    div: {
        height: "1.35rem",
    },
}));

const InventoryMixTable = ({
    inventoryMix,
    setInventoryMix,
    setHasInvMixError,
    setInvNameError,
}: IInventoryMixTable) => {
    const { floorplans, projectDetails } = useAppSelector((state: any) => ({
        floorplans: state.projectFloorplans.floorplans,
        projectDetails: state.projectDetails.data,
    }));

    const [inventoryMixCopy, setInventoryMixCopy] = useState(inventoryMix);

    useEffect(() => {
        setInventoryMixCopy(inventoryMix);
        // eslint-disable-next-line
    }, [inventoryMix]);

    const decreaseCount = () => {
        if (inventoryMix.count > 1) {
            setInventoryMix((state: any) => {
                const stateCopy = cloneDeep(state);
                stateCopy.inventoryList.pop();
                stateCopy.count -= 1;
                return stateCopy;
            });
        }
    };

    // TODO: reset variation details to the original state
    // const resetInventoryMixs = () => {
    //     setInventoryMix(inventoryMixCopy);
    // };

    const increaseCount = () => {
        setInventoryMix((state: any) => {
            const stateCopy = cloneDeep(state);
            stateCopy.inventoryList.push({
                inventoryName: "",
                floorplanCounts: floorplans.data?.map((plan: any) => {
                    return {
                        floorplanId: plan.id,
                        count: 0,
                    };
                }),
            });
            stateCopy.count += 1;
            return stateCopy;
        });
    };

    const onPlanCountChange = (e: any, listIdx: number, countIdx: number) => {
        setInventoryMix((state: any) => {
            const value = parseInt(e.target.value, 10);
            const stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy.inventoryList[listIdx].floorplanCounts[countIdx][`count`] = isNaN(value)
                ? ""
                : value;
            return stateCopy;
        });
    };
    const onPlanCountBlur = (e: any, listIdx: number, countIdx: number) => {
        setInventoryMix((state: any) => {
            const value = parseInt(e.target.value, 10);
            const stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy.inventoryList[listIdx].floorplanCounts[countIdx][`count`] = isNaN(value)
                ? 0
                : value;
            return stateCopy;
        });
        let invItemId = inventoryMix.inventoryList[listIdx].floorplanCounts[countIdx].floorplanId;
        let totalRenoUnits = 0;
        inventoryMix.inventoryList?.forEach((element: any) => {
            totalRenoUnits += element.floorplanCounts[countIdx][`count`];
        });
        if (floorplans.data.find((ite: any) => ite.id == invItemId).renoUnits !== totalRenoUnits) {
            setHasInvMixError(true);
        } else {
            setHasInvMixError(false);
        }
    };

    useEffect(() => {
        const isNameEmpty = find(inventoryMixCopy.inventoryList, { inventoryName: "" });
        setInvNameError(isNameEmpty ? true : false);
        const isinventoryUpdate = map(floorplans.data, (row) => {
            const fpCount = map(inventoryMixCopy.inventoryList, (list: any) => {
                const floorplan = find(list.floorplanCounts, { floorplanId: row.id });
                return floorplan.count;
            });
            const diff = parseInt(row.renoUnits, 10) - sum(fpCount);
            return { update: diff == 0 ? false : true };
        });
        setHasInvMixError(find(isinventoryUpdate, { update: true }) ? true : false);
        // eslint-disable-next-line
    }, [inventoryMixCopy]);

    const onNameChange = (e: any, listIdx: number) => {
        setInventoryMix((state: any) => {
            const stateCopy = cloneDeep(state);
            stateCopy["inventoryList"][listIdx]["inventoryName"] = e.target.value;
            return stateCopy;
        });
        if (e.target.value == "") {
            setInvNameError(true);
        } else {
            setInvNameError(false);
        }
    };

    const renderVariationHeaders = () => {
        const headers = [];
        for (let i = 0; i < inventoryMixCopy.count; i++) {
            headers.push(
                <RegularCell
                    className={`Variation-table-regular Variation-${i + 1}`}
                    key={`regular-header-${i}`}
                >
                    <Typography variant="tableHeaderText">
                        <div>Inventory {i + 1}</div>
                    </Typography>
                    <StyledTextField
                        label=""
                        onChange={(e) => onNameChange(e, i)}
                        value={inventoryMixCopy?.["inventoryList"]?.[i]?.["inventoryName"] || ""}
                        className="Variation-table-input Variation-header-input"
                        sx={{ width: "8rem" }}
                        color={
                            inventoryMixCopy?.["inventoryList"]?.[i]?.["inventoryName"]
                                ? "primary"
                                : "error"
                        }
                        error={
                            inventoryMixCopy?.["inventoryList"]?.[i]?.["inventoryName"].trim() == ""
                        }
                    />
                </RegularCell>,
            );
        }
        return headers;
    };

    const renderVariationData = (plan: any) => {
        let variations = [];
        let total = 0;
        for (let i = 0; i < inventoryMixCopy.count; i++) {
            const dataIdx = inventoryMixCopy?.["inventoryList"]?.[i]?.[
                "floorplanCounts"
            ]?.findIndex((p: any) => p.floorplanId === plan.id);
            const locationValue =
                inventoryMixCopy?.["inventoryList"]?.[i]?.["floorplanCounts"]?.[dataIdx]?.[`count`];
            variations.push(
                <TableCell key={`${plan.fpName}-${i}`}>
                    <StyledTextField
                        onChange={(e) => onPlanCountChange(e, i, dataIdx)}
                        onBlurCapture={(e) => onPlanCountBlur(e, i, dataIdx)}
                        value={
                            locationValue === undefined || locationValue === null
                                ? "0"
                                : locationValue.toString()
                        }
                        className="Variation-table-input"
                        name={`${plan.fpName}-${i}-${dataIdx}`}
                        sx={{ width: "3.5rem" }}
                    />
                </TableCell>,
            );
            total +=
                parseInt(
                    inventoryMixCopy?.["inventoryList"]?.[i]?.["floorplanCounts"]?.[dataIdx]?.[
                        `count`
                    ],
                    10,
                ) || 0;
        }
        return { variations, total };
    };

    const renderRows = (plans: any) => {
        let rows: any = [];
        plans.map((plan: any, idx: number) => {
            const { variations, total } = renderVariationData(plan);
            const countDiff = plan.renoUnits - total;

            return rows.push(
                <StyledTableRow
                    key={`${plan.name}-${idx}`}
                    sx={{
                        animation: countDiff !== 0 ? "flashing 1.5s ease-in infinite" : "none",
                    }}
                >
                    <ActiveDataCell className="Variation-table-regular-border">
                        <Typography variant="tableHeaderText">{plan.type}</Typography>
                    </ActiveDataCell>
                    <ActiveDataCell className="Variation-table-regular-border">
                        <Typography variant="tableHeaderText">{plan.name}</Typography>
                    </ActiveDataCell>
                    {projectDetails.projectType !== PROJECT_TYPE[2].value && (
                        <RegularCell className="Variation-table-regular" align="center">
                            {idx === Math.ceil(plans.length / 2) - 1 ? (
                                <span className="Variation-item-delete-group">
                                    <span onClick={decreaseCount} role="presentation">
                                        <BaseIconButton
                                            icon={MinusIcon}
                                            classes={`Variation-item-icon-button ${
                                                inventoryMixCopy.count <= 1 ? "disabled" : ""
                                            }`}
                                        />
                                    </span>
                                </span>
                            ) : null}
                        </RegularCell>
                    )}
                    {variations}
                    {projectDetails.projectType !== PROJECT_TYPE[2].value && (
                        <RegularCell className="Variation-table-regular" align="center">
                            {idx === Math.ceil(plans.length / 2) - 1 ? (
                                <span onClick={increaseCount} role="presentation">
                                    <BaseIconButton
                                        icon={AddIcon}
                                        classes="Variation-item-icon-button"
                                    />
                                </span>
                            ) : null}
                        </RegularCell>
                    )}
                    <RegularCell sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="tableData">{`${plan.renoUnits}`} </Typography>
                        {countDiff !== 0 ? (
                            <React.Fragment>
                                <Typography
                                    variant="tableData"
                                    className={`${
                                        countDiff === 0
                                            ? "Variation-table-total-count"
                                            : "Variation-table-error-count"
                                    }`}
                                    sx={{ color: "#BD0000" }}
                                >
                                    {`(${countDiff > 0 ? "+" : ""}${countDiff})`}
                                </Typography>
                                <span className="Variation-takeoff-issue">
                                    <img src={ExclamationIcon} alt="takeoff problems" />
                                </span>
                            </React.Fragment>
                        ) : (
                            <span className="Variation-takeoff-correct">
                                <img src={CorrectIcon} alt="takeoff accepted" />
                            </span>
                        )}
                    </RegularCell>
                </StyledTableRow>,
            );
        });
        return rows;
    };
    return (
        <Grid>
            <Table
                className="Variation-table"
                padding="normal"
                size="small"
                sx={{ borderCollapse: "separate", borderSpacing: "0.25rem 0" }}
            >
                <TableHead>
                    <TableRow>
                        <ActiveCell className="Variation-table-header-highlight">
                            <Typography variant="tableHeaderText">Floorplan Type</Typography>
                        </ActiveCell>
                        <ActiveCell className="Variation-table-header-highlight">
                            <Typography variant="tableHeaderText">Floorplan Name</Typography>
                        </ActiveCell>
                        {projectDetails.projectType !== PROJECT_TYPE[2].value && (
                            <RegularCell className="Variation-table-regular"></RegularCell>
                        )}
                        {renderVariationHeaders()}
                        {projectDetails.projectType !== PROJECT_TYPE[2].value && (
                            <RegularCell className="Variation-table-regular"></RegularCell>
                        )}
                        <ActiveCell className="Variation-table-header-highlight">
                            <Typography variant="tableHeaderText">Reno Units</Typography>
                        </ActiveCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {floorplans.data.length ? (
                        <React.Fragment>{renderRows(floorplans.data)}</React.Fragment>
                    ) : null}
                </TableBody>
            </Table>
        </Grid>
    );
};

export default React.memo(InventoryMixTable);
