import React, { FC, ReactNode } from "react";
import LockIcon from "@mui/icons-material/Lock";
import { Button, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import {
    GridColumnGroupHeaderParams,
    GridColumnGroupingModel,
    GridRenderCellParams,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
} from "@mui/x-data-grid-pro";
import { Add } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BaseAutoComplete from "components/base-auto-complete";

interface HeaderWithIconProps extends GridColumnGroupHeaderParams {
    icon: ReactNode;
}

interface IWorkTypeDropDown {
    params: GridRenderCellParams;
    workTypeOptions: string[];
    handleCellEditCommit: Function;
    readOnly?: boolean;
}

interface IBidbookToolbar {
    defaultProps: any;
    viewMode: boolean;
    handleCustomButtonClick: Function;
    containerVersion?: any;
}

interface IColumnHeaderGrouping {
    item: any;
    invDetails: {
        name: any;
        numOfQty: any;
    }[];
    isCommonAreaProject: boolean;
}

export const HeaderWithIconRoot = styled("div")(({ theme }) => ({
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    "& span": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginRight: theme.spacing(0.5),
    },
}));
export function HeaderWithIcon(props: HeaderWithIconProps) {
    const { icon, ...params } = props;

    return (
        <HeaderWithIconRoot>
            <span>{params.headerName ?? params.groupId}</span> {icon}
        </HeaderWithIconRoot>
    );
}

export const CustomToolbar = ({ onClickCustomButton, viewMode, containerVersion }: any) => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
            {!viewMode && containerVersion == "2.0" && (
                <Button variant="text" startIcon={<Add />} onClick={onClickCustomButton}>
                    Add Row
                </Button>
            )}
        </GridToolbarContainer>
    );
};

export const columnGroupingModel: GridColumnGroupingModel = [
    {
        groupId: "Each",
        headerName: "Each (Per Each UOM Quantity)",
        freeReordering: true,
        children: [{ field: "eachQuantity" }, { field: "eachPrice" }],
        renderHeaderGroup: (params) => (
            <HeaderWithIcon {...params} icon={<LockIcon fontSize="small" />} />
        ),
    },
    {
        groupId: "Aggregate",
        headerName: "Total Aggregate for all reno units",
        freeReordering: true,
        children: [{ field: "aggregateQuantity" }, { field: "aggregatePrice" }],
        renderHeaderGroup: (params) => (
            <HeaderWithIcon {...params} icon={<LockIcon fontSize="small" />} />
        ),
    },
    {
        groupId: "WAVG",
        headerName: "WAVG FP WAVG Sqft",
        freeReordering: true,
        children: [{ field: "wavgQuantity" }, { field: "wavgPrice" }],
        renderHeaderGroup: (params) => (
            <HeaderWithIcon {...params} icon={<LockIcon fontSize="small" />} />
        ),
    },
];

export const ColumnHeaderGrouping: FC<IColumnHeaderGrouping> = ({
    item,
    invDetails,
    isCommonAreaProject,
}) => (
    <Grid container className="parent">
        <Typography className="div1">
            {`${item.commercial_name} : ${invDetails.map(
                (inv) => `${inv.name} (${inv.numOfQty})`,
            )}`}
        </Typography>
        <Typography className="div2">{`Area: ${item.area} ${item.areaUom}`}</Typography>
        <Typography className="div3">{`Reno Units: ${item.renoUnits}`}</Typography>
        {!isCommonAreaProject && <Typography className="div4">{item.unit_type}</Typography>}
    </Grid>
);

export const BidbookToolbar: FC<IBidbookToolbar> = ({
    viewMode,
    handleCustomButtonClick,
    containerVersion,
}) => (
    <Grid
        container
        gap={5}
        direction="row-reverse"
        alignItems="center"
        sx={{ background: "#EEEEEE" }}
    >
        <Grid item sx={{ height: "2.5rem", paddingBottom: "1rem" }}>
            <CustomToolbar
                onClickCustomButton={handleCustomButtonClick}
                viewMode={viewMode}
                containerVersion={containerVersion}
            />
        </Grid>
    </Grid>
);

export const WorkTypeDropDown: FC<IWorkTypeDropDown> = ({
    params,
    workTypeOptions,
    handleCellEditCommit,
    readOnly,
}) => (
    <BaseAutoComplete
        variant="outlined"
        options={workTypeOptions}
        placeholder="Work Type"
        label=""
        onChangeHandler={(value: any) => {
            handleCellEditCommit({
                id: params.row.id,
                field: params.field,
                value: value,
            });
        }}
        value={params.row.workType}
        popupIcon={<ArrowDropDownIcon />}
        autocompleteSx={{
            ".MuiOutlinedInput-notchedOutline": {
                border: "none",
            },
        }}
        blurOnSelect
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        readOnlyTextField={readOnly}
    />
);
