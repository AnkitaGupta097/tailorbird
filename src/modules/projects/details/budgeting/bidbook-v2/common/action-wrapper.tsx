import React, {
    Dispatch,
    forwardRef,
    Ref,
    SetStateAction,
    useImperativeHandle,
    useState,
} from "react";
import Button from "components/button";
import { Grid, Tooltip, Typography } from "@mui/material";
import { useRef } from "react";
import { graphQLClient } from "utils/gql-client";
import { GET_LATEST_RENOVATION_VERSION } from "../actions/mutation-contsants";
import SplitButton from "components/split-button";

interface IActionWrapper {
    viewMode: boolean;
    activeStep: string;
    setActiveStep: Dispatch<SetStateAction<string>>;
    save: () => Promise<void>;
    setSaveChanges: Dispatch<SetStateAction<boolean>>;
    steps: {
        label: string;
        value: string;
    }[];
    projectType: string;
    projectId: string | undefined;
    onChangeSelectedOption: Function;
    selectedOption: 0 | 1 | 2;
    container_version: number;
}

const ActionWrapper = (
    {
        viewMode,
        activeStep,
        setActiveStep,
        save,
        setSaveChanges,
        steps,
        projectType,
        projectId,
        onChangeSelectedOption,
        selectedOption,
        container_version,
    }: IActionWrapper,
    ref: Ref<any>,
) => {
    const [isHavingUnsavedChanges, setIsHavingUnsavedChanges] = useState(false);
    const spanRef = useRef<HTMLSpanElement>(null);
    const currentStepItemIndex = steps.findIndex((item) => item.value == activeStep);

    useImperativeHandle(
        ref,
        () => ({
            isHavingUnsavedChanges,
            setIsHavingUnsavedChanges,
        }),
        [isHavingUnsavedChanges],
    );

    const getIsExhCGenerated = async () => {
        const res = await graphQLClient.query(
            "LatestRenovationVersion",
            GET_LATEST_RENOVATION_VERSION,
            {
                projectId: projectId,
            },
        );
        return Boolean(res?.latestRenovationVersion?.created_at);
    };
    return (
        <Grid item xs={12} id="floatingDiv">
            <Grid container justifyContent="flex-end" gap={2}>
                {currentStepItemIndex > 0 && (
                    <Grid item>
                        <Tooltip
                            title={
                                isHavingUnsavedChanges ? (
                                    <Typography variant="text_12_medium">
                                        Unsaved changes.
                                    </Typography>
                                ) : (
                                    ""
                                )
                            }
                            arrow
                        >
                            <span>
                                <Button
                                    classes={`invisible default spaced${
                                        isHavingUnsavedChanges ? " disabledwithoutBG" : ""
                                    }`}
                                    onClick={() =>
                                        isHavingUnsavedChanges
                                            ? null
                                            : setActiveStep(steps[currentStepItemIndex - 1].value)
                                    }
                                    label={"Previous"}
                                />
                            </span>
                        </Tooltip>
                    </Grid>
                )}
                {!viewMode &&
                    currentStepItemIndex >
                        (container_version > 2.0 ? -1 : projectType == "COMMON_AREA" ? 1 : 2) && (
                        <Grid item>
                            <Tooltip
                                title={
                                    !isHavingUnsavedChanges ? (
                                        <Typography variant="text_12_medium">
                                            No changes made.
                                        </Typography>
                                    ) : (
                                        ""
                                    )
                                }
                                arrow
                            >
                                <span>
                                    <Button
                                        classes={`primary default spaced${
                                            !isHavingUnsavedChanges ? " disabled" : ""
                                        }`}
                                        onClick={() => {
                                            isHavingUnsavedChanges
                                                ? (setIsHavingUnsavedChanges(false),
                                                  setSaveChanges(true))
                                                : null;
                                        }}
                                        label={"Save"}
                                    />
                                </span>
                            </Tooltip>
                        </Grid>
                    )}
                {currentStepItemIndex !=
                    (container_version > 2.0
                        ? projectType == "INTERIOR"
                            ? 2
                            : 1
                        : projectType == "COMMON_AREA"
                        ? 3
                        : 5) && (
                    <Grid item>
                        <Tooltip
                            title={
                                isHavingUnsavedChanges ? (
                                    <Typography variant="text_12_medium">
                                        Unsaved changes.
                                    </Typography>
                                ) : (
                                    ""
                                )
                            }
                            arrow
                        >
                            <span>
                                <Button
                                    classes={`invisible default spaced${
                                        isHavingUnsavedChanges ? " disabledwithoutBG" : ""
                                    }`}
                                    onClick={() =>
                                        isHavingUnsavedChanges
                                            ? null
                                            : setActiveStep(steps[currentStepItemIndex + 1].value)
                                    }
                                    label={"Next"}
                                />
                            </span>
                        </Tooltip>
                    </Grid>
                )}
                {currentStepItemIndex ==
                    (container_version > 2.0
                        ? projectType == "INTERIOR"
                            ? 2
                            : 1
                        : projectType == "COMMON_AREA"
                        ? 3
                        : 5) &&
                    !viewMode && (
                        <Grid item>
                            <Tooltip
                                title={
                                    isHavingUnsavedChanges ? (
                                        <Typography variant="text_12_medium">
                                            Unsaved changes.
                                        </Typography>
                                    ) : (
                                        ""
                                    )
                                }
                                arrow
                            >
                                <span style={{ position: "relative" }} ref={spanRef}>
                                    <SplitButton
                                        options={[
                                            "Save as New Version",
                                            "Only Exhibit C",
                                            "Only Exhibit A",
                                        ]}
                                        onSelect={(selected: number) => {
                                            onChangeSelectedOption(selected);
                                        }}
                                        selected={selectedOption}
                                        disabled={[...(!getIsExhCGenerated() ? [2] : [])]}
                                        onClick={save}
                                    />
                                </span>
                            </Tooltip>
                        </Grid>
                    )}
            </Grid>
        </Grid>
    );
};

export default forwardRef(ActionWrapper);
