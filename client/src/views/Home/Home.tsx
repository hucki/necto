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
import UpcomingPanel from '../../components/molecules/InfoPanel/UpcomingPanel';
import { Greeting, NotificationCount } from '../../components/Library/Messages';
import { useEmployeeEvents, useLeavesByStatus } from '../../hooks/events';
import { useAllUsers, useUser } from '../../hooks/user';
import { AuthContext } from '../../providers/AuthProvider';
import { Event } from '../../types/Event';

interface EmployeeEventAccordionItemProps {
  employeeId: string;
  now: dayjs.Dayjs;
  upcomingEvents: Event[];
}
const EmployeeEventAccordionItem = ({
  upcomingEvents,
}: EmployeeEventAccordionItemProps) => {
  const maxEvents = 10;
  return (
    <AccordionItem isDisabled={upcomingEvents.length < 1}>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left" display="flex" flexDirection="row">
            <span>anstehende Ereignisse </span>
            <span
              style={{
                marginLeft: '0.2rem',
                fontSize: 'small',
              }}
            >
              (
              {upcomingEvents.length > maxEvents
                ? maxEvents + '+'
                : upcomingEvents.length}
              )
            </span>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <UpcomingPanel events={upcomingEvents} maxEvents={maxEvents} />
      </AccordionPanel>
    </AccordionItem>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { user: maxUser } = useUser(user?.uuid || '');
  const { users } = useAllUsers();
  const employeeId =
    (maxUser?.userSettings && maxUser?.userSettings[0].employeeId) || '';
  const now = dayjs(new Date());
  const { rawEvents: events } = useLeavesByStatus('requested');
  const uniqueEvents = events.filter(
    (event) => event.rrule === '' || !event.parentEventId
  );
  const newUsers = users.filter((user) => !user?.permissions?.length);
  const timeOfDay = now.isBetween(now.hour(0), now.hour(11), 'hour')
    ? 'morning'
    : now.isBetween(now.hour(10), now.hour(18), 'hour')
    ? 'day'
    : 'evening';

  const employeeEventsResult = employeeId
    ? useEmployeeEvents(employeeId)
    : undefined;
  const upcomingEvents = employeeEventsResult
    ? employeeEventsResult.employeeEvents.filter((e) =>
        dayjs(e.startTime).isAfter(now)
      )
    : [];
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
        <Accordion
          allowMultiple
          defaultIndex={upcomingEvents.length ? [2] : undefined}
        >
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
          {employeeId && (
            <EmployeeEventAccordionItem
              upcomingEvents={upcomingEvents}
              employeeId={employeeId}
              now={now}
            />
          )}
        </Accordion>
      </div>
    </>
  );
};

export default Home;
