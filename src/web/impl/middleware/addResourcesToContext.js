let cheerio = require("cheerio");

/**
 * @description Middleware function to strip out Page resources to the context
 *              and add resources provided by other Modules to the context too
 */
module.exports = function({ config, logger } = {}) {
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

        // Unique them
        let unique = {};
        ctx.dockui.webPage.scripts = scripts.filter(script => {
          if (!unique[script.tag + script.attributes.src + script.content]) {
            unique[
              script.tag + script.attributes.src + script.content
            ] = script;
            return true;
          }
        });
        ctx.dockui.webPage.links = links.filter(link => {
          if (!unique[link.tag + link.attributes.href]) {
            unique[link.tag + link.attributes.href] = link;
            return true;
          }
        });
        ctx.dockui.webPage.styles = styles.filter(style => {
          if (!unique[style.tag + style.content]) {
            unique[style.tag + style.content] = style;
            return true;
          }
        });

        // Now for each non static item across all Resource modules
        // Add them too
        // TODO: this
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
