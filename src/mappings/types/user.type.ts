import {AutoMap} from "@automapper/classes";

export default class UserType {
  _id: string

  @AutoMap()
  name: string

  @AutoMap()
  email: string

  password: string

  @AutoMap()
  createdAt: string

  @AutoMap()
  updatedAt: string
}
