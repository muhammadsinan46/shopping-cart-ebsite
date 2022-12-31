const { MongoClient } = require('mongodb');

const state={
    db:null
}

module.exports.connect=function(done){
    const url = 'mongodb+srv://shoppingcart:VmzGy6LGcdTZIdfA@cluster0.zmjtbp4.mongodb.net/?retryWrites=true&w=majority';
    const dbname = 'shopping';

    MongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    });
    

}
module.exports.get=function(){
    return state.db
}