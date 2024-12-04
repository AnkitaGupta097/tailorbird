import React from "react";
import { Divider, Grid } from "@mui/material";

type IFilterSidebar = React.ComponentPropsWithRef<"div"> & {
    children: React.ReactNode;
};

const FilterSidebar = ({ children }: IFilterSidebar) => {
    return (
        <Grid
            container
            flexDirection={"column"}
            gap={4}
            style={{
                border: "1px solid #C9CCCF",
                borderRadius: "4px",
                padding: "16px",
                height: "100%",
            }}
        >
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    return (
                        <Grid container flexDirection={"column"} gap={4}>
                            <Grid item>{React.cloneElement(child, { key: index })}</Grid>
                            {index < React.Children.count(children) - 1 && (
                                <Grid item>
                                    <Divider sx={{ borderBottomWidth: 3 }} />
                                </Grid>
                            )}
                        </Grid>
                    );
                }
            })}
        </Grid>
    );
};

export default FilterSidebar;
