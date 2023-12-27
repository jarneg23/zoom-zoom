import { Request, Response } from 'express';
import { ReservationService } from "../service/ReservationService";
import { SellerRepository } from "../domain/seller/SellerRepository";
import { ReservationRepository } from "../domain/reservation/ReservationRepository";

export default async function CheckReservationList(req: Request, res: Response): Promise<void> {
  const { sellerId, month } = req.query;
  if (!sellerId || !month) {
    res.statusCode = 204;
    res.send(`Wrong request`);
    return ;
  }

  const sellerRepository = await SellerRepository.getSellerRepository();
  const reservationRepository = await ReservationRepository.getReservationRepository();
  const reservationService = ReservationService.getReservationService(sellerRepository, reservationRepository)

  const availableDays = await reservationService.getAvailableReservationDays(Number(sellerId), Number(month));

  if (availableDays) {
    res.json(JSON.stringify(availableDays));
  } else {
    res.send(`There are not available days`);
  }
}