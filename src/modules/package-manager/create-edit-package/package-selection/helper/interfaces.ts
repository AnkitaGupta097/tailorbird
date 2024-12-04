import { GridRenderCellParams } from "@mui/x-data-grid";
import { ILabor, IMaterialPackage } from "modules/package-manager/interfaces";
import { Dispatch, SetStateAction } from "react";

export interface IImageUploaderDialog {
    isImageUploaderOpen: boolean;
    setIsImageUploaderOpen: Dispatch<SetStateAction<boolean>>;
    materialData?: Record<string, any>;
    setActiveRow?: Dispatch<SetStateAction<{}>>;
    setNewPackageMaterialsData?: Dispatch<SetStateAction<(IMaterialPackage | ILabor)[]>>;
    setManualThumbnailUrl?: Dispatch<SetStateAction<string>>;
}

export interface ICustomTypographyProps {
    property: string;
    value: string | undefined | null;
}

export interface IThumbnailRenderer {
    params: GridRenderCellParams<any, any, any>;
    setActiveRow: Dispatch<SetStateAction<{}>>;
    setIsImageUploaderOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IDeleteMaterial {
    row: {
        id: string;
        setMaterialsData: Function;
        category: string;
        subcategory: string;
        manufacturer?: string;
        model_id?: string;
        supplier?: string;
        description: string;
        grade?: string;
        style?: string;
        finish?: string;
    };
}

export type TdeleteMaterialResponse = { material_id: string };
