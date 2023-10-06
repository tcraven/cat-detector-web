import { Auth as AmplifyAuth } from 'aws-amplify';

const getUser = async () => {
    try {
        const user = await AmplifyAuth.currentAuthenticatedUser();
        user.config = getUserConfig(user);
        return user;
    }
    catch (error) {
        return null;
    }
};

const getUserConfig = (user) => {
    try {
        const idTokenPayload = user.signInUserSession.idToken.payload;
        const configJsonStr = idTokenPayload['custom:config_json'];
        return JSON.parse(configJsonStr);
    }
    catch (error) {
        console.log('Auth.getUserConfig', error);
        return null;
    };
};

const signOut = () => {
    AmplifyAuth.signOut();
};

const redirectToSignInPage = () => {
    AmplifyAuth.federatedSignIn();
};

const getCredentials = async () => {
    try {
        const credentials = await AmplifyAuth.currentUserCredentials();
        return AmplifyAuth.essentialCredentials(credentials);
    }
    catch (error) {
        console.log('error', error);
        return null;
    }
};

export const Auth = {
    getCredentials,
    getUser,
    redirectToSignInPage,
    signOut
};
