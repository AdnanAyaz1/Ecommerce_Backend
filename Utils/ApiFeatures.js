class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString?.keyword) {
      const regex = new RegExp(this.queryString.keyword, "i");
      this.query = this.query.find({
        $or: [{ name: regex }, { description: regex }],
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const removeFields = ["sort", "page", "limit", "skip", "keyword"];
    removeFields.forEach((feild) => delete queryObj[feild]);

    if (queryObj.category == "") {
      delete queryObj.category; // Remove category if it's not provided
    }

    if (queryObj.stock != 0) {
      delete queryObj.stock;
    }

    if (queryObj?.status == "All") {
      delete queryObj.status;
    }

    if (!queryObj.createdAt) {
      delete queryObj.createdAt;
    }

    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  paginate() {
    const result_pr_page = 10;
    const page = this.queryString?.page * 1 || 1;
    const skip = result_pr_page * (page - 1);
    this.query = this.query.skip(skip).limit(result_pr_page);
    return this;
  }
}

export default ApiFeatures;
