import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { DoctorProfile } from './doctor-profile.entity';
import { PatientProfile } from './patient-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(DoctorProfile) private doctorRepository: Repository<DoctorProfile>,
    @InjectRepository(PatientProfile) private patientRepository: Repository<PatientProfile>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  //DOCTOR ONBOARDING LOGIC
  async createDoctorProfile(userId: number, profileData: any) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const existingProfile = await this.doctorRepository.findOne({ where: { user: { id: userId } } });

    if (existingProfile) {
      throw new BadRequestException('Doctor profile already exists. Use PATCH to update.');
    }

    const newProfile = this.doctorRepository.create({
      ...profileData,
      user: user,
    });

    return this.doctorRepository.save(newProfile);
  }

  async getDoctorProfile(userId: number) {
    const profile = await this.doctorRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      throw new NotFoundException('Doctor profile not found. Please complete onboarding.');
    }
    return profile;
  }

  async updateDoctorProfile(userId: number, updateData: any) {
    const profile = await this.doctorRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      throw new NotFoundException('Doctor profile not found.');
    }

    Object.assign(profile, updateData);
    return this.doctorRepository.save(profile);
  }
  // --- PATIENT ONBOARDING LOGIC ---
  async createPatientProfile(userId: number, profileData: any) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const existingProfile = await this.patientRepository.findOne({ where: { user: { id: userId } } });

    if (existingProfile) {
      throw new BadRequestException('Patient profile already exists. Use PATCH to update.');
    }

    const newProfile = this.patientRepository.create({
      ...profileData,
      user: user,
    });

    return this.patientRepository.save(newProfile);
  }

  async getPatientProfile(userId: number) {
    const profile = await this.patientRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      throw new NotFoundException('Patient profile not found. Please complete onboarding.');
    }
    return profile;
  }

  async updatePatientProfile(userId: number, updateData: any) {
    const profile = await this.patientRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      throw new NotFoundException('Patient profile not found.');
    }

    Object.assign(profile, updateData);
    return this.patientRepository.save(profile);
  }
}