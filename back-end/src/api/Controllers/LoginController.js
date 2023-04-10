const { verifyUser, getSellers } = require('../Services/UserService');

const login = async (req, res) => {
    const { email, password } = req.body;
    const data = await verifyUser(email, password);
    
    if (data && data.error) return res.status(401).json(data.error.message);
    if (!data) {
        return res.status(404).json({ message:
    'User Not Found!' }); 
}
    return res.status(200).json(data);
};  

const getSellersController = async (_req, res) => {
    const users = await getSellers();
    return res.status(200).json(users);
};

module.exports = {
    login,
    getSellersController,
};