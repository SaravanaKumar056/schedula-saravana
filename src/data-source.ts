import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { DoctorProfile } from './users/doctor-profile.entity';
import { PatientProfile } from './users/patient-profile.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: true,
  entities: [User, DoctorProfile, PatientProfile],
  migrations: ['src/migrations/*.ts'],
});