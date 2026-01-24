import Animal from "../Models/Animal.js";

export const animalCaller = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    // If search query is provided, search by name (case-insensitive, partial match)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    const animals = await Animal.find(query);
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const animalExport = async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const createAnimal = async (req, res) => {
  try {
    const {
      name,
      category,
      type,
      animal,
      breed,
      gender,
      age,
      life_expectancy,
      medical_condition,
      tameness_level,
      care_requirements,
      adoption_type,
      foster_duration,
      address,
    } = req.body;

    // Validate required fields
    if (!name || !category || !adoption_type) {
      return res.status(400).json({ error: "Name, category, and adoption type are required" });
    }

    // Handle image - expect image URL from request body
    const imgPath = req.body.img || "";

    // Parse nested objects if they're strings
    let lifeExpectancyObj = {};
    if (life_expectancy) {
      try {
        lifeExpectancyObj = typeof life_expectancy === "string" 
          ? JSON.parse(life_expectancy) 
          : life_expectancy;
      } catch (e) {
        // If parsing fails, try to construct from individual fields
        if (req.body.life_expectancy_captivity || req.body.life_expectancy_wild) {
          lifeExpectancyObj = {
            captivity: req.body.life_expectancy_captivity || "",
            wild: req.body.life_expectancy_wild || "",
          };
        }
      }
    }

    let careRequirementsObj = {};
    if (care_requirements) {
      try {
        careRequirementsObj = typeof care_requirements === "string"
          ? JSON.parse(care_requirements)
          : care_requirements;
      } catch (e) {
        // If parsing fails, try to construct from individual fields
        if (req.body.care_food || req.body.care_attention || req.body.care_yearly_cost ||
            req.body.care_vet_cost || req.body.care_insurance) {
          careRequirementsObj = {
            food: req.body.care_food || "",
            attention: req.body.care_attention || "",
            yearly_cost: req.body.care_yearly_cost || "",
            average_vet_cost: req.body.care_vet_cost || "",
            insurance: req.body.care_insurance || "",
          };
        }
      }
    }

    // Create new animal
    const newAnimal = new Animal({
      name,
      category,
      type: type || "",
      animal: animal || "",
      breed: breed || "",
      gender: gender || "Unknown",
      age: age ? Number(age) : undefined,
      life_expectancy: lifeExpectancyObj,
      medical_condition: medical_condition || "",
      tameness_level: tameness_level || "",
      care_requirements: careRequirementsObj,
      adoption_type,
      foster_duration: foster_duration || "",
      address: address || "",
      img: imgPath,
    });

    await newAnimal.save();

    res.status(201).json({
      message: "Animal submitted successfully",
      animal: newAnimal,
    });
  } catch (error) {
    console.error("Error creating animal:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};
