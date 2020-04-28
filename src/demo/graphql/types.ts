export type Maybe<T> = T | undefined;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: File;
};

export type IQuery = {
   __typename?: 'Query';
  hello: Scalars['String'];
  users: Array<IUser>;
};

export type IUser = {
   __typename?: 'User';
  username: Scalars['String'];
};

export enum ICacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


