declare module '@upstash/redis' {
  export class Redis {
    constructor(options: {
      url: string;
      token: string;
    });
    
    set(key: string, value: any): Promise<string>;
    get(key: string): Promise<any>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    ttl(key: string): Promise<number>;
    incr(key: string): Promise<number>;
    decr(key: string): Promise<number>;
    sadd(key: string, ...members: string[]): Promise<number>;
    srem(key: string, ...members: string[]): Promise<number>;
    smembers(key: string): Promise<string[]>;
    sismember(key: string, member: string): Promise<number>;
    hset(key: string, field: string, value: any): Promise<number>;
    hget(key: string, field: string): Promise<any>;
    hgetall(key: string): Promise<Record<string, any>>;
    hdel(key: string, ...fields: string[]): Promise<number>;
    lpush(key: string, ...elements: string[]): Promise<number>;
    rpush(key: string, ...elements: string[]): Promise<number>;
    lpop(key: string): Promise<string | null>;
    rpop(key: string): Promise<string | null>;
    lrange(key: string, start: number, stop: number): Promise<string[]>;
    llen(key: string): Promise<number>;
    keys(pattern: string): Promise<string[]>;
    flushall(): Promise<string>;
    ping(): Promise<string>;
  }
  
  export default Redis;
} 