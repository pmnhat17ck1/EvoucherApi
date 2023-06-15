import { ObjectId } from 'mongodb';
import { BaseEntity } from './base-entity';
import { User } from './user';

export class Partner extends BaseEntity {
  userId: ObjectId;
  logoBrand: string;
  branch?: Branch[];
  type: TypeIndustry;
}

class Branch extends BaseEntity {
  nameBranch!: string;
  direction?: string;
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
