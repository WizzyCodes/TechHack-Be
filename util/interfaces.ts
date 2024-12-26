import { Document } from "mongoose";

interface iUser {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  avatarID: string;
  Verified: boolean;
  verifiedToken: string;
}

export interface iUserData extends iUser, Document {}
