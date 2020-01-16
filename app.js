require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");

var app = express();

//AUTHENTICATION
app.use((req, res, next) => {
  const apiKey = req.get("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY)
    return res.status(401).json({ message: "Unauthorized" });
  else return next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//ROUTES
app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send error
  res.status(err.status || 500).json({
    message: err.message || "Uknown Error"
  });
});

console.log(
  'process.env.NODE_ENV === "production"',
  process.env.NODE_ENV === "production"
);
module.exports = app;
