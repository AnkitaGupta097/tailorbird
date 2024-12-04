import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Button } from "@mui/material";

type ViewSwitcherProps = {
    // eslint-disable-next-line no-unused-vars
    onViewModeChange: (viewMode: ViewMode) => void;
};
const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ onViewModeChange }) => {
    return (
        <div className="ViewContainer">
            <ButtonGroup size="small" aria-label="small Button group">
                <Button onClick={() => onViewModeChange(ViewMode.Hour)}>Hour</Button>
                <Button onClick={() => onViewModeChange(ViewMode.Day)}>Day</Button>
                <Button onClick={() => onViewModeChange(ViewMode.Week)}>Week</Button>
                <Button onClick={() => onViewModeChange(ViewMode.Month)}>Month</Button>
                <Button onClick={() => onViewModeChange(ViewMode.Year)}>Year</Button>
            </ButtonGroup>
        </div>
    );
};

export default ViewSwitcher;
