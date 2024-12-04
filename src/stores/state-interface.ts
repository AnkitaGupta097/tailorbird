export interface IState {
    loading: boolean;
    error: IError;
}

interface IError {
    type: string;
    msg: string;
    statusCode: number;
}
