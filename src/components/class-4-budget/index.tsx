import { gql } from "@apollo/client";
import { useFeature } from "@growthbook/growthbook-react";
import { Download } from "@mui/icons-material";
import { Button, CircularProgress, Typography } from "@mui/material";
import { FEATURE_FLAGS } from "components/production/constants";
import { useProductionContext } from "context/production-context";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FeatureFlagConstants } from "utils/constants";
import { graphQLClient } from "utils/gql-client";

const CLASS_4_BUDGET_LINK = gql`
    mutation class4BudgetLink($project_id: String) {
        class4BudgetLink(project_id: $project_id)
    }
`;

const Class4BudgetComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { projectId } = useParams();
    const { hasFeature } = useProductionContext();
    async function downloadClass4Budget() {
        setIsLoading(true);
        try {
            const response = await graphQLClient.mutate("class4BudgetLink", CLASS_4_BUDGET_LINK, {
                project_id: projectId,
            });
            window.open(response);
        } finally {
            setIsLoading(false);
        }
    }
    const isFeatureOn = useFeature(FeatureFlagConstants.CLASS_4_BUDGET_DOWNLOAD).on;
    const canDownload = hasFeature(FEATURE_FLAGS.EDIT_UNIT_RELEASE_INFO);
    if (canDownload && isFeatureOn) {
        return (
            <Button
                variant={"outlined"}
                startIcon={isLoading ? <CircularProgress size={12} /> : <Download />}
                color="primary"
                disabled={isLoading}
                onClick={downloadClass4Budget}
            >
                <Typography variant="text_14_medium">Class 4 Budget</Typography>
            </Button>
        );
    }
    return <></>;
};

export default Class4BudgetComponent;
