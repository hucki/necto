import { SET_CURRENT_COMPANY } from '../actions/actions';
import { initialState } from '../assets/data';
import { Company } from '../types/Company';

interface CurrentCompanyProps {
  type: typeof SET_CURRENT_COMPANY;
  payload: Company;
}
export default function currentCompany(
  state = initialState.currentCompany,
  { type, payload }: CurrentCompanyProps
) {
  const newState = payload;
  switch (type) {
    case SET_CURRENT_COMPANY:
      return newState;
    default:
      return state;
  }
}
