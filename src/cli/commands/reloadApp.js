module.exports = async ({
  baseUrl,
  fetcher,
  screen,
  logger,
  appId,
  permission
}) => {
  const uri = `${baseUrl}/api/v1/admin/app/${appId}/reload`;
  try {
    let fetchable = {
      uri,
      method: "PUT",
      json: true
    };
    if (permission) {
      fetchable.body = {
        permission: permission
      };
    }
    const response = await fetcher(fetchable);
    if (response.statusCode !== 200) {
      logger.error(
        "Error reloading App(id=%s) error: %o",
        appId,
        response.body.error
      );
    }
    const body = response.body;
    if (typeof body === "object") {
      screen.log(
        // Only return id so we can chain together commands
        `${body.id}`
      );
    }
  } catch (err) {
    logger.error("Error reloading App(id=%s) error: %o", appId, err);
  }
};
