import architectureImage from './images/cat-detector-architecture.jpg';

export const Tech = () => {
    return (
        <div>
            <a href={architectureImage} target="_blank" rel="noreferrer">
                <img
                    className="architecture-diagram"
                    alt="Cat Detector architecture"
                    src={architectureImage}
                />
            </a>

            <h2>Overview</h2>
            <p>The Cat Detector is an IoT application that uses machine learning to
                detect cats in a Raspberry Pi camera. It consists of two components - an
                IoT application running on the Pi, and a website hosted in the cloud.</p>

            <h3>Raspberry Pi IoT Application</h3>
            <p>The Cat Detector is an AWS IoT Greengrass application that runs continuously
                on the Pi as a set of background processes. It has the following
                components:</p>

            <h4>Greengrass Nucleus</h4>
            <p>The main controller for the other components. This is a standard AWS Greengrass
                component that handles starting and stopping the other components,
                configuration, logging, component software updates, etc.</p>

            <h4>Video Source</h4>
            <p>This component streams video from the Pi camera using a GStreamer pipeline,
                and shares it with the other components via two separate copies of the original
                stream, each having different formats:</p>
            <ul>
                <li>
                    <p>The first stream sends 640 x 360 resolution 25 frames per second I420 BT.601
                        raw video to the WebRTC Client component</p>
                </li>
                <li>
                    <p>The second stream sends 640 x 360 resolution one frame per second RGB
                        1:1:16:4 raw video to the Object Detector component</p>
                </li>
            </ul>
            <p>This component is a bash script that uses the <code>gst-launch-1.0</code> command to
                create the GStreamer pipeline. It uses hardware acceleration to reduce the
                load on the Pi CPU.</p>

            <h4>WebRTC Client</h4>
            <p>The WebRTC Client component accepts WebRTC calls from the Website video player
                via the AWS Kinesis video service. When a call is started, it starts its own
                GStreamer pipeline using the Video Source as its source, and converts the
                video into the required H.264 format, using hardware acceleration.</p>
            <p>The component is a C application, based on an example application from
                the AWS Kinesis WebRTC C SDK. When a call ends, the component releases its
                resources so that it is ready to accept the next call.</p>

            <h4>Object Detector</h4>
            <p>This component is responsible for detecting cats in the video. It is a Python
                application that reads RGB video frames from the second Video Source stream
                once per second. Frames are classified using a machine learning model,
                and if a cat is detected, a message is published to an IoT MQTT topic and to
                an internal Greengrass IPC topic. These messages are picked up by the Website
                and Audio Player component respectively.</p>
            <p>The machine learning model used is a pre-trained ResNet50 model running on the
                PyTorch Torchvision library. Each classification takes approximately 2.5
                seconds to run on the Pi, and only one classification runs at a time. This
                means that one in every three video frames is classified, and there there is a
                delay of approximately five seconds between the cat being put in the Pi camera
                view, and the publish of the detection message.</p>

            <h4>Audio Player</h4>
            <p>The Audio Player component is responsible for playing a short audio clip each
                time a cat is detected. It subscribes to a local Greengrass IPC topic, and when
                a cat detection message is received, it plays a WAV file through a speaker
                plugged in to the Pi headphones jack.</p>

            <h3>Cloud Components</h3>

            <h4>Website</h4>
            <p>The website is a static web application written in React. It uses the AWS
                Amplify SDK and AWS Kinesis WebRTC SDK libraries, and is hosted via Github
                Pages.</p>
            <p>It has four main features:</p>
            <ul>
                <li>
                    <p>A video player that allows users to view the live video from the
                        Raspberry Pi camera. It works by starting a WebRTC call with the WebRTC Client
                        component on the Pi, via the AWS Kinesis Video service</p>
                </li>
                <li>
                    <p>When a cat is detected, a cat image pops up above the video player. This
                        function works as follows: when the page loads, it connects to AWS IoT and
                        subscribes to an MQTT topic. When the Object Detector
                        component on the Pi detects a cat, it sends a message on this topic that is
                        received by the web page</p>
                </li>
                <li>
                    <p>Users are authenticated using AWS Cognito, and must sign in via a Cognito
                        hosted login page. Once signed in, the Cognito session provides the necessary
                        AWS credentials for the web page to authenticate to the AWS IoT and AWS Kinesis
                        WebRTC services.</p>
                </li>
                <li>
                    <p>An information section displays instructions how to use the demo,
                        technical information about the architecture of the Cat Detector application,
                        and information about Cardinal Peak</p>
                </li>
            </ul>
            
            <h4>AWS Greengrass</h4>
            <p>The initial set-up and configuration of the Pi, and subsequent component
                software updates are performed manually using a combination of the AWS
                Console and running local Greengrass CLI commands.</p>

            <h4>AWS Kinesis Video Signaling Channels</h4>
            <p>This service is used for the WebRTC video calls, but no manual configuration
                steps are necessary. The AWS Console can be used for debugging
                and development.</p>

            <h4>AWS Cognito</h4>
            <p>User authentication is handled AWS Cognito. A User Pool is configured to
                provide a hosted login page for the application. A corresponding Identity Pool
                is used to authorize Cognito sessions to access the necessary resources in AWS
                IoT and AWS Kinesis Video services.</p>

            <h4>IAM Roles and Profiles</h4>
            <p>The
                Cognito Identity Pool has an authenticated access role attached, which has a
                policy to allow access to IoT and Kinesis Video. Only the minimum necessary
                permissions are granted.</p>
            <p>The Pi gets the necessary access to Greengrass, IoT and Kinesis Video via a
                policy attached to its IoT certificate.</p>

        </div>
    );
};
