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

  public async save() {
    try {
      const response = await fs.promises.readFile(
        'src/data/users.json',
        'utf8'
      );
      const data = JSON.parse(response);
      data.push({
        id: new Date().getTime().toString(),
        name: this.name,
        email: this.email,
        password: this.password,
      });
      fs.promises.writeFile('src/data/users.json', JSON.stringify(data));
    } catch (err: any) {
      console.error(err.message);
      throw new Error('Failed to save user');
    }
  }

  public static async findByEmail(email: string): Promise<IUser | undefined> {
    const response = await fs.promises.readFile('src/data/users.json', 'utf8');
    const data = JSON.parse(response) as IUser[];
    return data.find((user) => user.email === email);
  }

  public static async findById(id: string): Promise<IUser | undefined> {
    const response = await fs.promises.readFile('src/data/users.json', 'utf8');
    const data = JSON.parse(response) as IUser[];
    return data.find((user) => user.id === id);
  }
}

export default User;
