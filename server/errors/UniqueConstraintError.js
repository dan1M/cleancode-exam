class UniqueConstraintError extends Error {
    constructor(errors) {
        super("Validation error");
        this.errors = errors;
    }

    static fromSequelizeUniqueConstraintError(e) {
        const errors = e.errors.reduce((acc, error) => {
            if (!acc[error.path]) acc[error.path] = [];
            acc[error.path].push(error.message);
            return acc;
        }, {});
        return new UniqueConstraintError(errors);
    }
}

module.exports = UniqueConstraintError;