module.exports = async ({ baseUrl, fetcher, screen, logger, appId }) => {
  const uri = `${baseUrl}/api/v1/admin/app/${appId}`;
  try {
    let fetchable = {
      uri,
      method: "DELETE",
      json: true
    };
    const { response, body } = await fetcher(fetchable);
    if (response.statusCode !== 200) {
      logger.error("Error unloading App(id=%s) error: %o", appId, body.error);
    }
    if (typeof body === "object") {
      screen.log(
        `App(key=${body.key},id=${body.id}) has been successfully unloaded`
      );
    }
  } catch (err) {
    logger.error("Error unloading App(id=%s) error: %o", appId, err);
  }
};