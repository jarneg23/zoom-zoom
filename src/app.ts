import express from "express";
import { router } from "./router";
import { urlencoded, json } from 'body-parser';
import { registerCronSchedule } from "./utils/cron";
import { refreshSellerReservationCount } from "./utils/refresh";
import "reflect-metadata";

const app = express();
app.use(urlencoded({ extended: true, limit: '5mb' }));
app.use(json({ limit: '5mb' }));
app.set('port', 1234);
router(app);
app.listen(app.get('port'), () => {
  console.debug(`Express server listening on port ${app.get('port')}`);
})

registerCronSchedule('0 0 * * *', refreshSellerReservationCount);
