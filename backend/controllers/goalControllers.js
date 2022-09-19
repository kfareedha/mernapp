const asyncHandler = require('express-async-handler')
const Goal = require ('../models/goalModel')
const User = require ('../models/userModel')


//@desc get goal
//@route GET /api/goals
//@access Private


const getGoals = asyncHandler(async(req, res) => {
    const goals = await Goal.find({user:req.user.id})
    res.status(200).json(goals)
})
//@desc set goal
//@route POST /api/goals
//@access Private
const setGoals = asyncHandler(async(req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('please add a text')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user:req.user.id
    })
    res.status(200).json(goal)
})
//@desc update goal
//@route PUT /api/goals:id
//@access Private



const updateGoal =asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)
    // Check for user
    if (!user){
        res.status(401)
        throw new Error('User not found')
    }
    
    // Make sure the logged in user matches the goal user
    if(goal.user.toString() !==user.id){
        res.status(401)
        throw new Error('User not authorized')  
    }


    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id,req.body,{new: true,})
    res.json(updatedGoal)
})
//@desc  delete goal
//@route DELETE /api/goals:id
//@access Private
const deleteGoal =asyncHandler( async(req, res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)
    // Check for user
    if (!user){
        res.status(401)
        throw new Error('User not found')
    }
    
    // Make sure the logged in user matches the goal user
    if(goal.user.toString() !==user.id){
        res.status(401)
        throw new Error('User not authorized')  
    }

    await Goal.remove()
    res.json({ id: req.params.id  })
})
module.exports = {
    getGoals,
    setGoals,
    updateGoal,
    deleteGoal
}