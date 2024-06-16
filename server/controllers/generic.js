module.exports = function genericController(Service, options = {}) {
    let result = {
        getAll: async (req, res) => {
            const { page, itemPerPage, order, ...filters } = req.query;
            try {
                const results = await Service.findAll(filters, {
                    order,
                    limit: itemPerPage,
                    offset: (page - 1) * itemPerPage,
                });
                res.status(200).json(results);
            } catch (error) {
                console.error(error);

                res.status(500).json(error);
            }
        },
        getOne: async (req, res) => {
            try {
                const result = await Service.findOne(req.params);
                if (result) res.status(200).json(result);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);

                res.status(500).json(error);
            }
        },
        create: async (req, res) => {
            const { body } = req;
            try {
                const result = await Service.create(body);
                res.status(201).json(result);
            } catch (error) {
                if (error.constructor.name === "ValidationError") {
                    res.status(422).json(error.errors);
                } else if (error.constructor.name === "UniqueConstraintError") {
                    res.status(409).json(error.errors);
                } else {
                    console.error(error);
                    res.status(500).json(error);
                }
            }
        },
        replace: async (req, res) => {
            const { id } = req.params;
            const { body } = req;
            try {
                const [[result, created]] = await Service.replace(
                    { id: parseInt(id, 10) },
                    { id: parseInt(id, 10), ...body }
                );
                if (created) res.status(201).json(result);
                else res.json(result);
            } catch (error) {
                if (error.constructor.name === "ValidationError") {
                    res.status(422).json(error.errors);
                } else {
                    console.error(error);

                    res.status(500).json(error);
                }
            }
        },
        update: async (req, res) => {
            const { id } = req.params;
            const { body } = req;
            try {
                const [result] = await Service.update(
                    { id: parseInt(id, 10) },
                    body
                );
                if (result) res.json(result);
                else res.sendStatus(404);
            } catch (error) {
                if (error.constructor.name === "ValidationError") {
                    res.status(422).json(error.errors);
                } else {
                    console.error(error);

                    res.status(500).json(error);
                }
            }
        },
        delete: async (req, res) => {
            const { id } = req.params;
            try {
                const nbDeleted = await Service.delete({
                    id: parseInt(id, 10),
                });
                if (nbDeleted) res.sendStatus(204);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        },
    };

    if (options.hasOwnProperty("customController")) {
        result = { ...result, ...options.customController(Service) };
    }

    return result;
};