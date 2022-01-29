import mongoose from "mongoose";

const {MONGODB_URI} = process.env;

const mongoDBService = () => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      // tslint:disable-next-line:no-console
      console.info("Successfully connected to MongoDB");
    })
    .catch((error) => {
      // tslint:disable-next-line:no-console
      console.info("MongoDb connection failed. exiting now...");
      // tslint:disable-next-line:no-console
      console.error(error);
      process.exit(1);
    });
};

export default mongoDBService;
