import React from 'react';
import { CgPhone } from 'react-icons/cg';
import { IoDocumentTextOutline, IoMailOutline } from 'react-icons/io5';
import { ContactData } from '../../../types/ContactData';

interface ContactDataDisplayProps {
  contactData: ContactData[];
  isInteractive?: boolean;
}

export const ContactDataDisplay = ({
  contactData,
  isInteractive = false,
}: ContactDataDisplayProps) => {
  const InteractiveContact = ({ number }: { number: string }) => {
    return (
      <a
        href={`tel:${number}`}
        onClick={(e) => e.stopPropagation()}
        style={{ color: 'blue', textDecoration: 'underline' }}
      >
        {number}
      </a>
    );
  };
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
      {contactItem.type === 'telephone' && isInteractive ? (
        <InteractiveContact number={contactItem.contact} />
      ) : (
        contactItem.contact
      )}
    </div>
  ));
  return <>{currentContacts}</>;
};
