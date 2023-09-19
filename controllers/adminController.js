const User = require('../models/user');
const Ticket = require('../models/ticket');
const roles = ['resolver', 'admin'];
const allDept = ["Technical Support", "Customer Support", "IT Support", "Human Resources"]
const loadAddResolver = async (req, res) => {
    try {
        res.render("./admin/addResolver", {
            roles,
            allDept,
            message:null,
        });
        return;
    } catch (error) {
        console.log('%cadminController.js line:5 error', 'color: #007acc;', error);
    }
}
const register = async (req, res) => {
    try {

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        const dept = req.body.dept;
        const user = await User.findOne({ email: req.body.email }) ;
        if (!user) { 
            await User.create({
                name,
                email,
                password,
                role,
                dept,
            })
            res.status(200).redirect("/");
            return;
        }
        res.render("./admin/addResolver", {
            message: "User already exists",
            roles,
            allDept,
        });
        return;
    } catch (error) {
        console.log('%cadminController.js line:13 error', 'color: #007acc;', error);
    }
}
const loadAllTickets = async (req, res) => {
    const allTickets = await Ticket.find({status:'pending'}).sort({createdAt:-1});
    // console.log('%cadminController.js line:47 allTickets', 'color: #007acc;', allTickets);
    const filter = ["All", ...allDept];
    res.render("./admin/allTickets", {
        allTickets,
        user: req.session.user,
        filter,
    });
    return;
    
}

const resolveTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate({ _id: req.params._id }, { status: "opened", resolverId: req.session.user._id });
        res.status(200).json(ticket);
        return;
    } catch (error) {
        console.log('%cuserController.js line:60 error', 'color: #007acc;', error);
    }    
}
const openedTickets = async (req, res) => {
    const allOpenedTickets = await Ticket.find({status:"opened", resolverId:req.session.user._id});
    // console.log('%cadminController.js line:47 allTickets', 'color: #007acc;', allTickets);
    res.render("./admin/openedTickets", {
        allOpenedTickets,
        user: req.session.user,
    });
    return;
}
const closeTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate({ _id: req.params._id }, { status: "closed" });
        res.status(200).json(ticket);
        return;
    } catch (error) {
        console.log('%cuserController.js line:60 error', 'color: #007acc;', error);
    }
}
const closedTickets = async (req, res) => {
    const allClosedTickets = await Ticket.find({ status: "closed" });
    // console.log('%cadminController.js line:47 allTickets', 'color: #007acc;', allTickets);
    res.render("./admin/closedTickets", {
        allClosedTickets,
        user: req.session.user,
    });
    return;
}

// const loadTicketsDeptWise = async (req, res) => {
//     console.log(req.body);
//     const encodedFilterVlaue = req.params.value;
//     const filterValue = decodeURIComponent(encodedFilterVlaue);
//     console.log('%cadminController.js line:97 filterValue', 'color: #007acc;', filterValue);
//     const allTickets = await Ticket.find({ issueType: filterValue,});
//     const filter = ["All", ...allDept];
// //     res.render("./admin/allTickets", {
// //         allTickets:allTickets,
// //         user: req.session.user,
// //        filter,
// //    });
//     res.status(200).redirect("/logout");
//     return;
   
// }

// function filterby(req, res) {
//     const filter = req.params.filter
//     console.log('%cadminController.js line:116 filter', 'color: #007acc;', filter);
//     if (filter === "All") {
//         Ticket.find({})
//         .then(tickets => {
//             // res.render("./admin/allTickets", { allTickets: tickets, user: req.session.user, filter: ["All", ...allDept] });
//             res.json(tickets);
//             return;
//         })
//     } else {
//         allDept.forEach(f => {
//             if (f == filter) {
//                 Ticket.find({ issueType: filter })
//                 .then(tickets => {
//                     // res.render("./admin/allTickets", { allTickets : tickets, user: req.session.user, filter: ["All",...allDept] });
//                     res.json(tickets);

//                 })
//             }
//         })
//     }

// }
const filterby=async (req, res)=>{
    const data=decodeURIComponent(req.params.filter);
    const dataArr=data.split('-');
    const [filter,sorting]=dataArr;
    console.log(filter);

    console.log('%cadminController.js line:116 filter', 'color: #007acc;', filter);
        if (filter === "All" && sorting==="Time ASC") {
           const tickets=await Ticket.find({});
           res.json(tickets);
           return;
        } else if(filter === "All" && sorting==="Time DSC"){
            const tickets=await Ticket.find({}).sort({createdAt:-1});
           res.json(tickets);
           return;
        }else if(sorting==="Time DSC"){
                const tickets=await Ticket.find({ issueType: filter }).sort({createdAt:-1});
                res.json(tickets)
                return;
        }else if(sorting==="Time ASC"){
            const tickets=await Ticket.find({ issueType: filter });
                res.json(tickets)
                return;
        }
        return;
                
        
}
// function sortby(req, res) {
    
//     const sorting =decodeURIComponent(req.params.sorting);
//     if (sorting === "Time ASC") {
//         Ticket.find({})
//         .then(tickets => {
//             res.json(tickets);
//         })
//         .catch((error)=> console.log('%cadminController.js line:141 error', 'color: #007acc;', error))
//     } else if (sorting ==="Time DSC"){
//         Ticket.find({}).sort({ createdAt: -1 })
//             .then(tickets => {
//                 res.json(tickets);
//             })
//         .catch ((error) => console.log('%cadminController.js line:141 error', 'color: #007acc;', error))
//     } else if (sorting ==="Priority DESC"){
        
//     }
// }

async function getNotifications(req,res){
    console.log(req.path,req.method);
    console.log("notification requested");
    const allTickets= await Ticket.find({_id:req.session.user._id,status:"opened"});
    allTickets.forEach(ticket=>console.log(ticket))
    res.end("hello")
}


module.exports = {
    loadAddResolver,
    register,
    loadAllTickets,
    resolveTicket,
    openedTickets,
    closeTicket,
    closedTickets,
    // loadTicketsDeptWise,
    filterby,
    // sortby,
    getNotifications
}