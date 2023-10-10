export const Info = () => {
    return (
        <div>
            <ul>
                <li>
                    Ensure that the Cat Detector Raspberry Pi is up and running
                    and connected to Wi-Fi
                </li>
                <li>Click the Start Video button to show video from the Pi</li>
                <li>
                    Place a cat image in view of the camera and wait
                    approximately five seconds
                </li>
                <li>
                    The Pi will play a meow sound, and the web page will show
                    that a cat is detected
                </li>
                <li>
                    Click the Stop Video button to disconnect from the video
                    feed
                </li>
                <li>
                    Cat detection runs on the Pi (at the edge), so it continues
                    to work if the video is not being viewed, and even if
                    the Pi doesn't have a working internet connection
                </li>
            </ul>
        </div>
    );
};
