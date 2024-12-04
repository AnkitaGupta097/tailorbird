import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import ScopeStatusChip from "../common/scope-status-chip";
import AvatarGroup from "components/avatar-group";
import theme from "styles/theme";

interface IScopeCategoryRowProps {
    scopeData: any;
}

const ScopeCategoryRow = ({ scopeData }: IScopeCategoryRowProps) => {
    const getContractorsAvatar = (contractors: Array<any>) => {
        if (contractors?.length > 0) {
            return <AvatarGroup names={contractors?.map((sub) => sub?.name)} size={32} />;
        }

        return <Avatar sx={{ width: 32, height: 32 }} />;
    };

    return (
        <Grid
            container
            gap={2}
            padding={"14px 16px"}
            sx={{ borderRadius: "4px", border: `1px solid ${theme.border.textarea}` }}
            alignItems={"center"}
        >
            <Grid item>
                <Typography variant="text_16_medium">{scopeData?.scope}</Typography>
            </Grid>
            <Grid item marginLeft={"auto"}>
                <ScopeStatusChip status={scopeData?.status} />
            </Grid>
            <Grid item>{getContractorsAvatar(scopeData?.subs)}</Grid>
        </Grid>
    );
};

export default ScopeCategoryRow;
