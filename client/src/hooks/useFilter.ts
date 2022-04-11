import { useContext } from 'react';
import { filterContext } from '../providers/filter';
;
export const useFilter = () => useContext(filterContext);