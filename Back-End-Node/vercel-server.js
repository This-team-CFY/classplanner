const app = require("./server.js");

// vercel requires an export to avoid the error
//   No exports found in module "../../Back-End-Node/server.js".
//   Did you forget to export a function or a server?
export default app;