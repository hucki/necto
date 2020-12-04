/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Dayjs } from 'dayjs';
import { Ressource } from '../../types/Ressource';

interface CalendarColumnInputProps {
  date: Dayjs;
  ressources: Ressource[];
  numOfHours: number;
}

function CalendarColumn({date, ressources, numOfHours}:CalendarColumnInputProps):JSX.Element {
  const ressourceColsHeader = ressources.map(ressource =>
    <div
      id={`rcolHeader_r${ressource.id}`}
      css={{
        width: `calc(100% / ${ressources.length})`,
        textAlign: 'center',
      }}
    >
      {ressource.shortDescription}
    </div>
  )
  const ressourceColsBody = ressources.map(ressource =>
    <div
      id={`rcolBody_d${date.format('YYYYMMDD')}_r${ressource.id}`}
      css={{
        width: `calc(100% / ${ressources.length})`,
        height: '100%'
      }}
    >
      content
    </div>
  )

  return (
    <div id={`CalendarDay_d${date.format('YYYYMMDD')}`}
      css={{
        width: `100%`,
        textAlign: 'center'
      }}
      >
      <div id={`DayHeader_d${date.format('YYYYMMDD')}`} css={{ height: `calc((100% / ${numOfHours+1}) / 2)`}}
      >{date.format('DD.MM.YYYY')}</div>
      <div id={`RessourceHeader_d${date.format('YYYYMMDD')}`}
        css={{
          display: 'flex',
          height: `calc((100% / ${numOfHours+1}) / 2)`,
          flexDirection: 'row',
        }}
      >
        {ressourceColsHeader}
      </div>
      <div id={`RessourceBody_d${date.format('YYYYMMDD')}`}
        css={{
          display: 'flex',
          height: `calc(100% / ${numOfHours+1} * ${numOfHours})`,
          flexDirection: 'row',
        }}
      >
        {ressourceColsBody}
      </div>
    </div>
  )
}

export {CalendarColumn};