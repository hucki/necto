import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from 'sequelize';
import { Event } from './Event';
import { Contract } from './Contract';
import { v4 as uuidv4 } from 'uuid';
import { commonFields } from './commonFields';

export interface UserAttributes {
  id: number;
  a0Id: string;
  firstName: string;
  lastName: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  tenantId: typeof uuidv4;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public a0Id!: string;
  public firstName!: string;
  public lastName!: string;
  public validUntil!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public tenantId!: typeof uuidv4;

  public getEvents!: HasManyGetAssociationsMixin<Event>;
  public addEvent!: HasManyAddAssociationMixin<Event, number>;
  public hasEvent!: HasManyHasAssociationMixin<Event, number>;
  public countEvents!: HasManyCountAssociationsMixin;
  public createEvent!: HasManyCreateAssociationMixin<Event>;

  public static associations: {
    events: Association<User, Event>;
    contracts: Association<User, Contract>;
  };
}

export const userFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  a0Id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING(64),
  },
  lastName: {
    type: DataTypes.STRING(64),
  },
  ...commonFields
};
