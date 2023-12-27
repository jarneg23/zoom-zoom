import express from 'express';
import { ReservationService } from "../service/ReservationService";
import { SellerRepository } from "../domain/seller/SellerRepository";
import { ReservationRepository } from "../domain/reservation/ReservationRepository";
import { pick } from 'lodash';
import { getRedisClient } from "../utils/redis";
import { ReservationHistoryRepository } from "../domain/history/ReservationHistoryRepository";
export default async function reserve(req: express.Request, res: express.Response) {
  const { sellerId, tourId, startDate, endDate } = pick(req.body, ['sellerId', 'tourId', 'startDate', 'endDate']);

  if (!sellerId || !tourId || !startDate || !endDate) {
    res.statusCode = 204;
    res.send(`Wrong request`);
    return res;
  }

  const sellerRepository = await SellerRepository.getSellerRepository();
  const reservationRepository = await ReservationRepository.getReservationRepository();
  const reservationHistoryRepository = await ReservationHistoryRepository.getReservationHistoryRepository();
  const reservationService = ReservationService.getReservationService(sellerRepository, reservationRepository, reservationHistoryRepository)

  const token = await reservationService.reserve(Number(sellerId), Number(tourId), new Date(startDate), new Date(endDate));

  if (token) {
    res.send(token);
  } else {
    res.send(`Can not reserve that period`);
  }
}