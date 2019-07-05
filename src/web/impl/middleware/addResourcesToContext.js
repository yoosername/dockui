const cheerio = require("cheerio");
const WebResourceModule = require("../../../app/module/impl/WebResourceModule");
const path = require("path");

const getResourcePath = async (appService, resource) => {
  const resourcePath = resource.path;
  const module = resource.module;
  let resourceUrl = null;
  try {
    const app = await appService.getApp(module.getAppId());
    let appKey = app.getKey();
    // If App has alias use it instead of the key for shorter URL
    if (app.getAlias() !== null) {
      appKey = app.getAlias();
    }
    let moduleKey = module.getKey();
    // If Module has aliases use first foudn one instead of the key for shorter URL
    const moduleAliases = module.getAliases();
    if (
      moduleAliases !== null &&
      moduleAliases.length &&
      moduleAliases.length > 0
    ) {
      moduleKey = moduleAliases[0];
    }

    resourceUrl = path.normalize(
      "/app/" + appKey + "/" + moduleKey + "/" + resourcePath
    );
  } catch (e) {}
  return resourceUrl;
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(index, array[index], array);
  }
}

const generateUniqueKeyFromObj = obj => {
  const key = Object.values(obj)
    .map(i => Object.values(i))
    .join(":")
    .replace(/[,\s:\.\/]/g, "");
  return key;
};

const makeUnique = orig => {
  let unique = {};
  return orig.filter(item => {
    const key = generateUniqueKeyFromObj(item);
    if (!unique.hasOwnProperty(key)) {
      unique[key] = item;
      return true;
    }
  });
};

/**
 * @description Middleware function to strip out Page resources to the context
 *              and add resources provided by other Modules to the context too
 */
module.exports = function({ config, logger, appService } = {}) {
  return async function addResourcesToContext(ctx, next) {
    // For each css, link, style, script tag parse it out for later.
    if (ctx.dockui.webPage && ctx.dockui.webPage.stack) {
      try {
        logger.debug(
          "WebPage Stack has content so attempting to Strip Page Resources out of the HTML and add them to CTX for later"
        );

        let scripts = (ctx.dockui.webPage.scripts = []);
        let links = (ctx.dockui.webPage.links = []);
        let styles = (ctx.dockui.webPage.styles = []);

        // For each item in the stack
        ctx.dockui.webPage.stack.forEach((page, idx) => {
          const $ = cheerio.load(page);

          // Strip and collect scripts (src and embedded)
          $("script")
            .each(function(i, el) {
              scripts.push({
                tag: "script",
                attributes: {
                  src: $(this).attr("src")
                },
                content: $(this).html()
              });
            })
            .remove();

          // Strip and collect links
          $("link[rel=stylesheet]")
            .each(function(i, el) {
              links.push({
                tag: "link",
                attributes: {
                  rel: $(this).attr("rel"),
                  href: $(this).attr("href")
                }
              });
            })
            .remove();

          // Strip and collect styles
          $("style")
            .each(function(i, el) {
              styles.push({
                tag: "style",
                content: $(this).html()
              });
            })
            .remove();

          ctx.dockui.webPage.stack[idx] = $.html();
        });

        // Now Add entries for each non static resource across all Resource modules that match
        // the current context
        const allResources = (await appService.getModules(module => {
          let context = module.getContext ? module.getContext() : null;
          return (
            module.getType() === WebResourceModule.DESCRIPTOR_TYPE &&
            module.getContext() === ctx.dockui.module.getKey()
          );
        }))
          .map(module => {
            // Take copy because we need to associated the module to the resource and if we dont
            // any persistance later will fail because of recursion
            // TODO: This doesnt seem to work!!!
            let decoratedResources = [...module.getResources()];
            let collection = [];
            decoratedResources.forEach(resource => {
              //resource.module = module;
              collection.push({
                module: module,
                ...resource
              });
            });
            //return decoratedResources;
            return collection;
          })
          .reduce((existingArray, newArray) => {
            return [].concat(existingArray, newArray);
          }, []); // Add starting array for the case of no starting values for reducer

        if (allResources && allResources.length && allResources.length > 0) {
          await asyncForEach(allResources, async (idx, resource) => {
            const resourcePath = await getResourcePath(appService, resource);
            switch (resource.type) {
              case "js":
                const script = {
                  tag: "script",
                  attributes: {
                    src: resourcePath
                  }
                };
                scripts.push(script);
                break;
              case "css":
                const style = {
                  tag: "link",
                  attributes: {
                    rel: "stylesheet",
                    href: resourcePath
                  }
                };
                links.push(style);
                break;
              default:
                break;
            }
          });
        }

        // Unique them and add to the context
        ctx.dockui.webPage.scripts = makeUnique(ctx.dockui.webPage.scripts);
        ctx.dockui.webPage.links = makeUnique(ctx.dockui.webPage.links);
        ctx.dockui.webPage.styles = makeUnique(ctx.dockui.webPage.styles);
      } catch (err) {
        logger.error("Error parsing current page: error = %o", err);
      }
    } else {
      logger.warn(
        "Trying to parse resources but there is no Page in the context - skipping"
      );
    }
    await next();
  };
};
