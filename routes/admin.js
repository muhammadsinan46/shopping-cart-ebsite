var express = require('express');
const { response } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers');
const { getUserOrders } = require('../helpers/user-helpers');
const userHelpers = require('../helpers/user-helpers');

const verfyLogin=(req,res,next)=>{
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin')
  }
}

router.post('/admin',(req,res)=>{
  productHelpers.adminLogin(req.body).then((response)=>{
    if(response.status){
      
      req.session.admin=response.admin
      req.session.adminLoggedIn=true
      res.redirect('/admin/view-products')
    }else{
      req.session.userLoginErr="Invalid username of password"
      res.redirect('/admin')
    }
  })
})
router.get('/adsignup',(req,res)=>{
  res.render('admin/adsignup')
})
router.post('/adsignup',(req,res)=>{
  productHelpers.adminSignup(req.body).then((response=>{
    console.log(response);
    req.session.admin=response
    req.session.admin.loggedIn
    res.redirect('/admin/view-products/')
  }))
})





/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/admin',{admin:true,products});
  })
});

router.get('/view-products',verfyLogin, function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{admin:true,products});
  })
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product')

})
router.post('/add-product',(req,res)=>{

  productHelpers.addProduct(req.body,(id)=>{
    let imageFile=req.files.Image;
    imageFile.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      
      if(err){
        console.log(err);
      }else{
        res.render('admin/add-product');
      }
    });
    
  })
        
})  
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/view-products/')
  })
})
router.get('/edit-product/:id',async(req,res)=>{
 productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{

  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/view-products')
    if (req.files.Image){
    let imageFile=req.files.Image;
    imageFile.mv('./public/product-images/'+id+'.jpg')
    }
  })
})
router.get('/all-orders',(req,res)=>{
  productHelpers.getAllOrders().then((orderslist)=>{
    res.render('admin/all-orders',{admin:true,orderslist})
  })
 
})
router.post('/ship-order',(req,res)=>{
  productHelpers.changeOrderStatus(req.body.orderId).then(()=>{
    console.log("success")
    res.json({status: true})
  })
})



module.exports = router;
