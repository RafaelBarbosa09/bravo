import pgPromise from "pg-promise";
import DatabaseConnection from "./DatabaseConnection";

class PostgresAdapter implements DatabaseConnection {
    connection: any;

    constructor() {
        this.connection = pgPromise()(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`);
    }

    query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);
    }

    close(): Promise<void> {
        return this.connection.$pool.end();
    }
}

export default PostgresAdapter;