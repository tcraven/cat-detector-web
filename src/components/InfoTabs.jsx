import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { About } from './About';
import { Info } from './Info';
import { Tech } from './Tech';

export const InfoTabs = () => {
    const Page = {
        INFO: 'INFO',
        TECH: 'TECH',
        ABOUT: 'ABOUT'
    };
    
    return (
        <div className="info">
            <Tab.Container defaultActiveKey={Page.INFO}>
                <Nav variant="underline" justify={true}>
                    <Nav.Item>
                        <Nav.Link eventKey={Page.INFO}>How to Use</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={Page.TECH}>How it Works</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={Page.ABOUT}>Cardinal Peak</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey={Page.INFO}>
                        <Info />
                    </Tab.Pane>
                    <Tab.Pane eventKey={Page.TECH}>
                        <Tech />
                    </Tab.Pane>
                    <Tab.Pane eventKey={Page.ABOUT}>
                        <About />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    );
};
