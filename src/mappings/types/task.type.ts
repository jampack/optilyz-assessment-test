import {AutoMap} from "@automapper/classes";
import IUser from "../../app/models/interfaces/iUser";

export default class TaskType {
  _id: string

  @AutoMap()
  title: string

  @AutoMap()
  description: string

  @AutoMap()
  completeBefore: string

  @AutoMap()
  notifyAt: string

  @AutoMap()
  isComplete: boolean

  creator: IUser

  assignee: IUser

  @AutoMap()
  createdAt: string

  @AutoMap()
  updatedAt: string
}
