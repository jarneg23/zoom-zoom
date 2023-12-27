import { ReservationEntity } from "./ReservationEntity";

export type ReservationArgs = {
  token: string;
  tourId: number;
  sellerId: number;
  startDate: Date;
  endDate: Date;
  state: number;
};

export class ReservationModel {
  private constructor(
    private readonly _token: string,
    private readonly _tourId: number,
    private readonly _sellerId: number,
    private readonly _startDate: Date,
    private readonly _endDate: Date,
    private _state: number
  ) {}

  public static buildFromArgs(reservationArgs: ReservationArgs): ReservationModel {
    if (!reservationArgs) throw new Error('can not find reservation');
    const { token, tourId, sellerId, startDate, endDate, state } = reservationArgs;
    return new ReservationModel(token, tourId, sellerId, startDate, endDate, state);
  }
  public static buildFromEntity(reservationEntity: ReservationEntity): ReservationModel {
    if (!reservationEntity) throw new Error('can not find reservation');
    const { token, tour_id, seller_id, start_date, end_date, state } = reservationEntity;
    return new ReservationModel(token, tour_id, seller_id, start_date, end_date, state);
  }

  public static buildFromEntities(reservationEntities: ReservationEntity[]): ReservationModel[] {
    if (!reservationEntities) throw new Error('can not find reservation');

    return reservationEntities.map(reservationEntity => {
      const { token, tour_id, seller_id, start_date, end_date, state } = reservationEntity;
      return new ReservationModel(token, tour_id, seller_id, start_date, end_date, state);
    })
  }

  public approve(): void {
    this.state = 1;
  }

  public toJsonString(): string {
    return JSON.stringify({
      tourId: this._tourId,
      sellerId: this._sellerId,
      state: this._state,
      startDate: this._startDate,
      endDate: this._endDate
    });
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get tourId(): number {
    return this._tourId;
  }

  get sellerId(): number {
    return this._sellerId
  }

  get state(): number {
    return this._state;
  }

  get token(): string {
    return this._token;
  }

  set state(value: number) {
    this._state = value;
  }
}