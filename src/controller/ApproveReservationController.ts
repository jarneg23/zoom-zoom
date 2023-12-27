import { Request, Response } from 'express';
import { ReservationService } from "../service/ReservationService";
import { SellerRepository } from "../domain/seller/SellerRepository";
import { ReservationRepository } from "../domain/reservation/ReservationRepository";
import { ReservationHistoryRepository } from "../domain/history/ReservationHistoryRepository";

export default async function ApproveReservation(req: Request, res: Response): Promise<Response> {
  const { sellerId, token } = req.body;

  if (!sellerId || !token) {
    res.statusCode = 204;
    res.send(`Wrong request`);
    return res;
  }

  const sellerRepository = await SellerRepository.getSellerRepository();
  const reservationRepository = await ReservationRepository.getReservationRepository();
  const reservationHistoryRepository = await ReservationHistoryRepository.getReservationHistoryRepository();
  const reservationService = ReservationService.getReservationService(sellerRepository, reservationRepository, reservationHistoryRepository);
  await reservationService.approveReservation(Number(sellerId), String(token));

  res.send(`Approved ${token} reservation`); // 예약 정보
}