import type { TurboModule } from 'react-native';
export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
export type FileParam = {
    fileMimeType: string;
    fileUrl: string;
    fileName: string;
};
export type NetworkRequestArgs = {
    endPoint: string;
    path: string;
    method: HttpMethod;
    queryParams?: Record<string, any>;
    headerParams?: Record<string, any>;
    fileParams?: Record<string, FileParam>;
    returnBinary?: boolean;
    doesNotRequireAuthentication?: boolean;
};
export type NetworkResponse = {
    data?: any;
    headers?: Record<string, string>;
    statusCode?: number;
    error?: string;
};
export interface Spec extends TurboModule {
    sendRequest(endPoint: string, path: string, method: HttpMethod, queryParams?: {
        [key: string]: any;
    } | null | undefined, headerParams?: {
        [key: string]: any;
    } | null | undefined, fileParams?: {
        [key: string]: FileParam;
    } | null | undefined, returnBinary?: boolean | null | undefined, doesNotRequireAuthentication?: boolean | null | undefined): Promise<any>;
}
declare const _default: Spec;
export default _default;
