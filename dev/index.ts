import MsalWrapper, { Configuration, AuthenticationParameters } from "../src/MsalWrapper";
import * as $ from "jquery";

const msalConfiguration: Configuration = {
    auth: {
        clientId: "6cd834ae-5dda-4fa6-b55d-efb32854f4f1",
        redirectUri: "http://localhost:8080/redirect"
    }
};

const tokenRequest: AuthenticationParameters = {
    scopes: ["User.Read"]
};


$(".acquireAccessToken").click(() => {
    const msalWrapper = new MsalWrapper(msalConfiguration);
    msalWrapper.acquireAccessToken(tokenRequest)
        .then(accessTokenReponse => {
            console.log("Access Token Response", accessTokenReponse);
            alert("Access token acquired");
        })
        .catch(error => {
            console.log(error);
        });
});

$(".acquireLoginToken").click(() => {
    const msalWrapper = new MsalWrapper(msalConfiguration);    
    msalWrapper.acquireLoginToken()
        .then(loginTokenReponse => {
            console.log("Login Response Token", loginTokenReponse);
            alert("Login token acquired");
        })
        .catch(error => {
            console.log(error);
        });
});



console.log("Index");
