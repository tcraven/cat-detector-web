import { Hub, PubSub } from 'aws-amplify';
import { CONNECTION_STATE_CHANGE } from '@aws-amplify/pubsub';

const subscribe = (options) => {
    const { onMessage, thingName } = options;

    // The PubSub module retries automatically if a connection error occurs
    const topic = `devices/${thingName}/cat-detector/state-change`;
    PubSub.subscribe(topic).subscribe({
        next: (data) => {
            console.log('PubSub.next', data);
            onMessage(data.value);
        },
        error: (error) => {
            console.log('PubSub.error', error);
        },
        complete: () => {
            console.log('PubSub.complete');
        },
    });

    Hub.listen('pubsub', (event) => {
        const { payload } = event;
        if (payload.event === CONNECTION_STATE_CHANGE) {
            const connectionState = payload.data.connectionState;
            console.log('PubSub.connectionStateChange', connectionState, event);
        }
    });
};

export const Iot = {
    subscribe
};
