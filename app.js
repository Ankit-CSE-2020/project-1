const express=require('express');
const fs=require('fs');
const session = require('express-session')
const app=express();

let userData=[];

app.use(session({
  secret: 'keyboard cat cat',
  resave: true,
  saveUninitialized: true,
}))

app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')

app.use(express.static("public"));

app.get('/',(req,res)=>{
  res.render('homepage')
})

app.get('/dashboard',(req,res)=>{
  

  getProduct(function(error,products){
    if (error) {
        res.status(500);
        res.send('product not get succ.')
    }
    else{
       
      res.render('dashboard')
        
    
      }
      
      
    
})

})

app.get('/products.json', (req, res) => {
  const products = require('./product.json');
  res.json(products);
});


app.get('/signup',(req,res)=>{
  res.render('signup')
})

app.post('/signup',(req,res)=>{
  const name=req.body.username
  const email=req.body.useremail
  const password=req.body.userpassword

  saveUserInfo(name,email,password,function(error){
    if (error) {
        res.status(403);
        res.send("user info not save succ..");
    }
    else{
        res.redirect('/login')

    }
})
  
})



app.get('/login',(req,res)=>{
  res.render('login')
})

app.post('/login',(req,res)=>{
  const name=req.body.username
  const email=req.body.useremail
  const password=req.body.userpassword

  getUserInfo(email,password,function(error){
      if (error) {
        res.send('user not able to login..something wrong')
          //res.render('userillegal') 
      }
      else{
          // req.session.isLogedIn=true;
          // req.session.username=name;
          // res.redirect('/todohome')
          res.redirect('/dashboard')
      }
  })
})


app.listen(3000,()=>{
  console.log('server listen at port 3000');
})




function getProduct(callback){
  fs.readFile('productData.text','utf-8',function(error,data){
      if (error) {
          callback(error);
      }
      else{
          if(data.length===0){
              data='[]'
          }

             try{
             
              let products=JSON.parse(data);
              callback(null,products);
             }
             catch(error){
              callback(null,[])
             }
            
      }
  })
}




function getUserInfo(email,password,callback){
 fs.readFile('userinfo.text','utf-8',function (error,data) {
       if (error) {
         callback(error);
       }
       else{
         
           let userDataBase=JSON.parse(data);

           const user=userDataBase.find((user)=>{
            if(user.email===email && user.password===password){
              return user;
             }
           })

           if (user) {
             callback();
           }
           else{
             callback('user not found');
           }

       }
      
 })
}


function saveUserInfo(name,email1,password1,callback) {
 fs.readFile('userinfo.text','utf-8',function (error,data) {
     if (error) {
         callback(error);
     }
     else{
          
      if(data.length===0){
        data='[]';
    }

           let userDataBase=JSON.parse(data);
       
         const user=userDataBase.filter((user)=>{
             if(user.email===email1 && user.password===password1){
              return user;
             }
                              
           })
         
           if (user.length===1) {
             callback('user exist')
           }
           else{
             
             let uinfo={name:name,email:email1,password:password1}

              userData.push(userDataBase);
              userData.push(uinfo)
              console.log("w-w-w",userData);
               fs.writeFile('userinfo.text',JSON.stringify(userData),function(error){
                 if (error) {
                     callback(error);
                 }
                 else{
                     callback();
                 }
               })
           }
   
     }  
 })
}