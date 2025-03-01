export type PropertyDiff = {
  current?: any;
  target?: any;
  isDifferent: boolean;
};

export type ColumnPropertyDiffs = {
  type?: PropertyDiff;
  length?: PropertyDiff;
  nullable?: PropertyDiff;
  default?: PropertyDiff;
  primary?: PropertyDiff;
  unique?: PropertyDiff;
  comment?: PropertyDiff;
};

export interface ColumnDiff {
  name: string;
  current?: {
    type: string;
    length?: number;
    nullable?: boolean;
    default?: any;
    primary?: boolean;
    unique?: boolean;
    comment?: string;
  };
  target?: {
    type: string;
    length?: number;
    nullable?: boolean;
    default?: any;
    primary?: boolean;
    unique?: boolean;
    comment?: string;
  };
  status: 'add' | 'remove' | 'modify';
  propertyDiffs?: ColumnPropertyDiffs;
}

export type IndexPropertyDiffs = {
  columns?: PropertyDiff;
  unique?: PropertyDiff;
};

export interface IndexDiff {
  name: string;
  current?: {
    columns: string[];
    unique?: boolean;
  };
  target?: {
    columns: string[];
    unique?: boolean;
  };
  status: 'add' | 'remove' | 'modify';
  propertyDiffs?: IndexPropertyDiffs;
}

export interface TableDiff {
  name: string;
  exists: boolean;
  columns?: ColumnDiff[];
  indices?: IndexDiff[];
} 