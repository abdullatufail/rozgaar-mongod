import Gig from '../models/gig.model.js';
import User from '../models/user.model.js';

// Create a new gig
export const createGig = async (req, res) => {
  try {
    const { title, description, price, category, image, durationDays } = req.body;
    
    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Validate that user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can create gigs' });
    }
    
    // Create gig
    const gig = await Gig.create({
      title,
      description,
      price,
      category,
      image: image || 'https://placehold.co/600x400',
      durationDays: durationDays || 7,
      freelancerId: req.user._id
    });
    
    // Populate freelancer info
    const populatedGig = await Gig.findById(gig._id).populate({
      path: 'freelancer',
      select: 'name'
    });
    
    res.status(201).json(populatedGig);
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all gigs with filters and search
export const getGigs = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sort = 'createdAt',
      order = 'desc',
      limit = 20,
      page = 1
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Find gigs
    const gigs = await Gig.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: 'freelancer',
        select: 'name'
      });
    
    // Count total gigs for pagination
    const total = await Gig.countDocuments(filter);
    
    res.status(200).json({
      gigs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single gig by ID
export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate({
      path: 'freelancer',
      select: 'name profileImage bio'
    });
    
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    
    res.status(200).json(gig);
  } catch (error) {
    console.error('Get gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update gig
export const updateGig = async (req, res) => {
  try {
    const { title, description, price, category, image, durationDays } = req.body;
    
    // Find gig
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    
    // Check if user is owner of gig
    if (gig.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this gig' });
    }
    
    // Update gig fields
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      {
        title: title || gig.title,
        description: description || gig.description,
        price: price || gig.price,
        category: category || gig.category,
        image: image || gig.image,
        durationDays: durationDays || gig.durationDays
      },
      { new: true }
    ).populate({
      path: 'freelancer',
      select: 'name'
    });
    
    res.status(200).json(updatedGig);
  } catch (error) {
    console.error('Update gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete gig
export const deleteGig = async (req, res) => {
  try {
    // Find gig
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    
    // Check if user is owner of gig
    if (gig.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this gig' });
    }
    
    // Delete gig
    await Gig.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Gig deleted successfully' });
  } catch (error) {
    console.error('Delete gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all gigs by freelancer
export const getFreelancerGigs = async (req, res) => {
  try {
    const freelancerId = req.params.freelancerId;
    
    // Check if freelancer exists
    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.role !== 'freelancer') {
      return res.status(404).json({ message: 'Freelancer not found' });
    }
    
    // Find all gigs by freelancer
    const gigs = await Gig.find({ freelancerId }).populate({
      path: 'freelancer',
      select: 'name'
    });
    
    res.status(200).json(gigs);
  } catch (error) {
    console.error('Get freelancer gigs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get my gigs (for logged-in freelancer)
export const getMyGigs = async (req, res) => {
  try {
    // Check if user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Find all gigs by the logged-in freelancer
    const gigs = await Gig.find({ freelancerId: req.user._id }).populate({
      path: 'freelancer',
      select: 'name'
    });
    
    res.status(200).json(gigs);
  } catch (error) {
    console.error('Get my gigs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 