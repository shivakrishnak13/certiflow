import { User } from "@/models/user";
import { HashHelper } from "@/utils/configuration/helpers/hashHelper";

export class AuthService {
  static async findUserByEmail(email: string) {
    return await User.findOne({ email }).select("+password");
  }

  static async createUser(
    email: string,
    password: string,
    name: { first: string; last: string },
  ) {
    const hashedPassword = await HashHelper.hash(password);

    const user = new User({ email, password: hashedPassword, name });
    return await user.save();
  }
}
