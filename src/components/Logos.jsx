import cardinalPeakLogo from './images/cardinal-peak-logo.jpg';

export const Logos = () => {
    return (
        <div className="logos-container">
            <a
                href="https://www.cardinalpeak.com"
                target="_blank"
                rel="noreferrer"
            >
                <img
                    className="cardinal-peak-logo"
                    src={cardinalPeakLogo}
                    alt="Developed by Cardinal Peak"
                />
            </a>
            <a
                href="https://aws.amazon.com/what-is-cloud-computing"
                target="_blank"
                rel="noreferrer"
            >
                <img
                    className="aws-logo"
                    src="https://d0.awsstatic.com/logos/powered-by-aws.png"
                    alt="Powered by AWS Cloud Computing"
                />
            </a>
        </div>
    );
};
