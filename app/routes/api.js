
var User = require('../models/user');
var jwt = require('jsonwebtoken'); 
var secret = 'harrypotter'; 
var nodemailer = require('nodemailer'); 
var sgTransport = require('nodemailer-sendgrid-transport');


module.exports=function(router){
	router.post('/users',function(req,res){
		var user= new User();
		user.username=req.body.username;
		user.password=req.body.password;
		user.email=req.body.email;
		user.name = req.body.name; 
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); 

		if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null ||req.body.email == ''||req.body.name=null || req.body.name=''){
			res.json({success: false, message: 'Ensure username, email, and password were provided'})
		} else{
			user.save(function(err){
				iif (err) {
                    // Check if any validation errors exists (from user model)
                    if (err.errors !== null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); 
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); 
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); 
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); 
                        } else {
                            res.json({ success: false, message: err }); 
                        }
                    } else if (err) {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); 
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); 
                            }
                        } else {
                            res.json({ success: false, message: err }); 
                        }
                    }
                } else {
                    // Create e-mail object to send to user
                    var email = {
                        from: 'MEAN Stack Staff, abc.com',
                        to: [user.email, 'gramtri@gmail.com'],
                        subject: 'Your Activation Link',
                        text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://www.herokutestapp3z24.com/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://www.herokutestapp3z24.com/activate/' + user.temporarytoken + '">http://www.herokutestapp3z24.com/activate/</a>'
                    };
                    // Function to send e-mail to the user
                    client.sendMail(email, function(err, info) {
                        if (err) {
                            console.log(err); // If error with sending e-mail, log to console/terminal
                        } else {
                            console.log(info); // Log success message to console if sent
                            console.log(user.email); // Display e-mail that it was sent to
                        }
                    });
                    res.json({ success: true, message: 'Account registered! Please check your e-mail for activation link.' }); // Send success message back to controller/request
                }
            });
        }
    });
			// Route to check if username chosen on registration page is taken
    router.post('/checkusername', function(req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, abc.com',
                    to: 'gramtri@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); 
                    } else {
                        console.log(info); 
                        console.log(user.email); 
                    }
                });
                res.json({ success: false, message: 'Something went wrong. ' });
            } else {
                if (user) {
                    res.json({ success: false, message: 'That username is already taken' }); 
                } else {
                    res.json({ success: true, message: 'Valid username' }); 
                }
            }
        });
    });

    // Route to check if e-mail chosen on registration page is taken    
    router.post('/checkemail', function(req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, abc.com',
                    to: 'gramtri@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); 
                    } else {
                        console.log(info); 
                        console.log(user.email); 
                    }
                });
                res.json({ success: false, message: 'Something went wrong. ' });
            } else {
                if (user) {
                    res.json({ success: false, message: 'That e-mail is already taken' }); 
                } else {
                    res.json({ success: true, message: 'Valid e-mail' }); 
                }
            }
        });
    });

