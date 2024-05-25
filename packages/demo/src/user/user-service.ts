import { injectable } from "@athenajs/core";

@injectable()
export class UserService {
  getMany() {
    return Promise.resolve([{ username: "foo" }, { username: "bar" }]);
  }
}
