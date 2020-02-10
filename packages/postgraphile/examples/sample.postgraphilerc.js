module.exports = {
  options: {
    connection:
      "postgres://api_user:api_password@localhost:5432/api_development",
    schema: ["myApp", "myAppPrivate"], // Command line comma separated options must be entered as arrays
    jwtSecret: "myJwtSecret",
    defaultRole: "myapp_anonymous",
    token: "myApp.jwt_token",
  },
};
