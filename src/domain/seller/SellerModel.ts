import { ReservationModel } from "../reservation/ReservationModel";
import { SellerEntity } from "./SellerEntity";

export type SellerArgs = {
  sellerId: number;
  reservations: string;
  reservationRequests: string;
  holidays: string;
};

export interface SellerInterface {
  get sellerId(): number;
  get holidayList(): string[];
  get reservationList(): string[];
  get reservationRequestList(): string[];
  reserve(reservation: ReservationModel, reservationCount: number): string | undefined;
  cancle(reservation: ReservationModel): void;
  approve(token: string): void
  addHoliday(holiday: string): void;
  isAvailableReserve(reservation: ReservationModel): boolean;
  isAvailableDay(month: number, date: number): boolean;
}

export class SellerModel implements SellerInterface {
  _sellerId: number;
  _holidayList: string[];
  _reservationList: string[];

  _reservationRequestList: string[];

  private constructor(sellerId: number, holidayList: string[], reservationList: string[], reservationRequestList: string[]) {
    this._sellerId = sellerId;
    this._holidayList = holidayList;
    this._reservationList = reservationList;
    this._reservationRequestList = reservationRequestList;
  }

  cancle(reservation: ReservationModel): void {
    const { token } = reservation;
    const index = this.reservationList.indexOf(token, 0);
    if (index > -1) {
      this._reservationList.splice(index, 1);
    }
  }

  reserve(reservation: ReservationModel, reservationCount: number): string | undefined {
    const { token } = reservation;
    if (!this.isAvailableReserve(reservation)) return;

    if (reservationCount >= 5) {
      this._reservationRequestList.push(token);
    } else {
      this._reservationList.push(token);
    }
    return token;
  }

  approve(token: string): void {
    this._reservationList[token] = this._reservationRequestList[token];
    delete this._reservationList[token];
  }

  addHoliday(holiday: string): void {
    this._holidayList.push(holiday);
  }

  public isAvailableReserve(reservation: ReservationModel): boolean {
    const { startDate, endDate } = reservation;
    return !this._holidayList.some(holiday => {
      const holidayDate = new Date(holiday);
      if ((startDate.getTime() <= holidayDate.getTime() && holidayDate.getTime() >= endDate.getTime())) {
        return true;
      }
    })
  }

  public isAvailableDay(month: number, date: number): boolean {
    return !this._holidayList.some(holiday => {
      const holidayDate = new Date(holiday).getDate();
      const holidayDay = new Date(holiday).getMonth();
      if (month === holidayDay && holidayDate === date) {
        return true;
      }
    });
  }

  public static buildFromArgs(sellerArgs: SellerArgs): SellerInterface {
    const {
      sellerId,
      reservations,
      reservationRequests,
      holidays
    } = sellerArgs;

    return new SellerModel(sellerId, JSON.parse(holidays), JSON.parse(reservations), JSON.parse(reservationRequests));
  }

  public static buildFromEntity(sellerEntity: SellerEntity): SellerInterface {
    if (!sellerEntity) throw new Error('can not find seller');

    const {
      seller_id,
      reservations,
      reservationRequests,
      holidays
    } = sellerEntity;

    return new SellerModel(seller_id, JSON.parse(holidays), JSON.parse(reservations), JSON.parse(reservationRequests));
  }

  get sellerId(): number {
    return this._sellerId;
  }

  get holidayList(): string[] {
    return this._holidayList;
  }

  get reservationList(): string[] {
    return this._reservationList;
  }
  get reservationRequestList(): string[] {
    return this._reservationRequestList;
  }
}