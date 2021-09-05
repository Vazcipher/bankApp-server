const express=require('express')
const dataService=require('./services/data.service')
const session=require('express-session')
const cors=require('cors')
const app = express()

app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))

app.use(session({
    secret:"rendomstring",
    resave:false,
    saveUninitialized:false
}))

//Application specific middleware
// app.use((req,res,next)=>{
//     console.log("Application specific middleware");
//     next()
// })

//root specific middleware
const authMiddleware = (req,res,next)=>{      
    if(!req.session.currentAcc){
        res.json({
          statusCode:422,
          status:false,
          message:"Pls login"
        })
      }
      else{
          next()
      }
}

// app.use(authMiddleware)

app.use(express.json())

app.post('/',(req,res)=>{
    res.send("Post post")
})

app.get('/',(req,res)=>{
    res.send("this is Get method")
})

app.put('/putMethod',(req,res)=>{
    res.send("put method")
})
app.delete('/delete',(req,res)=>{
    res.send("delete method")
})

app.post('/register',(req,res)=>{
    console.log(req.body);
    dataService.register(req.body.acno,req.body.username,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/deposit',authMiddleware,(req,res)=>{
    console.log(req.body);
    // console.log(req.session.currentAcc);
    dataService.deposit(req.body.acno,req.body.password,req.body.amount).then(result=>{
        res.status(result.statusCode).json(result)
    })
})
app.post('/withdrawal',authMiddleware,(req,res)=>{
    console.log(req.body);
    dataService.withdrawal(req,req.body.acno,req.body.password,req.body.amount).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/login',(req,res)=>{
    dataService.login(req,req.body.acno,req.body.pwd).then(result=>{
        res.status(result.statusCode).json(result)
        console.log(req.session.currentAcc);
    })
})

app.post('/getTransaction',authMiddleware,(req,res)=>{
    dataService.getTransaction(req.body.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.delete('/deleteAcc/:acno',authMiddleware,(req,res)=>{
    dataService.deleteAcc(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.listen(3000,()=>{
    console.log("Server started at:3000");
})