# AppStore

> AppStore represents the persistence mechanism for State etc

### Example

```javascript
const config = new EnvConfigLoader();
const factory = new StoreFactory();
const store = factory.create(config);
const itemId = await store.create({ something: "nothing" });
const fetchedItem = await store.read({ id: itemId });
expect(itemId).toBe(fetchedItem.id);
```
