import Logger from "../../application/logger/Logger";

class LoggerConsole implements Logger {
    error(message: string): void {
        console.error(message);
    }

    info(message: string): void {
        console.log(message);
    }
}

export default LoggerConsole;