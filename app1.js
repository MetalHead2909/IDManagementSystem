//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let isNewUserEntered = false;
let isUserAllotCard = false;
let updateFreq = 1;

mongoose.connect("mongodb://localhost:27017/UserDB",{useNewUrlParser:true});

const centreSchema = new mongoose.Schema({
    CentreNo:Number,
    CentreCity:String,
    CentreAdd:String,
    CentreType:String
});
const appointmentSchema = new mongoose.Schema({
    Name:String,
    RegistrationNo:Number,
    EmailID:String,
    Field:String,
    City:String,
    Accepted:Number
});
const departmentSchema = new mongoose.Schema({
    DeptNo:Number,
    NoOfEmployee:Number,
    AnnualExpense:Number
});
const cardSchema = new mongoose.Schema({
    CardNo:String,
    Type:String,
    IssueDate:String,
    UpdateFreq: Number,
    IssueAmt:Number,
    issuedbyDept: departmentSchema
});
const managingstaffSchema = new mongoose.Schema({
    EmpID:Number,
    CentreCode:centreSchema,
    DOB:String,
    Fname:String,
    Lname:String,
    Gender:String,
    Salary:Number,
    EmpType:String,
    EmpDept:departmentSchema
});
const userSchema = new mongoose.Schema({
    fname:String,
    mname:String,
    lname:String,
    gender:String,
    City:String,
    Address:String,
    Email:String,
    Password:String,
    DOB:String,
    RegNo:String,
    ApplicationAccepted:Number,
    VerificationAccepted:Number,
    cardAllotted:cardSchema,
    MngStaff:String,
    centreAllot:Number
});
const authorizeSchema = new mongoose.Schema({
    LoginNo:String,
    Password:String,
    CityManager:String
});

const Card = mongoose.model("Card",cardSchema);
const Centre = mongoose.model("Centre",centreSchema);
const Department = mongoose.model("Department",departmentSchema);
const ManagingStaff = mongoose.model("ManagingStaff",managingstaffSchema);
const Appointment = mongoose.model("Appointment",appointmentSchema);
const User = mongoose.model("User",userSchema);
const Authorize = mongoose.model("Authorize",authorizeSchema);

const authorize1 = new Authorize({
    LoginNo:"24515@",
    Password:"authorization",
    CityManager:"Mumbai"
});
const authorize2 = new Authorize({
    LoginNo:"24516@",
    Password:"authorize",
    CityManager:"New Dehli"
});
const authorize3 = new Authorize({
    LoginNo:"24517@",
    Password:"authorize3",
    CityManager:"Pune"
});
if(isNewUserEntered === false){
authorize1.save();
authorize2.save();
authorize3.save();
}
const newcentre1 = new Centre({
    CentreNo:10124,
    CentreCity:"Mumbai",
    CentreAdd:"Mantralaya, Marine Lines, Mumbai ",
    CentreType:"Application,Verification and Updation"
});

const newcentre2 = new Centre({
    CentreNo:10214,
    CentreCity:"New Dehli",
    CentreAdd:"Canaught Square, New Dehli",
    CentreType:"Application,Verification and Updation"
});

