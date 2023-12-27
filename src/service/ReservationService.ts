import { ReservationModel } from "../domain/reservation/ReservationModel";
import { SellerRepository } from "../domain/seller/SellerRepository";
import { ReservationRepository } from "../domain/reservation/ReservationRepository";
import { getDateDiff, getAllDayFromTargetMonth, getLastDayFromTargetMonth } from "../utils/date";
import uniqid from 'uniqid';
import { ReservationHistoryRepository } from "../domain/history/ReservationHistoryRepository";

export class ReservationService {
  private static reservationService: ReservationService;
  private constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationHistoryRepository?: ReservationHistoryRepository
  ) {};

  public static getReservationService(
    sellerRepository: SellerRepository,
    reservationRepository: ReservationRepository,
    reservationHistoryRepository?: ReservationHistoryRepository
  ) {
    if (ReservationService.reservationService) return ReservationService.reservationService;
    ReservationService.reservationService = new ReservationService(sellerRepository, reservationRepository, reservationHistoryRepository);
    return ReservationService.reservationService;
  }

  public async reserve(sellerId: number, tourId: number, startDate: Date, endDate: Date ): Promise<string> {
    const token = uniqid().toString();
    const reservation = ReservationModel.buildFromArgs({ token, tourId, sellerId, startDate, endDate, state: 0 });
    const seller = await this.sellerRepository.getSeller(sellerId);
    const reservationCount = await this.sellerRepository.getTodayReservationCount(sellerId);
    const isReserved = seller.reserve(reservation, reservationCount);
    if (isReserved) {
      await this.sellerRepository.setTodayReservationCount(sellerId, reservationCount + 1);
    }

    await this.sellerRepository.upsertSeller(seller);
    await this.reservationRepository.upsertReservation(reservation);
    await this.reservationHistoryRepository.insertReservationHistory(0, reservation);
    return token;
  }

  public async cancle(sellerId: number, token: string): Promise<void> {
    const reservation = await this.reservationRepository.getReservation(sellerId, token);
    const startDate = reservation.startDate;
    const today = new Date();
    const dateDiff = getDateDiff(startDate, today);
    if (dateDiff > 3) {
      throw Error('3일 초과');
    }

    const seller = await this.sellerRepository.getSeller(sellerId);
    seller.cancle(reservation);
    await this.sellerRepository.upsertSeller(seller)
    await this.reservationRepository.deleteReservation(sellerId, token);
    await this.reservationHistoryRepository.insertReservationHistory(-1, reservation);
    const reservationCount = await this.sellerRepository.getTodayReservationCount(sellerId);
    await this.sellerRepository.setTodayReservationCount(sellerId, reservationCount - 1);
  }

  public async approveReservation(sellerId: number, token: string): Promise<void> {
    const seller = await this.sellerRepository.getSeller(sellerId);
    const reservation = await this.reservationRepository.getReservation(sellerId, token);
    const preReservationSetting = reservation.toJsonString();
    seller.approve(token);
    reservation.approve();
    await this.sellerRepository.upsertSeller(seller);
    await this.reservationRepository.upsertReservation(reservation);
    await this.reservationHistoryRepository.insertReservationHistory(1, reservation, preReservationSetting);
  }

  public async checkReservation(sellerId: number, token: string): Promise<ReservationModel> {
    return await this.reservationRepository.getReservation(sellerId, token)
  }

  public async getAvailableReservationDays(sellerId: number, month: number): Promise<number[]> {
    const seller = await this.sellerRepository.getSeller(sellerId);

    const reservationList = (await this.reservationRepository.getReservationBySeller(sellerId)).filter(reservation => reservation.startDate.getMonth() === month);

    const lastDay = getLastDayFromTargetMonth(month);
    let availableDate = getAllDayFromTargetMonth(month);

    reservationList.forEach(reservation => {
      const startDate = reservation.startDate.getDate();
      const endDate = reservation.endDate.getDate() < startDate ? lastDay : reservation.endDate.getDate();
      availableDate = availableDate.filter(date => {
        return ((startDate > date || date > endDate) && seller.isAvailableDay(month, date));
      });
    })


    return availableDate;
  }
}