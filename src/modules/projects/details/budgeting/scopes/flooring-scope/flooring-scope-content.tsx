// Import necessary packages and components
import React, { useEffect, useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "./flooring-scope.css";
import FlooringScopeTableBody from "./flooring-scope-table-body";
import { Typography } from "@mui/material";
import BaseButton from "../../../../../../components/base-button";

// Define typescript interface to define the props passed in this component
interface Props {
    header: string;
    isHeader: boolean;
}

// Component that defines how each table cell should look like
const TableCellComponent = ({ header, isHeader }: Props) => (
    <TableCell
        style={{
            backgroundColor: isHeader ? "#004D71" : "#EEEEEE",
            color: isHeader ? "#FFFFFF" : "#001833",
            marginLeft: "20px",
        }}
        className="Flooring-scope-table-cell"
    >
        <Typography variant="tableHeaderText" sx={{ fontWeight: "700", marginLeft: "2rem" }}>
            {header}
        </Typography>
    </TableCell>
);

// Function that returns the headers of the table
const getTableHeaders = ([firstHeader, ...headers]: string[]) => (
    <>
        <TableCellComponent header={firstHeader} isHeader />
        {headers.map((header, index) => (
            <TableCellComponent key={index} header={header} isHeader={false} />
        ))}
    </>
);

// Function that creates a formatted table body based on the data passed in as arguments along with other helper data
const getFormattedTableBody = (flooringItems: any, data: any, subGroups: any) => {
    let tableData: any[] = [];
    data.forEach((entry: any) => {
        const tableRow = [
            { cellType: "RoomType", cellValue: entry.roomType, isDisabled: entry.isDisabled },
        ];
        entry.subGroups.forEach((subGroup: any, index: number) => {
            const group = subGroups.data.find((group: any) => group.id === subGroup.subGroupId);
            const floorLevelData = {
                cellType: "FloorLevel",
                cellValue: group?.name,
                subGroupId: group?.id,
                isDisabled: entry?.isDisabled || false,
            };
            const sItem = subGroup?.selectedItem;
            const flooringData = flooringItems.map((item: any) => ({
                cellType: item,
                cellValue: item === sItem ? "checked" : "unChecked",
                isCellDefault: subGroup?.isDefault,
                isDisabled: entry?.isDisabled || false,
            }));
            if (index === 0) {
                tableRow.push(floorLevelData);
                tableRow.push(...flooringData);
                tableData.push(tableRow);
            } else {
                let newRow = [];
                newRow.push(floorLevelData);
                newRow.push(...flooringData);
                tableData.push(newRow);
            }
        });
    });

    return tableData;
};

// Component that defines the layout and functionality of the Flooring Scope page
const FlooringScopeContent = ({
    flooringTakeOffs,
    isFloorSplit,
    onSaveClicked,
    subGroups,
    flooringData,
}: {
    flooringTakeOffs: any;
    isFloorSplit: any;
    onSaveClicked: any;
    subGroups: any;
    flooringData: any;
}) => {
    // Define the table headers based on the flooring items data
    const tableHeaders = ["Locations", "Floor Level", ...flooringTakeOffs.flooringItems];
    // Generate the formatted table body using data passed in as arguments
    const tableBody = useMemo(
        () =>
            getFormattedTableBody(flooringTakeOffs.flooringItems, flooringTakeOffs.data, subGroups),
        [flooringTakeOffs.flooringItems, flooringTakeOffs.data, subGroups],
    );
    // Define state to keep track of rows in the table
    const [tableRows, setTableRows] = useState(tableBody);

    // Update the formatted table on any change to input data
    useEffect(() => {
        const tableBody = getFormattedTableBody(
            flooringTakeOffs.flooringItems,
            flooringTakeOffs.data,
            subGroups,
        );
        setTableRows(tableBody);
        flooringData(tableBody); // Save the formatted table data into parent state
        //eslint-disable-next-line
    }, [flooringTakeOffs.flooringItems, flooringTakeOffs.data, subGroups]);

    // Component that defines the "Save" button which triggers save functionality when clicked
    const SaveButton = () => (
        <BaseButton
            label={isFloorSplit ? "Update" : "Save"}
            onClick={() => onSaveClicked(tableRows)}
            type="active"
            sx={{ maxWidth: "4.75rem" }}
        />
    );

    // Render the Flooring Scope page with the table and save button components
    return (
        <div>
            <TableContainer className="Flooring-scope-table-container">
                <Table sx={{ maxHeight: 100 }} stickyHeader>
                    <TableHead>
                        <TableRow>{getTableHeaders(tableHeaders)}</TableRow>
                    </TableHead>
                    <FlooringScopeTableBody tableRows={tableRows} setTableRows={setTableRows} />
                </Table>
            </TableContainer>
            <SaveButton />
        </div>
    );
};

// Export the component for use in other parts of the code
export default FlooringScopeContent;
