import React, { CSSProperties } from "react";
import { KeyValueObject } from "../filter-sidebar/filter-section";
import { Autocomplete, Grid, TextField } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

type ISearchFilters = React.ComponentPropsWithRef<"div"> & {
    dataList: Array<any>;
    filters: Array<any>;
    style?: CSSProperties;
    disabled?: boolean;
    // eslint-disable-next-line no-unused-vars
    onSearchFilterClick: (type: string, value: string) => void;
    contractorList: Array<any>;
};

const SearchFilters = ({
    onSearchFilterClick,
    dataList,
    filters,
    style,
    disabled,
    contractorList,
}: ISearchFilters) => {
    const getFilterOptions = (type: string): Array<KeyValueObject> => {
        let options: Array<any> = [];
        if (type == "unitId") {
            options = dataList?.map((unit: any) => {
                return {
                    value: unit?.id,
                    label: unit?.unit_name,
                };
            });
        } else if (type === "scopeId") {
            options = dataList?.map((scope: any) => {
                return {
                    value: scope?.id,
                    label: scope?.scope,
                };
            });
        } else if (type === "invoiceId") {
            options = dataList?.map((invoice: any) => {
                return {
                    value: invoice?.id,
                    label: invoice?.id.toString(),
                };
            });
        } else if (type === "contractor") {
            options = contractorList?.map((contractor: any) => {
                return {
                    value: contractor?.id,
                    label: contractor?.name,
                };
            });
        }

        return options;
    };

    return (
        <Grid container gap={3} style={{ ...(style || {}) }} alignItems="center">
            <FilterListIcon color="primary" />
            {filters?.map((filter) => (
                <Grid item flex={1} key={filter?.type} sx={{ opacity: filter?.hide ? 0 : 1 }}>
                    <Autocomplete
                        disabled={disabled}
                        size="small"
                        options={getFilterOptions(filter?.type)}
                        sx={{ width: "100%" }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={filter?.placeholder} />
                        )}
                        onChange={(_e, value: any) => {
                            onSearchFilterClick(filter?.type, value?.value);
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default SearchFilters;
