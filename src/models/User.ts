import fs from 'fs';
import bcrypt from 'bcryptjs';

interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public password: string;

  constructor({ id, name, email, password }: IUser) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  public async save(): Promise<void> {
    try {
      const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
      data.push({
        id: new Date().getTime().toString(),
        name: this.name,
        email: this.email,
        password: await bcrypt.hash(this.password, 10),
      });
      fs.writeFileSync('users.json', JSON.stringify(data));
    } catch (err: any) {
      console.error(err.message);
      throw new Error('Failed to save user');
    }
  }

  public static findByEmail(email: string): IUser | undefined {
    const data = JSON.parse(fs.readFileSync('users.json', 'utf8')) as IUser[];
    return data.find((user) => user.email === email);
  }

  public static findById(id: string): IUser | undefined {
    const data = JSON.parse(fs.readFileSync('users.json', 'utf8')) as IUser[];
    return data.find((user) => user.id === id);
  }
}

export default User;
