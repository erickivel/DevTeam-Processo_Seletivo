import crypto from "crypto";
import { Task } from "./Task";

interface SubjectProps {
  id?: string;
  name: string;
  userId: string;
  tasks?: Task[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class Subject {
  public readonly id: string;
  public readonly name: string;
  public readonly userId: string;
  public readonly tasks?: Task[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: SubjectProps) {
    this.id = props.id || crypto.randomUUID();
    this.name = props.name;
    this.userId = props.userId;
    this.tasks = props.tasks || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}