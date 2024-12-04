import { IBaseState } from "stores/common/models/base-state";

export interface ITags {
    file_size: number;
    is_archive: boolean;
    is_cover_image?: boolean;
    projectId?: string;
}
export interface IFileDetails {
    id: number;
    file_name: string;
    created_by: string;
    created_at: string;
    tags: ITags;
    is_active: boolean;
    file_type: string;
}

export interface IUploadFileDetails {
    file_name: string;
    loading: boolean;
    error: string;
    data: any;
}
export interface IFileUtility extends IBaseState {
    uploadDetails: IUploadFileDetails[];
    fileDetails: IFileDetails[];
    finalistFiles: IFileDetails[];
    archivedFiles: IFileDetails[];
    imageFiles?: any[];
    downloadingFiles?: boolean;
    downloadingError?: boolean;
}
