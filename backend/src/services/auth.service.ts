import { User } from "@/models/user";
import { HashHelper } from "@/utils/helpers/hashHelper";

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

  static async loginUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await HashHelper.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    return user;
  }

  static async getUserById(userId: string) {
    return User.findById(userId);
  }
}
