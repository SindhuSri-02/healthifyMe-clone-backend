exports.getProducts = (req,res)=>{
    console.log("---------------logged in user-------------------",req.user)
    return res.status(200).json({message: "ok", products:[
        {
            name: "dress",
            price: 1000
        },
        {
            name: "jeans",
            price: 2000
        }
]})
}