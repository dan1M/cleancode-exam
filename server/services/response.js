const { Response } = require("../db/models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");

module.exports = function ResponseService() {
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
            return Response.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Response.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                const response = await Response.create(data);

                return response;
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
                const response = await this.create(newData);
                return [[response, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, responses] = await Response.update(
                    newData,
                    {
                        where: filters,
                        returning: true,
                        individualHooks: true,
                    }
                );
                return [nbUpdated, responses];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async function (filters) {
            return Response.destroy({ where: filters });
        },
        getResponsesByCard: async function (cardId, userId) {
            return Response.findAll({
                where: {
                    cardId,
                    userId,
                },
            });
        },
        checkResponseValidity: async function (cardId, userId) {
            const response = await Response.findAll({
                where: {
                    cardId,
                    userId,
                },
            });

            if (response.isValid === false) {
                throw new UnauthorizedError();
            }

            return response;
        },
    };
};