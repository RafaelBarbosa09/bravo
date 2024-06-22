import pgPromise from "pg-promise";
import DatabaseConnection from "./DatabaseConnection";

class PostgresAdapter implements DatabaseConnection {
    connection: any;

    constructor() {
        this.connection = pgPromise()(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    }

    query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);
    }

    close(): Promise<void> {
        return this.connection.$pool.end();
    }
}

export default PostgresAdapter;