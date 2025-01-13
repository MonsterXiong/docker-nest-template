import { SortParam,ConditionParam, QueryCondition } from "src/interfaces/queryCondition.interface";

class QueryConditionBuilder {
  private pageNumber?: number = 1;
  private pageSize?: number = 10;
  private sortParams: SortParam[] = [];
  private conditionParams: ConditionParam[] = [];

  static getInstanceNoPage(): QueryConditionBuilder {
    const instance = new QueryConditionBuilder();
    instance.sortParams = [];
    instance.conditionParams = [];
    return instance;
  }

  static getInstance(pageNumber: number = 1, pageSize: number = 10, sortParams: SortParam[] = []): QueryConditionBuilder {
    const instance = new QueryConditionBuilder();
    instance.pageNumber = pageNumber;
    instance.pageSize = pageSize;
    instance.sortParams = sortParams;
    instance.conditionParams = [];
    return instance;
  }

  static getPageInstance(pageNumber: number = 1, pageSize: number = 10, sortParams: SortParam[] = []): QueryConditionBuilder {
    const instance = new QueryConditionBuilder();
    instance.pageNumber = pageNumber;
    instance.pageSize = pageSize;
    instance.sortParams = sortParams;
    instance.conditionParams = [];
    return instance;
  }

  filterIsFalse(): QueryConditionBuilder {
    if (this.conditionParams && this.conditionParams.length > 0) {
      this.conditionParams = this.conditionParams.filter((item: ConditionParam) => item.value);
    }
    return this;
  }

  filter(predict: (value: any) => boolean = () => true): QueryConditionBuilder {
    if (this.conditionParams && this.conditionParams.length > 0) {
      this.conditionParams = this.conditionParams.filter((item: ConditionParam) => predict(item.value));
    }
    return this;
  }

  private _buildQuery(property: string, value: any, symbol: string, combine: string = 'and'): void {
    this.conditionParams.push({
      combine,
      property,
      value,
      symbol,
    });
  }

  private _buildSort(property: string, isDesc: boolean = true): void {
    this.sortParams.push({
        property,
        isDesc,
        propertyType: ""
    });
  }

  buildDescSort(property: string): QueryConditionBuilder {
    this._buildSort(property, true);
    return this;
  }

  buildAscSort(property: string): QueryConditionBuilder {
    this._buildSort(property, false);
    return this;
  }

  buildEqualQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    this._buildQuery(property, value, '=', combine);
    return this;
  }

  buildNotEqualQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    this._buildQuery(property, value, '!=', combine);
    return this;
  }

  buildGTQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    this._buildQuery(property, value, '>', combine);
    return this;
  }

  buildGEQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    this._buildQuery(property, value, '>=', combine);
    return this;
  }

  buildLTQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    this._buildQuery(property, value, '<', combine);
    return this;
  }

  buildLEQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    this._buildQuery(property, value, '<=', combine);
    return this;
  }

  buildLikeQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    this._buildQuery(property, value, 'like', combine);
    return this;
  }

  buildInQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    if (Array.isArray(value)) {
      value = value.join(',');
    }
    this._buildQuery(property, value, 'in', combine);
    return this;
  }

  buildNotInQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    if (Array.isArray(value)) {
      value = value.join(',');
    }
    this._buildQuery(property, value, 'not in', combine);
    return this;
  }

  buildBetweenQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    if (Array.isArray(value)) {
      value = value.join(',');
    }
    this._buildQuery(property, value, 'between', combine);
    return this;
  }

  buildNotBetweenQuery(property: string, value: any, combine: string = 'and'): QueryConditionBuilder {
    if (Array.isArray(value)) {
      value = value.join(',');
    }
    this._buildQuery(property, value, 'not between', combine);
    return this;
  }

  setPageNumber(pageNumber: number): QueryConditionBuilder {
    this.pageNumber = pageNumber;
    return this;
  }

  setPageSize(pageSize: number): QueryConditionBuilder {
    this.pageSize = pageSize;
    return this;
  }
}
export { QueryConditionBuilder }
export default QueryConditionBuilder; 