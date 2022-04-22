import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;
dayjs.extend(isoWeek);

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
    const incomingPatient = {...req.body}
    delete incomingPatient.telephoneNumber
    delete incomingPatient.mailAddress
    const createdPatient = await prisma.patient.create({
      data: {
        ...incomingPatient,
        tenantId: tenantId,
      },
    });
    const createdTelephone = req.body.telephoneNumber
      ? await prisma.contactData.create({
          data: {
            patientId: createdPatient.uuid,
            type: 'telephone',
            contact: req.body.telephoneNumber,
            tenantId: tenantId,
          },
        })
      : {};

    const createdMail = req.body.mailAddress
      ? await prisma.contactData.create({
          data: {
            patientId: createdPatient.uuid,
            type: 'email',
            contact: req.body.mailAddress,
            tenantId: tenantId,
          },
        })
      : {};

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
    const incomingPatient = {...req.body}
    delete incomingPatient.telephoneNumber
    delete incomingPatient.mailAddress
    delete incomingPatient.contactData
    delete incomingPatient.events
    const updatedPatient = await prisma.patient.update({
      where: {
        uuid: patientId,
      },
      data: {
        ...incomingPatient,
      },
    });
    console.warn('contact data to be updated:',{ cd: req.body.contactData })
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
        events: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });
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
    // TODO: fix to only get patient without events or with not cancelled diagnostic patients
    const waitingPatients = await prisma.patient.findMany({
      include: {
        events: {
          include: {
            employee: true,
          },
        },
        contactData: true,
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
                isCancelled: true,
              },
            },
          },
          {
            archived: false,
            events: {
              some: {
                isDiagnostic: true,
                isCancelled: false,
              },
            },
          },
        ],
      },
      orderBy: {
        isWaitingSince: 'asc',
      },
    });
    res.json(waitingPatients);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
