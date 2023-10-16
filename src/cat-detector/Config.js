import { Amplify, Auth as AmplifyAuth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { config } from '../config';

const AWS_REGION = config.region;

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
