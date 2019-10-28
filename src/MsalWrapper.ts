import * as Msal from "msal";

enum TokenRequestType {
    LoginToken,
    AccessToken
}

class MsalWrapper {
    private _userAgentApplication: Msal.UserAgentApplication;
    private _resolve: (value?: Msal.AuthResponse) => void;
    private _reject: (value?: any) => void;
    private _requestType: TokenRequestType;

    private _basicConfiguration: Msal.Configuration = {
        auth: {
            clientId: null,
            validateAuthority: true
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: false
        },
        system: {
            loadFrameTimeout: 30000
        }
    };
    private _basicLoginRequest: Msal.AuthenticationParameters = {
        scopes: ["openid", "User.Read"],
        prompt: "login"
    }

    constructor(configuration: Msal.Configuration) {
        if (!configuration.auth.clientId)
            throw "ClientId has to be set";

        const mergedConfiguration = Object.assign(this._basicConfiguration, configuration);
        this._userAgentApplication = new Msal.UserAgentApplication(mergedConfiguration);
        this._userAgentApplication.handleRedirectCallback(this._authRedirectCallBack);
    };

    acquireAccessToken = (request: Msal.AuthenticationParameters): Promise<Msal.AuthResponse> => {
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this._requestType = TokenRequestType.AccessToken;
            this._acquireAccessTokenInternal(request);
        });
    };

    acquireLoginToken = (request?: Msal.AuthenticationParameters): Promise<Msal.AuthResponse> => {
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this._requestType = TokenRequestType.LoginToken;
            const mergedLoginRequest = Object.assign(this._basicLoginRequest, request);
            this._userAgentApplication
                .loginPopup(mergedLoginRequest)
                .then((loginResponse) => {
                    this._resolve(loginResponse);
                })
                .catch((error) => {
                    this._reject(error);
                });
        });
    };

    private _authRedirectCallBack = (error: Msal.AuthError, response?: Msal.AuthResponse) => {
        console.log("Authorization redirect fired");
        if (error) {
            console.log(error);
        } else {
            if (response.tokenType === "id_token") {
                if (this._requestType === TokenRequestType.AccessToken)
                    this._acquireAccessTokenInternal({ scopes: response.scopes });
                else
                    this._resolve(response);
            } else if (response.tokenType === "access_token") {
                this._resolve(response);
            } else {
                console.log("token type is:" + response.tokenType);
            }
        }
    };

    private _requiresInteraction = (errorMessage) => {
        if (!errorMessage || !errorMessage.length) {
            return false;
        }
        console.log(errorMessage);
        return (
            errorMessage.indexOf("consent_required") !== -1 ||
            errorMessage.indexOf("interaction_required") !== -1 ||
            errorMessage.indexOf("login_required") !== -1
        );
    };

    private _acquireAccessTokenInternal = (request: Msal.AuthenticationParameters) => {
        this._userAgentApplication
            .loginPopup(this._basicLoginRequest)
            .then(() => {
                this._userAgentApplication
                    .acquireTokenSilent(request)
                    .then((tokenResponse) => {
                        this._resolve(tokenResponse);
                    })
                    .catch((error) => {
                        if (this._requiresInteraction(error.errorCode)) {
                            this._userAgentApplication
                                .acquireTokenPopup(request)
                                .then((tokenResponse) => {
                                    this._resolve(tokenResponse);
                                })
                                .catch((error) => {
                                    this._reject(error);
                                });
                        }
                        else
                            this._reject(error);
                    });
            })
            .catch((error) => {
                this._reject(error);
            });

    };
}

export { Configuration, AuthenticationParameters } from "msal";
export default MsalWrapper;