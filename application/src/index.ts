import mongo from "./external/mongoClient";
import StartUp from "./api/startUp";

const mongoConnection = mongo;

new StartUp(mongoConnection);
