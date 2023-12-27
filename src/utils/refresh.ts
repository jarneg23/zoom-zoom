import { getRedisClient } from "./redis";

export const refreshSellerReservationCount = async () => {
  const pattern = '*_reservation_count';
  const client = await getRedisClient();
  client.scan('0', 'MATCH', pattern, 'COUNT', '100', (err, keys) => {
    if (err) throw err;

    if (keys.length > 0) {
      client.del(...keys, (delErr, reply) => {
        if (delErr) throw delErr;
        console.log(`${reply} keys removed.`);
      });
    } else {
      console.log('No matching keys found.');
    }
  });
}