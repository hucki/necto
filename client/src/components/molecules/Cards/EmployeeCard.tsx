import styled from '@emotion/styled/macro';
import React from 'react';
import { useViewport } from '../../../hooks/useViewport';
import { Employee } from '../../../types/Employee';
import EventReport from '../DataDisplay/EventReport';

const EmployeeCardWrapper = styled.div({
  border: '1px solid #3333',
  padding: '0.1rem',
  borderRadius: '0.25rem',
  boxShadow: '2px 2px 5px #3333',
});
interface EmployeeCardContainerProps {
  hasBorder: boolean;
  isMobile: boolean;
}
const EmployeeCardContainer = styled.div((p: EmployeeCardContainerProps) => ({
  display: 'grid',
  minWidth: '290px',
  gridTemplateColumns: p.isMobile ? '42px 1fr' : '42px 1fr 1fr',
  gridTemplateRows: 'auto',
  gridTemplateAreas: p.isMobile
    ? '"avatar name" "avatar alias" "stats stats"'
    : '"avatar name stats" "avatar alias stats"',
  border: p.hasBorder ? '1px solid #3333' : 'none',
  borderRadius: '0.25rem',
  padding: '0.2rem',
  fontSize: '0.75rem',
  '.name': {
    fontWeight: 'bold',
  },
}));
const AvatarContainer = styled.div({
  backgroundColor: 'grey',
  color: 'white',
  fontSize: '1rem',
  textAlign: 'center',
  placeSelf: 'center',
  width: '32px',
  height: '32px',
  lineHeight: '32px',
  gridArea: 'avatar',
  borderRadius: '50%',
});
const EventReportContainer = styled.div({
  gridArea: 'stats',
});
interface EmployeeCardProps {
  employee: Employee;
  hasBorder?: boolean;
  // eslint-disable-next-line no-unused-vars
  handleClickPerson?: ({ employee }: { employee: Employee }) => void;
}
export const EmployeeCard = ({
  employee,
  hasBorder = false,
  handleClickPerson,
}: EmployeeCardProps) => {
  const { isMobile } = useViewport();
  const onClickedPerson = () => {
    handleClickPerson ? handleClickPerson({ employee }) : console.log('');
  };

  return (
    <EmployeeCardWrapper>
      <EmployeeCardContainer
        onClick={onClickedPerson}
        hasBorder={hasBorder}
        isMobile={isMobile}
      >
        <div
          className="name"
          style={{
            gridArea: 'name',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {employee.firstName + ' ' + employee.lastName}
        </div>
        <div
          className="alias"
          style={{
            gridArea: 'alias',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {employee.alias}
        </div>
        <AvatarContainer>
          {employee.firstName.substring(0, 1).toUpperCase() +
            employee.lastName.substring(0, 1).toUpperCase()}
        </AvatarContainer>
        {employee.events ? (
          <EventReportContainer>
            <EventReport
              useStatGroup={true}
              events={employee.events}
              dateRangeLabel=""
            />
          </EventReportContainer>
        ) : null}
      </EmployeeCardContainer>
    </EmployeeCardWrapper>
  );
};
