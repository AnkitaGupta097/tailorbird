/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Card, Box, Typography, Select, MenuItem, styled } from "@mui/material";
import { STATS_TYPE } from "../constants";
import { map } from "lodash";

const Dropdown = styled(Select)(() => ({
    "& .css-1kn7y0p-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
        paddingLeft: "0px",
        paddingTop: "10px",
        paddingBottom: "10px",
    },
    fieldset: {
        border: "none",
        borderTop: "1px solid #EEE",
        borderBottom: "1px solid #EEE",
        borderRadius: "0px",
    },
}));
interface IStatsCard {
    statsDetails: any;
    statsKey: string;
}

const StatsCard = ({ statsDetails, statsKey }: IStatsCard) => {
    const [stats, setStats] = useState<any>(statsDetails[0]);
    const { color, name } = STATS_TYPE[statsKey];
    return (
        <Box pl={5} width="245px" height="169px">
            <Card
                sx={{
                    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.10)",
                    cursor: "pointer",
                    height: "100%",
                    borderRadius: "8px",
                    backgroundColor: color,
                }}
            >
                <Box p={3}>
                    <Box display="flex" justifyContent="center">
                        <div>
                            <Typography variant="text_18_medium">{name}</Typography>
                        </div>
                    </Box>
                    <Box display="flex" mt={7} justifyContent="space-between">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <img src={stats?.icon} alt={`${stats.name?.split(" ")[0]}`} />
                            <Box pl={1}>
                                <Typography variant="text_24_medium">{stats?.count}</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Dropdown
                                value={stats}
                                onChange={(e: any) => setStats(e.target.value)}
                                sx={{ padding: "0px" }}
                            >
                                {map(statsDetails, (data) => {
                                    if (data.count !== 0) {
                                        return (
                                            <MenuItem value={data}>
                                                <Typography variant="text_12_medium">
                                                    {data.name}
                                                </Typography>
                                            </MenuItem>
                                        );
                                    }
                                    return null;
                                })}
                            </Dropdown>
                        </Box>
                    </Box>
                    <Typography variant="text_10_medium">
                        {`Total ${stats?.name === "Roofing" ? "SQFT" : stats?.name}`}
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
};

export default StatsCard;
