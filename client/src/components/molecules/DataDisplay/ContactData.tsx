import React from 'react';
import { CgMail, CgPhone } from 'react-icons/cg';
import { ContactData } from '../../../types/ContactData';

interface ContactDataDisplayProps {
  contactData: ContactData[];
}

export const ContactDataDisplay = ({
  contactData,
}: ContactDataDisplayProps) => {
  const currentContacts = contactData.map((contactItem: ContactData, index) => (
    <div
      className="contact"
      key={index}
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      {contactItem.type === 'telephone' ? <CgPhone /> : <CgMail />}{' '}
      {contactItem.contact}
    </div>
  ));
  return <>{currentContacts}</>;
};
