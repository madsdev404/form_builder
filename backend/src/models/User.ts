import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  airtableUserId: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
  scopes: string[];
}

const userSchema = new Schema<IUser>(
  {
    airtableUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profilePictureUrl: { type: String },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    tokenExpiresAt: { type: Date, required: true },
    scopes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
