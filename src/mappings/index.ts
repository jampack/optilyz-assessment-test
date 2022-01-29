import mapper from "../lib/mapper";
import userProfile from "./profiles/userProfile";
import taskProfile from "./profiles/taskProfile";

const createMappings = (): void => {
  userProfile(mapper);
  taskProfile(mapper);
};

export default createMappings;
