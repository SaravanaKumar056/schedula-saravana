import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { DoctorProfile } from './users/doctor-profile.entity';
import { PatientProfile } from './users/patient-profile.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres:HDKoKB10%40sarav@localhost:5432/internship_db',
  synchronize: false,
  logging: true,
  entities: [User, DoctorProfile, PatientProfile],
  migrations: ['src/migrations/*.ts'],
});