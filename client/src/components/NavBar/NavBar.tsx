import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Tooltip } from 'antd';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { DatePicker } from '../../elements';
import { changeDate, setCurrentTeam } from '../../actions/actions';
import { AppState } from '../../types/AppState';
import classes from './NavBar.module.css';
import dayjs, { Dayjs } from 'dayjs';
import { useAllTeams } from '../../hooks/teams';
import { Team } from '../../types/Employee';

interface NavBarProps {
  currentDate: Dayjs;
  // currentTeam: Team;
  dispatch: Dispatch<any>;
}

const NavBar = ({ currentDate, /*currentTeam,*/ dispatch }: NavBarProps) => {
  const { isLoading: isLoadingTeams, error, teams } = useAllTeams();
  const [currentTeam, setCurrentTeam] = useState<Team>();

  useEffect(() => {
    if (!isLoadingTeams && teams.length) {
      setCurrentTeam(teams[0]);
    }
  }, [isLoadingTeams]);
  const onTeamChangeHandler = (event: any) => {
    setCurrentTeam(teams.filter((t) => t.uuid === event.target.value)[0]);
  };

  // function onTeamChangeHandler(event: any) {
  //   dispatch(
  //     setCurrentTeam(teams.filter((t) => t.uuid === event.target.value)[0])
  //   );
  // }

  function onChangeHandler(date: Dayjs | null) {
    dispatch(changeDate(date));
  }
  function todayClickHandler() {
    dispatch(changeDate(dayjs()));
  }
  function prevDayHandler() {
    dispatch(changeDate(dayjs(currentDate).subtract(1, 'day')));
  }
  function nextDayHandler() {
    dispatch(changeDate(dayjs(currentDate).add(1, 'day')));
  }

  return (
    <div className={classes.NavBar}>
      {currentTeam && (
        <select
          name="team"
          value={currentTeam.uuid}
          onChange={onTeamChangeHandler}
        >
          {teams.map((t, i) => (
            <option key={i} value={t.uuid}>
              {t.displayName}
            </option>
          ))}
        </select>
      )}
      <Button
        disabled={dayjs().isSame(dayjs(currentDate), 'day')}
        onClick={todayClickHandler}
      >
        Today
      </Button>
      <Tooltip title="previous Day">
        <Button icon={<CaretLeftOutlined />} onClick={prevDayHandler}></Button>
      </Tooltip>
      <DatePicker onChange={onChangeHandler} value={currentDate} />
      <Tooltip title="next Day">
        <Button icon={<CaretRightOutlined />} onClick={nextDayHandler}></Button>
      </Tooltip>
    </div>
  );
};

const MapStateToProps = (state: AppState) => {
  const { currentDate /*, currentTeam */ } = state.current;
  return { currentDate /*, currentTeam */ };
};
const MapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    changeDate,
    setCurrentTeam,
    dispatch,
  };
};

export default connect(MapStateToProps, MapDispatchToProps)(NavBar);
