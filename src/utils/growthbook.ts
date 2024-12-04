import { GrowthBook } from "@growthbook/growthbook-react";

export const growthbook = new GrowthBook({
    enableDevMode: true,
    trackingCallback: (experiment, result) => {
        console.log("Experiment Viewed", {
            experimentId: experiment.key,
            variationId: result.variationId,
        });
    },
});
