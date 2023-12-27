import { Request, Response } from 'express';
import { ReservationService } from "../service/ReservationService";
import { SellerRepository } from "../domain/seller/SellerRepository";
import { ReservationRepository } from "../domain/reservation/ReservationRepository";

export default async function CheckReservation(req: Request, res: Response): Promise<Response> {
  const { sellerId, token } = req.query;
  if (!sellerId || !token) {
    res.statusCode = 204;
    res.send(`Wrong request`);
    return res;
  }

  const sellerRepository = await SellerRepository.getSellerRepository();
  const reservationRepository = await ReservationRepository.getReservationRepository();
  const reservationService = ReservationService.getReservationService(sellerRepository, reservationRepository)
  const reservation = await reservationService.checkReservation(Number(sellerId), String(token));

  if (!reservation) {
    res.send('Cannot find reservation');
  } else {
    res.send(`Reservation Info : ${reservation.toJsonString()}`); // 예약 정보
  }
}