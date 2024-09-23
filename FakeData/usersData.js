const usersData = [
    {

        userName: "bla",
        email: "bla@bla.com",
        password: "Password@123",
        profilePicture: "",
        coverPicture: "",
        friends: [
            "alice@example.com"
        ],
        friendRequest: [],
        isAdmin: false,
        token: ""
    },
    {
        userName: "Alice",
        email: "alice@example.com",
        password: "Password@123",
        profilePicture: "alice-pic.jpg",
        coverPicture: "alice-cover.jpg",
        friends: [
            "bob@example.com",
            "carol@example.com",
            "bla@bla.com"
        ],
        friendRequest: [
            "dave@example.com"
        ],
        isAdmin: false,
        token: ""
    },
    {
        userName: "Bob",
        email: "bob@example.com",
        password: "Password@123",
        profilePicture: "bob-pic.jpg",
        coverPicture: "bob-cover.jpg",
        friends: [
            "alice@example.com",
            "dave@example.com"
        ],
        friendRequest: [],
        isAdmin: false,
        token: ""
    },
    {
        userName: "Carol",
        email: "carol@example.com",
        password: "Password@123",
        profilePicture: "carol-pic.jpg",
        coverPicture: "carol-cover.jpg",
        friends: [
            "alice@example.com"
        ],
        friendRequest: [],
        isAdmin: false,
        token: ""
    },
    {
        userName: "Dave",
        email: "dave@example.com",
        password: "Password@123",
        profilePicture: "dave-pic.jpg",
        coverPicture: "dave-cover.jpg",
        friends: [
            "bob@example.com"
        ],
        friendRequest: [
            "alice@example.com"
        ],
        isAdmin: false,
        token: "",
    }
];

module.exports = usersData;
