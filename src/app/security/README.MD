# Security

## SecurityContext

  > Represents security info required to communicate with an APP. E.g. shared secrets etc

## Example

```javascript
const app = new App(
  "appKey",descriptor,appLoader,moduleLoaders,store,events
);
const ctx = new SecurityContext(app);
ctx.getContext();
// Returns
{
  key: key-from-app-descriptor,
  uuid: framework-unique-identifier-of-App,
  secret: a-secret-used-for-jwt-signing-etc,
  framework: {
    url: https://base.url.of.the.calling.framework.instance
  }
}
```
