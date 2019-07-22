module.exports = async ({ baseUrl, fetcher, screen, logger, appId }) => {
  const uri = `${baseUrl}/api/v1/admin/app/${appId}/enable`;
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
