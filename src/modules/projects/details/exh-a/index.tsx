import React, { useCallback, useEffect, useState } from "react";

import { Box, Button, SelectChangeEvent, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { graphQLClient } from "utils/gql-client";
import BaseLoader from "components/base-loading";
import { IExhAConfig, ISelectedTradeOptionsMap, VERSION_OPTIONS } from "./types";
import {
    GET_EXH_A_CONFIG_QUERY,
    GET_EXH_A_MISSING_FILES,
    UPDATE_EXH_A_CONFIG_MUTATION,
} from "./exh-a.graphql";
import { cloneDeep } from "lodash";
import { sleep } from "./helper";
import ConfigPopup from "./config-popup";
import moment from "moment-timezone";
import DocumentsList from "./documents-list";
import { GET_PROJECT_FILE } from "components/production/constants";
import { downloadFile } from "stores/single-project/operation";
import UploadProjectDocPopup from "./upload-popup";
import { ReactComponent as CheckCircle } from "../../../../assets/icons/check_circle.svg";

export default function ExhA() {
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

    const { projectId } = useParams();
    const [configData, setConfigData] = useState<IExhAConfig | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSavingExhAConfig, setIsSavingExhAConfig] = useState<boolean>(false);
    const [exhAConfigSaved, setExhAConfigSaved] = useState<boolean>(false);
    const [selectedTradeOptionsId, setSelectedTradeOptionsId] = useState<ISelectedTradeOptionsMap>(
        {},
    );
    const [missingFiles, setMissingFiles] = useState([]);
    const toggleSettingsModal = () => {
        setIsSettingsModalOpen((prev) => !prev);
    };
    const toggleUploadModal = () => {
        setIsUploadModalOpen((prev) => !prev);
    };
    const getMissingFiles = useCallback(async () => {
        const res = await graphQLClient.query("getExhAMissingItemsFile", GET_EXH_A_MISSING_FILES, {
            projectId,
        });
        setMissingFiles(res?.getExhAMissingItemsFile);
    }, [projectId]);

    const getExhAConfig = useCallback(async () => {
        setLoading(true);
        try {
            const res = await graphQLClient.query("GetExhAConfig", GET_EXH_A_CONFIG_QUERY, {
                projectId,
            });
            setConfigData(res.getExhAConfig);
        } catch (error) {
            console.error(`getExhAConfig failed with ${error}`);
        } finally {
            setLoading(false);
        }
    }, [projectId]);
    const updateExhAConfig = useCallback(async () => {
        setIsSavingExhAConfig(true);
        try {
            const res = await graphQLClient.mutate(
                "updateExhAConfig",
                UPDATE_EXH_A_CONFIG_MUTATION,
                {
                    projectId,
                    updateExhAInput: configData,
                },
            );
            if (res.message === "success") {
                setExhAConfigSaved(true);
                sleep(2000).then(() => {
                    setIsSettingsModalOpen(false);
                    setIsSavingExhAConfig(false);
                    setExhAConfigSaved(false);
                });
            }
        } catch (error) {
            console.error(`getExhAConfig failed with ${error}`);
        }
    }, [configData, projectId]);

    useEffect(() => {
        if (projectId) {
            getExhAConfig();
            getMissingFiles();
        }
    }, [getExhAConfig, getMissingFiles, projectId]);
    useEffect(() => {
        if (selectedTradeOptionsId && typeof selectedTradeOptionsId === "object") {
            const copyOfConfigData = cloneDeep(configData);
            Object.keys(selectedTradeOptionsId).map((tradeId) => {
                const selectedTradeOptionsIds = selectedTradeOptionsId[tradeId];

                // Find the trade in copyOfConfigData with the tradeId
                const trade = copyOfConfigData?.trades?.find((t) => t.trade_id === tradeId);
                console.log({ trade, tradeId });

                if (trade) {
                    // Toggle all id in the selectedTradeOptionsIds is_selected to true and all the remaining to false
                    trade.trade_options.forEach((tradeOption) => {
                        tradeOption.is_selected = selectedTradeOptionsIds.includes(tradeOption.id);
                    });
                }
            });
            setConfigData(copyOfConfigData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTradeOptionsId]);
    const onChangeVersion = (e: SelectChangeEvent<unknown>) => {
        const selectedValue = e.target.value;
        setConfigData((prev) => {
            if (!prev) {
                return prev;
            }
            return {
                ...prev,
                long_description_included: selectedValue === VERSION_OPTIONS[0].value,
                short_description_included: selectedValue === VERSION_OPTIONS[1].value,
            };
        });
    };
    const onChangeMaterialSupply = (e: SelectChangeEvent<unknown>) => {
        setConfigData((prev) => {
            if (!prev) {
                return prev;
            }
            return {
                ...prev,
                material_supply: e.target.value as string,
            };
        });
    };

    const downloadMissingFiles = async () => {
        if (missingFiles) {
            const downloadPromises = missingFiles.map(async (file: { id: any }) => {
                const res = await graphQLClient.query("getProjectFile", GET_PROJECT_FILE, {
                    fileId: Number(file.id),
                });
                return downloadFile(res.getProjectFile.download_link, res.getProjectFile.file_name);
            });

            await Promise.all(downloadPromises);
        }
    };

    if (loading && !configData) {
        return <BaseLoader />;
    }
    return (
        <Box>
            <Box
                sx={{ display: "flex" }}
                py={"1rem"}
                px={"3rem"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDirection="row"
            >
                <Typography variant="text_18_medium">SOW (Ex A)</Typography>
                <Box alignItems={"center"} sx={{ display: "flex" }} gap={"1rem"}>
                    <ConfigPopup
                        isSavingExhAConfig={isSavingExhAConfig}
                        exhAConfigSaved={exhAConfigSaved}
                        toggleSettingsModal={toggleSettingsModal}
                        onChangeVersion={onChangeVersion}
                        configData={configData}
                        onChangeMaterialSupply={onChangeMaterialSupply}
                        setConfigData={setConfigData}
                        setSelectedTradeOptionsId={setSelectedTradeOptionsId}
                        updateExhAConfig={updateExhAConfig}
                        isSettingsModalOpen={isSettingsModalOpen}
                        selectedTradeOptionsId={selectedTradeOptionsId}
                    />
                    <UploadProjectDocPopup
                        projectId={projectId as string}
                        isOpen={isUploadModalOpen}
                        toggle={toggleUploadModal}
                    />
                </Box>
            </Box>
            {Boolean(missingFiles.length) && (
                <Box
                    width={"25rem"}
                    paddingLeft="3rem"
                    gap="4px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CheckCircle />
                    <Typography variant="text_12_regular">
                        SOW (Ex A) last generated on {/* @ts-ignore */}
                        {moment(missingFiles[missingFiles.length - 1].created_at).format(
                            "MMM D, h:mm A",
                        )}
                        .
                    </Typography>
                    <Button
                        sx={{ textDecoration: "underline" }}
                        onClick={downloadMissingFiles}
                        variant="text"
                    >
                        Download log
                    </Button>
                </Box>
            )}
            <DocumentsList projectId={projectId as string} />
        </Box>
    );
}
