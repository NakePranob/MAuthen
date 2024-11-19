export interface User {
    email: string;
}

export type LoginResponse = {
    message: string;
    awsCredentials: {
      AccessKeyId: string;
      SecretAccessKey: string;
      SessionToken: string;
    };
  };