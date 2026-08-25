export type UserRegisterDataType = {
  email: string;
  password: string;
  name: {
    first: string;
    last: string;
  };
};

export type UserLoginDataType = {
  email: string;
  password: string;
};

export type AuthUserType = {
  id: string;
  email: string;
  name: {
    first: string;
    last: string;
  };
};

export type AuthResponseType = {
  message: string;
  data: {
    user: AuthUserType;
  };
};

export type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export type MeResponse = {
  message: string;
  data: {
    user: AuthUserType;
  };
};

export type LogoutResponse = {
  message: string;
};