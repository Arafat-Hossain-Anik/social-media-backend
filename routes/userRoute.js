const router = require('express').Router();
const User = require('../models/userModel');
const cloudinary = require('../db/cloudinary_confiq')
const fileUpload = require('express-fileupload');
const usersData = require('../FakeData/usersData')


//express-fileupload middleware
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
//get all users
router.get('/users', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})
// upload the fake data
router.post('/user-fake-data', async (req, res) => {
    const data = await User.insertMany(usersData);
    res.json(data)
})
// Route to send a friend request
router.post('/send-friend-request', async (req, res) => {
    try {
        const { senderEmail, recipientEmail } = req.body;
        console.log(senderEmail, recipientEmail);

        // Find recipient user
        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            return res.status(404).json({ message: "User not found" });
        }

        // Checking already in friendRequest array or not
        if (recipient.friendRequest.includes(senderEmail)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }
        //Check already friends or not
        if (recipient.friends.includes(senderEmail)) {
            return res.status(400).json({ message: "You both are already friend" });
        }
        recipient.friendRequest.push(senderEmail);
        await recipient.save();

        res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Route to view all friend requests
router.get('/friend-requests/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send back the friend requests array
        res.status(200).json({ friendRequests: user.friendRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Route to accept a friend request
router.post('/accept-friend-request', async (req, res) => {
    try {
        const { recipientEmail, senderEmail } = req.body;

        // Find the recipient user
        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        // Find the sender user
        const sender = await User.findOne({ email: senderEmail });
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        // if friend request not sent
        if (!recipient.friendRequest.includes(senderEmail)) {
            return res.status(400).json({ message: "No friend request from this user" });
        }

        // Removing from friendRequest array and adding to boths friends array
        recipient.friendRequest = recipient.friendRequest.filter(email => email !== senderEmail);
        if (!recipient.friends.includes(senderEmail)) {
            recipient.friends.push(senderEmail);
        }
        if (!sender.friends.includes(recipientEmail)) {
            sender.friends.push(recipientEmail);
        }
        await recipient.save();
        await sender.save();
        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get a user's friendship graph
router.get('/friendship-graph/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const visited = new Set();
        const queue = [email];
        const graph = {};
        while (queue.length > 0) {
            const currentUserEmail = queue.shift();
            const currentUser = await User.findOne({ email: currentUserEmail });
            // checking user valid or not
            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }
            // If we've already visited this user, skip
            if (visited.has(currentUserEmail)) continue;
            visited.add(currentUserEmail);
            if (currentUser) {
                graph[currentUserEmail] = currentUser.friends;
                currentUser.friends.forEach(friendEmail => {
                    if (!visited.has(friendEmail)) {
                        queue.push(friendEmail);
                    }
                });
            }
        }

        res.status(200).json({ friendshipGraph: graph });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// get all friends of a user
router.get('/friends/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ friends: user.friends });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//update profile information
// Helper function
const uploadImage = async (image) => {
    try {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: 'social-media-backend',
        });
        return result.secure_url;
    } catch (error) {
        throw new Error('Image upload failed');
    }
};

// Route to update user profile
router.put('/update-profile/:email', async (req, res) => {
    const { email } = req.params;
    const { userName } = req.body;
    const profilePicture = req.files.profilePicture;
    const coverPicture = req.files.coverPicture;
    console.log(userName, profilePicture, coverPicture);
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check and upload profile picture if provided
        let profilePicUrl = user.profilePicture;
        if (profilePicture) {
            profilePicUrl = await uploadImage(profilePicture);
        }

        // Check and upload cover picture if provided
        let coverPicUrl = user.coverPicture;
        if (coverPicture) {
            coverPicUrl = await uploadImage(coverPicture);
        }

        // Update user profile with new data
        user = await User.findOneAndUpdate(
            { email },
            {
                userName: userName || user.userName,
                profilePicture: profilePicUrl,
                coverPicture: coverPicUrl,
            },
            { new: true }
        );

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router