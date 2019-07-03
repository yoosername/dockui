module.exports = async ({
  baseUrl,
  fetcher,
  screen,
  formatters,
  logger,
  appId
}) => {
  const uri = `${baseUrl}/api/v1/admin/app/${appId}/disable`;
  try {
    const { response, body } = await fetcher({
      uri,
      method: "PUT",
      json: true
    });
    if (!response.statusCode === 200) {
      logger.error("There was an error calling the management Api(%s)", uri);
      logger.error(response.message);
      resolve();
    }
    if (body && body.length && body.length > 0) {
      screen.log(`App(key=${body.key},id=${body.id}) has been disabled`);
    }
  } catch (err) {
    logger.error("Error connecting to Management API (%s)", uri);
    logger.debug(err);
  }
};
