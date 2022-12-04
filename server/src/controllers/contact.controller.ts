import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import { encrypt } from '../utils/crypto';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

export const addPatientContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const patientId = req.params.patientId;
  try {
    const createdContact = await prisma.contactData.create({
      data: {
        patientId,
        type: req.body.type,
        contact: req.body.contact?.length
          ? encrypt(req.body.contact)
          : req.body.contact,
        tenantId: tenantId,
      },
    });
    res.json(createdContact);
    res.status(201);
  } catch (error) {
    next(error);
  }
};

export const addDoctorContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const doctorId = req.params.doctorId;
  try {
    const createdContact = await prisma.contactData.create({
      data: {
        doctorId,
        type: req.body.type,
        contact: req.body.contact?.length
          ? encrypt(req.body.contact)
          : req.body.contact,
        tenantId: tenantId,
      },
    });
    res.json(createdContact);
    res.status(201);
  } catch (error) {
    next(error);
  }
};

export const addInstitutionContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const institutionId = req.params.institutionId;
  try {
    const createdContact = await prisma.contactData.create({
      data: {
        institutionId,
        type: req.body.type,
        contact: req.body.contact?.length
          ? encrypt(req.body.contact)
          : req.body.contact,
        tenantId: tenantId,
      },
    });
    res.json(createdContact);
    res.status(201);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const contactId = req.params.contactId;
  try {
    const updatedContact = await prisma.contactData.update({
      where: {
        uuid: contactId,
      },
      data: {
        contact: req.body.contact?.length
          ? encrypt(req.body.contact)
          : req.body.contact,
      },
    });
    res.json(updatedContact);
    res.status(200);
  } catch (error) {
    next(error);
  }
};
