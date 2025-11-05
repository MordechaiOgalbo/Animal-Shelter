import Animal from "../Models/Animal.js";

export const animalCaller = async (req, res) => {
  try {
    const animals = await Animal.find();
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
