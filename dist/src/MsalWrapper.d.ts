import * as Msal from "msal";
declare class MsalWrapper {
    private _userAgentApplication;
    private _resolve;
    private _reject;
    private _requestType;
    private _basicConfiguration;
    private _basicLoginRequest;
    constructor(configuration: Msal.Configuration);
    acquireAccessToken: (accessTokenRequest: Msal.AuthenticationParameters, loginTokenRequest?: Msal.AuthenticationParameters) => Promise<Msal.AuthResponse>;
    acquireLoginToken: (request?: Msal.AuthenticationParameters) => Promise<Msal.AuthResponse>;
    private _authRedirectCallBack;
    private _requiresInteraction;
    private _acquireAccessTokenInternal;
}
export { Configuration, AuthenticationParameters } from "msal";
export default MsalWrapper;
