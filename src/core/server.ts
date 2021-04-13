import express, { Express, Router } from "express";
import mongoose from "mongoose";
import cors from "cors";

/**
 * Express Server with Mongoose
 */
class Server {
  private static _instance: any;
  private _api_path: string;
  private _port: number;

  private _express: Express;

  private constructor() {
    // Load environment
    this._api_path = process.env.API_PATH || "/api/";
    this._port = Number(process.env.PORT);

    // Load Server
    this._express = express();

    // Load middlewares
    this.loadMiddlewares();

    // Load DB
    this.connectDB();
  }

  /**
   * Singleton pattern to unique Server instance
   * 
   * @returns Server
   */
  static instance(): Server {
    if (!this._instance) {
      return (this._instance = new Server()) as Server;
    }
    return this._instance as Server;
  }

  /**
   * Add routes from modules to Server
   * Example final point: http|https:://yourserver.com/api/users
   * with methods: POST, GET, PUT, DELETE, PATCH, etc...
   * 
   * @param path module path, example: users, auth, products, etc.
   * @param router 
   */
  loadRoutes(path: string, router: Router): void {
    this._express.use(`${this._api_path}path`, router);
  }

  /**
   * Express Server listen on environment PORT or 5000
   */
  listen(): void {
    this._express.listen(this._port, () => {
      console.log(`REST Server listening on http://localhost:${this._port}`);
    });
  }

  /**
   * Basic middlewares to Express Server: public directory, cors and json 
   * Add route test on point: <yourserver>/api/test
   */
  private loadMiddlewares(): void {
    this._express.use(express.static("public"));
    this._express.use(cors());
    this._express.use(express.json());
    this.loadRoutes('test', Router().get('test', (req, res) => res.status(200).json({msg: 'OK!'})));
  }

  /**
   * Async function to Connect to MongoDB with CNN or show error on console
   */
  private async connectDB(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGO_CNN || "", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      console.log('DB Online!');
    } catch (error) {
      console.log(error);
    }
  }
}

export = Server;
