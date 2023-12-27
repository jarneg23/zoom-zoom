import { PrimaryColumn, Column, Entity } from "typeorm"

@Entity({ name: 'Reservation', schema: 'public' })
export class ReservationEntity {
  @PrimaryColumn('varchar')
  token: string

  @Column('int')
  seller_id: number

  @Column('int')
  tour_id: number

  @Column('int')
  state: number

  @Column('datetime')
  start_date: Date

  @Column('datetime')
  end_date: Date

  @Column('datetime')
  m_time: Date
}