import { Typography } from "@mui/material";
import BaseTabs from "components/base-tabs";
import React from "react";
import { StyledGrid } from "./style";

interface IBaseAppContainer {
    title: string;
    currentTab?: any;
    tabChanged?: Function;
    tabList?: any[];
    otherContent?: any;
}

const BaseAppContainer = ({
    title,
    currentTab,
    tabChanged,
    tabList,
    otherContent,
}: IBaseAppContainer) => {
    return (
        <React.Fragment>
            <StyledGrid container className="Base-grid container app">
                <StyledGrid container className={`Base-grid container app projects`}>
                    <StyledGrid
                        item
                        md={6}
                        sm={6}
                        xs={6}
                        className={"Base-grid container app projects title"}
                    >
                        <Typography variant="text_26_medium">{title}</Typography>
                        {otherContent}
                    </StyledGrid>
                    <StyledGrid
                        item
                        md={6}
                        sm={6}
                        xs={6}
                        className={`Base-grid container app projects tabs`}
                    >
                        {tabList !== undefined && tabList?.length > 0 && (
                            <BaseTabs
                                currentTab={currentTab}
                                onTabChanged={tabChanged}
                                tabList={tabList}
                            />
                        )}
                    </StyledGrid>
                </StyledGrid>
            </StyledGrid>
        </React.Fragment>
    );
};

export default BaseAppContainer;
