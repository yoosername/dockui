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
    const { response, body } = await fetcher(fetchable);
    if (response.statusCode !== 200) {
      logger.error("Error reloading App(id=%s) error: %o", appId, body.error);
    }
    if (typeof body === "object") {
      const permText = permission ? `With new Permission ${permission}` : "";
      screen.log(
        `App(key=${body.key},id=${
          body.id
        }) has been successfully reloaded ${permText}`
      );
    }
  } catch (err) {
    logger.error("Error reloading App(id=%s) error: %o", appId, err);
  }
};
