import { prop, arrayProp } from "@typegoose/typegoose";
import { MongoService } from "../../../..";

export class User {
  @MongoService.idProp()
  _id!: string;

  @prop({ required: true })
  username!: string;

  @arrayProp({ items: Number, required: true })
  roleIds!: number[];
}
