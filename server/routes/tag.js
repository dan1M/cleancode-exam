const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const TagService = require("../services/tag");
const tagController = require("../controllers/tag");

module.exports = new genericRouter(
    new genericController(new TagService(), {
        customController: tagController,
    }),
    {
        customRoutes: [
            {
                handler: "create",
                method: "post",
                path: "/",
                middleware: [],
            },
            {
                handler: "getAllTagsByUser",
                method: "get",
                path: "/:userId",
                middleware: [],
            },
        ],
        defaultRoutes: {
            getAll: {
                method: "get",
                path: "/",
                middleware: [],
                active: true,
            },
            getOne: {
                method: "get",
                path: "/tag/:id",
                middleware: [],
                active: true,
            },
            update: {
                method: "put",
                path: "/:id",
                middleware: [],
                active: true,
            },
            delete: {
                method: "delete",
                path: "/:id",
                middleware: [],
                active: true,
            },
        },
        middleware: [],
    }
);