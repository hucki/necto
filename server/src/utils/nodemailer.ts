import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { User, Employee, Event } from '@prisma/client';
import { getCurrentCompany } from '../controllers/company.controller';
import { EventChange } from '../controllers/event.controller';
dotenv.config();
const environment = process.env.NODE_ENV;
const sendChangesActive = process.env.SEND_CHANGES_ACTIVE;

const subjectPrefix = environment === 'development' ? '[DEV] ' : '';

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT) || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  logger: false,
});

type NotifyUserProps = {
  user: User;
};
export const notifyUser = async ({ user }: NotifyUserProps) => {
  try {
    const company = await getCurrentCompany();
    const res = await transporter.sendMail({
      from: company.name
        ? `${company.name} <${process.env.MAIL_FROM}>`
        : process.env.MAIL_FROM,
      to: user.email,
      subject: subjectPrefix + 'Password reset',
      text: `Hi ${user.firstName}, \n
              an Appointment was changed. The new Event Data is:\n
              TEST
              Best, \n
              Mundwerk IT`,
      html: `Hi ${user.firstName},<br /><br />
              an Appointment was changed. The new Event Data is:<br /><br />
              TEST <br /><br />
              Best,<br /><br />
              Mundwerk IT`,
    });
    console.log('✅', res.response);
  } catch (error) {
    console.error('❌', error);
  }
};

type SendEventChangeProps = {
  user: User;
  employee: Employee;
  employeeEmail: string;
  newEvent: Event;
  changes: EventChange[];
};
export const sendEventChange = async ({
  user,
  employee,
  employeeEmail,
  newEvent,
  changes,
}: SendEventChangeProps) => {
  try {
    const company = await getCurrentCompany();
    if (sendChangesActive) {
      const res = await transporter.sendMail({
        from: company.name
          ? `${company.name} <${process.env.MAIL_FROM}>`
          : process.env.MAIL_FROM,
        to: employeeEmail,
        subject: subjectPrefix + 'Event changed',
        text: `Hi ${employee.firstName}, \n
            an Appointment was changed by ${
              user.firstName
            }. The new Event Data is:\n
            ${changes.map(
              (change) =>
                `${change.field} ${change.oldValue} => ${change.newValue} \n`
            )}
            Best, \n
            Mundwerk IT`,
        html: `Hi ${employee.firstName},<br /><br />
            an Appointment was changed by ${
              user.firstName
            }. The new Event Data is:<br /><br />
            ${changes.map(
              (change) =>
                `${change.field} ${change.oldValue} => ${change.newValue} <br /><br />`
            )}
            Best,<br /><br />
            Mundwerk IT`,
      });
      console.log('✅ sent Mail:', res.response);
    } else {
      console.log('✅ would have sent mail to:', employeeEmail);
    }
  } catch (error) {
    console.error('❌', error);
  }
};
