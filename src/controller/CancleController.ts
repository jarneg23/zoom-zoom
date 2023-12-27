import { Request, Response } from 'express';
import { ReservationService } from "../service/ReservationService";
import { SellerRepository } from "../domain/seller/SellerRepository";
import { ReservationRepository } from "../domain/reservation/ReservationRepository";
import { getRedisClient } from "../utils/redis";
import {ReservationHistoryRepository} from "../domain/history/ReservationHistoryRepository";

export default async function cancle(req: Request, res: Response): Promise<void> {
  const { sellerId, token } = req.body;

  if (!sellerId || !token) {
    res.statusCode = 204;
    res.send(`Wrong request`);
    return;
  }

  const sellerRepository = await SellerRepository.getSellerRepository();
  const reservationRepository = await ReservationRepository.getReservationRepository();
  const reservationHistoryRepository = await ReservationHistoryRepository.getReservationHistoryRepository();
  const reservationService = ReservationService.getReservationService(sellerRepository, reservationRepository, reservationHistoryRepository);
  await reservationService.cancle(sellerId, token);
  res.send(`Cancle Reservation`);
}