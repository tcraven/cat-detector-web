import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Auth } from './cat-detector/Auth';
import { Config } from './cat-detector/Config';
import { Iot } from './cat-detector/Iot';
import { WebRtc } from './cat-detector/WebRtc';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CatDetector } from './components/CatDetector';
import { InfoTabs } from './components/InfoTabs';

const App = () => {
    const [ isCatDetected, setIsCatDetected ] = useState(false);
    const [ isVideoPlaying, setIsVideoPlaying ] = useState(false);
    const [ user, setUser ] = useState(null);
    const videoElRef = useRef(null);

    const isLoading = () => {
        return (user === null);
    };

    const startVideo = () => {
        WebRtc.startVideo({
            thingName: user.config.thingName,
            videoEl: videoElRef.current,
            onConnectionStateChange: (connectionState) => {
                console.log('onConnectionStateChange:', connectionState);
                if (connectionState === 'connected') {
                    setIsVideoPlaying(true);
                }
                if ([ 'closed', 'failed' ].includes(connectionState)) {
                    setIsVideoPlaying(false);
                }
            }
        });
    };

    const stopVideo = () => {
        WebRtc.stopVideo({
            videoEl: videoElRef.current
        });
        setIsVideoPlaying(false);
    };

    const signOut = () => {
        stopVideo();
        Auth.signOut();
    };

    // Runs once when app is ready
    useEffect(() => {
        const onReady = async () => {
            console.log('onReady');

            Config.configure();

            const user = await Auth.getUser();
            if (!user) {
                Auth.redirectToSignInPage();
                return;
            }

            setUser(user);

            Iot.subscribe({
                thingName: user.config.thingName,
                onMessage: (messageDict) => {
                    console.log('onMessage', messageDict);
                    setIsCatDetected(messageDict.frame_is_cat_detected);
                }
            });

            console.log('user', user);
        };
        onReady();
    }, []);

    if (isLoading()) {
        return (
            <div></div>
        );
    }

    return (
        <Container>
            <Row xs={1} lg={2}>
                <Col>
                    <CatDetector
                        isCatDetected={isCatDetected}
                        isVideoPlaying={isVideoPlaying}
                        signOut={signOut}
                        startVideo={startVideo}
                        stopVideo={stopVideo}
                        videoElRef={videoElRef}
                    />
                </Col>
                <Col>
                    <InfoTabs />
                </Col>
            </Row>
            <hr />
            <div className="footer">
                &copy; 2023 Cardinal Peak
            </div>
        </Container>
    );
};

export default App;
