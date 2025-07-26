function generateUserData(count, model) {
  const users = [];
  const firstNames = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Emma",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
    "Kate",
    "Liam",
    "Mia",
    "Noah",
    "Olivia",
    "Peter",
    "Quinn",
    "Rachel",
    "Sam",
    "Tina",
    "Uma",
    "Victor",
    "Wendy",
    "Xavier",
    "Yara",
    "Zack",
  ];
  const lastNames = [
    "Smith",
    "Jones",
    "Williams",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark",
    "Rodriguez",
    "Lewis",
    "Lee",
    "Walker",
    "Hall",
    "Allen",
  ];

  return new Promise((res, rej) => {
    for (let i = 1; i <= count; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const age = Math.floor(Math.random() * 60) + 18; // Age between 18 and 77
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
      const password = `pass${Math.random().toString(36).substring(2, 10)}`; // Random password

      users.push(
        new model({
          name: name,
          age: age,
          username: username,
          password: password,
        })
      );
    }

    res(users);
  });
}

module.exports = { generateUserData };
