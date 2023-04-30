import { ObjectId } from 'mongodb';
import { connectedDb } from '../connection/connect';

const db = connectedDb();
interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

class User {
  public _id?: ObjectId;
  public name: string;
  public email: string;
  public password: string;

  constructor({ _id, name, email, password }: IUser) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  public async save() {
    const collection = (await db).collection<IUser>('users');
    const result = await collection.insertOne({
      name: this.name,
      email: this.email,
      password: this.password,
    });
    this._id = result.insertedId;
    return result;
  }

  public static async findByEmail(email: string): Promise<IUser | undefined> {
    const collection = (await db).collection<IUser>('users');
    const result = await collection.findOne({ email });
    if (result) {
      return new User({
        _id: result._id,
        name: result.name,
        email: result.email,
        password: result.password,
      });
    }
  }

  public static async findById(id: string): Promise<IUser | undefined> {
    const collection = (await db).collection<IUser>('users');
    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (result) {
      return new User({
        _id: result._id,
        name: result.name,
        email: result.email,
        password: result.password,
      });
    }
  }

  public static async getAllUsers() {
    const collection = (await db).collection<IUser>('users').find({});
    const users = await collection.toArray();
    return users;
  }
}

export default User;
