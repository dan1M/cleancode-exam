const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const responseController = require("../controllers/response");
const ResponseService = require("../services/response");

module.exports = new genericRouter(
    new genericController(new ResponseService(), {
        customController: responseController,
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
                handler: "getResponsesByCard",
                method: "get",
                path: "/card/:cardId/:userId",
                middleware: [],
            },
            {
                handler: "checkCardResponseValidity",
                method: "post",
                path: "/check-validity",
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
                path: "/:id",
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