const newcentre3 = new Centre({
    CentreNo:10324,
    CentreCity:"Pune",
    CentreAdd:"Marathwada, Pune",
    CentreType:"Verification and Updation"
});
if(isNewUserEntered === false){
newcentre1.save();
newcentre2.save();
newcentre3.save();
}
const managing = new Department({
    DeptNo:1124,
    NoOfEmployee:10,
    AnnualExpense:20000
});
const technical = new Department({
    DeptNo:2231,
    NoOfEmployee:15,
    AnnualExpense:40000
});
const appointment = new Department({
    DeptNo:3321,
    NoOfEmployee:12,
    AnnualExpense:30000
});
if(isNewUserEntered === false){
managing.save();
technical.save();
appointment.save();
}
const managingstaff1 = new ManagingStaff({
    EmpID:managing.DeptNo+101,
    CentreCode:newcentre1,
    DOB:"1980-12-10",
    Fname:"Gauresh",
    Lname:"Manav",
    Gender:"Male",
    Salary:40000,
    EmpType:"Manager",
    EmpDept:managing
});
const managingstaff2 = new ManagingStaff({
    EmpID:technical.DeptNo+101,
    CentreCode:newcentre1,
    DOB:"1970-8-12",
    Fname:"Pragya",
    Lname:"Sutar",
    Gender:"Female",
    Salary:40000,
    EmpType:"Technical",
    EmpDept:technical
});
const managingstaff3 = new ManagingStaff({
    EmpID:appointment.DeptNo+101,
    CentreCode:newcentre1,
    DOB:"1960-5-6",
    Fname:"Suresh",
    Lname:"Shankaran",
    Gender:"Male",
    Salary:40000,
    EmpType:"Appointment",
    EmpDept:appointment
});
if(isNewUserEntered === false){
managingstaff1.save();
managingstaff2.save();
managingstaff3.save();
}
app.get("/",function(req,res){
    // if(!isNewUserEntered){
    // res.render("newuser.ejs",{});
    //}else{
    res.render("homepage",{passwordMessage:null});
   // }
   console.log("/ function entered");
});

app.post("/app1.js",function(req,res){
    console.log("/app1.js function entered");
    const registerno= String(new Date().getFullYear()) +String(new Date().getHours()) + String(new Date().getMinutes());
    const newuser = new User({
        fname:req.body.fname,
        mname:req.body.midname,
        lname:req.body.lname,
        gender:req.body.gender,
        City:req.body.city,
        Address:(req.body.street) + " " + (req.body.city) + " " + (req.body.state) + " "+(req.body.pincode)+" "+(req.body.country),
        Email:req.body.email,
        Password:req.body.password,
        DOB:req.body.dob,
        RegNo:registerno,
        ApplicationAccepted:0,
        VerificationAccepted:0,
        cardAllotted:null,
        MngStaff:null,
        centreAllot:null
    });
    newuser.save();
    console.log("New User Entered with register number : "+registerno);
    isNewUserEntered = true;
    res.render("homepage",{passwordMessage:null});
});

app.post("/app1.js/action",function(req,res){
    console.log("/app1.js/action function entered");
    const Username = req.body.Username;
    const PassWord = req.body.Password;
    User.findOne({Email:Username},function(err, FoundEmail){
        if(err){
            res.render("homepage",{passwordMessage:"Invalid Username"});
        }
        else{
            if(FoundEmail.Password === PassWord){
                const idappmsg = FoundEmail.ApplicationAccepted === 1 ? "APPLICATION IN PROCESSING...":(FoundEmail.ApplicationAccepted === 0 ? "ID APPLICATION":(FoundEmail.ApplicationAccepted === 2?"APPLICATION APPROVED":"APPLIICATION DENIED(try again later, thank you)"));
                const idvermsg = FoundEmail.VerificationAccepted === 1 ? "APPLICATION PENDING...":(FoundEmail.VerificationAccepted === 0? "ID VERIFICATION/ID UPDATION":(FoundEmail.VerificationAccepted===2?"ID UPDATION APPROVED":"APPLIICATION DENIED(try again later, thank you)"));
                res.render("userdetails",{name:(FoundEmail.fname+" "+FoundEmail.mname+" "+FoundEmail.lname),regno:FoundEmail.RegNo,address:FoundEmail.Address,email:FoundEmail.Email,bday:FoundEmail.DOB,gender:FoundEmail.gender,isDisabled:isUserAllotCard,city:FoundEmail.City,idapp:idappmsg,idver:idvermsg})
            }
            else{
                res.render("homepage",{passwordMessage:"Invalid Password"});
            }
        }
    })
});

