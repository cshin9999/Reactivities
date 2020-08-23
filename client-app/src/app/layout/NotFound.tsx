import React from 'react'
import { Segment, Header, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Oops - we've looked everywhere but couldn't find this
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' primary>
                    Return to Activities Page
                </Button>
            </Segment.Inline>
        </Segment>
    );
};

export default NotFound;