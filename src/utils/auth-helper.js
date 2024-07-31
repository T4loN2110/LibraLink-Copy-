const bcrypt=require('bcrypt');
const hashPassword=async (plainTextPassword)=>
{
    let res=""
    res= await bcrypt.hash(plainTextPassword,10).catch(error=>{
        console.log(error);
    })
    return res;
    //
}
const hashPassword2=(plainTextPassword,callback)=>
{
    bcrypt.hash(plainTextPassword,10).then(value=>
        {
            console.log(value);
            callback(value);
        }).catch(error=>
            {
                console.log(error);
                callback("");
            })
}
const comparePassword=async (plainTextPassword,hashedPassword)=>
{
    let res=false;
    res= await bcrypt.compare(plainTextPassword,hashedPassword).catch(error=>{
        console.log(error);
    })
    return res;
    //return bcrypt.compareSync(plainTextPassword,hashedPassword)
}
const comparePassword2=(plainTextPassword,hashedPassword,callback)=>
{
    bcrypt.compare(plainTextPassword,hashedPassword).then(value=>
        {
            console.log(value);
            callback(value);
        }).catch(error=>
            {
                console.log(error);
                callback(false);
            })
}
module.exports={hashPassword,comparePassword}