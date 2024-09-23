const router = require('express').Router();
const User = require('../models/userModel');
const cloudinary = require('../db/cloudinary_confiq')
const fileUpload = require('express-fileupload');

// file upload middle ware
// Set up express-fileupload middleware
router.use(fileUpload({
    useTempFiles: true, // Store files temporarily
    tempFileDir: '/tmp/' // Temporary file directory
}));
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

        // Check if sender is already in the friendRequest array
        if (recipient.friendRequest.includes(senderEmail)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }
        //Check already friends or not
        if (recipient.friends.includes(senderEmail)) {
            return res.status(400).json({ message: "You both are already friend" });
        }
        // Add sender email to recipient's friendRequest array
        recipient.friendRequest.push(senderEmail);
        await recipient.save();

        res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Route to view all friend requests (recipient's email in the body)
router.get('/all-friend-requests/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log(email);
        // Find the user by email
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

        // Check if sender email exists in the friendRequest array
        if (!recipient.friendRequest.includes(senderEmail)) {
            return res.status(400).json({ message: "No friend request from this user" });
        }

        // Remove the sender's email from recipient's friendRequest array
        recipient.friendRequest = recipient.friendRequest.filter(email => email !== senderEmail);

        // Add sender's email to recipient's friends array if not already added
        if (!recipient.friends.includes(senderEmail)) {
            recipient.friends.push(senderEmail);
        }

        // Add recipient's email to sender's friends array if not already added
        if (!sender.friends.includes(recipientEmail)) {
            sender.friends.push(recipientEmail);
        }

        // Save both updated users
        await recipient.save();
        await sender.save();

        res.status(200).json({ message: "Friend request accepted", friends: recipient.friends });
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
router.get('/all-friends/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log(email);
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send back the friend requests array
        res.status(200).json({ friends: user.friends });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//update profile information
// Helper function to upload images to Cloudinary
const uploadImage = async (image) => {
    try {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: 'social-media-backend',
        });
        return result.secure_url; // Return the URL of the uploaded image
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
        // Find the user by email
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
            { new: true } // Return the updated user document
        );

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router