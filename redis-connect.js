import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'YAm29WtSzGeeFa9z4McFMGYlCuETrxjW',
    socket: {
        host: 'redis-16655.c330.asia-south1-1.gce.cloud.redislabs.com',
        port: 16655
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar