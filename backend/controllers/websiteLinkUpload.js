
export async function youtubelinkController(req,res){
    try {
        const {websiteLnk} = req.body;

        
        console.log("🟢🟢",websiteLnk)
    } catch (error) {
        res.json({success:false,message:error})
    }
}