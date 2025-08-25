import type { TurboModule } from 'react-native';
export type UserAccount = {
    accessToken: string;
    clientId: string;
    instanceUrl: string;
    loginUrl: string;
    orgId: string;
    refreshToken: string;
    userAgent: string;
    userId: string;
    communityId?: string;
    communityUrl?: string;
};
export interface Spec extends TurboModule {
    authenticate(): Promise<UserAccount>;
    getAuthCredentials(): Promise<UserAccount>;
    logoutCurrentUser(): Promise<void>;
}
declare const _default: Spec;
export default _default;
