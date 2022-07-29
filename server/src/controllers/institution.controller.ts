import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

// get all institutions
export const getAllInstitutions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const institutions = await prisma.institution.findMany({
      where: {
        tenantId,
        archived: false
       },
      include: {
        patients: true,
        contactData: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(institutions);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

// get all archived institutions
export const getAllArchivedInstitutions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const institutions = await prisma.institution.findMany({
      where: {
        tenantId,
        archived: true
       },
      include: {
        patients: true,
        contactData: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(institutions);
    res.status(200);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * add one Institution
 *  @param {Institution} req.body
 */
export const addInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, street, zip, city, archived } = req.body
    const createdInstitution = await prisma.institution.create({
      data: {
        name,
        description,
        street,
        zip,
        city,
        archived,
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
            institutionId: createdInstitution.uuid,
            type: 'telephone',
            contact: req.body.telephoneNumber,
            tenantId: tenantId,
          },
        })
      : {};

    const createdMail = req.body.mailAddress
      ? await prisma.contactData.create({
          data: {
            institutionId: createdInstitution.uuid,
            type: 'email',
            contact: req.body.mailAddress,
            tenantId: tenantId,
          },
        })
      : {};

    res.json(createdInstitution);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};

/**
 * update one Institution
 *  @param {Institution} req.body
 */
 export const updateInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const institutionId = req.params.institutionId;
    const { name, description, street, zip, city, archived } = req.body
    const updateInstitution = await prisma.institution.update({
      where: {
        uuid: institutionId,
      },
      data: {
        name,
        description,
        street,
        zip,
        city,
        archived
      },
    });
    res.json(updateInstitution);
    res.status(201);
    return;
  } catch (e) {
    next(e);
  }
};
