import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ApprovalPanel from '../../components/molecules/InfoPanel/ApprovalPanel';
import NewUserPanel from '../../components/molecules/InfoPanel/NewUserPanel';
import { Greeting, NotificationCount } from '../../components/Library/Messages';
import { useLeavesByStatus } from '../../hooks/events';
import { useAllUsers } from '../../hooks/user';
import { AuthContext } from '../../providers/AuthProvider';
import { isAuthorized } from '../../config/home';
import { useEmployee } from '../../hooks/employees';
import { TimeSheet } from '../../components/organisms/Employee/TimeSheet';

const Home = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { users } = useAllUsers();
  const now = dayjs(new Date());
  const { rawEvents: requestedLeaves } = useLeavesByStatus('requested');
  const uniqueRequestedLeaves = requestedLeaves.filter(
    (event) => event.rrule === '' || !event.parentEventId
  );
  const newUsers = users.filter((user) => !user?.permissions?.length);
  const timeOfDay = now.isBetween(now.hour(0), now.hour(11), 'hour')
    ? 'morning'
    : now.isBetween(now.hour(10), now.hour(18), 'hour')
    ? 'day'
    : 'evening';

  const { employee } = useEmployee(user?.employeeId);

  return (
    <>
      <div
        className="home-wrapper"
        style={{
          padding: '0 0.25rem 0 0.25rem',
        }}
      >
        <Greeting>{`${t('dict.good')} ${t(`time.ofDay.${timeOfDay}`)} ${
          user?.firstName
        }`}</Greeting>
        <Accordion allowMultiple>
          {user && isAuthorized(user, 'newUsers') && (
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
          {user && isAuthorized(user, 'openRequests') && (
            <AccordionItem isDisabled={uniqueRequestedLeaves.length < 1}>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    display="flex"
                    flexDirection="row"
                  >
                    <span>offene Anträge</span>
                    <NotificationCount count={uniqueRequestedLeaves.length}>
                      {uniqueRequestedLeaves.length}
                    </NotificationCount>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <ApprovalPanel events={uniqueRequestedLeaves} />
              </AccordionPanel>
            </AccordionItem>
          )}
          {user && employee && isAuthorized(user, 'personalTimesheet') && (
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    display="flex"
                    flexDirection="row"
                  >
                    <span>Zeitkonto</span>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <TimeSheet employee={employee} />
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </>
  );
};

export default Home;
