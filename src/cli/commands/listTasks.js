module.exports = async ({ baseUrl, fetcher, screen, formatters, logger }) => {
  const uri = baseUrl + "/api/v1/admin/task";
  try {
    const response = await fetcher({
      uri,
      method: "GET",
      json: true
    });
    if (!response.statusCode === 200) {
      logger.error("There was an error calling the management Api(%s)", uri);
      logger.error(response.message);
      resolve();
    }
    const body = response.body;
    if (body && body.length && body.length > 0) {
      if (formatters.apps && typeof formatters.apps === "function") {
        screen.log(formatters.tasks(body));
      }
    } else {
      screen.log("");
    }
  } catch (err) {
    logger.error("Error connecting to Management API (%s)", uri);
    logger.debug(err);
  }
};
