/** @jsx jsx */
import { jsx } from '@emotion/react';

function CalendarRow():JSX.Element {
  return (
    <div
      css={{
        fontSize: '4em',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div>CalendarScale</div>
      <div>CalendarRows</div>
    </div>
  )
}

export {CalendarRow};