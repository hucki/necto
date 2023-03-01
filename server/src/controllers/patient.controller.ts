import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { encrypt, decryptContactData, decryptPatient } from '../utils/crypto';
import { Patient, User, WaitingPreference } from '@prisma/client';
dotenv.config();
const tenantId = process.env.TENANT_UUID;
dayjs.extend(isoWeek);

export const encryptedPatientFields: (keyof Patient)[] = [
  'notices',
  'firstName',
  'lastName',
  /**
   * TODO: encrypt 'medicalReport'
   */
];

const getSanitizedPatient = (patient) => {
  const sanitizedPatient = { ...patient };
  delete sanitizedPatient.contactData;
  delete sanitizedPatient.events;
  delete sanitizedPatient.availability;
  delete sanitizedPatient.doctor;
  delete sanitizedPatient.institution;
  delete sanitizedPatient.numberInLine;
  delete sanitizedPatient.createdAt;
  delete sanitizedPatient.updatedAt;
  delete sanitizedPatient.addpayFreedom;
  return sanitizedPatient;
};

const getEncryptedPatient = (patient) => {
  let encryptedPatient = {
    ...patient,
  };
  for (let i = 0; i < encryptedPatientFields.length; i++) {
    encryptedPatient[encryptedPatientFields[i]] = encryptedPatient[
      encryptedPatientFields[i]
    ]?.length
      ? encrypt(encryptedPatient[encryptedPatientFields[i]])
      : encryptedPatient[encryptedPatientFields[i]];
  }
  return encryptedPatient;
};

/**
 * add one Patient
 *  @param {Patient} req.body
 */
export const addPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    const incomingPatient = getSanitizedPatient(req.body);
    const encryptedPatient = getEncryptedPatient(incomingPatient);
    const createdPatient = await prisma.patient.create({
      data: {
        ...encryptedPatient,
        tenantId: tenantId,
        updatedBy: user.uuid,
        createdBy: user.uuid,
      },
    });

    res.json(createdPatient);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update one Patient
 *  @param {Patient} req.body
 */
export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    const patientId = req.params.patientId;
    const incomingPatient = getSanitizedPatient(req.body);
    const encryptedPatient = getEncryptedPatient(incomingPatient);
    const updatedPatient = await prisma.patient.update({
      where: {
        uuid: patientId,
      },
      data: {
        ...encryptedPatient,
        updatedBy: user.uuid,
        waitingPreferences: {
          connect: encryptedPatient.waitingPreferences.map((wp) => ({
            key: wp.key,
          })),
        },
      },
    });
    res.json(updatedPatient);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * delete one Patient by patientId
 *  @param {string} req.params.patientId
 */
export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: check if patient may be deleted
    const patientId = req.params.patientId;
    const deletedPatient = await prisma.patient.delete({
      where: { uuid: patientId },
    });
    res.json(deletedPatient);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all Events that are connected to a patient
 *  @param {string} req.params.patientId
 */
export const getPatientsEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = req.params.patientId;
    const patientsEvents = await prisma.patient.findMany({
      where: {
        uuid: patientId,
        archived: false,
      },
      include: {
        events: true,
        waitingPreferences: true,
      },
    });
    res.json(patientsEvents);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all Patients
 */
export const getAllPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        archived: false,
      },
      include: {
        contactData: true,
        waitingPreferences: true,
        events: {
          include: {
            employee: true,
          },
        },
        doctor: true,
        institution: true,
        addpayFreedom: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });
    for (let i = 0; i < patients.length; i++) {
      patients[i] = {
        ...patients[i],
        ...decryptPatient({
          patient: patients[i],
          fields: encryptedPatientFields,
        }),
      };
      if (patients[i].contactData) {
        patients[i].contactData = decryptContactData(patients[i].contactData);
      }
    }
    res.json(patients);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
/**
 * get all archived Patients
 */
export const getAllArchivedPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        archived: true,
      },
      include: {
        contactData: true,
        waitingPreferences: true,
        events: {
          include: {
            employee: true,
          },
        },
        doctor: true,
        institution: true,
        addpayFreedom: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });
    for (let i = 0; i < patients.length; i++) {
      patients[i] = {
        ...patients[i],
        ...decryptPatient({
          patient: patients[i],
          fields: encryptedPatientFields,
        }),
      };
      if (patients[i].contactData) {
        patients[i].contactData = decryptContactData(patients[i].contactData);
      }
    }
    res.json(patients);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * get all Patients that are currently not scheduled
 */
export const getWaitingPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const waitingPatients = await prisma.patient.findMany({
      include: {
        events: {
          include: {
            employee: true,
          },
        },
        contactData: true,
        waitingPreferences: true,
        doctor: true,
        institution: true,
        addpayFreedom: true,
      },
      where: {
        OR: [
          {
            isWaitingAgain: true,
          },
          {
            archived: false,
            events: {
              none: {},
            },
          },
          {
            archived: false,
            events: {
              every: {
                OR: [
                  {
                    isCancelled: true,
                  },
                  {
                    isDiagnostic: true,
                  },
                ],
              },
            },
          },
        ],
      },
      orderBy: {
        isWaitingSince: 'asc',
      },
    });
    for (let i = 0; i < waitingPatients.length; i++) {
      waitingPatients[i] = {
        ...waitingPatients[i],
        ...decryptPatient({
          patient: waitingPatients[i],
          fields: encryptedPatientFields,
        }),
      };
      if (waitingPatients[i].contactData) {
        waitingPatients[i].contactData = decryptContactData(
          waitingPatients[i].contactData
        );
      }
    }
    res.json(waitingPatients);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * connect one Patient to a waitingPreference
 *  @param {Patient['uuid']} req.body.patientId
 *  @param {WaitingPreference['key']} req.body.waitingPreferenceKey
 */
export const connectToWaitingPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    const { patientId, waitingPreferenceKey } = req.body;
    const updatedPatient = await prisma.patient.update({
      where: {
        uuid: patientId,
      },
      data: {
        updatedBy: user.uuid,
        waitingPreferences: {
          connect: {
            key: waitingPreferenceKey,
          },
        },
      },
    });
    res.json(updatedPatient);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * connect one Patient to a waitingPreference
 *  @param {Patient['uuid']} req.body.patientId
 *  @param {WaitingPreference['key']} req.body.waitingPreferenceKey
 */
export const disconnectFromWaitingPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    const { patientId, waitingPreferenceKey } = req.body;
    const updatedPatient = await prisma.patient.update({
      where: {
        uuid: patientId,
      },
      data: {
        updatedBy: user.uuid,
        waitingPreferences: {
          disconnect: {
            key: waitingPreferenceKey,
          },
        },
      },
    });
    res.json(updatedPatient);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
