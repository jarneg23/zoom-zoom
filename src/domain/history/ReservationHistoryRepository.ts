import { ReservationModel } from "../reservation/ReservationModel";
import { getDataSource } from "../../utils/dataSource";
import { DataSource } from "typeorm";
import { ReservationHistoryEntity } from "./ReservationHistoryEntity";

export class ReservationHistoryRepository {
  private static reservationHistoryRepository: ReservationHistoryRepository;
  constructor(private readonly dataSource: DataSource) {}

  public static async getReservationHistoryRepository() {
    if (ReservationHistoryRepository.reservationHistoryRepository) return ReservationHistoryRepository.reservationHistoryRepository
    const dataSource = await getDataSource();
    ReservationHistoryRepository.reservationHistoryRepository = new ReservationHistoryRepository(dataSource);
    return ReservationHistoryRepository.reservationHistoryRepository;
  }

  public async insertReservationHistory(action: number, reservation: ReservationModel, preReservationValue?: string): Promise<void> {
    await this.dataSource.createQueryBuilder()
      .insert()
      .into(ReservationHistoryEntity)
      .values({
        seller_id: reservation.sellerId,
        token: reservation.token,
        pre_value: preReservationValue || '{}',
        post_value: reservation.toJsonString(),
        action,
        c_time: new Date()
      })
      .execute();
  }

}