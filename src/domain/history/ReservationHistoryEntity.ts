import { PrimaryGeneratedColumn, Column, Entity } from "typeorm"

@Entity({ name: 'ReservationHistory', schema: 'public' })
export class ReservationHistoryEntity {
  @PrimaryGeneratedColumn()
  pkid: number

  @Column('int')
  seller_id: number

  @Column('varchar')
  token: string

  @Column('text')
  pre_value: string

  @Column('text')
  post_value: string

  @Column('int')
  action: number

  @Column('datetime')
  c_time: Date
}