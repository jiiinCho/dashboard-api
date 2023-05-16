import { ApolloError, ValidationError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import {
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
  UserModel,
} from "../schema/user.schema";
import Context from "../types/context";
import { signJwt } from "../utils/jwt";

class UserService {
  async createUser(input: CreateUserInput) {
    return UserModel.create(input);
  }

  async update(input: UpdateUserInput, context: Context) {
    const userId = context.user?._id;

    if (!userId) {
      throw new ValidationError("Missing context, login first");
    }
    const updateResult = await UserModel.findOneAndUpdate(
      { _id: userId },
      { ...input, user: userId },
      {
        new: true,
        runValidators: true,
        lean: true,
      }
    );

    if (!updateResult) {
      throw new ApolloError("Failed to update");
    }

    return updateResult;
  }

  async deleteUser(id: string) {
    const deleteResult = await UserModel.deleteOne({ _id: id });

    if (!deleteResult.deletedCount) {
      throw new Error("Invalid id");
    }

    return "success";
  }

  async users() {
    return UserModel.find().lean();
  }

  async login(input: LoginInput, context: Context) {
    const e = "Invalid email or password";

    // Get our user by email
    const user = await UserModel.find().findByEmail(input.email).lean();

    if (!user) {
      throw new ApolloError(e);
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new ApolloError(e);
    }

    // sign a jwt
    const token = signJwt(user);

    // set a cookie for the jwt
    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // return the jwt
    return token;
  }
}

export default UserService;
