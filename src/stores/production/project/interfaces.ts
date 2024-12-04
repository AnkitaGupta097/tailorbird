export interface IProject {
    projectId: string;
    subscription: any;
    constants: any;
    featureAccess: string[];
    loading: boolean;
    accessDenied?: boolean;
}
