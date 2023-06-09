import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./user.schema";
import { IsNumber, MaxLength, Min } from "class-validator";

@ObjectType()
export class Product {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  description: string;

  @Field(() => String)
  @prop({ required: true })
  price: string;
}

export const ProductModel = getModelForClass<typeof Product>(Product);

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @MaxLength(1000, {
    message: "Description must not be more than 1000 characters",
  })
  @Field()
  description: string;

  @IsNumber()
  @Min(1)
  @Field()
  price: number;
}

@InputType()
export class GetProductInput {
  @Field()
  _id: string;
}
