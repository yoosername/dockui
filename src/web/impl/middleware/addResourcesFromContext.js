const cheerio = require("cheerio");

/**
 * @description Middleware function to add resources in the Context back to
 *              The HTML of the Page
 */
module.exports = function({ config, logger } = {}) {
  return async function addResourcesFromContext(ctx, next) {
    logger.debug("Add Resources back in to the HTML");

    // for the decorated page
    const page = ctx.dockui.webPage.decoratedPage;
    const $ = cheerio.load(page);

    // See if there is a Script injection point and if so add all known scripts
    let links = ctx.dockui.webPage.links;
    let styles = ctx.dockui.webPage.styles;
    let scripts = ctx.dockui.webPage.scripts;
    // {
    //   tag: "script",
    //   attributes: {
    //     src: $(this).attr("src")
    //   },
    //   content: $(this).html()
    // }
    const headResources = $("meta[name=WebResourcesFor]");
    headResources.each(function(i, el) {
      let types = $(this).attr("content");
      types = types.split(",");
      types.forEach(type => {
        switch (type) {
          case "link":
            links.forEach(link => {
              $(this).before(
                `<link rel="${link.attributes.rel}" href="${
                  link.attributes.href
                }">`
              );
            });
            break;
          case "style":
            styles.forEach(style => {
              $(this).before(`<style>${style.content}</style>`);
            });
            break;
        }
      });
      $(this).remove();
    });

    // Do bodyResources
    $("[data-WebResourcesFor]").each(function(i, el) {
      let resourcesFor = $(this).data("webresourcesfor");
      console.log(resourcesFor);
      let parts = resourcesFor.split(":");
      let resourceType = parts[0];
      let embedTypes = parts[1].split(",");

      switch (resourceType) {
        case "script":
          embedTypes.forEach(type => {
            scripts.forEach(script => {
              switch (type) {
                case "src":
                  if (script.attributes.src) {
                    $(this).before(
                      `<script src="${script.attributes.src}"></script>`
                    );
                  }
                  break;
                case "content":
                  if (script.content) {
                    $(this).before(`<script>${script.content}</script>`);
                    break;
                  }
              }
            });
          });
          $(this).remove();
          break;
        case "link":
          links.forEach(link => {
            if (link.attributes.src) {
              $(this).before(`<link src="${link.attributes.src}" />`);
            }
          });
          $(this).remove();
          break;
        case "style":
          styles.forEach(style => {
            if (style.content) {
              $(this).before(`<style>${style.content}</style>`);
            }
          });
          $(this).remove();
          break;
      }
    });

    ctx.dockui.webPage.decoratedPage = $.html();
    await next();
  };
};
