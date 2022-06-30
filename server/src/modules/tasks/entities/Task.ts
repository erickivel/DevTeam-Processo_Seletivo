import crypto from "crypto";

interface TaskProps {
  id?: string;
  name: string;
  done?: boolean;
  userId: string;
  subjectId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Task {
  public readonly id: string;
  public readonly name: string;
  public readonly done: boolean;
  public readonly userId: string;
  public readonly subjectId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: TaskProps) {
    this.id = props.id || crypto.randomUUID();
    this.name = props.name;
    this.done = props.done || false;
    this.userId = props.userId;
    this.subjectId = props.subjectId;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}