import React from 'react';
import { CgPhone } from 'react-icons/cg';
import { IoDocumentTextOutline, IoMailOutline } from 'react-icons/io5';
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
      {contactItem.type === 'telephone' ? (
        <CgPhone />
      ) : contactItem.type === 'email' ? (
        <IoMailOutline />
      ) : (
        <IoDocumentTextOutline />
      )}{' '}
      {contactItem.contact}
    </div>
  ));
  return <>{currentContacts}</>;
};