app.post("/app1.js/homepage",function(req,res){
    console.log("homepage function entered");
    res.render("homepage",{passwordMessage:null});
});

app.post("/app1.js/newuser",function(req,res){
    console.log("newuser function entered");
    res.render("newuser",{});
})

app.post("/app1.js/IdApplication",async function(req,res){
    console.log("/app1.js/IdApplication function entered");
    const regNo = req.body.regno;
    const cityName = req.body.city;
    var isApplicationAccepted = false;
    User.findOne({RegNo:regNo},async function(err,FoundEmail){
        if(!err){
            console.log(FoundEmail);
            if(FoundEmail.ApplicationAccepted === 2){
                console.log("FoundEmail.ApplicationAccepted === 2 entered");
                console.log("isApplicationAccepted(before function):"+isApplicationAccepted);
                isApplicationAccepted=true;
                console.log("isApplicationAccepted(after function):"+isApplicationAccepted);
                }}
    });
    await User.findOne();
    console.log(regNo);
    console.log(cityName);
    console.log("isApplicationAccepted(after findOne function):"+isApplicationAccepted);
    if(isApplicationAccepted === true){
        const newcard = new Card({
            CardNo:String(new Date().getMinutes())+regNo,
            Type:"ID",
            IssueDate:String(new Date().getDate()),
            UpdateFreq: 1,
            IssueAmt:2000,
            issuedbyDept: appointment
        });
        newcard.save();
        console.log(newcard);
        console.log("isApplicationAccepted === true entered");
        User.updateOne({RegNo:regNo},{cardAllotted:newcard},function(err){});
        var CentreAddress;
        Centre.findOne({CentreCity:cityName},function(err, CentreFound){ if(!err){CentreAddress = CentreFound.CentreAdd}});
        console.log("CentreAddress:"+CentreAddress);
        var CentreNumber;
        Centre.findOne({CentreCity:cityName},function(err, CentreFound){ if(!err){CentreNumber = CentreFound.CentreNo}});
        console.log("CentreNumber:"+CentreNumber);
        User.updateOne({RegNo:regNo},{centreAllot:CentreNumber},function(err){});
        var ManagingStaffFound; //const intialized
        ManagingStaff.findOne({EmpType:"Appointment"},function(err, FoundManagingStaff){ if(!err){
             ManagingStaffFound = (FoundManagingStaff.Fname)+" "+(FoundManagingStaff.Lname);
                console.log(FoundManagingStaff)}});
        User.updateOne({RegNo:regNo},{MngStaff:ManagingStaffFound},function(err,FoundEmail){});
        console.log("ManagingStaff:"+ManagingStaffFound) 
        var Manager;
        ManagingStaff.findOne({EmpType:"Manager"},function(err, FoundManagingStaff){if(!err){Manager = (FoundManagingStaff.Fname)+" "+(FoundManagingStaff.Lname)}});
        console.log("Manager: "+Manager);
        User.findOne({RegNo:regNo},function(err,FoundEmail){
            if(!err)
            {
                console.log(FoundEmail);
                res.render("newapplication",{name:(FoundEmail.fname)+" "+(FoundEmail.mname)+" "+(FoundEmail.lname),
                regno:FoundEmail.RegNo,
                centreAlloted:cityName,
                centreMngr:Manager,
                centreStaff:ManagingStaffFound,
                centreAdd:CentreAddress,
                centreNo:CentreNumber,
                dateofapp:String(new Date().getDate())+"-"+String(new Date().getMonth())+"-"+String(new Date().getFullYear())});
                isUserAllotCard = true;
            }
        });
    }
    else{
        console.log("isApplicationAccepted === false entered");
        var appName;
        var appEmail;
        //var appCity;
        User.findOne({RegNo:regNo},function(err,FoundEmail){
            if(!err){
                //appName = (FoundEmail.fname)+" "+(FoundEmail.mname)+" "+(FoundEmail.lname);
                //appEmail = FoundEmail.Email;
                //console.log(appName);
                //console.log(appEmail);
                const appApplication = new Appointment({
                    Name:(FoundEmail.fname)+" "+(FoundEmail.mname)+" "+(FoundEmail.lname),
                    RegistrationNo:regNo,
                    EmailID:FoundEmail.Email,
                    Field:"ID Application",
                    City:cityName,
                    Accepted:0
                });
                appApplication.save();
                //appCity = FoundEmail.City;
            }
        });
        User.findOneAndUpdate({RegNo:regNo},{ApplicationAccepted:1},function(err, FoundEmail){});
        User.findOne({RegNo:regNo},function(err,FoundEmail){
            if(!err){
                res.render("userdetails",{name:(FoundEmail.fname+" "+FoundEmail.mname+" "+FoundEmail.lname),regno:FoundEmail.RegNo,address:FoundEmail.Address,email:FoundEmail.Email,bday:FoundEmail.DOB,gender:FoundEmail.gender,isDisabled:isUserAllotCard,city:FoundEmail.City,idapp:"APPLICATION IN PROCESSING...",idver:"ID VERIFICATION/ID UPDATION"});
            }
        }) 
    }   
});

