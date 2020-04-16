import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as session from "express-session";
import * as fs from "fs";
import * as helmet from "helmet";
import * as path from "path";
import "reflect-metadata";
import * as sqrl from "squirrelly";
import { createConnection } from "typeorm";
import { config } from "./config/config";
import { Badge } from "./entity/Badge";
import { Repository } from "./entity/Repository";
import { User } from "./entity/User";
import routes from "./routes";
import { toInt } from "./utils/utils";
import * as glob from "glob";
const SessionFileStore = require("session-file-store")(session);

glob(path.join(__dirname, "./views/**/*.html"), (error, files) => {
  for (const file of files) {
    const partialName = file.replace(path.join(__dirname, "./views/").replace(/\\/g, "/"), "").replace(".html", "");
    sqrl.definePartial(partialName, fs.readFileSync(file));
  }
});



// Connects to the Database -> then starts the express
createConnection({
  charset: "utf8mb4",
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
  database: config.database_name,
  entities: [User, Repository, Badge],
  host: config.database_host,
  logging: false,
  migrations: [],
  migrationsRun: true,
  password: config.database_password,
  port: toInt(config.database_port),
  synchronize: true,
  type: "mysql",
  username: config.database_user,
})
  .then(async (connection) => {
    await connection.query("SET NAMES utf8mb4;");
    await connection.synchronize();
    // tslint:disable-next-line: no-console
    console.log("Migrations: ", await connection.runMigrations());
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    const sess: session.SessionOptions = {
      cookie: {},
      resave: false,
      saveUninitialized: false,
      secret: config.secret,
      store: new SessionFileStore({}),
    };
    if (app.get("env") === "production") {
      app.set("trust proxy", 1);
      sess.cookie.secure = true;
    }

    app.use(session(sess));

    // Set all routes from routes folder
    app.use("/", routes);

    app.listen(config.port, () => {
      // tslint:disable-next-line: no-console
      console.log(`Server started on port ${config.port}!`);
    });
  })
  // tslint:disable-next-line: no-console
  .catch((error) => console.log(error));
