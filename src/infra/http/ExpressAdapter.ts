import express from "express";
import HttpServer from "./HttpServer";
import { HttpStatusCode } from "axios";

class ExpressAdapter implements HttpServer {
    app: any;

    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    register(method: string, url: string, callback: Function): void {
        this.app[method](url, async (req: any, res: any) => {
            try {
                const response = await callback(req.body, req.query, req.params);
                res.status(response.statusCode).json(response.data);
            } catch (error: any) {
                // refactor: create a custom error handler
                res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
            }
        });
    }
    listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    }
}

export default ExpressAdapter;