import React from "react";
import FolderIcon from "@mui/icons-material/Folder";

export const TypeIcon = (props: any) => {
    if (props.droppable) {
        return <FolderIcon />;
    }

    return null;
};
