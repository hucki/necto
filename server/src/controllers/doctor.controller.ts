import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

// get all doctors
export const getAllDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { tenantId },
      include: {
        patients: true,
        contactData: true,
      },
    });
    res.json(doctors);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * add one Doctor
 *  @param {Doctor} req.body
 */
export const addDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, title, street, zip, city } = req.body
    const createdDoctor = await prisma.doctor.create({
      data: {
        firstName,
        lastName,
        title,
        street,
        zip,
        city,
        tenantId: tenantId,
      },
      include: {
        patients: true,
        contactData: true,
      },
    });

    const createdTelephone = req.body.telephoneNumber
      ? await prisma.contactData.create({
          data: {
            doctorId: createdDoctor.uuid,
            type: 'telephone',
            contact: req.body.telephoneNumber,
            tenantId: tenantId,
          },
        })
      : {};

    const createdMail = req.body.mailAddress
      ? await prisma.contactData.create({
          data: {
            doctorId: createdDoctor.uuid,
            type: 'email',
            contact: req.body.mailAddress,
            tenantId: tenantId,
          },
        })
      : {};

    res.json(createdDoctor);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update one Doctor
 *  @param {Doctor} req.body
 */
 export const updateDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const doctorId = req.params.doctorId;
    const { firstName, lastName, title, street, zip, city } = req.body
    const updatedDoctor = await prisma.patient.update({
      where: {
        uuid: doctorId,
      },
      data: {
        firstName,
        lastName,
        title,
        street,
        zip,
        city
      },
    });
    console.warn('contact data to be updated:',{ cd: req.body.contactData })
    res.json(updatedDoctor);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
