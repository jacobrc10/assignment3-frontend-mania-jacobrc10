const mongoose = require("mongoose");
const express = require("express");
const { connectDB } = require("./connectDB.js");
const { populatePokemons } = require("./populatePokemons.js");
const { getTypes } = require("./getTypes.js");
const { handleErr } = require("./errorHandler.js");
const cors = require("cors");
const { asyncWrapper } = require("./asyncWrapper.js");
const dotenv = require("dotenv");
dotenv.config();

const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonAuthError,
} = require("./errors.js");

const app = express();
// const port = 5000
var pokeModel = null;

const start = asyncWrapper(async () => {
  await connectDB({ drop: false });

  const pokeSchema = await getTypes();
  // pokeModel = await populatePokemons(pokeSchema);
  pokeModel = mongoose.model("pokemons", pokeSchema);

  app.listen(process.env.serverPORT, async (err) => {
    if (err) throw new PokemonDbError(err);
    else
      console.log(`Phew! Server is running on port: ${process.env.serverPORT}`);
    const doc = await userModel.findOne({ username: "admin" });
    if (!doc)
      userModel.create({
        username: "admin",
        password: bcrypt.hashSync("admin", 10),
        role: "admin",
        email: "admin@admin.ca",
      });
  });
});
start();

app.use(express.json());
app.use(
  cors({
    exposedHeaders: ["auth-token-access", "auth-token-refresh"],
  })
);
const jwt = require("jsonwebtoken");
// const { findOne } = require("./userModel.js")
const userModel = require("./userModel.js");

const bcrypt = require("bcrypt");
app.post(
  "/register",
  asyncWrapper(async (req, res) => {
    const { username, password, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userWithHashedPassword = { ...req.body, password: hashedPassword };

    const user = await userModel.create(userWithHashedPassword);
    res.send(user);
  })
);

let refreshTokens = []; // replace with a db
app.post(
  "/requestNewAccessToken",
  asyncWrapper(async (req, res) => {
    // console.log(req.headers);
    const refreshToken = req.header("auth-token-refresh");
    if (!refreshToken) {
      throw new PokemonAuthError("No Token: Please provide a token.");
    }
    if (!refreshTokens.includes(refreshToken)) {
      // replaced a db access
      console.log("token: ", refreshToken);
      console.log("refreshTokens", refreshTokens);
      throw new PokemonAuthError(
        "Invalid Token: Please provide a valid token."
      );
    }
    try {
      const payload = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const accessToken = jwt.sign(
        { user: payload.user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );
      res.header("auth-token-access", accessToken);
      res.send("All good!");
    } catch (error) {
      throw new PokemonAuthError(
        "Invalid Token: Please provide a valid token."
      );
    }
  })
);

app.post(
  "/login",
  asyncWrapper(async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) throw new PokemonAuthError("User not found");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new PokemonAuthError("Password is incorrect");

    const accessToken = jwt.sign(
      { user: user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
    const refreshToken = jwt.sign(
      { user: user },
      process.env.REFRESH_TOKEN_SECRET
    );
    refreshTokens.push(refreshToken);

    res.header("auth-token-access", accessToken);
    res.header("auth-token-refresh", refreshToken);

    // res.send("All good!")
    res.send(user);
  })
);

app.get(
  "/logout",
  asyncWrapper(async (req, res) => {
    const refreshToken = req.header("auth-token-refresh");
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    res.send("Logged out");
  })
);

const authUser = asyncWrapper(async (req, res, next) => {
  // const token = req.body.appid
  const token = req.header("auth-token-access");

  if (!token) {
    // throw new PokemonAuthError("No Token: Please provide an appid query parameter.")
    throw new PokemonAuthError(
      "No Token: Please provide the access token using the headers."
    );
  }
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (err) {
    throw new PokemonAuthError("Invalid Token Verification. Log in again.");
  }
});

const authAdmin = asyncWrapper(async (req, res, next) => {
  const payload = jwt.verify(
    req.header("auth-token-access"),
    process.env.ACCESS_TOKEN_SECRET
  );
  if (payload?.user?.role == "admin") {
    return next();
  }
  throw new PokemonAuthError("Access denied");
});

app.use(authUser); // Boom! All routes below this line are protected
app.get(
  "/api/v1/pokemons",
  asyncWrapper(async (req, res) => {
    if (!req.query["count"]) req.query["count"] = 10;
    if (!req.query["after"]) req.query["after"] = 0;
    // try {
    const docs = await pokeModel
      .find({})
      .sort({ id: 1 })
      .skip(req.query["after"])
      .limit(req.query["count"]);
    res.json(docs);
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.get(
  "/api/v1/pokemon",
  asyncWrapper(async (req, res) => {
    // try {
    const { id } = req.query;
    const docs = await pokeModel.find({ id: id });
    if (docs.length != 0) res.json(docs);
    else res.json({ errMsg: "Pokemon not found" });
    // } catch (err) { res.json(handleErr(err)) }
  })
);

// app.get("*", (req, res) => {
//   // res.json({
//   //   msg: "Improper route. Check API docs plz."
//   // })
//   throw new PokemonNoSuchRouteError("");
// })

app.use(authAdmin);
app.post(
  "/api/v1/pokemon/",
  asyncWrapper(async (req, res) => {
    // try {
    console.log(req.body);
    if (!req.body.id) throw new PokemonBadRequestMissingID();
    const poke = await pokeModel.find({ id: req.body.id });
    if (poke.length != 0) throw new PokemonDuplicateError();
    const pokeDoc = await pokeModel.create(req.body);
    res.json({
      msg: "Added Successfully",
    });
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.delete(
  "/api/v1/pokemon",
  asyncWrapper(async (req, res) => {
    // try {
    const docs = await pokeModel.findOneAndRemove({ id: req.query.id });
    if (docs)
      res.json({
        msg: "Deleted Successfully",
      });
    // res.json({ errMsg: "Pokemon not found" })
    else throw new PokemonNotFoundError("");
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.put(
  "/api/v1/pokemon/:id",
  asyncWrapper(async (req, res) => {
    // try {
    const selection = { id: req.params.id };
    const update = req.body;
    const options = {
      new: true,
      runValidators: true,
      overwrite: true,
    };
    const doc = await pokeModel.findOneAndUpdate(selection, update, options);
    // console.log(docs);
    if (doc) {
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc,
      });
    } else {
      // res.json({ msg: "Not found", })
      throw new PokemonNotFoundError("");
    }
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.patch(
  "/api/v1/pokemon/:id",
  asyncWrapper(async (req, res) => {
    // try {
    const selection = { id: req.params.id };
    const update = req.body;
    const options = {
      new: true,
      runValidators: true,
    };
    const doc = await pokeModel.findOneAndUpdate(selection, update, options);
    if (doc) {
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc,
      });
    } else {
      // res.json({  msg: "Not found" })
      throw new PokemonNotFoundError("");
    }
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.get("/report", (req, res) => {
  console.log("Report requested");
  res.send(`Table ${req.query.id}`);
});

app.use(handleErr);
