import {AutoMap} from "@automapper/classes";

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
  createdAt: string

  @AutoMap()
  updatedAt: string
}