app.post("/app1.js/IdVerification",async function(req,res){
    console.log("app1.js/IdVerification entered");
    const regNo = req.body.regno;
    const cityName = req.body.city;
    updateFreq+=1;
    var isVerificationAccepted = false;
    User.findOne({RegNo:regNo},async function(err,FoundEmail){
        if(!err){if(FoundEmail.VerificationAccepted == 2){isVerificationAccepted=true;}}
    });
    await User.findOne();
    if(isVerificationAccepted === true){
        console.log("isVerificationAccepted === true function entered");
        var CentreAddress;
    Centre.findOne({CentreCity:cityName},function(err, CentreFound){ if(!err){CentreAddress = CentreFound.CentreAdd}});
    console.log("CentreAddress:"+CentreAddress);
    var CentreNumber;
    Centre.findOne({CentreCity:cityName},function(err, CentreFound){ if(!err){CentreNumber = CentreFound.CentreNo}});
    console.log("CentreNumber:"+CentreNumber);
    var ManagingStaffFound; //const intialized
    ManagingStaff.findOne({EmpType:"Technical"},function(err, FoundManagingStaff){ if(!err){
         ManagingStaffFound = (FoundManagingStaff.Fname)+" "+(FoundManagingStaff.Lname);
            console.log(FoundManagingStaff)}});
    var Manager;
    ManagingStaff.findOne({EmpType:"Manager"},function(err, FoundManagingStaff){if(!err){Manager = (FoundManagingStaff.Fname)+" "+(FoundManagingStaff.Lname)}});
    console.log("Manager: "+Manager);
    User.findOne({RegNo:regNo},function(err, FoundEmail){
    res.render("newapplication",{name:(FoundEmail.fname)+" "+(FoundEmail.mname)+" "+(FoundEmail.lname),
        regno:FoundEmail.RegNo,
        centreAlloted:cityName,
        centreMngr:Manager,
        centreStaff:ManagingStaffFound,
        centreAdd:CentreAddress,
        centreNo:CentreNumber,
        dateofapp:String(new Date().getDate())+"-"+String(new Date().getMonth())+"-"+String(new Date().getFullYear())});
    });
    }
    else{
        console.log("isVerificationAccepted === false function entered");
        var appName;
        var appEmail;
        //var appCity;
        User.findOne({RegNo:regNo},async function(err,FoundEmail){
            if(!err){
                appName = (FoundEmail.fname)+" "+(FoundEmail.mname)+" "+(FoundEmail.lname);
                appEmail = FoundEmail.Email;
                //appCity = FoundEmail.City;
            }
        })
        await User.findOne()
        const appVerification = new Appointment({
            Name:appName,
            RegistrationNo:regNo,
            EmailID:appEmail,
            Field:"ID Verification/ID Updation",
            City:cityName,
            Accepted:0
        });
        appVerification.save();
        User.findOneAndUpdate({RegNo:regNo},{VerificationAccepted:1},function(err, FoundEmail){});
        User.findOne({RegNo:regNo},function(err,FoundEmail){
            const idappmsg = FoundEmail.ApplicationAccepted === 1 ? "APPLICATION IN PROCESSING...":(FoundEmail.ApplicationAccepted === 0 ? "ID APPLICATION":"APPLICATION APPROVED");
            console.log(FoundEmail.VerificationAccepted);
            res.render("userdetails",{name:(FoundEmail.fname+" "+FoundEmail.mname+" "+FoundEmail.lname),regno:FoundEmail.RegNo,address:FoundEmail.Address,email:FoundEmail.Email,bday:FoundEmail.DOB,gender:FoundEmail.gender,isDisabled:isUserAllotCard,city:FoundEmail.City,idapp:idappmsg,idver:"APPLICATION PENDING..."});
        })
        
    }
});

