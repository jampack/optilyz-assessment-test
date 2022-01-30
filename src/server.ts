import mongoDBService from "./services/database.service";
import {app} from "./app";

const port = process.env.SERVER_PORT || 8080;

// connect to mongoDB
mongoDBService();

const server = app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.info(`🔥 Server started at http://localhost:${port} 🚀`);
});

export {server};
