import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { DoctorProfile } from './doctor-profile.entity';
import { PatientProfile } from './patient-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, DoctorProfile, PatientProfile])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}