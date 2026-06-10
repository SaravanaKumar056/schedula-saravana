import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { UserRole } from './users/user.entity';

@Controller()
export class AppController {
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Get('doctor/profile')
  getDoctorProfile(@Request() req) {
    return {
      message: 'Access Granted: Welcome to the Doctor Dashboard.',
      user: req.user,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @Get('patient/profile')
  getPatientProfile(@Request() req) {
    return {
      message: 'Access Granted: Welcome to the Patient Portal.',
      user: req.user,
    };
  }
}