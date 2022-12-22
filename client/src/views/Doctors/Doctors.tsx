import React, { useState } from 'react';
import PersonList from '../../components/organisms/Person/PersonList';
import { useAllArchivedDoctors, useAllDoctors } from '../../hooks/doctor';
import { PersonListWrapper } from '../../components/atoms/Wrapper';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';

function Doctors(): JSX.Element {
  const { isLoading, doctors } = useAllDoctors();
  const { isLoading: isLoadingArchivedDoctors, archivedDoctors } =
    useAllArchivedDoctors();
  const [showArchived, setShowArchived] = useState(false);
  const isPending = isLoading || isLoadingArchivedDoctors;
  return isPending ? (
    <FullPageSpinner />
  ) : (
    <PersonListWrapper>
      <PersonList
        persons={showArchived ? archivedDoctors : doctors}
        listType="doctors"
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />
    </PersonListWrapper>
  );
}

export default Doctors;
