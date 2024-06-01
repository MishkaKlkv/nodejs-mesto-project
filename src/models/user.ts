import { model, Schema } from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name cannot be empty'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'About cannot be empty'],
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: [true, 'Avatar cannot be empty'],
  },
}, { versionKey: false });

export default model<IUser>('User', userSchema);
