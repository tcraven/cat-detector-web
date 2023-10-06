import { Amplify, Auth as AmplifyAuth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';

const AWS_REGION = 'us-west-2';
const OAUTH_REDIRECT_URL = 'https://tcraven.github.io/cat-detector-web/';
// const OAUTH_REDIRECT_URL = 'http://localhost:3000/';

const config = {
    iot: {
        clientIdPrefix: 'tjc-client-',
        endpoint: 'wss://a1i76m5vdp3b1-ats.iot.us-west-2.amazonaws.com/mqtt',
    },
    cognito: {
        identityPoolId: 'us-west-2:7e451140-a1aa-44a2-af36-1bc89f2fce57',
        region: AWS_REGION,
        userPoolId: 'us-west-2_HWngHemyi',
        userPoolWebClientId: '337gen4ohqf8fru78ss7fe02n4'
    },
    oauth: {
        domain: 'cat-detector.auth.us-west-2.amazoncognito.com',
        scope: [ 'email', 'openid', 'phone', 'profile' ],
        redirectSignIn: OAUTH_REDIRECT_URL,
        redirectSignOut: OAUTH_REDIRECT_URL,
        responseType: 'code'
    }
};

const getRandomId = () => {
    return Math.random().toString(36).substring(7);
};

/**
 * Configures the Amplify and Auth modules to enable Cognito login,
 * IoT publish and subscribe, and getting AWS credentials.
 */
const configure = () => {
    Amplify.configure({ Auth: config.cognito });
    AmplifyAuth.configure({ oauth: config.oauth });
    const iotClientId = config.iot.clientIdPrefix + getRandomId();
    Amplify.addPluggable(
        new AWSIoTProvider({
            aws_pubsub_region: AWS_REGION,
            aws_pubsub_endpoint: config.iot.endpoint,
            clientId: iotClientId
        })
    );
};

export const Config = {
    AWS_REGION,
    configure,
    getRandomId
};
