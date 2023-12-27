import { Request, Response } from 'express';
import { SellerRepository } from "../domain/seller/SellerRepository";

export default async function AddHoliday(req: Request, res: Response): Promise<Response> {
  const { sellerId, holiday } = req.query;
  if (!sellerId || !holiday) {
    res.statusCode = 204;
    res.send(`Wrong request`);
    return res;
  }

  const sellerRepository = await SellerRepository.getSellerRepository();
  const seller = await sellerRepository.getSeller(Number(sellerId));
  seller.addHoliday(String(holiday));
  await sellerRepository.upsertSeller(seller);



  res.send('update holiday');
}