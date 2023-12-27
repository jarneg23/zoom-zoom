import { PrimaryColumn, Column, Entity } from "typeorm"

@Entity({ name: 'Seller', schema: 'public' })
export class SellerEntity {
  @PrimaryColumn('int')
  seller_id: number

  @Column('text' )
  reservations: string

  @Column('text' )
  reservationRequests: string

  @Column('text' )
  holidays: string

  @Column('datetime')
  m_time: Date
}