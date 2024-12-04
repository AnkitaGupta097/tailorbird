import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import PropertiesListTable from "../common/project-list-table";

interface IPropertiesTable {
    yourProperties: any;
    /* eslint-disable-next-line */
    setPropertyModal: (val: boolean) => void;
}

const PropertiesTable = ({ yourProperties, setPropertyModal }: IPropertiesTable) => {
    const [properties, setProperties] = React.useState([]);

    useEffect(() => {
        setProperties(yourProperties);
    }, [yourProperties]);

    return (
        <Grid container>
            <Grid item md={12} style={{ marginTop: 10 }}>
                <PropertiesListTable
                    properties={properties}
                    type={"general"}
                    setPropertyModal={setPropertyModal}
                />
            </Grid>
        </Grid>
    );
};

export default PropertiesTable;
