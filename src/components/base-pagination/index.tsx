import { Pagination, PaginationItem } from "@mui/material";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";

import React from "react";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";

interface IBasePagination {
    setPage: React.Dispatch<React.SetStateAction<number>>;
    noOfPages: number;
}

const BasePagination = (props: IBasePagination) => {
    //Functions
    const handlePageChange = (val: any) => {
        props?.setPage(val);
    };
    return (
        <Pagination
            count={props?.noOfPages}
            renderItem={(item) => (
                <PaginationItem
                    components={{
                        previous: SkipPreviousIcon,
                        next: SkipNextIcon,
                        first: FastRewindIcon,
                        last: FastForwardIcon,
                    }}
                    {...item}
                />
            )}
            sx={{ marginLeft: "9.3rem" }}
            showFirstButton
            showLastButton
            size="large"
            onChange={(event: React.ChangeEvent<unknown>, page: number) => {
                handlePageChange(page);
            }}
        />
    );
};

export default BasePagination;
