import { Controller, Get, Post, Patch, Body, UseGuards, Request, Query, Param } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { UserRole } from './users/user.entity';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private usersService: UsersService) {}

  // DOCTOR PROTECTED ROUTES
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Post('doctor/profile')
  async createDoctorProfile(@Request() req, @Body() body: any) {
    return this.usersService.createDoctorProfile(req.user.sub, body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Get('doctor/profile')
  async getDoctorProfile(@Request() req) {
    return this.usersService.getDoctorProfile(req.user.sub);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Patch('doctor/profile')
  async updateDoctorProfile(@Request() req, @Body() body: any) {
    return this.usersService.updateDoctorProfile(req.user.sub, body);
  }

  // ==========================================
  // PATIENT PROTECTED ROUTES
  // ==========================================
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @Post('patient/profile')
  async createPatientProfile(@Request() req, @Body() body: any) {
    return this.usersService.createPatientProfile(req.user.sub, body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @Get('patient/profile')
  async getPatientProfile(@Request() req) {
    return this.usersService.getPatientProfile(req.user.sub);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @Patch('patient/profile')
  async updatePatientProfile(@Request() req, @Body() body: any) {
    return this.usersService.updatePatientProfile(req.user.sub, body);
  }

  //DOCTOR DISCOVERY ROUTES (Patients Only)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @Get('doctor')
  async discoverDoctors(@Query() query: any) {
    return this.usersService.findAllDoctors(query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @Get('doctor/:id')
  async getDoctorById(@Param('id') id: string) {
    // Convert the string ID from the URL into a number
    return this.usersService.findOneDoctorById(Number(id));
  }
}