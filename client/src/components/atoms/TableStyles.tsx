import styled from '@emotion/styled/macro';

export const TimesheetStyle = styled.div`
  padding: 0.5rem;
  overflow: scroll;

  table {
    border-spacing: 0;
    border: 1px solid black;
    font-size: 12px;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.25rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;
interface PersonListStyleProps {
  archived?: boolean;
}
export const PersonListStyle = styled.div(
  ({ archived = false }: PersonListStyleProps) => ({
    padding: '0.5rem',
    overflow: 'scroll',
    table: {
      borderSpacing: 0,
      border: '1px solid lightgrey',
      fontSize: '12px',
      th: {
        backgroundColor: 'linen',
      },
      tr: {
        ':nth-child(even)': {
          backgroundColor: archived
            ? 'var(--chakra-colors-orange-100)'
            : 'var(--chakra-colors-green-100)',
        },
        ':hover': {
          backgroundColor: 'palegoldenrod',
        },
        ':last-child': {
          td: {
            borderBottom: 0,
          },
        },
      },

      'th, td': {
        margin: 0,
        padding: '0.25rem',
        borderBottom: '1px solid lightgrey',
        borderRight: '1px solid lightgrey',

        ':last-child': {
          borderRight: 0,
        },
      },
    },
  })
);
