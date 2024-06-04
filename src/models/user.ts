import {
  Model, Document, model, Schema,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: string;
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    default: 'Jacques-Yves Cousteau',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'French naval officer, oceanographer, filmmaker and author',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => validator.isURL(v, { protocols: ['http', 'https'] }),
      message: (props) => `${props.value} is not a valid URL!`,
    },

  },
  email: {
    type: String,
    required: [true, 'Email cannot be empty'],
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Incorrect email',
    },
  },
  password: {
    type: String,
    required: [true, 'Password cannot be empty'],
    select: false,
  },
}, { versionKey: false });

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    return Promise.reject(new Error('Incorrect email or password'));
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return Promise.reject(new Error('Incorrect email or password'));
  }
  return user;
});

export default model<IUser, UserModel>('User', userSchema);
