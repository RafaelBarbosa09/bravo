import Cache from "./Cache";
import {createClient, RedisClientType} from "redis";

class RedisAdapter implements Cache {
    private client: RedisClientType;

    constructor() {
        this.client = createClient(); 
        this.client.connect();
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        if(!data) {
            return null;
        }

        return JSON.parse(data) as T;
    }
    
    async set<T>(key: string, value: T): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
    }

    async invalidate(key: string): Promise<void> {
        await this.client.del(key);
    }
}

export default RedisAdapter;