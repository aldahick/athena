import { GraphQLError,GraphQLScalarType } from "graphql";
import { singleton } from "tsyringe";
import { resolver } from "../..";

@singleton()
export class DateTimeScalarResolver {
  @resolver("DateTime")
  dateTime = new GraphQLScalarType({
    name: "DateTime",
    serialize: (date: Date) => {
      if (!(date instanceof Date)) {
        throw new GraphQLError("can't serialize non-Date value as DateTime");
      }
      return date.toISOString();
    }
  });
}
