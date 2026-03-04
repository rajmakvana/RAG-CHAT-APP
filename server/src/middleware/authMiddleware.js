import jwt from 'jsonwebtoken';
import prisma from '../config/dataBase.js';

export const authMiddleware = async (req, res, next) => {
    try{

        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
        if(!token){
            return res.status(401).json({ message: "No token provided , access denied" });
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            role: true,
            organizationId: true,
          },
        });

        if (!user) {
          return res.status(401).json({ message: "Invalid token user" });
        }

        req.user = user;
        next();

    }catch(err){
        console.error("Auth middleware error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}


export const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Not allowed." });
    }
    next();
  };
};
