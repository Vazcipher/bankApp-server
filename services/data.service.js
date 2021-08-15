const db=require('./db')

users = {
    1001:{ acno:1001, username:"Vasif", password:"12345", balance:5000,transaction:[]},
    1002:{ acno:1002, username:"basil", password:"basil", balance:50000,transaction:[]},
    1003:{ acno:1003, username:"sabith", password:"sabith", balance:1000,transaction:[]}
  }

 const register =(acno,username,password)=>{

    return db.User.findOne({acno}).then(user=>{
      console.log(user);

      if(user){
        return {
                statusCode:422,
                status:false,
                message:"Already exist"
      }
    }
      else{
        const newUser=new db.User({
              acno,
              username,
              password,
              balance:0,
              transaction:[]
        })
        newUser.save()
        return {
                  statusCode:200,
                  status:true,
                  message:"Registration Succcess"
            }
      }
    })

}

const login=(req,acno,password)=>{

  return db.User.findOne({acno,password}).then(user=>{
    console.log(user);
    if(user){
      req.session.currentAcc = user.acno
      return {
        statusCode:200,
        status:true,
        message:"Login successfull"
      }
    }
      return {
        statusCode:422,
        status:false,
        message:"Invalid Username or Password"
      }
  })
}

const deposit=(acno,password,amount)=>{
  var amt=parseInt(amount)
 
  return db.User.findOne({acno,password}).then(user=>{
    if(!user){
      return {
          statusCode:422,
          status:false,
          message:"Invalid Account Details"
      }
    }
    else{
      user.balance+=amt
      user.transaction.push({
        amount:amt,
        type:"CREDIT"
      })
      user.save()
      return {
        statusCode:200,
        status:true,
        message:"Rs:"+amt+" Succefully deposited, Your balance is "+user.balance
      }
    }
  })
}

const withdrawal=(req,acno,pwd,amount)=>{

  var amt=parseInt(amount);

  return db.User.findOne({acno,password:pwd}).then(user=>{
    if(!user){
      return {
        statusCode:422,
        status:false,
        message:"Invalid User"
      }
    }
    if(req.session.currentAcc!=user.acno){
      return {
        statusCode:422,
        status:false,
        message:"Operation Denayed"
      }
    }
    if(user.balance<amt){
      return {
          statusCode:422,
          status:false,
          message:"Insuffieciant Balance"
      }
    }
    else{
      user.balance-=amt
      user.transaction.push({
        amount:amt,
        type:"DEBIT"
      })
      user.save()
      return {
        statusCode:200,
        status:true,
        message:"Rs:"+amt+" Succefully debited, Your balance is " +user.balance
      }
    }
  })
}

const getTransaction=(req)=>{
  // let balance=this.users[this.currentUser]["balance"]

  return db.User.findOne({acno:req.session.currentAcc}).then(user=>{
    if(user){
      return {
        statusCode:200,
        status:true,
        transaction:user.transaction
      }
    }
    else{
      return {
        statusCode:422,
        status:false,
        message:"Invalid Operation"
      }
    }
  })
}

module.exports={
    register,
    login,
    deposit,
    withdrawal,
    getTransaction
}