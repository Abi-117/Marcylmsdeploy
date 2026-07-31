import TimeSlot from "../models/TimeSlot.js";

export const getSlots = async (req, res) => {
  try {

    const slots = await TimeSlot.find({
      course: req.params.courseId,
    });

    res.json(slots);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};