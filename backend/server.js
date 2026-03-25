const app = require("./app");

const PORT = process.env.PORT || 8080;

function startServer(port = PORT) {
  return app.listen(port, () => {
    console.log(`QA360 backend running on port ${port}`);
  });
}

// When run directly (e.g., `node server.js`)
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };

