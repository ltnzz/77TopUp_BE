import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; //ambil header authorization

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message: 'Token diperlukan'});
        } //cek apakah ada token dan apakah token dimulai dengan Bearer

        const token = authHeader.split(' ')[1]; //ambil token dari header authorization

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifikasi token

        if(decoded.role !== 'admin'){
            return res.status(403).json({message: 'Anda tidak memiliki akses.'});
        } //cek apakah user memiliki role admin

        req.user = decoded; //simpan informasi user ke dalam request
        next();
    } catch(error) {
        return res.status(500).json({message: 'Gagal memverifikasi token.', error});
    }
}

export default verifyToken;