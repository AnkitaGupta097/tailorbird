import React from "react";
import { Grid } from "@mui/material";
import PropertiesListTable from "../common/project-list-table";
interface IArchiveTable {
    yourProperties: any;
}

const ArchiveTable = ({ yourProperties }: IArchiveTable) => {
    const [properties, setProperties] = React.useState([]);

    React.useEffect(() => {
        setProperties(yourProperties);
    }, [yourProperties]);

    return (
        <Grid container>
            <Grid item md={12} style={{ marginTop: 10 }}>
                <PropertiesListTable properties={properties} type={"archive"} />
            </Grid>
        </Grid>
    );
};

export default ArchiveTable;
