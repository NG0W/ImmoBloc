const express = require("express");
const app = express();
const cors = require("cors");

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/agencies", require("./routes/agencies"));
app.use("/assets", require("./routes/assets"));
app.use("/documents", require("./routes/documents"));
app.use("/offers", require("./routes/offers"));
app.use("/payments", require("./routes/payments"));
app.use("/users", require("./routes/users"));

app.listen(5000, () => { console.log(`Server is starting on port 5000`); });
