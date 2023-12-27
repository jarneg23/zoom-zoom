import { SellerInterface } from "./SellerModel";
import { SellerModel } from "./SellerModel";
import { getDataSource } from "../../utils/dataSource";
import { getRedisClient } from "../../utils/redis";
import { DataSource } from "typeorm";
import { SellerEntity } from "./SellerEntity";
import { Redis } from "ioredis";

export class SellerRepository {
  private static sellerRepository: SellerRepository;

  constructor(private readonly dataSource: DataSource, private  readonly redisClient: Redis) {}

  public static async getSellerRepository() {
    if (SellerRepository.sellerRepository) return SellerRepository.sellerRepository
    const dataSource = await getDataSource();
    const redisClient = await getRedisClient();
    SellerRepository.sellerRepository = new SellerRepository(dataSource, redisClient);
    return SellerRepository.sellerRepository;
  }

  async getSeller(sellerId: number): Promise<SellerInterface> {
    if (await this.redisClient.exists(String(sellerId))) {
      return SellerModel.buildFromArgs(JSON.parse(await this.redisClient.get(String(sellerId))));
    }

    return SellerModel.buildFromEntity(await this.dataSource.manager
      .createQueryBuilder(SellerEntity, 'seller')
      .select()
      .where("seller.seller_id = :sellerId", { sellerId })
      .getOne()
    );
  }

  async upsertSeller(seller: SellerInterface): Promise<void> {
    const { reservationList, reservationRequestList, holidayList, sellerId } = seller;

    await this.dataSource.createQueryBuilder()
      .insert()
      .into(SellerEntity)
      .values({
        seller_id: sellerId,
        holidays: JSON.stringify(holidayList),
        reservations: JSON.stringify(reservationList),
        reservationRequests: JSON.stringify(reservationRequestList),
        m_time: new Date()
      })
      .orUpdate(['holidays', 'reservations', 'reservationRequests', 'm_time'])
      .execute();

    await this.cache(seller);
  }

  public async getTodayReservationCount(sellerId: number): Promise<number> {
    return Number(await this.redisClient.get(`${sellerId}_reservation_count`) || '0');
  }

  public async setTodayReservationCount(sellerId: number, reservationCount: number): Promise<void> {
    await this.redisClient.set(`${sellerId}_reservation_count`, reservationCount);
  }

  private async cache(seller: SellerInterface): Promise<void> {
    await this.redisClient.set(String(seller.sellerId), JSON.stringify(seller));
  }
}