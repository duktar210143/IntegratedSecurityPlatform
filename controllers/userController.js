const fetchUser = async(req,res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.json({
          success: false,
          message: "questionId is required",
        });
      }
    
      try {
        
      } catch (error) {
        
      }

}