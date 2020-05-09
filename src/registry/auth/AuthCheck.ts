interface AuthCheckItem {
  resource: string;
  action: "readAny" | "readOwn" | "updateAny" | "updateOwn" | "createAny" | "createOwn" | "deleteAny" | "deleteOwn";
  attributes?: string;
}

export type AuthCheck = AuthCheckItem | AuthCheckItem[];
