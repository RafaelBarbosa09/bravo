interface Cache {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    invalidate(key: string): Promise<void>;
}

export default Cache;