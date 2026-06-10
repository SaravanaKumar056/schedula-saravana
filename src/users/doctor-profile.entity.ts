import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class DoctorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  specialization: string;

  @Column()
  experience: number;

  @Column()
  qualification: string;

  @Column('decimal', { precision: 10, scale: 2 })
  consultationFee: number;

  @Column()
  availability: string;

  @Column({ type: 'text', nullable: true })
  profileDetails: string;

  // This links the profile directly to the user who created it
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}