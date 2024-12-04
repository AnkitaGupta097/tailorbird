import React, { useEffect } from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableCellProps,
    styled,
    CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../../../stores/hooks";
import actions from "../../../../../../../stores/actions";

const HeaderCellActive = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.primary.main,
    color: theme.palette.text.secondary,
}));

const HeaderCellInactive = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.secondary.main,
    color: theme.palette.text.primary,
}));

const BodyCellActive = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main,
}));

const FlooringTable = ({ renoId }: { renoId: string | undefined }) => {
    const dispatch = useAppDispatch();

    const { floorplanCosts, loading } = useAppSelector((state) => ({
        floorplanCosts: state.budgeting.details.baseScope.floorplanCosts,
        loading: state.budgeting.details.baseScope.floorplanCosts.loading,
    }));

    useEffect(() => {
        dispatch(actions.budgeting.fetchFloorplanCostsStart({ renovationId: renoId }));
        // eslint-disable-next-line
    }, [renoId]);

    return loading ? (
        <CircularProgress />
    ) : (
        <Table sx={{ borderCollapse: "separate", borderSpacing: "0.25rem 0" }}>
            <TableHead>
                <TableRow>
                    <HeaderCellActive>Floorplan Type</HeaderCellActive>
                    <HeaderCellActive>Floorplan Name</HeaderCellActive>
                    <HeaderCellInactive>UOM</HeaderCellInactive>
                    <HeaderCellInactive>Quantity</HeaderCellInactive>
                    <HeaderCellActive>Total</HeaderCellActive>
                </TableRow>
            </TableHead>
            <TableBody>
                {floorplanCosts.data?.map((floorplan: any, idx: number) => (
                    <TableRow key={`${floorplan.name}-${idx}`}>
                        <BodyCellActive>{floorplan.type}</BodyCellActive>
                        <BodyCellActive>{floorplan.name}</BodyCellActive>
                        <TableCell>{floorplan.uom}</TableCell>
                        <TableCell>{floorplan.quantity?.toFixed(2)}</TableCell>
                        <TableCell>{floorplan.price?.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default React.memo(FlooringTable);
