import { BaseEntity } from './base-entity';

export class Partner extends BaseEntity {
  username!: string;
  hashedPassword!: string;
  displayName!: string;
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
