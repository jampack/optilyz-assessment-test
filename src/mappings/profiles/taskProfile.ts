import {mapFrom, MappingProfile} from "@automapper/core";
import TaskType from "../types/task.type";
import TaskDto from "../dtos/task.dto";
import UserType from "../types/user.type";
import UserDto from "../dtos/user.dto";

const taskProfile: MappingProfile = (mapper) => {
  mapper
    .createMap(TaskType, TaskDto)
    .forMember(
      (destination) => destination.id,
      mapFrom((source) => source._id)
    )
    .forMember((destination) => destination.creator,
      mapFrom((source) => mapper.map(source.creator, UserDto, UserType))
    )
    .forMember((destination) => destination.assignee,
      mapFrom((source) => {
        if(source.assignee) {
          return mapper.map(source.assignee, UserDto, UserType);
        }
        return null;
      })
    );
};

export default taskProfile;
