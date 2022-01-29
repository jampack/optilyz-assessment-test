import UserDto from "../dtos/user.dto";
import {mapFrom, MappingProfile} from "@automapper/core";
import UserType from "../types/user.type";

const userProfile: MappingProfile = (mapper) => {
  mapper
    .createMap(UserType, UserDto)
    .forMember(
      (destination) => destination.id,
      mapFrom((source) => source._id)
    );
};

export default userProfile;
