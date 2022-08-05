import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { decryptData, encryptData } from '../utils/crypto';
dotenv.config();
const tenantId = process.env.TENANT_UUID;
dayjs.extend(isoWeek);

const encryptPatient = (patient) => {
  let encryptedPatient = {
    ...patient,
    notices: patient.notices ? encryptData(patient.notices) : undefined,
  }
  return encryptedPatient
}

const decryptPatient = (patient) => {
  let decryptedPatient = {
    ...patient,
    notices: patient.notices ? decryptData(patient.notices) : undefined,
  }
  return decryptedPatient
}

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
    const incomingPatient = { ...req.body }
    delete incomingPatient.contactData
    delete incomingPatient.events
    delete incomingPatient.availability
    delete incomingPatient.doctor
    delete incomingPatient.institution

    const encryptedPatient = encryptPatient(incomingPatient);
    const createdPatient = await prisma.patient.create({
      data: {
        ...encryptedPatient,
        tenantId: tenantId,
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
    const patientId = req.params.patientId;
    const incomingPatient = { ...req.body }
    delete incomingPatient.contactData
    delete incomingPatient.events
    delete incomingPatient.availability
    delete incomingPatient.doctor
    delete incomingPatient.institution
    delete incomingPatient.numberInLine

    const encryptedPatient = encryptPatient(incomingPatient);
    const updatedPatient = await prisma.patient.update({
      where: {
        uuid: patientId,
      },
      data: {
        ...encryptedPatient,
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
        archived: false
      },
      include: {
        events: true,
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
        archived: false
      },
      include: {
        contactData: true,
        events: {
          include: {
            employee: true,
          },
        },
        doctor: true,
        institution: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });
    for (let i = 0; i < patients.length; i++) {
      patients[i] = decryptPatient(patients[i]);
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
        doctor: true,
        institution: true,
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
                  }
                ]
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
      waitingPatients[i] = decryptPatient(waitingPatients[i]);
    }
    res.json(waitingPatients);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
