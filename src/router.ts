import { Application } from "express";
import {
  ReserveController,
  CancleController,
  CheckReservationController,
  CheckReservationListController,
  ApproveReservationController,
  AddHolidayController,
} from "./controller";

export const router = (app: Application) => {
  app.get('/', (req, res) => { res.send(`Server is Ok`) });
  app.get('/check/reservation', CheckReservationController);
  app.get('/check/reservations', CheckReservationListController);

  app.post('/add/holiday', AddHolidayController);
  app.post('/approve', ApproveReservationController);
  app.post('/reserve', ReserveController);

  app.delete('/cancle', CancleController);
}