import {AutoMap} from "@automapper/classes";
import UserDto from "./user.dto";

export default class TaskDto {
  id: string

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

  creator: UserDto

  assignee: UserDto

  @AutoMap()
  createdAt: string

  @AutoMap()
  updatedAt: string
}
