import React, { useEffect, useState } from "react";
import {
    TextField,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Grid,
    CircularProgress as Loader,
    styled,
    TableCellProps,
    Typography,
    TextFieldProps,
} from "@mui/material";
import { useAppSelector } from "../../../../../stores/hooks";
import BaseIconButton from "../../../../../components/base-icon-button";
import MinusIcon from "../../../../../assets/icons/icon-minus.svg";
// import ResetIcon from "../../../../../assets/icons/icon-reset.svg";
import { cloneDeep } from "lodash";
import ExclamationIcon from "../../../../../assets/icons/icon-exclamation.svg";
import CorrectIcon from "../../../../../assets/icons/icon-correct.svg";
import AddIcon from "../../../../../assets/icons/icon-add.svg";

interface IVariationTable {
    variationDetail: any;
    setVariationDetail: any;
    loading: boolean;
}
interface ILocation {
    name: any;
    takeOff: any;
}
const defaultVariationDetail = {
    item: "",
    category: "",
    count: null,
    floorplans: [],
};

const ActiveCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.primary.main,
    color: theme.palette.text.secondary,
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
    "@keyframes flashing": {
        from: {
            backgroundColor: "#ffecb3",
        },
        to: {
            backgroundColor: "inherit",
        },
    },
}));

const VariationTable = ({ variationDetail, setVariationDetail, loading }: IVariationTable) => {
    const { floorplans } = useAppSelector((state) => ({
        floorplans: state.budgeting.details.variations.baseFloorplans,
    }));

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const locations: ILocation[] = [];
        for (let i = 0; i < variationDetail.count; i++) {
            locations.push({ name: "", takeOff: 0 });
        }
        let floorplanMap: any = [];
        if (floorplans.data?.length) {
            floorplans.data?.map((floor) => {
                floorplanMap.push({ ...floor, locations: [...locations] });
            });
        }
        setVariationDetail({ ...variationDetail, floorplans: floorplanMap });
        setIsLoading(loading);
        // eslint-disable-next-line
    }, [floorplans?.data, loading]);

    const decreaseCount = () => {
        if (variationDetail.count > 2) {
            setVariationDetail((state: any) => {
                const stateCopy = cloneDeep(state);
                stateCopy.floorplans.map((floor: any) => {
                    floor.locations.pop();
                });
                stateCopy.count -= 1;
                return stateCopy;
            });
        }
    };

    useEffect(() => {
        return () => {
            setVariationDetail(defaultVariationDetail);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const increaseCount = () => {
        setVariationDetail((state: any) => {
            const stateCopy = cloneDeep(state);
            stateCopy.floorplans.map((floor: any) => {
                floor.locations.push({ name: "", takeOff: 0 });
            });
            stateCopy.count += 1;
            return stateCopy;
        });
    };

    const onTakeoffChange = (e: any, id: number, type: string, dataIdx: number) => {
        const value = e.target.value;
        if (value >= 0) {
            setVariationDetail((state: any) => {
                const stateCopy = JSON.parse(JSON.stringify(state));
                stateCopy["floorplans"][dataIdx]["locations"][id][type] = value;
                return stateCopy;
            });
        }
    };

    const onTakeoffBlur = (e: any, id: number, type: string, dataIdx: number) => {
        const value = e.target.value == "" ? 0 : parseFloat(e.target.value);
        setVariationDetail((state: any) => {
            const stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy["floorplans"][dataIdx]["locations"][id][type] = isNaN(value)
                ? 0
                : Number(value.toFixed(2));
            stateCopy["floorplans"][dataIdx]["fpCurrentQty"] = Number(
                stateCopy["floorplans"][dataIdx]["locations"]
                    .map((item: any) => item.takeOff)
                    .reduce((prev: any, next: any) => Number(prev) + Number(next))
                    .toFixed(2),
            );

            stateCopy["floorplans"][dataIdx]["hasError"] =
                Math.abs(
                    Number(
                        stateCopy["floorplans"][dataIdx]["fpTotalQty"]?.toFixed(2) -
                            stateCopy["floorplans"][dataIdx]["fpCurrentQty"]?.toFixed(2),
                    ),
                ) !== 0;
            return stateCopy;
        });
    };

    const onNameChange = (e: any, i: number) => {
        setVariationDetail((state: any) => {
            const stateCopy = cloneDeep(state);
            stateCopy["floorplans"].map((floor: any) => {
                floor["locations"][i]["name"] = e.target.value;
            });
            return stateCopy;
        });
    };
    console.log("variations data", variationDetail);
    const renderVariationHeaders = () => {
        const headers = [];
        for (let i = 0; i < variationDetail.count; i++) {
            headers.push(
                <RegularCell
                    className={`Variation-table-regular Variation-${i + 1}`}
                    key={`regular-header-${i}`}
                >
                    <Typography variant="tableHeaderText">
                        <div>Location {i + 1}</div>
                    </Typography>
                    <StyledTextField
                        label=""
                        onChange={(e) => onNameChange(e, i)}
                        value={
                            variationDetail?.["floorplans"]?.[0]?.["locations"]?.[i]?.["name"] || ""
                        }
                        className="Variation-table-input Variation-header-input"
                        sx={{ width: "8rem" }}
                        color={
                            variationDetail?.["floorplans"]?.[0]?.["locations"]?.[i]?.["name"]
                                ? "primary"
                                : "error"
                        }
                        error={
                            variationDetail?.["floorplans"]?.[0]?.["locations"]?.[i]?.[
                                "name"
                            ].trim() == ""
                        }
                    />
                </RegularCell>,
            );
        }
        return headers;
    };
    const renderVariationData = (plan: any) => {
        const dataIdx = variationDetail?.["floorplans"]?.findIndex(
            (p: any) => p.fpId === plan.fpId,
        );
        const variations = Array.from({ length: variationDetail.count }, (_, i) => {
            const countDiff = Number(
                Math.abs(
                    (variationDetail?.["floorplans"]?.[dataIdx]?.fpTotalQty || 0) -
                        (variationDetail?.["floorplans"]?.[dataIdx]?.fpCurrentQty || 0),
                ).toFixed(2),
            );
            return (
                <TableCell key={`${plan.fpName}-${i}`}>
                    <StyledTextField
                        onChange={(e) => onTakeoffChange(e, i, "takeOff", dataIdx)}
                        onBlur={(e) => onTakeoffBlur(e, i, "takeOff", dataIdx)}
                        value={
                            variationDetail?.["floorplans"]?.[dataIdx]?.["locations"]?.[i]?.[
                                "takeOff"
                            ]
                        }
                        className="Variation-table-input"
                        name={`${plan.fpName}-${i}-${dataIdx}`}
                        sx={{
                            animation: countDiff !== 0 ? "flashing 1.5s ease-in infinite" : "none",
                            width: "3.5rem",
                        }}
                    />
                </TableCell>
            );
        });
        return { variations };
    };

    const renderRows = (plans: any) => {
        let rows: any = [];
        plans.map((plan: any, idx: number) => {
            let { variations } = renderVariationData(plan);
            const countDiff = Number((plan.fpTotalQty - (plan.fpCurrentQty || 0)).toFixed(2));

            return rows.push(
                <TableRow key={`${plan.name}-${idx}`}>
                    <ActiveDataCell className="Variation-table-regular-border">
                        <Typography variant="tableHeaderText">{plan.fpType}</Typography>
                    </ActiveDataCell>
                    <ActiveDataCell className="Variation-table-regular-border">
                        <Typography variant="tableHeaderText">{plan.fpName}</Typography>
                    </ActiveDataCell>
                    <RegularCell className="Variation-table-regular" align="center">
                        {idx === Math.ceil(plans.length / 2) - 1 ? (
                            <span className="Variation-item-delete-group">
                                <span onClick={decreaseCount} role="presentation">
                                    <BaseIconButton
                                        icon={MinusIcon}
                                        classes={`Variation-item-icon-button ${
                                            variationDetail.count <= 2 ? "disabled" : ""
                                        }`}
                                    />
                                </span>
                                {/* TODO: Add undo button.
                                     {origVariation.count !== variationDetail.count ? (
                                    <span
                                        onClick={resetVariationDetails}
                                        className="Variation-item-reset-icon"
                                        role="presentation"
                                    >
                                        <BaseIconButton
                                            icon={ResetIcon}
                                            classes="Variation-item-reset-icon-button"
                                        />
                                    </span>
                                ) : null} */}
                            </span>
                        ) : null}
                    </RegularCell>
                    {variations}
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
                    <RegularCell
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            animation: countDiff !== 0 ? "flashing 1.5s ease-in infinite" : "none",
                            color: countDiff !== 0 ? "#BD0000" : "inherit",
                        }}
                    >
                        <Typography variant="tableData">
                            {`${plan.fpTotalQty.toFixed(2)}`}{" "}
                        </Typography>
                        {countDiff !== 0 ? (
                            <React.Fragment>
                                <Typography
                                    variant="tableData"
                                    className={`${
                                        countDiff === 0
                                            ? "Variation-table-total-count"
                                            : "Variation-table-error-count"
                                    }`}
                                >
                                    {`(${countDiff > 0 ? "+" : ""}${Number(countDiff).toFixed(2)})`}
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
                </TableRow>,
            );
        });
        return rows;
    };

    const plans = variationDetail?.floorplans ? variationDetail?.floorplans : floorplans;
    return isLoading ? (
        <Grid className="Variation-table-loader" sx={{ display: "flex" }}>
            <Loader />
        </Grid>
    ) : (
        <React.Fragment>
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
                        <RegularCell className="Variation-table-regular"></RegularCell>
                        {renderVariationHeaders()}
                        <RegularCell className="Variation-table-regular"></RegularCell>
                        <ActiveCell className="Variation-table-header-highlight">
                            <Typography variant="tableHeaderText">Total Quantity</Typography>
                        </ActiveCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {plans.length ? <React.Fragment>{renderRows(plans)}</React.Fragment> : null}
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

export default React.memo(VariationTable);
