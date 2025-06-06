import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'client' | 'freelancer';
  balance: number;
  profileImage: string;
  bio: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['client', 'freelancer'],
    default: 'client'
  },
  balance: {
    type: Number,
    default: 0
  },
  profileImage: {
    type: String,
    default: 'https://placehold.co/400x400'
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
