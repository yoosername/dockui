const WebItemModule = require("../../../app/module/impl/WebItemModule");
const cheerio = require("cheerio");

const getWebItemContextsFromPage = ({ selector, logger }) => {
  let itemContexts = null;
  try {
    itemContexts = selector("[data-webItemsFor]");
  } catch (err) {
    logger.error("Error parsing page for WebItem contexts, error = %o", err);
  }
  return itemContexts;
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(index, array[index], array);
  }
}

const injectWebItems = async ({ dom, selector, app, modules, logger }) => {
  try {
    let webItems = "";
    modules.forEach(module => {
      // Get the template specified in the innerHTML
      let template = selector.html();
      logger.debug(
        "Building WebItem from Template for Template(%s), App(%s), Module(%s)",
        template,
        app.getKey(),
        module.getKey()
      );
      // Format the template with the values from this module
      template = template.replace(
        /\{\{[\s]*webitem\.link[\s]*\}\}/g,
        module.getUrl()
      );
      template = template.replace(
        /\{\{[\s]*webitem\.key[\s]*\}\}/g,
        module.getKey()
      );
      template = template.replace(
        /\{\{[\s]*webitem\.text[\s]*\}\}/g,
        module.getText()
      );
      template = template.replace(
        /\{\{[\s]*webitem\.tooltip[\s]*\}\}/g,
        module.getTooltip()
      );
      webItems += template;
    });

    selector.removeAttr("data-webitemsfor");
    selector.html(webItems);
  } catch (err) {
    logger.error("Error compiling WebItem, Error = %o", err);
  }
};

const filterModulesByContext = ({ modules, context, ctx }) => {
  return modules.filter(module => {
    let location = module.getLocation();
    const parts = location.split(":");
    // If used a : then check the app is the current app if not then its targetting any app
    if (parts.length >= 2) {
      if (
        !parts[0] === ctx.dockui.app.getKey() &&
        !parts[0] === ctx.dockui.app.getAlias()
      ) {
        // user specified an app and this isnt it so skipping
        return;
      }
      // In this case the location is actually the bit after the colon
      location = parts[1];
    }
    // Does the remaining part match the context in the HTML ( Regex test )
    const tester = RegExp(location);
    return tester.test(context);
  });
};

/**
 * @description Middleware function to inject WebItems into the HTML
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function addPageItems(ctx, next) {
    try {
      logger.debug("Finding Page items to inject into page");
      // If there are any item injection points
      const $ = cheerio.load(ctx.dockui.webPage.decoratedPage);
      const itemContexts = getWebItemContextsFromPage({
        selector: $,
        logger
      });
      if (itemContexts !== null) {
        // Get all modules of type WebItem which are enabled
        //logger.debug("Fragment contexts = (%o)", fragmentContexts.html());
        const webItemModules = await appService.getModules(module => {
          return (
            module.getType() === WebItemModule.DESCRIPTOR_TYPE &&
            module.isEnabled()
          );
        });
        //logger.debug("Injecting with: %o", fragmentModules);
        // For each fragment context
        await asyncForEach(itemContexts, async (i, el) => {
          const selector = $(el);
          const context = $(el).data("webitemsfor");
          const filtered = filterModulesByContext({
            modules: webItemModules,
            context,
            ctx
          });
          if (filtered && filtered.length && filtered.length > 0) {
            await injectWebItems({
              dom: $,
              selector,
              app: ctx.dockui.app,
              modules: filtered,
              logger,
              appService
            });
          }
        });
        // Once here any remaining data-webItemsFor sections have no available content so remove
        $("[data-webItemsFor]").remove();
        ctx.dockui.webPage.decoratedPage = $.html();
      }
    } catch (err) {
      logger.error("Failed to add WebItem to page, error = %o", err);
    }

    await next();
  };
};
