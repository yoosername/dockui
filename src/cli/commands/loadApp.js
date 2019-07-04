module.exports = async ({
  baseUrl,
  fetcher,
  screen,
  logger,
  url,
  permission
}) => {
  const uri = `${baseUrl}/api/v1/admin/app`;
  try {
    const request = {
      url: url,
      permission: permission
    };
    const { response, body } = await fetcher({
      uri,
      method: "POST",
      json: true,
      body: request
    });
    if (!response.statusCode === 200) {
      logger.error("There was an error calling the management Api(%s)", uri);
      logger.error(response.message);
      resolve();
    }
    if (typeof body === "object") {
      screen.log(
        `App(key=${body.key},id=${body.id}) has been successfully loaded`
      );
    }
  } catch (err) {
    logger.error("Error connecting to Management API (%s)", uri);
    logger.debug(err);
  }
};