// Route to activate the user's account 
    router.put('/activate/:token', function(req, res) {
        User.findOne({ temporarytoken: req.params.token }, function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, abc.com',
                    to: 'gramtri@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); 
                        console.log(user.email); 
                    }
                });
                res.json({ success: false, message: 'Something went wrong. '});
            } else {
                var token = req.params.token; // Save the token from URL for verification 
                // Function to verify the user's token
                jwt.verify(token, secret, function(err, decoded) {
                    if (err) {
                        res.json({ success: false, message: 'Activation link has expired.' }); 
                    } else if (!user) {
                        res.json({ success: false, message: 'Activation link has expired.' }); 
                    } else {
                        user.temporarytoken = false; 
                        user.active = true; 
                        // Mongoose Method to save user into the database
                        user.save(function(err) {
                            if (err) {
                                console.log(err); 
                            } else {
                                // If save succeeds, create e-mail object
                                var email = {
                                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                    to: user.email,
                                    subject: 'Account Activated',
                                    text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                                    html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                                };
                                // Send e-mail object to user
                                client.sendMail(email, function(err, info) {
                                    if (err) console.log(err); 
                                });
                                res.json({ success: true, message: 'Account activated!' }); 
                            }
                        });
                    }
                });
            }
        });
    });
	return router;
}
// Route to delete a user
    router.delete('/management/:username', function(req, res) {
        var deletedUser = req.params.username; 
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) {
               
                var email = {
                    from: 'MEAN Stack Staff, abc.com',
                    to: 'gramtri@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); \
                    } else {
                        console.log(info); 
                        console.log(user.email); 
                    }
                });
                res.json({ success: false, message: 'Something went wrong. ' });
            } else {
                
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); 
                } else {
                
                    if (mainUser.permission !== 'admin') {
                        res.json({ success: false, message: 'Insufficient Permissions' }); 
                    } else {
                        
                        User.findOneAndRemove({ username: deletedUser }, function(err, user) {
                            if (err) {
                                
                                var email = {
                                    from: 'MEAN Stack Staff, abc.com',
                                    to: 'gramtri@gmail.com',
                                    subject: 'Error Logged',
                                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                };
                                // Function to send e-mail to myself
                                client.sendMail(email, function(err, info) {
                                    if (err) {
                                        console.log(err); 
                                    } else {
                                        console.log(info); 
                                        console.log(user.email); 
                                    }
                                });
                                res.json({ success: false, message: 'Something went wrong. ' });
                            } else {
                                res.json({ success: true }); // Return success status
                            }
                        });
                    }
                }
            }
        });
    });

    // Route to get the user that needs to be edited
    router.get('/edit/:id', function(req, res) {
        var editUser = req.params.id; 
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) {
                
                var email = {
                    from: 'MEAN Stack Staff, abc.com',
                    to: 'gramtri@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); 
                    } else {
                        console.log(info); 
                        console.log(user.email); 
                    }
                });
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                // Check if logged in user was found in database
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); 
                } else {
                    \
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) {
                                
                                var email = {
                                    from: 'MEAN Stack Staff, abc.com',
                                    to: 'gramtri@gmail.com',
                                    subject: 'Error Logged',
                                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                };
                                // Function to send e-mail to myself
                                client.sendMail(email, function(err, info) {
                                    if (err) {
                                        console.log(err); 
                                    } else {
                                        console.log(info); 
                                        console.log(user.email); 
                                    }
                                });
                                res.json({ success: false, message: 'Something went wrong. ' });
                            } else {
                                // Check if user to edit is in database
                                if (!user) {
                                    res.json({ success: false, message: 'No user found' }); 
                                } else {
                                    res.json({ success: true, user: user }); 
                                }
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permission' }); 
                    }
                }
            }
        });
    });

    // Route to update/edit a user
    router.put('/edit', function(req, res) {
        var editUser = req.body._id; 
        if (req.body.name) var newName = req.body.name; 
        if (req.body.username) var newUsername = req.body.username; 
        if (req.body.email) var newEmail = req.body.email; 
        if (req.body.permission) var newPermission = req.body.permission; 
        // Look for logged in user in database to check if have appropriate access
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) {
                
                var email = {
                    from: 'MEAN Stack Staff, abc.com',
                    to: 'gramtri@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); 
                    } else {
                        console.log(info); 
                        console.log(user.email); 
                    }
                });
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                
                if (!mainUser) {
                    res.json({ success: false, message: "no user found" }); 
                } else {
                    
                    if (newName) {
                        
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            
                            User.findOne({ _id: editUser }, function(err, user) {
                                if (err) {
                                    
                                    var email = {
                                        from: 'MEAN Stack Staff, abc.com',
                                        to: 'gramtri@gmail.com',
                                        subject: 'Error Logged',
                                        text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                        html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                    };
                                    // Function to send e-mail to myself
                                    client.sendMail(email, function(err, info) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(info); 
                                            console.log(user.email); 
                                        }
                                    });
                                    res.json({ success: false, message: 'Something went wrong. ' });
                                } else {
                                    // Check if user is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); 
                                    } else {
                                        user.name = newName; 
                                        
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); 
                                            } else {
                                                res.json({ success: true, message: 'Name has been updated!' }); 
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); 
                        }
                    }

                    // Check if a change to username was requested
                    if (newUsername) {
                        
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            
                            User.findOne({ _id: editUser }, function(err, user) {
                                if (err) {
                                   
                                    var email = {
                                        from: 'MEAN Stack Staff, abc.com',
                                        to: 'gramtri@gmail.com',
                                        subject: 'Error Logged',
                                        text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                        html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                    };
                                    
                                    client.sendMail(email, function(err, info) {
                                        if (err) {
                                            console.log(err); 
                                        } else {
                                            console.log(info); 
                                            console.log(user.email); 
                                        }
                                    });
                                    res.json({ success: false, message: 'Something went wrong. ' });
                                } else {
                                    // Check if user is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); 
                                    } else {
                                        user.username = newUsername; 
                                        
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); 
                                            } else {
                                                res.json({ success: true, message: 'Username has been updated' }); 
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); 
                        }
                    }

                    // Check if change to e-mail was requested
                    if (newEmail) {
                        
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                           
                            User.findOne({ _id: editUser }, function(err, user) {
                                if (err) {
                                    var email = {
                                        from: 'MEAN Stack Staff, abc.com',
                                        to: 'gramtri@gmail.com',
                                        subject: 'Error Logged',
                                        text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                        html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                    };
                                    // Function to send e-mail to myself
                                    client.sendMail(email, function(err, info) {
                                        if (err) {
                                            console.log(err); 
                                        } else {
                                            console.log(info); 
                                            console.log(user.email); 
                                        }
                                    });
                                    res.json({ success: false, message: 'Something went wrong.' });
                                } else {
                                    // Check if logged in user is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); 
                                    } else {
                                        user.email = newEmail; 
                                        
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); 
                                            } else {
                                                res.json({ success: true, message: 'E-mail has been updated' }); 
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        }
                    }

                    // Check if a change to permission was requested
                    if (newPermission) {
                        
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            
                            User.findOne({ _id: editUser }, function(err, user) {
                                if (err) {
                                    
                                    var email = {
                                        from: 'MEAN Stack Staff, abc.com',
                                        to: 'gramtri@gmail.com',
                                        subject: 'Error Logged',
                                        text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                        html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                    };
                                    // Function to send e-mail to myself
                                    client.sendMail(email, function(err, info) {
                                        if (err) {
                                            console.log(err); // If error with sending e-mail, log to console/terminal
                                        } else {
                                            console.log(info); 
                                            console.log(user.email); 
                                        }
                                    });
                                    res.json({ success: false, message: 'Something went wrong. ' });
                                } else {
                                    // Check if user is found in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); 
                                    } else {
                                        
                                        if (newPermission === 'user') {
                                            
                                            if (user.permission === 'admin') {
                                                // Check if user making changes has access
                                                if (mainUser.permission !== 'admin') {
                                                    res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade an admin.' }); 
                                                } else {
                                                    user.permission = newPermission; 
                                                    // Save changes
                                                    user.save(function(err) {
                                                        if (err) {
                                                            console.log(err); 
                                                        } else {
                                                            res.json({ success: true, message: 'Permissions have been updated!' }); // 
                                                        }
                                                    });
                                                }
                                            } else {
                                                user.permission = newPermission; 
                                                // Save changes
                                                user.save(function(err) {
                                                    if (err) {
                                                        console.log(err); 
                                                    } else {
                                                        res.json({ success: true, message: 'Permissions have been updated!' }); 
                                                    }
                                                });
                                            }
                                        }
                                        // Check if attempting to set the 'moderator' permission
                                        if (newPermission === 'moderator') {
                                            
                                            if (user.permission === 'admin') {
                                                
                                                if (mainUser.permission !== 'admin') {
                                                    res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' }); 
                                                } else {
                                                    user.permission = newPermission; 
                                                    
                                                    user.save(function(err) {
                                                        if (err) {
                                                            console.log(err); 
                                                        } else {
                                                            res.json({ success: true, message: 'Permissions have been updated!' }); 
                                                        }
                                                    });
                                                }
                                            } else {
                                                user.permission = newPermission; 
                                                
                                                user.save(function(err) {
                                                    if (err) {
                                                        console.log(err); 
                                                    } else {
                                                        res.json({ success: true, message: 'Permissions have been updated!' }); 
                                                    }
                                                });
                                            }
                                        }

                                        // Check if assigning the 'admin' permission
                                        if (newPermission === 'admin') {
                                            
                                            if (mainUser.permission === 'admin') {
                                                user.permission = newPermission; 
                                                
                                                user.save(function(err) {
                                                    if (err) {
                                                        console.log(err); 
                                                    } else {
                                                        res.json({ success: true, message: 'Permissions have been updated!' }); 
                                                    }
                                                });
                                            } else {
                                                res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to upgrade someone to the admin level' }); 
                                            }
                                        }
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); 
                        }
                    }
                }
            }
        });
    });

    return router; 

