// Flight controller

const searchFlights = async (req, res) => {
  // Search flights logic
};

const getFlightById = async (req, res) => {
  // Get flight by ID
};

const addFlight = async (req, res) => {
  // Add new flight (Admin only)
};

const updateFlight = async (req, res) => {
  // Update flight (Admin only)
};

const deleteFlight = async (req, res) => {
  // Delete flight (Admin only)
};

const getAllFlights = async (req, res) => {
  // Get all flights (Admin)
};

module.exports = {
  searchFlights,
  getFlightById,
  addFlight,
  updateFlight,
  deleteFlight,
  getAllFlights
};
