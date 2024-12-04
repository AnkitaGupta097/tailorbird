import React from "react";
import Actions from "../../../../stores/actions";
import { graphQLClient as client } from "../../../../utils/gql-client";
import { initialState, initialErrors } from "./constants";
import { IHelperProps } from "./interfaces";
import {
    addNewMaterialItem,
    updateMaterial,
} from "../../../../queries/b2b-project/b2b-project-query";

export const isEmpty = (val: string) => {
    return val === "" || val === undefined || val === null ? true : false;
};
export const checkValue = (subcategories: Array<string>) => {
    return subcategories.map((subcat) => isEmpty(subcat));
};

export const handleSubmit = async (props: IHelperProps) => {
    let actions = Actions as any;
    const errors = {
        Subcategory: {
            ...props?.inputErrors.Subcategory,
            error: checkValue(props?.inputs.Subcategory),
        },
        UOM: { ...props?.inputErrors.UOM, error: isEmpty(props?.inputs.UOM) },
        Description: {
            ...props?.inputErrors.Subcategory,
            error: checkValue(props?.inputs.Description),
        },
        Category: {
            ...props?.inputErrors.Category,
            error: checkValue(props?.inputs.Category),
        },
    };
    props?.setInputErrors(errors);
    if (
        Object.values(errors).findIndex((obj) => obj.error === true) !== -1 ||
        errors.Subcategory.error.indexOf(true) !== -1 ||
        errors.Description.error.indexOf(true) !== -1 ||
        errors.Category.error.indexOf(true) !== -1
    ) {
        return;
    }

    const data = props?.inputs.Subcategory.map((subcategrory, index) => ({
        manufacturer: props?.inputs.Manufacturer,
        model_id: props?.inputs.ModelNumber,
        supplier: props?.inputs.Supplier,
        sku_id: props?.inputs.ItemNumber,
        subcategory: subcategrory, // String
        style: props?.inputs.Style,
        finish: props?.inputs.Finish,
        grade: props?.inputs.Grade,
        category: props?.inputs.Category[index],
        description: props?.inputs.Description[index], // String
        created_by: localStorage.getItem("email")?.split("@")[0] ?? "",
        user_id: localStorage.getItem("user_id") ?? "",
        version: props?.version ?? undefined,
        primary_thumbnail: props?.inputs?.primary_thumbnail,
    }));

    try {
        props?.setNoOfSubCats(1);
        props?.dispatch(actions.mdm.addNewSKUStart());
        const response = await client.mutate("addNewMaterialItem", addNewMaterialItem, {
            input: data,
        });

        props?.dispatch(actions.mdm.addNewSKUSuccess(response));
        if (response) {
            props?.onSubmit(response);
            props?.dispatch(
                actions.common.openSnack({
                    variant: "success",
                    message: " SKU successfully added to the package.",
                }),
            );
            closeHandler(props?.setCreateSKUModal);

            props?.setExpanded(true);
        } else {
            props?.dispatch(
                actions.common.openSnack({
                    variant: "error",
                    message: "Failed to add SKU to the package",
                }),
            );
        }
    } catch (err: any) {
        let message =
            err?.graphQLErrors?.[0]?.extensions?.response?.body?.error?.description ===
            "Material already exists in the database"
                ? "SKU already exists"
                : null;
        props?.dispatch(
            actions.common.openSnack({
                variant: "error",
                message: message ?? "Failed to add SKU to the package",
            }),
        );
        props?.dispatch(actions.mdm.addNewSKUFailure());
    } finally {
        reset(props?.setInputs, props?.setLink, props?.setInputErrors);
    }
};
const reset = (
    setInputs: React.Dispatch<React.SetStateAction<any>>,
    setLink: React.Dispatch<React.SetStateAction<string>>,
    setInputErrors?: React.Dispatch<React.SetStateAction<any>>,
) => {
    setInputs(initialState);
    setLink("");
    setInputErrors?.(initialErrors);
};

export const closeHandler = (setCreateSKUModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    setCreateSKUModal(false);
};

export const handleMaterialUpdate = async (props: any) => {
    const data = {
        id: props?.id,
        style: props?.style,
        finish: props?.finish,
        grade: props?.grade,
        description: props?.description, // String
        updated_by: localStorage.getItem("email")?.split("@")[0] ?? "",
    };
    try {
        const response = await client.mutate("updateMaterial", updateMaterial, {
            input: data,
        });
        if (response) {
            console.log("success");
        }
    } catch (err: any) {
        console.log("err", err);
    }
};
