/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import ScopeEditorHeader from "./scopes-editor-header";
import React, { useEffect, useState } from "react";
import ScopeEditorContent from "./scopes-editor-content";
import { useAppSelector } from "../../../stores/hooks";
import { getFormattedScopeContainerTree } from "./service";
import { cloneDeep } from "lodash";

interface IScopeEditorContainer {
    scopeData: {
        type: string;
        ownership: string;
        name: string;
        description: string;
        scopeList: any;
        isEdit?: boolean;
        ownershipGroupId: any;
        projectType?: any;
        containerVersion?: string;
    };
    setScopeData: any;
}

// eslint-disable-next-line
const ScopeEditorContainer = ({ scopeData, setScopeData }: IScopeEditorContainer) => {
    const scopeContainerTree = useAppSelector((state) => {
        return scopeData?.isEdit ? state.scopes.scopeContainerTree : state.scopes.containerTree;
    });

    const [scopeList, setScopeList] = useState<any>();
    const [isReset, setIsReset] = useState(false);

    useEffect(() => {
        const containerVersion = scopeData.containerVersion;
        const scopeList = getFormattedScopeContainerTree(scopeContainerTree);
        setScopeList(scopeList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scopeContainerTree]);

    useEffect(() => {
        if (isReset) {
            setIsReset(false);
            const scopeTreeCopy = JSON.parse(JSON.stringify(scopeContainerTree));
            const scopeList = scopeTreeCopy.map((category: any) => {
                let categoryCopy = {
                    ...category,
                    items: category.items.map((item: any) => {
                        let itemCopy = {
                            ...item,
                            scopes: item.scopes.map((scope: any) => {
                                const scopeCopy = {
                                    ...scope,
                                    isSelected: scopeData?.isEdit ? scope.isSelected : false,
                                };
                                return scopeCopy;
                            }),
                            isSelected: item.scopes.some((scope: any) => scope.isSelected),
                        };
                        return itemCopy;
                    }),
                };
                const isCategorySelected = categoryCopy.items.some((item: any) => item.isSelected);
                categoryCopy.isSelected = isCategorySelected;
                return categoryCopy;
            });
            setScopeList(scopeList);
        }
        // eslint-disable-next-line
    }, [isReset]);

    useEffect(() => {
        setScopeData({ ...scopeData, scopeList });
        // eslint-disable-next-line
    }, [scopeList]);

    /// selecting Profit & Overhead and General Conditions categogories by default in new scope creation
    useEffect(() => {
        if (scopeData?.isEdit == undefined) {
            setScopeList((state: any) => {
                const stateCopy = cloneDeep(state);
                return stateCopy?.map((item: any) => {
                    if (item.name == "Profit & Overhead" || item.name == "General Conditions") {
                        item.isSelected = true;
                        item.items.forEach((element: any) => {
                            element.isSelected = true;
                            element.scopes?.map((scItem: any, index: any) => {
                                if (index == 0) {
                                    scItem.isSelected = true;
                                }
                                return { ...item };
                            });
                        });

                        return item;
                    }
                    return item;
                });
            });
        }
    }, []);

    return (
        <Box component="div" style={{ width: "100%" }}>
            <ScopeEditorHeader
                setIsReset={setIsReset}
                scopeList={scopeList}
                scopeData={scopeData}
            />
            <ScopeEditorContent
                scopeItems={scopeList}
                setScopeItems={setScopeList}
                isEditFlow={scopeData?.isEdit}
            />
        </Box>
    );
};

export default ScopeEditorContainer;
