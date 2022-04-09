const Budget = require('../models/budget');

module.exports = {
    index,
    new: newBudget,
    create,
    show,
    delete: deleteBudget,
    edit,
    update
}

function index(req, res) {
    Budget.find({}, function(err, budgets) {
        if (err) return res.redirect('/home');
        res.render('budgets/index', {
            title: 'All Budgets',
            budgets
        });
    });
}

function newBudget(req, res) {
    res.render('budgets/new', {
        title: 'New Budget'
    });
}

function create(req, res) {
    // create a new budget object
    const budget = new Budget(req.body);
    // Assign the logged in user's id to that budget
    budget.userId = req.user._id;
    budget.remaining = budget.budget;
    budget.save(function(err) {
        if (err) return res.redirect('/budgets/new');
        res.redirect(`/budgets/${budget._id}`);
    })
}

function show(req, res) {
    Budget.findById(req.params.id, function(err, budget) {
        res.render('budgets/show', {
            title: budget.name,
            budget,
            remaining: budget.budget
        });
    })
}

function deleteBudget(req, res) {
    Budget.findOneAndDelete(
        // ensure that the budget was created by the logged in user
        {_id: req.params.id, userId: req.user._id}, function(err) {
            // redirect to index view
            res.redirect('/budgets');
        }
    )
}

function edit(req, res) {
    Budget.findOne({_id: req.params.id, userId: req.user._id}, function(err, budget) {
        if (err || !budget) return res.redirect(`/budgets/${req.params.id}`);
        res.render('budgets/edit', {
            title: "Edit: " + budget.name,
            budget
        })
    })
}

function update(req, res) {
    Budget.findOneAndUpdate(
        {_id: req.params.id, userId: req.user._id}, 
        // update object with updated properties
        req.body,
        // options object with new: true to make sure updated doci s retuend
        {new: true},
        function(err, budget) {
            if (err || !budget) return res.redirect(`/budgets/${budget._id}`);
            res.redirect(`/budgets/${budget._id}`)
            }
        )
}