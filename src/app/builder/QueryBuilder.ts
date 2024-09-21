import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchAbleFields: string[]) {
    const searchField = this.query?.searchField;
    if (searchField) {
      this.modelQuery = this.modelQuery.find({
        $or: searchAbleFields.map(
          (field) =>
            ({
              [field]: { $regex: searchField, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    const excludeFields = ['searchField', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => {
      delete queryObj[el];
    });

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sort = this?.query?.sort || '_id';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 3;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
