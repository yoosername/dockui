module.exports = async ({ baseUrl, fetcher, screen, logger, moduleId }) => {
  const uri = `${baseUrl}/api/v1/admin/module/${moduleId}/enable`;
  try {
    const response = await fetcher({
      uri,
      method: "PUT",
      json: true
    });
    if (!response.statusCode === 200) {
      logger.error("There was an error calling the management Api(%s)", uri);
      logger.error(response.message);
      resolve();
    }
    const body = response.body;
    if (typeof body === "object") {
      // Only display id so commands can be chained
      screen.log(`${body.id}`);
    }
  } catch (err) {
    logger.error("Error connecting to Management API (%s)", uri);
    logger.debug(err);
  }
};
