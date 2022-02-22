import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { Prisma } from '@prisma/client';
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
    const createdPatient = await prisma.patient.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        title: req.body.title,
        gender: req.body.gender,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        birthday: req.body.birthday,
        insurance: req.body.insurance,
        insuranceNumber: req.body.insuranceNumber,
        insuranceCardNumber: req.body.insuranceCardNumber,
        insuranceCardValid: req.body.insuranceCardValid,
        notices: req.body.notices,
        careFacility: req.body.careFacility,
        state: req.body.state,
        isAddpayFreed: req.body.isAddpayFreed,
        addPayFreedFrom: req.body.addPayFreedFrom,
        addPayFreedUntil: req.body.addPayFreedUntil,
        validUntil: req.body.validUntil,
        companyId: '0',
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
    console.log({ req: req.body, pId: req.params.patientId });
    const patientId = req.params.patientId;
    const updatedPatient = await prisma.patient.update({
      where: {
        uuid: patientId,
      },
      data: {
        firstName: req.body.userId,
        lastName: req.body.lastName,
        title: req.body.title,
        gender: req.body.gender,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        birthday: req.body.birthday,
        insurance: req.body.insurance,
        insuranceNumber: req.body.insuranceNumber,
        insuranceCardNumber: req.body.insuranceCardNumber,
        insuranceCardValid: req.body.insuranceCardValid,
        notices: req.body.notices,
        careFacility: req.body.careFacility,
        state: req.body.state,
        isAddpayFreed: req.body.isAddpayFreed,
        addPayFreedFrom: req.body.addPayFreedFrom,
        addPayFreedUntil: req.body.addPayFreedUntil,
        validUntil: req.body.validUntil,
        companyId: '0',
        tenantId: tenantId,
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
      where: { uuid: patientId },
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
    const patients = await prisma.patient.findMany();
    res.json(patients);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};
