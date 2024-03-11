function validation(){
    if(document.formfill.Username.value==""){
        document.getElementById("result").innerHTML="Enter Username";
        return false;
    }
    else  if(document.formfill.Username.value.length<6){
        document.getElementById("result").innerHTML=" Username Length Must Be Atleast 6 Letters";
        return false;
    }
    else  if(document.formfill.Email.value==""){
        document.getElementById("result").innerHTML="Enter Your Email";
        return false;
    }
    else  if(document.formfill.Password.value==""){
        document.getElementById("result").innerHTML="Enter Your Password";
        return false;
    }  
    else  if(document.formfill.Password.value.length<6){
        document.getElementById("result").innerHTML="Password Must Be 6-Digits";
        return false;
    }
    else  if(document.formfill.cPassword.value==""){
        document.getElementById("result").innerHTML="Enter Confirmation Password";
        return false;
    }
    else  if(document.formfill.Password.value!=document.formfill.cPassword.value){
        document.getElementById("result").innerHTML="Passwords Do Not Match";
        return false;
    }
    
}