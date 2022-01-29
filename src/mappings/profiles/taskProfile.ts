import {mapFrom, MappingProfile} from "@automapper/core";
import TaskType from "../types/task.type";
import TaskDto from "../dtos/task.dto";

const taskProfile: MappingProfile = (mapper) => {
  mapper
    .createMap(TaskType, TaskDto)
    .forMember(
      (destination) => destination.id,
      mapFrom((source) => source._id)
    );
};

export default taskProfile;
