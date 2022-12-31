const bodyParser = require('body-parser');
var db=require('../config/connection')
var collection=require('../config/collections');
const { ObjectId } = require('mongodb');
var objectId= require('mongodb').ObjectId
var bcrypt = require('bcrypt');
const { response } = require('../app');




module.exports={

 adminSignup:(adminData)=>{
    return new Promise(async(resolve,reject)=>{
        adminData.Password = await bcrypt.hash(adminData.Password, 10)
        db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
            adminData._id = data.insertedId;
            resolve(adminData);
        })
    })
 },
    
    

adminLogin: (adminData) => {
    return new Promise(async (resolve, reject) => {
        let loginStatus = false
        let response = {}
        let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email })
        if (admin) {
            bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                if (status) {
                    console.log("login success");
                    response.admin = admin
                    response.status = true
                    resolve(response)

                } else {
                    console.log("login failed");
                    resolve({ status: false })

                }
            })
        } else {
            console.log("login failed");
            resolve({ status: false })
        }
    })
},
    addProduct:(product,callback)=>{
        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data);
            callback(data.insertedId)

        })
    },getAllProducts:()=>{
        return new Promise((resolve,reject)=>{
            let products=db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        }) 
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            console.log(prodId)
            console.log(objectId(prodId));
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
               // console.log(response);
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    Brand:proDetails.Brand,
                    Model:proDetails.Model,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    getAllOrders:()=>{
        return new Promise(async(resolve,reject)=>{
            let orderslist=await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(orderslist)
            console.log(orderslist)
        })
    },
    changeOrderStatus:(orderId)=>{
        console.log(orderId);
        return new Promise((resolve,reject)=>{
             db.get().collection(collection.ORDER_COLLECTION).updateOne(
                {_id:ObjectId(orderId)},
            {
                $set:{
                    status:'shipped'
                }
            }
            ).then(()=>{
                resolve()
            })
        })
    }
}