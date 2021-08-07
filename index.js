const express=require('express')
const dataService=require('./services/data.service')
const session=require('express-session')
const app = express()

app.use(session({
    secret:"rendomstring",
    resave:false,
    saveUninitialized:false
}))

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
    
    const result=dataService.register(req.body.acno,req.body.username,req.body.password)
    res.status(result.statusCode).json(result)
})

app.post('/deposit',(req,res)=>{
    console.log(req.body);
    // console.log(req.session.currentAcc);
    const result=dataService.deposit(req,req.body.acno,req.body.password,req.body.amount)
    res.status(result.statusCode).json(result)
})
app.post('/withdrawal',(req,res)=>{
    console.log(req.body);
    const result=dataService.withdrawal(req.body.acno,req.body.password,req.body.amount)
    res.status(result.statusCode).json(result)
})

app.post('/login',(req,res)=>{
    const result=dataService.login(req,req.body.acno,req.body.pwd)
    res.status(result.statusCode).json(result)
    console.log(req.session.currentAcc);
})

// app.get('/getTraining',(req,res)=>{

//     trainingObj={
//         tariningId:2,
//         name:"vasif",
//         active:true
//     }

//     res.send(trainingObj)
// })

app.listen(3000,()=>{
    console.log("Server started at:3000");
})