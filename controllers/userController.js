const User = require('../models/user');
const Ticket = require('../models/ticket');
const auth= require('../services/auth');
const loadDashboard = async (req, res) => {
    try {
        // const userData = await User.findOne({ email: req.session.user.email }).select("-password");
        const allUserTickets = await Ticket.find({ createdBy: req.session.user._id}).sort({updatedAt:-1});
        // console.log(allUserTickets);
        if (req?.session.user.role === "admin") {
            res.status(200).redirect('/admin/tickets');
            return;
         } else if (req?.session.user.role === "resolver") {
            res.status(200).redirect('/resolver/tickets');
            return;
        }
        res.render('home', {
            user: req.session.user,
            allUserTickets,
        });
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}
const loadRegister = async (req, res) => {
    
    try {
        res.render('register');
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

const register = async (req, res) => {
    const user = User.findOne({ email: req.body.email });
    if (!user) {
        res.render("register", {
            error: "User Created Successfully"
        });
        return;
    }
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.render("register", {
            message:"User Created Successfully"
        });
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    } 
}
const loadLogin = async (req, res) => {
    try {
        res.render('login');
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}
const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            if (user.password === req.body.password) {
                // const userData=(({ password, ...o }) => o)(user)
                // console.log(userData);
                req.session.user = user;
                res.status(200).redirect("/");
                return;
            } else {
                res.render("login", {
                    error: "Incorrect user or password"
                })
                return;
            }
        } else {
            res.render("login", {
                error: "User Not Found"
            })
            return;
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

const logout =  (req, res) => {
    req.session.destroy();
    res.status(200).redirect('/login');
    return;
}
const loadTicketForm = async (req, res) => {
    auth.isLogin();
    try {
        const userData = await User.findOne({ email: req.session.user.email }).select("-password");
        const category = ["Technical Support", "Customer Support", "IT Support", "Human Resources"]
        res.render("createUserTicket", {
            user: userData,
            category:category,
        });
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}
const loadAllUserTickets = async (req, res) => {
    // auth.isLogin();
    try {
        const allUserTickets = await Ticket.find({ createdBy: req.session.user._id });
        // console.log('%cuserController.js line:94 allUserTickets', 'color: #007acc;', allUserTickets);
        res.status(200).json(allUserTickets);
        return;
    } catch (error) {
        console.log('%cuserController.js line:95 error', 'color: #007acc;', error);
        res.sendStatus(500);
        return;
    }
}
const generateUserTicket = async (req, res) => {
    // auth.isLogin();
    try {
        const title = req.body.title;
        const issueType = req.body.category;
        const description= req.body.desc;
        const priority= req.body.priority;
        if (!title && !issueType && !description) {
            res.render("createUserTicket", {
                error: "All field must be filled",
            });
            return;
        }
        const ticketData = await Ticket.create({
            title,
            issueType,
            priority,
            description,
            createdBy:req.session.user._id,
            resolverId:"",
            startTime: new Date().toLocaleString(),
            endTime: new Date(new Date().getTime() + 72 * 60 * 60 * 1000).toLocaleString()
        })
        res.status(200).redirect("/");
        return;
    } catch (error) {
        console.log('%cuserController.js line:82 object', 'color: #007acc;', error);
        res.sendStatus(500);
        return;
    }
}
const ChangeStatusToCancelTicket = async (req, res) => {
    // auth.isLogin();
    try {
        const ticket=await Ticket.findByIdAndUpdate({ _id: req.params._id }, { status: "cancelled" })
        res.status(200).json(ticket);
        return;
        
    } catch (error) {
        console.log('%cuserController.js line:107 error', 'color: #007acc;', error);
        res.sendStatus(500);
        return;
    }
}
const loadCancelledTicket = async (req, res) => {
    // auth.isLogin();
    try {
        const allUserTickets = await Ticket.find({ createdBy: req.session.user._id , status:'cancelled'});
        res.render("cancelledUserTicket", {
            user: req.session.user,
            allUserTickets,
        });
        return;
    } catch (error) {
        console.log('%cuserController.js line:131 error', 'color: #007acc;', error);
        res.sendStatus(500);
        return;
    }
}
const deleteUserTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete({ _id: req.params._id });
        res.status(200).json(ticket); 
        return;
    } catch (error) {
        console.log('%cuserController.js line:138 error', 'color: #007acc;', error);
        res.sendStatus(500);
        return;
    }
}
module.exports = {
    loadDashboard,
    loadLogin,
    register,
    loadRegister,
    login,
    loadTicketForm,
    loadAllUserTickets,
    generateUserTicket,
    ChangeStatusToCancelTicket,
    logout,
    loadCancelledTicket,
    deleteUserTicket
}