import React, { useState } from 'react';
import {
  useAllArchivedInstitutions,
  useAllInstitutions,
} from '../../hooks/institution';
import InstitutionList from '../../components/organisms/Institution/InstitutionList';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';

function Institutions(): JSX.Element {
  const [showArchived, setShowArchived] = useState(false);
  const { isLoading, institutions } = useAllInstitutions();
  const {
    isLoading: isLoadingArchivedInstitutions,
    institutions: archivedInstitutions,
  } = useAllArchivedInstitutions();

  return isLoading || isLoadingArchivedInstitutions ? (
    <FullPageSpinner />
  ) : (
    <div>
      <InstitutionList
        institutions={showArchived ? archivedInstitutions : institutions}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />
    </div>
  );
}

export default Institutions;
