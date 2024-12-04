import React from "react";
import { Button, Typography, Grid, TextField, InputAdornment } from "@mui/material";
import { debounce } from "lodash";

import SearchSvg from "../../../assets/icons/search.svg";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";

interface IItemSearchHeaderProps {
    onSearchChange?: any;
    onClickExpand?: any;
    onClickCollapse?: any;
    reorderMode?: boolean;
    setReorderMode?: any;
}

const ItemSearchHeader = (props: IItemSearchHeaderProps) => {
    const { onSearchChange, onClickExpand, onClickCollapse, reorderMode, setReorderMode } = props;
    return (
        <Grid container sx={{ padding: "8px" }} justifyContent="space-between" alignItems="center">
            <Grid item>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search"
                    size="small"
                    onChange={debounce((e) => onSearchChange(e.target.value))}
                    InputProps={{
                        sx: { height: "30px", width: "220px", fontSize: "12px" },
                        endAdornment: (
                            <InputAdornment position="end">
                                <img src={SearchSvg} height="10" width="10" alt="arrow-icon" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item>
                <Grid container columnSpacing={4}>
                    {setReorderMode && (
                        <Grid item>
                            <Button
                                onClick={() => setReorderMode((value: boolean) => !value)}
                                endIcon={reorderMode ? <ShuffleOnIcon /> : <ShuffleIcon />}
                            >
                                <Typography variant="text_12_regular">Shuffle</Typography>
                            </Button>
                        </Grid>
                    )}

                    <Grid item>
                        <Button variant="text" onClick={onClickExpand}>
                            <Typography variant="text_12_regular">Expand all</Typography>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="text" onClick={onClickCollapse}>
                            <Typography variant="text_12_regular">Collapse all</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ItemSearchHeader;
