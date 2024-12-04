import React, { useState } from "react";
// import ProductionAdmin from "components/production/admin";
import { Tab, Tabs } from "@mui/material";
import ProductionAdmin from ".";
import { EditScopes } from "./edit-scopes";

export const AdminTabs = () => {
    const [selectedTab, setSelectedTab] = useState("scopes");
    return (
        <div>
            {/* eslint-disable-next-line */}
            <Tabs
                value={selectedTab}
                onChange={(e, v) => {
                    setSelectedTab(v);
                }}
            >
                <Tab label="Scopes" value={"scopes"} style={{ color: "black" }} />
                <Tab label="Items" value={"items"} style={{ color: "black" }} />
            </Tabs>
            <div style={{ margin: "8px" }}>
                {selectedTab == "scopes" && <EditScopes />}
                {selectedTab == "items" && <ProductionAdmin />}
            </div>
        </div>
    );
};
