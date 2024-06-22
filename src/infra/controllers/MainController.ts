import { HttpStatusCode } from "axios";
import HttpServer from "../http/HttpServer";

class MainController {
    constructor(readonly httpServer: HttpServer) {
        httpServer.register('get', '/healthcheck', async () => {
            return {
                statusCode: HttpStatusCode.Ok,
                data: {
                    status: 'ok'
                }
            }
        });

        httpServer.register('get', '/readiness', async () => {
            return {
                statusCode: HttpStatusCode.Ok,
                data: {
                    status: 'ok'
                }
            }
        });
    }
}

export default MainController;