import React from "react";
import { Button, InputBase, Box } from "@mui/material";
import AddIcon from "../../../assets/icons/icon-add.svg";
import search from "../../../assets/icons/new_search.svg";
import { PROJECTS_TABS } from "../constant";
interface IProjectsHeader {
    /* eslint-disable-next-line */
    setSearchValue: (val: string) => void;
    /* eslint-disable-next-line */
    setProjectModal?: (val: boolean) => void;
    projectTab?: String;
}

const ProjectsHeader = ({ setSearchValue, setProjectModal, projectTab }: IProjectsHeader) => {
    const createNewProject = () => {
        // @ts-ignore
        setProjectModal(true);
    };
    return (
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
                        placeholder={"Search by property name, address, owner"}
                        inputProps={{ "aria-label": "search" }}
                        onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                    />
                </Box>
                <Box>
                    <img src={search} alt="search project" />
                </Box>
            </Box>
            {projectTab !== PROJECTS_TABS[1].value && (
                <Button
                    variant="contained"
                    startIcon={<img src={AddIcon} alt="add new Property" />}
                    style={{ height: "50px", marginLeft: "10px" }}
                    onClick={createNewProject}
                >
                    New Property
                </Button>
            )}
        </Box>
    );
};

export default ProjectsHeader;
