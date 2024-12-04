import { useTheme, Button, Divider, Grid, Typography, InputBase, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import UploadFile from "./scraper-upload-file";
import ScraperJobList from "./scraper-job-list";
import { scraperText } from "./constant";
import AppTheme from "../../styles/theme";
import search from "../../assets/icons/search.svg";
const Scraper = () => {
    const theme = useTheme();
    //States
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        document.title = `Tailorbird | Scraper`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Functions
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Grid
            container
            sx={{
                flexDirection: "row",
            }}
        >
            <Grid
                item
                sm={12}
                sx={{
                    background: theme.palette.secondary.main,
                    padding: "0.75rem 0",
                    boxShadow: "2px 0px 5px 2px rgba(0 , 0 , 0 , 0.1) inset",
                    marginBottom: "1rem",
                }}
            >
                <Typography sx={{ margin: "0.5rem 0 0 2.5rem" }} variant="heading2">
                    {scraperText.scraperTitle}
                </Typography>
            </Grid>
            <Grid item sm={12} md={12} lg={12}>
                <Grid
                    container
                    sx={{
                        flexDirection: "row",
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography sx={{ margin: "0.5rem 0 0 2.5rem" }} variant="heading">
                            {!open ? scraperText.scraperJobsText : scraperText.uploadFileText}
                        </Typography>
                        <Box display="flex" flex={0.75}>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    height: "50px",
                                    justifyContent: "space-between",
                                    border: (theme) => `1px solid ${theme.palette.divider}`,
                                    borderRadius: 1,
                                    bgcolor: "background.paper",
                                    color: "text.secondary",
                                    "& div": {
                                        mx: 2,
                                    },
                                    marginRight: "15px",
                                    width: "max-content",
                                }}
                            >
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                    }}
                                >
                                    <InputBase
                                        fullWidth
                                        placeholder={"Search by name, ownership and uploaded by."}
                                        inputProps={{ "aria-label": "search" }}
                                        onChange={(e) =>
                                            setSearchText(e.target.value.toLowerCase())
                                        }
                                    />
                                </Box>
                                <Box>
                                    <img src={search} alt="search project" />
                                </Box>
                            </Box>
                            {!open && (
                                <Button
                                    variant="contained"
                                    sx={{ marginRight: "2.5rem", textTransform: "none" }}
                                    onClick={handleOpen}
                                >
                                    <AddIcon />
                                    <Typography
                                        color={AppTheme.palette.secondary.light}
                                        variant="buttonText"
                                    >
                                        {scraperText.newJobText}
                                    </Typography>
                                </Button>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider
                            sx={{
                                width: "6.3rem",
                                height: "0.1rem",
                                marginTop: "0.9rem",
                                marginLeft: "2.5rem",
                            }}
                            color={AppTheme.palette.primary.main}
                        ></Divider>
                        <Divider sx={{ margin: 0, padding: 0 }}></Divider>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            paddingLeft: "2.5rem",
                            paddingRight: "2.5rem",
                        }}
                    >
                        <UploadFile open={open} handleClose={handleClose} setOpen={setOpen} />
                        {!open && (
                            <ScraperJobList handleOpen={handleOpen} searchText={searchText} />
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Scraper;
