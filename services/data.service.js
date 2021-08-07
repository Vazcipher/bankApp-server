users = {
    1001:{ acno:1001, username:"Vasif", password:"12345", balance:5000,transaction:[]},
    1002:{ acno:1002, username:"basil", password:"basil", balance:50000,transaction:[]},
    1003:{ acno:1003, username:"sabith", password:"sabith", balance:1000,transaction:[]}
  }

 const register =(acno,username,password)=>{
    if(acno in users){
      return {
          statusCode:422,
          status:false,
          message:"Already exist"
      }
    }
    else{
        users[acno]={
        acno,
        username,
        password,
        balance:0,
        transaction:[]
      }
      return {
            statusCode:200,
            status:true,
            message:"Registration Succcess"
      }
    }
}

const login=(req,acno,password)=>{

  if(acno in users){
    if(password==users[acno]["password"]){
      currentUser=users[acno]["username"]
      req.session.currentAcc = acno
    //  this.currentUser=userDetails[mobile]
      return {
        statusCode:200,
        status:true,
        message:"Login successfull"
      }
    }
    else{
      return {
        statusCode:422,
        status:false,
        message:"Invalid Password"
      }
    }
  }
  else{
    return {
      statusCode:422,
      status:false,
      message:"Invalid User"
    }
  }
}

const deposit=(req,acno,password,amount)=>{
  var amt=parseInt(amount)
  if(!req.session.currentAcc){
    return {
      statusCode:422,
      status:false,
      message:"Pls login"
    }
  }
 
  if(acno in users){
    if(password == users[acno]["password"]){
      users[acno]["balance"]+=amt
      users[acno].transaction.push({
        amount:amt,
        type:"CREDIT"
      })
      return {
        statusCode:200,
        status:true,
        message:"Rs:"+amt+" Succefully deposited, Your balance is " +users[acno]["balance"]
        }
    }
    else{
      return {
        statusCode:422,
        status:false,
        message:"Invalid Password"
      }
  }
}
  else{
    return {
      statusCode:422,
      status:false,
      message:"Invalid User"
    }
  }
}

const withdrawal=(acno,pwd,amount)=>{

  var amt=parseInt(amount);
  if(acno in users){
    if(pwd==users[acno]["password"]){
      if(users[acno]["balance"]<amt){
        return {
          statusCode:422,
          status:false,
          message:"Insuffieciant Balance"
        }
      }
      else{
        users[acno]["balance"]-=amt
        users[acno].transaction.push({
          amount:amt,
          type:"DEBIT"
        })
    
        return {
          statusCode:200,
          status:true,
          message:"Rs:"+amt+" Succefully debited, Your balance is " +users[acno]["balance"]
          }
      }
    }
    else{
      return {
        statusCode:422,
        status:false,
        message:"Invalid Password"
      }
    }
  }
  else{
    return {
      statusCode:422,
      status:false,
      message:"Invalid User"
    }
  }
}

module.exports={
    register,
    login,
    deposit,
    withdrawal
}