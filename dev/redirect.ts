import MsalWrapper, { Configuration, AuthenticationParameters } from "../src/MsalWrapper";

const msalConfiguration: Configuration = {
    auth: {
        clientId: "6cd834ae-5dda-4fa6-b55d-efb32854f4f1"
    }
};

const msalWrapper = new MsalWrapper(msalConfiguration);

console.log("Redirect");