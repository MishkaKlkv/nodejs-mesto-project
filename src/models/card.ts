import { model, Schema } from 'mongoose';
import validator from 'validator';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: [true, 'Name cannot be empty'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'Link cannot be empty'],
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Incorrect URL',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner cannot be empty'],
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export default model<ICard>('Card', cardSchema);
