const { Router } = require('express');

module.exports = function (Controller, options = {}) {
  const router = new Router();

  if (options.hasOwnProperty('middlewares') && options.middlewares.length > 0) {
    router.use(options.middlewares);
  }

  if (
    options.hasOwnProperty('defaultRoutes') &&
    typeof options.defaultRoutes === 'boolean' &&
    !options.defaultRoutes
  ) {
  } else if (
    options.hasOwnProperty('defaultRoutes') &&
    typeof options.defaultRoutes === 'object'
  ) {
    Object.entries(options.defaultRoutes).forEach(([handler, route]) => {
      if (Controller.hasOwnProperty(handler)) {
        if (route.hasOwnProperty('active') && route.active) {
          if (
            route.hasOwnProperty('middleware') &&
            route.middleware.length > 0
          ) {
            router[route.method.toLowerCase()](
              route.path,
              route.middleware,
              Controller[handler],
            );
          } else {
            router[route.method.toLowerCase()](route.path, Controller[handler]);
          }
        }
      } else {
        throw new Error(
          `handler '${handler}' is not defined in the generic controller`,
        );
      }
    });
  } else {
    throw new Error(
      "defaulRoutes parameter is required in 'genericController' method",
    );
  }

  if (options.hasOwnProperty('customRoutes')) {
    options.customRoutes.forEach(route => {
      if (route.hasOwnProperty('middleware') && route.middleware.length > 0) {
        router[route.method.toLowerCase()](
          route.path,
          route.middleware,
          Controller[route.handler],
        );
      } else {
        if (Controller[route.handler]) {
          router[route.method.toLowerCase()](
            route.path,
            Controller[route.handler],
          );
        }
      }
    });
  }

  return router;
};
