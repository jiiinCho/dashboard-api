import { Arg, Ctx, Mutation, Query, Resolver, Authorized } from "type-graphql";
import {
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
  User,
} from "../schema/user.schema";
import UserService from "../service/user.service";
import Context from "../types/context";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => User)
  updateUser(@Arg("input") input: UpdateUserInput, @Ctx() context: Context) {
    return this.userService.update(input, context);
  }

  @Mutation(() => String)
  deleteUser(@Arg("id") id: string) {
    return this.userService.deleteUser(id);
  }

  @Authorized()
  @Query(() => [User], { description: "returns all users" })
  users() {
    return this.userService.users();
  }

  @Mutation(() => String) // Returns the JWT
  login(@Arg("input") input: LoginInput, @Ctx() context: Context) {
    return this.userService.login(input, context);
  }

  @Mutation(() => Boolean!, { nullable: true })
  logout(@Ctx() context: Context) {
    context.res.clearCookie("accessToken"); // need to validate if req.destory succeed
    return context.req.destroy();
  }

  @Query(() => User, { nullable: true, description: "returns user object" }) // nullable: true means you can return null
  me(@Ctx() context: Context) {
    return context.user;
  }
}
