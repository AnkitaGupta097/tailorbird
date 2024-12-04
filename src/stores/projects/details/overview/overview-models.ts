import { IBaseState } from "../../../common/models/base-state";
export interface IProjectOverview extends IBaseState {
    uploadFileDetails: IUploadFileDetails;
    dataSource: any;
    downloadLink: any;
    dataSourceList: any;
    dataSourceUploadStatus: any;
    rentRoll: any;
    rentRollDb: any;
    rentRollDownloadLink: any;
}
export interface IUploadFileDetails extends IBaseState {
    uploadDetails: any;
}
