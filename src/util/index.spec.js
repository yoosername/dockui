const Utils = require("./");
const App = require("../app/App");

describe("Utils", function() {
  "use strict";

  test("getHashFromApp should return unique hashes", async () => {
    expect(Utils.getHashFromApp).not.toBeUndefined();
    expect(typeof Utils.getHashFromApp).toBe("function");
    const hash = Utils.getHashFromApp(
      new App({
        key: "bingo.bongo.bango",
        version: "1.0"
      })
    );
    const hash2 = Utils.getHashFromApp(
      new App({
        key: "floppy.flappy.flippy",
        version: "1.5"
      })
    );
    const hash3 = Utils.getHashFromApp(
      new App({
        key: "bingo.bongo.bango",
        version: "1.0"
      })
    );
    expect(hash).not.toBe(hash2);
    expect(hash).toBe(hash3);
  });
});
