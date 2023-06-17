import { ObjectId } from 'mongodb';
import { BaseEntity } from './base-entity';
import { User } from './user';

export class Partner extends BaseEntity {
  userId: ObjectId;
  name!: string;
  logo?: string;
  branches?: Branch[];
  type: TypeIndustry;
}

export class Branch extends BaseEntity {
  nameBranch!: string;
  direction?: string;
  description?: string;
  longtitude?: string;
  latitude?: string;
}

export enum TypeIndustry {
  Food = 'Food',
  Drink = 'Drink',
  Beauti = 'Beauti',
  Cinema = 'Cinema',
  Pharma = 'Pharma',
}
