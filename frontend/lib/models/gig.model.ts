import mongoose, { Document, Schema } from 'mongoose';

export interface IGig extends Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: 'Web Development' | 'Mobile Development' | 'Graphic Design' | 'Content Writing' | 'Digital Marketing';
  image: string;
  durationDays: number;
  freelancerId: string;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  freelancer?: any;
}

const gigSchema = new Schema<IGig>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'Graphic Design',
      'Content Writing',
      'Digital Marketing'
    ]
  },
  image: {
    type: String,
    required: true,
    default: 'https://placehold.co/600x400'
  },
  durationDays: {
    type: Number,
    required: true,
    min: 1,
    default: 7
  },  freelancerId: {
    type: mongoose.Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for freelancer info
gigSchema.virtual('freelancer', {
  ref: 'User',
  localField: 'freelancerId',
  foreignField: '_id',
  justOne: true
});

const Gig = mongoose.models.Gig || mongoose.model<IGig>('Gig', gigSchema);

export default Gig;