app.post("/app1.js/ViewCard",function(req,res){
    console.log("/app1.js/ViewCard function entered");
    const regNo = req.body.regno;
    //var cardInfo;
    var cardNumber;
    var cardType;
    var updationfreq;
    var cardamt;
    User.findOne({RegNo:regNo},function(err,FoundEmail){ 
        console.log(FoundEmail);
        cardNumber = FoundEmail.cardAllotted.CardNo;
        cardType =  FoundEmail.cardAllotted.Type;
        updationfreq = FoundEmail.cardAllotted.UpdateFreq;
        cardamt = FoundEmail.cardAllotted.IssueAmt});
    User.findOne({RegNo:regNo},function(err, FoundEmail){
        if(!err){
            res.render("viewcard",{name:(FoundEmail.fname)+" "+(FoundEmail.mname)+" "+(FoundEmail.lname),
    regno:FoundEmail.RegNo,
    cardno:cardNumber,
    cardtype:cardType,
    updatefreq:updationfreq,
    issueamt:cardamt})
        }
    })
});

app.post("/app1.js/AuthorizeUserLogin",function(req,res){
    console.log("/app1/js/AuthorizeUserLogin function entered");
    res.render("authorizeuserlogin",{passwordMessage:null});
})

app.post("/app1.js/AuthorizeUser",function(req,res){
    console.log("/app1.js/AuthorizeUser function entered");
    const Username = req.body.Username;
    const Password = req.body.Password;
    Authorize.findOne({LoginNo:Username},function(err, FoundUsername){
        if(!err){
            if(Password === FoundUsername.Password){
                res.render("authorizedetails",{userCity:FoundUsername.CityManager});
            }
            else{
                res.render("authorizeuserlogin",{passwordMessage:"Invalid Password"});
            }
        }
        else{
            res.render("authorizeuserlogin",{passwordMessage:"Invalid Username"});
        }
    })
});

app.post("/app1/js/EmployeeDataDept",function(req, res){
    console.log("/app1.js/EmployeeDataDept function entered");
    Department.find({},function(err, FoundDepartment){
        res.render("authorizeduserdept",{schema:"Departments",NewList:FoundDepartment});
    })
    //res.render("authorizeduserdept",{schema:"Departments",NewList:Department});
})
app.post("/app1/js/EmployeeDataCentre",function(req, res){
    console.log("/app1/js/EmployeeDataCentre function entered");
    Centre.find({},function(err, FoundCentre){
        res.render("authorizedusercentre",{schema:"Centres",NewList:FoundCentre});
    })
    //res.render("authorizeduseraccessdetails",{schema:"Centres",NewList:Centre});
})
app.post("/app1/js/EmployeeDataManagingStaff",function(req, res){
    console.log("/app1/js/EmployeeDataManagingStaff function entered");
    ManagingStaff.find({},function(err, FoundManagingStaff){
        res.render("authorizedusermanagingstaff",{schema:"Managing Staff",NewList:FoundManagingStaff});
    })
    //res.render("authorizeduseraccessdetails",{schema:"Managing Staff",NewList:ManagingStaff});
})

