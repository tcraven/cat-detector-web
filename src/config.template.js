// Save this file as config.js and enter configuration values from
// your Terraform deployment

const OAUTH_REDIRECT_URL = (
    (process.env.NODE_ENV === 'production') ?
    '<oauth-redirect-url>' :
    'http://localhost:3000/'
);

const AWS_REGION = 'us-west-2';

export const config = {
    region: AWS_REGION,
    iot: {
        clientIdPrefix: 'cat-detector-client-',
        endpoint: '<iot-wss-endpoint>',
    },
    cognito: {
        identityPoolId: '<identity-pool-id>',
        region: AWS_REGION,
        userPoolId: '<user-pool-id>',
        userPoolWebClientId: '<user-pool-client-id>'
    },
    oauth: {
        domain: '<cognito-domain>',
        scope: [ 'email', 'openid', 'phone', 'profile' ],
        redirectSignIn: OAUTH_REDIRECT_URL,
        redirectSignOut: OAUTH_REDIRECT_URL,
        responseType: 'code'
    }
};
