import { Button, MenuItem, Select, styled, TableCell, TableRow, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { tablePagination } from "../../modules/scraper/constant";
import AppTheme from "../../styles/theme";
import { OutlinedInput } from "@mui/material";

interface ITablePagination {
    page: number;
    noOfPages: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    rowsPerPage: number;
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
    columnsLength?: any;
}

const PaginationButton = styled(Button)(({ $isCurrent }: { $isCurrent: boolean }) => ({
    border: `0.063rem solid ${AppTheme.border.inner}`,
    borderRadius: "0.1rem",
    "&:focus": {
        backgroundColor: AppTheme.palette.primary.main,
        color: AppTheme.palette.secondary.light,
    },
    color: $isCurrent ? AppTheme.palette.secondary.light : AppTheme.text.light,
    textTransform: "none",
    backgroundColor: $isCurrent ? AppTheme.palette.primary.main : AppTheme.palette.secondary.light,
}));

const JumpInput = styled(OutlinedInput)`
    font-size: 0.87rem;
    line-height: 1.14rem;
    border: 0.063rem solid #dedede;
    border-radius: 0.1rem;
    vertical-align: middle;
    margin: 0px 15px;
    width: 90px;
`;

//@ts-ignore
const TablePaginationProperty = (props: ITablePagination) => {
    //Functions
    const handlePageChange = (val: any) => {
        let currentPage = Number(`${props?.page}`);
        if (val == "prev" && props?.page > 1) {
            currentPage = currentPage - 1;
        } else if (val == "next" && props?.page < props?.noOfPages) {
            currentPage = currentPage + 1;
        } else if (!isNaN(val)) {
            currentPage = val;
        }
        props?.setPage(Number(currentPage));
    };

    const [pageNumsArr, setPageNumsArr] = React.useState<number[]>([]);
    const [startArr, setStartArr] = React.useState<number[]>([]);
    const [middleArr, setMiddleArr] = React.useState<number[]>([]);
    const [endArr, setEndArr] = React.useState<number[]>([]);

    const getPageNums = () => {
        let pageNosArr: number[] = [];
        const maxPage = props?.noOfPages;
        for (let i = 1; i <= maxPage; i++) {
            pageNosArr.push(i);
        }
        setPageNumsArr(pageNosArr);
    };
    useEffect(() => {
        getPageNums();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.rowsPerPage, props?.noOfPages]);

    useEffect(() => {
        getPageNums();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let middle: number[] = [];
        let end: number[] = [];
        // let center = Math.ceil(pageNumsArr.length / 2);
        let pageNumsArrLength = pageNumsArr.length;
        let currentPage = props?.page;
        let start: number[] = [];
        if (currentPage < 5) {
            let max = pageNumsArrLength > 5 ? 5 : pageNumsArrLength;
            for (let i = 0; i < max; i++) {
                start.push(pageNumsArr[i]);
            }
            if (pageNumsArrLength > 5) {
                end = [pageNumsArr[pageNumsArrLength - 1]];
            }
        } else {
            start = [];
            start.push(1);

            if (currentPage <= pageNumsArr[pageNumsArrLength - 1]) {
                middle = [currentPage - 1, currentPage];
                if (!(currentPage + 1 > pageNumsArr[pageNumsArrLength - 1])) {
                    middle.push(currentPage + 1);
                }
                // if (currentPage + 1 == pageNumsArr[pageNumsArrLength - 1]) {
                //     [currentPage - 2].concat(middle);
                // }
            }
            if (pageNumsArrLength > 0) {
                end = [pageNumsArr[pageNumsArrLength - 1]];
            }
            if (
                currentPage + 1 == pageNumsArr[pageNumsArrLength - 1] ||
                currentPage == pageNumsArr[pageNumsArrLength - 1]
            ) {
                end = [];
            }
        }
        setStartArr(start);
        setMiddleArr(middle);
        setEndArr(end);
    }, [props?.page, pageNumsArr]);

    const handleJump = (value: any) => {
        if (value != "") {
            handlePageChange(value);
        }
    };

    return (
        <TableRow>
            <TableCell sx={{ display: "flex", flexDirection: "row" }} colSpan={2} align="left">
                <Typography
                    sx={{
                        marginRight: "0.7rem",
                        paddingTop: "0.5rem",
                    }}
                    color={AppTheme.text.light}
                    variant="footerText"
                >
                    {tablePagination.RowsPerPage}
                </Typography>
                <Select
                    value={props?.rowsPerPage}
                    /*@ts-ignore*/
                    onChange={(e: { target: { value: number } }) => {
                        props?.setRowsPerPage(e.target.value);
                    }}
                    sx={{
                        width: "3.6rem",
                        height: "2.5rem",
                        borderRadius: "0.1rem",
                        backgroundColor: AppTheme.palette.primary.main,
                        color: AppTheme.palette.secondary.light,
                        textAlign: "center",
                    }}
                    variant="standard"
                >
                    <MenuItem value={10}>
                        <Typography variant="tableData">10</Typography>
                    </MenuItem>
                    <MenuItem value={20}>
                        <Typography variant="tableData">20</Typography>
                    </MenuItem>
                    <MenuItem value={30}>
                        <Typography variant="tableData">30</Typography>
                    </MenuItem>
                </Select>
            </TableCell>

            <TableCell
                colSpan={props.columnsLength || 6}
                align="right"
                sx={{ paddingRight: "1.9rem" }}
            >
                <span style={{ fontWeight: "600", fontSize: "0.875rem", lineHeight: "1.14rem" }}>
                    Jump To
                </span>
                <JumpInput
                    size="small"
                    onChange={(e) => {
                        Number(e.target.value) <= props.noOfPages
                            ? handleJump(e.target.value)
                            : null;
                    }}
                    fullWidth
                />
                <PaginationButton
                    onClick={() => handlePageChange("prev")}
                    $isCurrent={false}
                    disabled={props?.page == 1}
                >
                    <Typography variant="buttonText">{tablePagination.Previous}</Typography>
                </PaginationButton>
                {
                    //@ts-ignore
                    startArr.map((i) => (
                        <PaginationButton
                            key={i}
                            onClick={() => handlePageChange(i)}
                            $isCurrent={props?.page === i}
                        >
                            <Typography variant="buttonText">{i}</Typography>
                        </PaginationButton>
                    ))
                }
                {middleArr.length > 0 && <span style={{ margin: "0px 10px" }}>...</span>}
                {
                    //@ts-ignore
                    middleArr.map((i) => (
                        <PaginationButton
                            key={i}
                            onClick={() => handlePageChange(i)}
                            $isCurrent={props?.page === i}
                        >
                            <Typography variant="buttonText">{i}</Typography>
                        </PaginationButton>
                    ))
                }
                {middleArr.includes(props?.noOfPages) == false &&
                    middleArr.includes(props?.noOfPages - 1) == false &&
                    (middleArr.length > 0 || endArr.length > 0) && (
                        <span style={{ margin: "0px 10px" }}>...</span>
                    )}
                {
                    //@ts-ignore
                    endArr.map((i) => (
                        <PaginationButton
                            key={i}
                            onClick={() => handlePageChange(i)}
                            $isCurrent={props?.page === i}
                        >
                            <Typography variant="buttonText">{i}</Typography>
                        </PaginationButton>
                    ))
                }
                <PaginationButton
                    onClick={() => handlePageChange("next")}
                    $isCurrent={false}
                    disabled={props?.page >= props.noOfPages}
                >
                    <Typography variant="buttonText">{tablePagination.Next}</Typography>
                </PaginationButton>
            </TableCell>
        </TableRow>
    );
};

export default TablePaginationProperty;
