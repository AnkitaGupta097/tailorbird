import React, { createContext, useState, useContext } from "react";

const ProjectContext = createContext<any>(null);

interface IProjectProps {
    children: any;
}

export const ProjectProvider = ({ children }: IProjectProps) => {
    const [project, setProject] = useState([]);

    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjectContext = () => useContext(ProjectContext);
