import { StyleSheet } from '@react-pdf/renderer';

export const timesheetStyle = StyleSheet.create({
  page: {
    padding: '100 40 50 40',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Helvetica',
    fontSize: '12pt',
  },
  heading: {
    margin: '20 0 20 0',
    fontSize: '16pt',
    width: '100%',
  },
  section: {
    marginTop: 20,
    gap: 10,
  },
  table: {
    borderSpacing: 0,
    fontSize: '12px',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#3333',
  },
  thead: {
    fontWeight: 'bold',
    flexDirection: 'row',
    borderBottomColor: '#3333',
    backgroundColor: '#3333',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  colMonth: {
    width: '15%',
    textAlign: 'left',
  },
  colShould: {
    width: '10%',
  },
  colPlan: {
    width: '10%',
  },
  colIs: {
    width: '10%',
  },
  colDiff: {
    width: '15%',
  },
  colAbsence: {
    width: '40%',
  },
  td: {
    alignItems: 'center',
    textAlign: 'center',
    borderBottomColor: '#3333',
    borderRightWidth: 1,
    height: '100%',
  },
  tr: {
    flexDirection: 'row',
    borderBottomColor: '#3333',
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 24,
    fontStyle: 'bold',
  },
});
