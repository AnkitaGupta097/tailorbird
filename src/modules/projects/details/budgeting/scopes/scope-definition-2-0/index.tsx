import React, { useState, useEffect } from "react";
import dispatchActions from "stores/actions";
import { useAppDispatch } from "stores/hooks";
import ScopeEditorContainer2Version from "modules/scopes/scope-editor-2-0/scope-editor-2-0-container";

import { getFormattedScopeContainerTree } from "modules/scopes/scopes-editor/service";
interface IScopeDefinition {
    scopeItems: any;
    setScopeItems: any;
    scopeLabel?: string;
    selectedScope?: any;
    setIsRollUp?: any;
    setRollUpItems?: any;
}

const ScopeDefinitionV2 = ({
    scopeItems,
    setScopeItems,
    selectedScope,
    setIsRollUp,
    setRollUpItems,
}: IScopeDefinition) => {
    const dispatch = useAppDispatch();
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        return () => {
            setScopeItems([]);
            dispatch(dispatchActions.budgeting.clearCreateOrUpdateAltScope());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (searchText != undefined) {
            setScopeItems((state: any) => {
                let stateCopy = [...state];
                stateCopy?.map((category) => {
                    let categoryMatch = category.name?.toLowerCase()?.includes(searchText);
                    let subCategoryMatch = category.items.some((subCategory: any) =>
                        subCategory.name?.toLowerCase()?.includes(searchText),
                    );
                    category?.items?.map((subCategory: any) => {
                        let scopeItemMatch = subCategory?.scopes?.some((scopeData: any) =>
                            scopeData.name?.toLowerCase()?.includes(searchText),
                        );
                        category.isSelected = categoryMatch || subCategoryMatch || scopeItemMatch;
                    });
                });
                return stateCopy;
            });
        }
        if (searchText == "") {
            const scopeListFormatted = getFormattedScopeContainerTree(scopeItems);
            setScopeItems(scopeListFormatted);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    return (
        <ScopeEditorContainer2Version
            scopeItems={scopeItems}
            setScopeItems={setScopeItems}
            isFromInventory
            searchTextFromInv={searchText}
            setSearchTextFromInv={setSearchText}
            scopeData={selectedScope}
            setScopeData={() => {}}
            setIsRollUp={setIsRollUp}
            setRollUpInfo={setRollUpItems}
        />
    );
};

export default React.memo(ScopeDefinitionV2);
