import React, { useState } from 'react';
import PersonList from '../../components/organisms/Person/PersonList';
import { useAllArchivedPatients, usePatients } from '../../hooks/patient';
import { PersonListWrapper } from '../../components/atoms/Wrapper';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';

function Patients(): JSX.Element {
  const { isLoading, rawPatients: patients } = usePatients({
    includes: 'contactData,addpayFreedom,doctor,institution',
  });
  const { isLoading: isLoadingArchivedPatients, archivedPatients } =
    useAllArchivedPatients();
  const [showArchived, setShowArchived] = useState(false);
  const isPending = isLoading || isLoadingArchivedPatients;
  return isPending ? (
    <FullPageSpinner />
  ) : (
    <PersonListWrapper>
      <PersonList
        persons={showArchived ? archivedPatients : patients}
        listType="patients"
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />
    </PersonListWrapper>
  );
}

export default Patients;
