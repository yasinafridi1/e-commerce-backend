import { UserProps } from "../../models/UserModel";

export const adminDto = ({
  userId,
  email,
  fullName,
  role,
  profilePicture,
}: UserProps) => ({
  userId,
  email,
  fullName,
  role,
  ...(profilePicture && { profilePicture }),
});
