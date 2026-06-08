import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { PatientProfile } from './users/patient-profile.entity';
import { DoctorProfile } from './users/doctor-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:HDKoKB10@sarav@localhost:5432/internship_db',
      autoLoadEntities: true,
      synchronize: false,
      entities: [User, DoctorProfile, PatientProfile],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}