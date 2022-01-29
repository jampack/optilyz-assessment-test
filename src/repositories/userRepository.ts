import User from '../app/models/user';
import IUser from "../app/models/interfaces/iUser";
import RepositoryBase from "./base/baseRepository";

class UserRepository extends RepositoryBase<IUser> {
  constructor() {
    super(User)
  }

  async findByEmail(email: string): Promise<IUser> {
    return User.findOne({email}).lean();
  }
}

export default UserRepository;
