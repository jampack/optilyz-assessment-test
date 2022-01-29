import {AutoMap} from "@automapper/classes";

export default class UserDto {
  id: string

  @AutoMap()
  name: string

  @AutoMap()
  email: string
}
