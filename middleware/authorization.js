exports.ensureClient = (req,res,next) => {
    if(req.user.clientCount === undefined) next();
    throw new Error('Please login as a client');
}

exports.ensureLawyer = (req,res,next) => {
    if(req.user.clientCount !== undefined) next();
    throw new Error('Please login as a lawyer');
}