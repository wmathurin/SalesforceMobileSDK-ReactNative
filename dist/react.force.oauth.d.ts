import { UserAccount } from "./specs/SFOauthSpec";
export declare const authenticate: () => Promise<UserAccount>;
export declare const getAuthCredentials: () => Promise<UserAccount>;
export declare const logout: () => Promise<void>;
