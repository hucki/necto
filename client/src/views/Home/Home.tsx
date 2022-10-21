import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import ApprovalPanel from '../../components/InfoPanel/ApprovalPanel';
import NewUserPanel from '../../components/InfoPanel/NewUserPanel';
import { NotificationCount } from '../../components/Library/Messages';
import { useLeavesByStatus } from '../../hooks/events';
import { useAllUsers } from '../../hooks/user';
import { AuthContext } from '../../providers/AuthProvider';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { users } = useAllUsers();
  const { rawEvents: events } = useLeavesByStatus('requested');
  const uniqueEvents = events.filter(
    (event) => event.rrule === '' || !event.parentEventId
  );
  const newUsers = users.filter((user) => !user?.permissions?.length);

  return (
    <>
      <div className="home-wrapper" style={{ padding: '0 0.25rem 0 0.25rem' }}>
        <Accordion allowMultiple>
          {(user?.isAdmin || user?.isPlanner) && (
            <AccordionItem isDisabled={newUsers.length < 1}>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    display="flex"
                    flexDirection="row"
                  >
                    <span>neue User</span>
                    <NotificationCount count={newUsers.length}>
                      {newUsers.length}
                    </NotificationCount>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <NewUserPanel newUsers={newUsers} />
              </AccordionPanel>
            </AccordionItem>
          )}
          {(user?.isAdmin || user?.isPlanner) && (
            <AccordionItem isDisabled={uniqueEvents.length < 1}>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    display="flex"
                    flexDirection="row"
                  >
                    <span>offene Anträge</span>
                    <NotificationCount count={uniqueEvents.length}>
                      {uniqueEvents.length}
                    </NotificationCount>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <ApprovalPanel events={uniqueEvents} />
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </>
  );
};

export default Home;
