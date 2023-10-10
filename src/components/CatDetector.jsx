import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BoxArrowRight, PlayFill, StopFill } from 'react-bootstrap-icons';
import { Logos } from './Logos';
import backgroundImage from './images/rainbow-swirl.jpg';
import catImage1 from './images/cat-1.webp';
import catImage2 from './images/cat-2.webp';

export const CatDetector = (props) => {
    const {
        isCatDetected,
        isVideoPlaying,
        signOut,
        startVideo,
        stopVideo,
        videoElRef
    } = props;

    const [ detectionCounter, setDetectionCounter ] = useState(0);
    
    // Each time isCatDetected changes and is true, increment the counter
    // that is used to choose which cat image to display
    useEffect(() => {
        if (isCatDetected) {
            setDetectionCounter(dc => dc + 1);
        }
    },
    [ isCatDetected ]);

    const catContainerClassName = isCatDetected ?
        'cat-container' : 'cat-container cat-container-hidden';

    const catImage = (detectionCounter % 2 === 0) ? catImage2 : catImage1;

    return (
        <div className="cat-detector-container">

            <h1 className="title">Cat Detector</h1>

            <div>
                <div className={catContainerClassName}>
                    <img
                        className="background-image"
                        src={backgroundImage}
                        alt=""
                    />
                    <img
                        className="cat-image"
                        src={catImage}
                        alt=""
                    />
                </div>
                <video
                    ref={videoElRef}
                    id="video"
                    autoPlay={true}
                    playsInline={true}
                    controls={true}
                ></video>
            </div>

            <div className="video-text-container">
                Place a cat in the camera view!
            </div>

            <div className="buttons-container">
                { !isVideoPlaying ? (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={startVideo}
                    >
                        <PlayFill className="button-icon" />
                        Start Video
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={stopVideo}
                    >
                        <StopFill className="button-icon" />
                        Stop Video
                    </Button>
                ) }
            </div>

            <Logos />

            <div className="sign-out-container">
                <Button
                    variant="light"
                    size="sm"
                    onClick={signOut}
                >
                    <BoxArrowRight className="button-icon button-icon-sign-out" />
                    <div className="sign-out-text d-none d-sm-inline-block">
                        Sign Out
                    </div>
                </Button>
            </div>

        </div>
    );
};
