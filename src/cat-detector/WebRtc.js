import { Role, SignalingClient } from 'amazon-kinesis-video-streams-webrtc';
import { KinesisVideo, KinesisVideoSignalingChannels } from 'aws-sdk';
import { Auth } from './Auth';
import { Config } from './Config';

let signalingClient = null;
let peerConnection = null;
let stream = null;

const startVideo = async (options) => {
    console.log('startVideo');

    const { onConnectionStateChange, thingName, videoEl } = options;

    // Stop the viewer if it is running
    stopVideo({ videoEl: videoEl });

    // Get user credentials
    const credentials = await Auth.getCredentials();

    // Create KVS client
    const kvClient = new KinesisVideo({
        region: Config.AWS_REGION,
        credentials: credentials,
        correctClockSkew: true
    });

    // Get signaling channel ARN
    const dscResp = await kvClient
        .describeSignalingChannel({ ChannelName: thingName })
        .promise();

    console.log('describeSignallingChannel response:', dscResp);

    const channelArn = dscResp.ChannelInfo.ChannelARN;

    // Get signaling channel endpoints
    const sceResp = await kvClient
        .getSignalingChannelEndpoint({
            ChannelARN: channelArn,
            SingleMasterChannelEndpointConfiguration: {
                Protocols: [ 'WSS', 'HTTPS' ],
                Role: Role.VIEWER
            }
        })
        .promise();

    console.log('getSignalingChannelEndpoint response:', sceResp);

    const endpointsByProtocol = sceResp.ResourceEndpointList.reduce(
        (endpoints, endpoint) => {
            endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            return endpoints;
        },
        {}
    );

    console.log('endpointsByProtocol:', endpointsByProtocol);

    const scClient = new KinesisVideoSignalingChannels({
        region: Config.AWS_REGION,
        credentials: credentials,
        endpoint: endpointsByProtocol.HTTPS,
        correctClockSkew: true
    });

    // Get ICE server configuration
    const iscResp = await scClient
        .getIceServerConfig({ ChannelARN: channelArn })
        .promise();

    console.log('getIceServerConfig response:', iscResp);

    const iceServers = [];
    iceServers.push({ urls: `stun:stun.kinesisvideo.${Config.AWS_REGION}.amazonaws.com:443` });
    iscResp.IceServerList.forEach((iceServer) => {
        iceServers.push({
            urls: iceServer.Uris,
            username: iceServer.Username,
            credential: iceServer.Password
        });
    });
    console.log('iceServers:', iceServers);

    // Create Signaling Client
    signalingClient = new SignalingClient({
        channelARN: channelArn,
        channelEndpoint: endpointsByProtocol.WSS,
        clientId: Config.getRandomId(),
        role: Role.VIEWER,
        region: Config.AWS_REGION,
        credentials: credentials,
        systemClockOffset: kvClient.config.systemClockOffset
    });

    peerConnection = new RTCPeerConnection({
        iceServers,
        iceTransportPolicy: 'all'
    });

    signalingClient.on('open', async () => {
        console.log('signalingClient open');

        // Create an SDP offer to send to the master
        console.log('Creating SDP offer');
        await peerConnection.setLocalDescription(
            await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            })
        );

        // Trickle ICE is enabled - send the offer now and then send
        // ICE candidates as they are generated
        console.log('Sending SDP offer');
        console.debug('localDescription:', peerConnection.localDescription);
        signalingClient.sendSdpOffer(peerConnection.localDescription);

        console.log('Generating ICE candidates');
    });

    signalingClient.on('sdpAnswer', async (answer) => {
        console.log('signalingClient sdpAnswer:', answer);
        // Add the SDP answer to the peer connection
        await peerConnection.setRemoteDescription(answer);
    });

    signalingClient.on('iceCandidate', (candidate) => {
        console.log('signalingClient iceCandidate:', candidate);
        // Add the ICE candidate received from the MASTER to
        // the peer connection
        peerConnection.addIceCandidate(candidate);
    });

    signalingClient.on('close', () => {
        console.log('signalingClient close');
    });

    signalingClient.on('error', (error) => {
        console.error('signalingClient error:', error);
    });

    // Send any ICE candidates to the other peer
    peerConnection.addEventListener('icecandidate', ({ candidate }) => {
        console.log('peerConnection icecandidate:', candidate);
        if (candidate) {
            // Trickle ICE is enabled. Send the ICE candidates as
            // they are generated
            console.log('Sending ICE candidate');
            signalingClient.sendIceCandidate(candidate);
        }
    });

    peerConnection.addEventListener('connectionstatechange', async (event) => {
        console.log('peerConnection connectionstatechange:', event);
        onConnectionStateChange(peerConnection.connectionState);
    });

    // As tracks are received, add them to the view
    peerConnection.addEventListener('track', (event) => {
        console.log('peerConnection track:', event);
        if (videoEl.srcObject) {
            return;
        }
        stream = event.streams[0];
        videoEl.srcObject = stream;
    });

    console.log('Opening signaling client connection');
    signalingClient.open();
};

const stopVideo = (options) => {
    console.log('stopVideo');

    const { videoEl } = options;

    if (signalingClient) {
        signalingClient.close();
        signalingClient = null;
    }

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    if (stream) {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
        stream = null;
    }

    videoEl.srcObject = null;
};


export const WebRtc = {
    startVideo,
    stopVideo
};
