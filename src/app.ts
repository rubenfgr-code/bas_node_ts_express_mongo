import Server from "./core/server";

const main = async () => {
  (await import("dotenv")).config();
  Server.instance().listen();
};

main();
   