import { UserWithoutPassword } from '../users/interfaces';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

const email = 'johndoe@email.com';
const name = 'John Doe';
const password = 'P4sSw0rD!';
const company = 'Company';

export const loginStubDto: LoginDto = {
  email,
  password,
};

export const signUpStubDto: SignUpDto = {
  ...loginStubDto,
  passwordConfirmation: password,
  name,
  companyName: company,
};

export const userStub: UserWithoutPassword = {
  id: 1,
  email,
  companyName: company,
  name,
  refreshToken: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
