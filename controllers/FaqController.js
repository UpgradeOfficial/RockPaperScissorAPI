const FAQ = require('../models/FAQ')


// @desc Get all faq
// @route GET /faq
// @access Private
const getAllFaq = async (req, res) => {
    // Get all faq from MongoDB
    const faq = await FAQ.find().select('-password').lean()

    // If no faq 
    if (!faq?.length) {
        return res.status(400).json({ message: 'No faq found' })
    }

    res.json(faq)
}


// @desc Create new faq
// @route POST /faqs
// @access Private
const createNewFaq = async (req, res) => {
    const { title, description } = req.body;
    
  
    //console.log(req)
  
    // Confirm data
    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    // Check for duplicate email
    const duplicate = await FAQ.findOne({ title })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
  
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate Title" });
    }
  
   
  
    
    const  faqObject = {
        title,
        description,
      };
    
    // Create and store new faq
    const faq = await FAQ.create(faqObject);
  
    if (faq) {
      //created
      res.status(201).json({ data: faq, message: `New faq ${title} created` });
    } else {
      res.status(400).json({ message: "Invalid faq data received" });
    }
  };

module.exports = {
    getAllFaq,
    createNewFaq
}