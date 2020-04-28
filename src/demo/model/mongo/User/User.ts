import { prop } from "@typegoose/typegoose";

export class User {
  @prop({ required: true })
  username!: string;
}
