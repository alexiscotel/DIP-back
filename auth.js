const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log('test 1');
        if(req.headers.authorization){
            console.log('test 2');
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            const userId = decodedToken.userId;
            
            if(req.body.userId && req.body.userId !== userId){
                console.log('test 3');
                throw 'userId not valid';
            }else{
                console.log('test 4');
                next();
            }
        }else{
            console.log('test 5');
            res.status(401).json('Request not auth');
        }        
    } catch ( error ) {
        console.log('test 6');
        console.log(error);
        res.status(401).json({ error: error | 'Request not auth' })
    }
};