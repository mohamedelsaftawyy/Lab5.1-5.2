const validateBudget = (req, res, next)=>{

    const budget = request.body.budget;
   
     req.body.budget = 300;


     if (typeof budget  !== "number" || budget <= 0 || !Number.isFinite(budget)){
            return res.status(400).json({
                 message: "Budget must be positive"
               })
           }

           next();
}

module.exports = {
    validateBudget
}