app.post("/app1.js/PendingAppointments",function(req,res){
    console.log("/app1.js./PendingAppointments function entered");
    const AuthorizedUserCity = req.body.PendingAppointment;
    console.log(AuthorizedUserCity);
    Appointment.find({Accepted:0,City:AuthorizedUserCity},function(err, FoundAppointment){
        res.render("application",{NewList:FoundAppointment});
    })
})

app.post("/app1.js/DueAppointments",function(req,res){
    console.log("/app1.js/DueAppointments function entered");
    const AuthorizedUserCity = req.body.DueAppointment;
    Appointment.find({Accepted:1,City:AuthorizedUserCity},function(err, FoundAppointment){
        res.render("dueapplication",{NewList:FoundAppointment});
    });
})

app.post("/app1.js/delete",function(req,res){
    console.log("/app1.js/delete function entered");
    const itemid = req.body.checkbox;
    const regno = req.body.regnumber;
    const idreg = req.body.idtype;
    console.log(regno);
    console.log("pending appointment deleted");
    //Appointment.findOneAndUpdate({_id:itemid},{Accepted:1},function(err, foundAppointment){});
    if(idreg === "ID Application"){
        console.log(idreg);
        User.findOneAndUpdate({RegNo:regno},{ApplicationAccepted:2},function(err,FoundUser){
            if(!err){console.log("User Found : "+FoundUser)};
        })
    }
    else {
        User.findOneAndUpdate({RegNo:regno},{VerificationAccepted:2},function(err,FoundUser){})
    }
    Appointment.findOneAndUpdate({_id:itemid},{Accepted:1},function(err, foundAppointment){});
    Appointment.findOneAndUpdate({_id:itemid},{$pull:{items: {_id:itemid}}},function(err, foundAppointment){});
    Appointment.find({Accepted:0},function(err, FoundAppointment){
        res.render("application",{NewList:FoundAppointment});
    });
})

app.post("/app1.js/onlydelete",function(req,res){
    const itemid = req.body.checkbox;
    const regno = req.body.regnumber;
    const idreg = req.body.idtype;
    console.log(itemid);
    console.log("/app1.js/onlydelete");
    console.log("pending appointment deleted");
    Appointment.findOneAndRemove({_id:itemid},function(err, foundAppointment){});
    if(idreg === "ID Application"){
        console.log(idreg);
        User.findOneAndUpdate({RegNo:regno},{ApplicationAccepted:3},function(err,FoundUser){
            if(!err){console.log("User Found : "+FoundUser)};
        })
    }
    else {
        User.findOneAndUpdate({RegNo:regno},{VerificationAccepted:3},function(err,FoundUser){})
    }
    //Appointment.findOneAndUpdate({_id:itemid},{$pull:{items: {_id:itemid}}},function(err, foundAppointment){});
    Appointment.find({Accepted:0},function(err, FoundAppointment){
        res.render("application",{NewList:FoundAppointment});
    });
})

app.listen(3000,function(){
    console.log("Server started on port 3000");
})

// $(function(){
//     $(document).on('submit','form',function(e){
//         e.preventDefault();
//         var button = $('button[type=submit]',this);
//         button.prop('disabled',true).find('span').text("Apllication Approval Pending...");
//         $.ajax({
//             success:function(data){
//                 button.prop('disabled',false).find('span').text("Button");
//             }
//         })
//     })
// })

//<!-- Mobile No : <%=%><br> --></br>
//<!-- Qualification : <%=%><br> --></br>
//<!-- Last Login : <%=%><br> -->
//<!-- Appointments : <%=%><br></p> --></br>