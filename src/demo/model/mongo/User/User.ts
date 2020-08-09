import { prop } from "@typegoose/typegoose";
import { MongoService } from "../../../..";

export class User {
  @MongoService.idProp()
  _id!: string;

  @prop({ required: true })
  username!: string;

  @prop({ type: Number, required: true })
  roleIds!: number[];
}
