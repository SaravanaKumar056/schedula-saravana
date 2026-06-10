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
  //DOCTOR DISCOVERY APIs
  async findAllDoctors(query: any) {
    // 1. Handle Pagination Edge Cases (Defaults to page 1, limit 10)
    const page = query.page && Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = query.limit && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    // 2. Build the Query dynamically
    const queryBuilder = this.doctorRepository.createQueryBuilder('doctor');

    // 3. Filter by Specialization (Exact or partial match)
    if (query.specialization) {
      queryBuilder.andWhere('doctor.specialization ILIKE :specialization', {
        specialization: `%${query.specialization}%`,
      });
    }

    // 4. Search by Name (Partial match)
    if (query.search) {
      queryBuilder.andWhere('doctor.fullName ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    // 5. Bonus: Availability Filter
    if (query.availability) {
      // Assuming availability field has text like "Available" or "Mon-Fri"
      queryBuilder.andWhere('doctor.availability ILIKE :availability', {
        availability: `%${query.availability}%`,
      });
    }

    // 6. Execute Query and Count for Pagination
    const [doctors, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    if (total === 0) {
      // Returning empty array and 200 OK is standard REST practice for empty searches
      return { data: [], total: 0, page, limit, message: 'No doctors found matching your criteria.' };
    }

    return {
      data: doctors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneDoctorById(id: number) {
    // Handle invalid ID format
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid doctor ID format.');
    }

    const doctor = await this.doctorRepository.findOne({ where: { id } });
    
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found.`);
    }

    return doctor;
  }
}