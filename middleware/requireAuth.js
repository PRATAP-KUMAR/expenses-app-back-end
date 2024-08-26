import jwt from 'jsonwebtoken';

const requireAuth = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization) {
        return res.status(401).json({error: 'Authorization token required'});
    }

    const token = authorization.split(' ')[1];

    try {
        const {id} = jwt.verify(token, process.env.SECRET);
        // assign user property to the request object
        req.user_id = id;
        next();
    } catch (error) {
        console.log('failed');
    }
}

export default requireAuth;