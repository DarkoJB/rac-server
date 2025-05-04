const { app } = require("./api/index.js");

// For local run-time development
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running locally on port ${PORT}`);
});
