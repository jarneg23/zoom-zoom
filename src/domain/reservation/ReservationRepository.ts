import { ReservationModel } from "./ReservationModel";
import { getDataSource } from "../../utils/dataSource";
import { DataSource}  from "typeorm";
import { ReservationEntity } from "./ReservationEntity";

export class ReservationRepository {
  private static reservationRepository: ReservationRepository;
  constructor(private readonly dataSource: DataSource) {}

  public static async getReservationRepository() {
    if (ReservationRepository.reservationRepository) return ReservationRepository.reservationRepository
    const dataSource = await getDataSource();
    ReservationRepository.reservationRepository = new ReservationRepository(dataSource);
    return ReservationRepository.reservationRepository;
  }

  public async getReservation(sellerId: number, token: string): Promise<ReservationModel> {

    return ReservationModel.buildFromEntity(await this.dataSource.manager
      .createQueryBuilder(ReservationEntity, 'reservation')
      .select()
      .where("reservation.token = :token", { token })
      .andWhere("reservation.seller_id = :sellerId", { sellerId })
      .getOne());
  }

  public async getReservationBySeller(sellerId: number): Promise<ReservationModel[]> {
    return ReservationModel.buildFromEntities(await this.dataSource.manager
      .createQueryBuilder(ReservationEntity, 'reservation')
      .select()
      .where("reservation.seller_id = :sellerId", { sellerId })
      .getMany());
  }

  public async deleteReservation(sellerId: number, token: string): Promise<void> {
    await this.dataSource.createQueryBuilder()
      .delete()
      .from(ReservationEntity, 'reservation')
      .where("reservation.token = :token", { token })
      .andWhere("reservation.seller_id = :sellerId", { sellerId })
      .execute();
  }

  public async upsertReservation(reservationModel: ReservationModel): Promise<void> {
    await this.dataSource.createQueryBuilder()
      .insert()
      .into(ReservationEntity)
      .values({
        token: reservationModel.token,
        seller_id: reservationModel.sellerId,
        tour_id: reservationModel.tourId,
        state: reservationModel.state,
        start_date: reservationModel.startDate,
        end_date: reservationModel.endDate,
        m_time: new Date(),
      }).orUpdate(['state', 'm_time'])
      .execute();
  }
}