import crypto from "crypto";

type UserProps = {
  id?: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly password: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id || crypto.randomUUID();
    this.name = props.name;
    this.password = props.password;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}
