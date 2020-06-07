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
import * as glob from "glob";
import { config } from "./config/config";
import { Badge } from "./entity/plugins/readmeBadges/Badge";
import { Repository } from "./entity/system/Repository";
import { User } from "./entity/system/User";
import routes from "./routes";
import { toInt } from "./utils/utils";
import * as sessions from "session-file-store";
import { DependencyUpgradeJob } from "./entity/plugins/dependencies/DependencyUpgradeJob";

const SessionFileStore = sessions(session);

glob(path.join(__dirname, "./views/**/*.html"), (error, files) => {
    for (const file of files) {
        const partialName = file.replace(path.join(__dirname, "./views/").replace(/\\/g, "/"), "").replace(".html", "");
        sqrl.definePartial(partialName, fs.readFileSync(file).toString());
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
    database: config.databaseName,
    entities: [User, Repository, Badge, DependencyUpgradeJob],
    host: config.databaseHost,
    logging: false,
    migrations: [],
    migrationsRun: true,
    password: config.databasePassword,
    port: toInt(config.databasePort),
    synchronize: true,
    type: "mysql",
    username: config.databaseUser,
})
    .then(async (connection) => {
        await connection.query("SET NAMES utf8mb4;");
        await connection.synchronize();
        // eslint-disable-next-line
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
            // eslint-disable-next-line
            console.log(`Server started on port ${config.port}!`);
        });
    })
    // eslint-disable-next-line
    .catch((error) => console.log(error));
