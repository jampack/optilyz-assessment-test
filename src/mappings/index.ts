import userProfile from "./profiles/userProfile";
import mapper from "../lib/mapper";

const createMappings = (): void => {
  userProfile(mapper)
};

export default createMappings;
