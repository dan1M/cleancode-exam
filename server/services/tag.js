const { Tag, User } = require("../db/models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = function TagService() {
    return {
        findAll: async function (filters, options) {
            let dbOptions = {
                where: filters,
            };
            if (options.order) {
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return Tag.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Tag.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                const tag = await Tag.create(data);

                return tag;
            } catch (e) {
                if (e instanceof Sequelize.UniqueConstraintError) {
                    throw UniqueConstraintError.fromSequelizeUniqueConstraintError(
                        e
                    );
                }
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }

                throw e;
            }
        },
        replace: async function (filters, newData) {
            try {
                const nbDeleted = await this.delete(filters);
                const tag = await this.create(newData);
                return [[tag, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, tags] = await Tag.update(newData, {
                    where: filters,
                    returning: true,
                    individualHooks: true,
                });
                return [nbUpdated, tags];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async function (filters) {
            return Tag.destroy({ where: filters });
        },
        getAllTagsByUser: async function (userId) {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new UnauthorizedError("Utilisateur non trouvé");
            }
            const tags = Tag.findAll({
                where: {
                    userId: userId,
                },
            });
            return tags;
        },
    };
};