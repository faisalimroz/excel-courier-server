const mongoose = require("mongoose");

const ParcelSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  parcelSize: { type: String, enum: ["small", "medium", "large"], required: true },
  parcelType: { type: String, required: true },
  paymentType: { type: String, enum: ["COD", "prepaid"], required: true },
  status: { 
    type: String, 
    enum: ["Booked", "Picked Up", "In Transit", "Delivered", "Failed"], 
    default: "Booked" 
  },
  amount: { type: Number, required: true },
  codAmount: { type: Number, default: 0 },
  location: { 
    lat: { type: Number, default: null }, 
    lng: { type: Number, default: null } 
  },
  trackingNumber: { type: String, unique: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
ParcelSchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    this.trackingNumber = 'TRK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Parcel", ParcelSchema);