export class RegisterUserRequest {
  username: string;
  name: string;
  password: string;
}

// export class RegisterUserResponse {}

export class UserResponse {
  username: string;
  name: string;
  token?: string;
}

// export class UserResponse {
//   code: number;
//   msg: string;
//   data: {
//     username: string;
//     name: string;
//     token?: string;
//   };
// }

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}
