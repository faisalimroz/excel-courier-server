const Parcel = require("../models/Parcel");
const User = require("../models/User");

const getCoordinatesFromAddress = async (address) => {
  // It will return null to indicate coordinates are not available because i don't have Google Maps Geocoding AP
  return null;
};

const bookParcel = async (req, res) => {
  try {
    const { 
      pickupAddress, 
      deliveryAddress, 
      parcelSize, 
      parcelType,
      paymentType, 
      amount,
      codAmount,
      notes 
    } = req.body;

   
    const pickupCoords = await getCoordinatesFromAddress(pickupAddress);
    const deliveryCoords = await getCoordinatesFromAddress(deliveryAddress);

    const parcel = await Parcel.create({
      customerId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      pickupAddress,
      deliveryAddress,
      parcelSize,
      parcelType,
      paymentType,
      amount,
      codAmount: paymentType === 'COD' ? codAmount : 0,
      notes,
      location: {
        lat: deliveryCoords?.lat || null,
        lng: deliveryCoords?.lng || null
      }
    });

    res.status(201).json({ message: "Parcel booked successfully", parcel });
  } catch (error) {
    res.status(500).json({ message: "Failed to book parcel", error: error.message });
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const parcels = await Parcel.find({ customerId: req.user.id })
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking history", error: error.message });
  }
};

const getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find()
      .populate('customerId', 'name email')
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch parcels", error: error.message });
  }
};

const getAssignedParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ agentId: req.user.id })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assigned parcels", error: error.message });
  }
};

const updateParcelStatus = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { status, location } = req.body;

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

  
    if (req.user.role === 'agent' && parcel.agentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this parcel" });
    }

    
    let locationUpdate = parcel.location;
    if (location && location.lat && location.lng) {
      locationUpdate = location;
    }

    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      { 
        status, 
        location: locationUpdate,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('customerId', 'name email')
     .populate('agentId', 'name email');

    res.status(200).json({ message: "Status updated successfully", parcel: updatedParcel });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

const assignAgentToParcel = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { agentId } = req.body;


    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const parcel = await Parcel.findByIdAndUpdate(
      parcelId,
      { agentId },
      { new: true }
    ).populate('customerId', 'name email')
     .populate('agentId', 'name email');

    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    res.status(200).json({ message: "Agent assigned successfully", parcel });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign agent", error: error.message });
  }
};

const getParcelById = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const parcel = await Parcel.findById(parcelId)
      .populate('customerId', 'name email')
      .populate('agentId', 'name email');

    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch parcel", error: error.message });
  }
};

const getParcelByTrackingNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const parcel = await Parcel.findOne({ trackingNumber })
      .populate('customerId', 'name email')
      .populate('agentId', 'name email');

    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch parcel", error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Parcel.aggregate([
      {
        $facet: {
          totalParcels: [{ $count: "count" }],
          todayBookings: [
            { $match: { createdAt: { $gte: today } } },
            { $count: "count" }
          ],
          failedDeliveries: [
            { $match: { status: "Failed" } },
            { $count: "count" }
          ],
          codAmount: [
            { $match: { paymentType: "COD" } },
            { $group: { _id: null, total: { $sum: "$codAmount" } } }
          ],
          statusBreakdown: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    res.status(200).json({
      totalParcels: stats[0].totalParcels[0]?.count || 0,
      todayBookings: stats[0].todayBookings[0]?.count || 0,
      failedDeliveries: stats[0].failedDeliveries[0]?.count || 0,
      codAmount: stats[0].codAmount[0]?.total || 0,
      statusBreakdown: stats[0].statusBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

module.exports = { 
  bookParcel,
  getBookingHistory,
  getAllParcels,
  getAssignedParcels,
  updateParcelStatus,
  assignAgentToParcel,
  getParcelById,
  getParcelByTrackingNumber,
  getDashboardStats
};