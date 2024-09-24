import dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import {
  decryptContactData,
  decryptPatient,
  encryptedPatientFields,
  getEncryptedPatient,
} from '../utils/crypto';
import { Patient, User, WaitingPreference } from '@prisma/client';
import { Serializer } from 'ts-japi';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

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
  delete sanitizedPatient.waitingPreferences;
  return sanitizedPatient;
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
        externalId: incomingPatient.externalId,
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
    const externalId = incomingPatient.externalId;
    const encryptedPatient = getEncryptedPatient(incomingPatient);
    const updatedPatient = await prisma.patient.update({
      where: {
        uuid: patientId,
      },
      data: {
        ...encryptedPatient,
        externalId: externalId,
        updatedBy: user.uuid,
        waitingPreferences: encryptedPatient.waitingPreferences
          ? {
              connect: encryptedPatient.waitingPreferences.map((wp) => ({
                key: wp.key,
              })),
            }
          : undefined,
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
    const patient = await prisma.patient.findUnique({
      where: {
        uuid: patientId,
      },
      include: {
        events: {
          include: {
            employee: true,
          },
        },
        waitingPreferences: true,
      },
    });
    res.json(patient.events);
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
 * get filtered Patients by query params
 */
export const getFilteredPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const filters = req.query;
  try {
    const patients = await prisma.patient.findMany({
      where: {
        archived: false,
        ...filters,
      },
      include: {
        contactData: true,
        waitingPreferences: true,
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

/**
 * API V2 filter parameter
 */
const patientFilterParameter = ['institutionId', 'patientId'] as const;
type PatientFilterParameter = (typeof patientFilterParameter)[number];
interface PatientAPIRequest extends Request {
  query: {
    filter: {
      [key in PatientFilterParameter]: string;
    };
    page: {
      limit: string;
      offset: string;
    };
    includes: string;
  };
}
/**
 * API V2 get many Patients per filter
 * https://jsonapi.org/recommendations/
 */
export const getPatients = async (
  req: PatientAPIRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const institutionId = req.query.filter?.institutionId;
    const offset = req.query.page?.offset;
    const limit = req.query.page?.limit;
    const includes = req.query.includes ? req.query.includes.split(',') : [];

    const patients = await prisma.patient.findMany({
      where: {
        archived: false,
        institutionId: institutionId || undefined,
      },
      include: {
        contactData: Boolean(includes.includes('contactData')),
        waitingPreferences: Boolean(includes.includes('waitingPreferences')),
        doctor: Boolean(includes.includes('doctor')),
        institution: Boolean(includes.includes('institution')),
        addpayFreedom: Boolean(includes.includes('addpayFreedom')),
      },
      skip: offset ? parseInt(offset) : undefined,
      take: limit ? parseInt(limit) : undefined,
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
    const PatientSerializer = new Serializer('patients');
    let response;
    try {
      response = await PatientSerializer.serialize(patients);
    } catch (error) {
      console.error(error);
    }
    res.set({ 'Content-Type': 'application/vnd.api+json' });
    res.json(response);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * API V2 get Patient per id
 * https://jsonapi.org/recommendations/
 */
export const getPatient = async (
  req: PatientAPIRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = req.params.patientId;
    const includes = req.query.includes ? req.query.includes.split(',') : [];

    const patient = await prisma.patient.findUnique({
      where: {
        uuid: patientId,
      },
      include: {
        contactData: Boolean(includes.includes('contactData')),
        waitingPreferences: Boolean(includes.includes('waitingPreferences')),
        doctor: Boolean(includes.includes('doctor')),
        institution: Boolean(includes.includes('institution')),
        addpayFreedom: Boolean(includes.includes('addpayFreedom')),
      },
    });
    const decryptedPatient = {
      ...patient,
      ...decryptPatient({ patient, fields: encryptedPatientFields }),
    };
    const PatientSerializer = new Serializer('patients');
    let response;
    try {
      response = await PatientSerializer.serialize(decryptedPatient);
    } catch (error) {
      console.error(error);
    }
    res.set({ 'Content-Type': 'application/vnd.api+json' });
    res.json(response);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
