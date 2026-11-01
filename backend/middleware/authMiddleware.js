const { ApiError } = require("./errorMiddleware");

function authenticateUser(authClient) {
  return async function authenticateUserMiddleware(req, res, next) {
    const authorization = req.get("authorization");
    const match =
      typeof authorization === "string" &&
      authorization.match(/^Bearer\s+([^\s,]+)$/i);

    if (!match) {
      return next(
        new ApiError(
          401,
          "A valid Bearer access token is required",
          "AUTHENTICATION_REQUIRED"
        )
      );
    }

    const token = match[1];
    if (
      !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)
    ) {
      return next(
        new ApiError(401, "The access token is invalid", "INVALID_TOKEN")
      );
    }

    try {
      const { data, error } = await authClient.auth.getUser(token);
      if (error || !data?.user?.id) {
        if (error?.status && error.status >= 500) {
          return next(
            new ApiError(
              503,
              "Authentication service is unavailable",
              "AUTHENTICATION_UNAVAILABLE"
            )
          );
        }
        return next(
          new ApiError(401, "The access token is invalid or expired", "INVALID_TOKEN")
        );
      }

      req.authenticatedUser = data.user;
      return next();
    } catch (error) {
      return next(
        new ApiError(
          503,
          "Authentication service is unavailable",
          "AUTHENTICATION_UNAVAILABLE"
        )
      );
    }
  };
}

function authorizeAdmin(databaseClient) {
  return async function authorizeAdminMiddleware(req, res, next) {
    try {
      const { data, error } = await databaseClient
        .from("admin_users")
        .select("id")
        .eq("id", req.authenticatedUser.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        return next(
          new ApiError(
            503,
            "Administrator access could not be verified",
            "ADMIN_AUTHORIZATION_UNAVAILABLE"
          )
        );
      }

      if (!data) {
        return next(
          new ApiError(403, "Administrator access is required", "FORBIDDEN")
        );
      }

      return next();
    } catch (error) {
      return next(
        new ApiError(
          503,
          "Administrator access could not be verified",
          "ADMIN_AUTHORIZATION_UNAVAILABLE"
        )
      );
    }
  };
}

module.exports = { authenticateUser, authorizeAdmin };
