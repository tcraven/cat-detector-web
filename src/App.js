import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Auth } from './cat-detector/Auth';
import { Config } from './cat-detector/Config';
import { Iot } from './cat-detector/Iot';
import { WebRtc } from './cat-detector/WebRtc';

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
        <div>

            <button onClick={signOut}>
                Log Out
            </button>

            { isCatDetected && (
                <div>CAT DETECTED</div>
            ) }
            
            <video
                ref={videoElRef}
                id="video"
                autoPlay={true}
                playsInline={true}
                controls={true}
            ></video>

            { !isVideoPlaying ? (
                <button onClick={startVideo}>
                    Start Video
                </button>
            ) : (
                <button onClick={stopVideo}>
                    Stop Video
                </button>
            ) }

        </div>
    );
};

export default App;
