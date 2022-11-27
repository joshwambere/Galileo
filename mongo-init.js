db.createUser(
    {
        user: "admin",
        pwd: "CHANGE_ME_I_M_NOT_SECURE",
        roles: [
            {
                role: "root",
                db: "dev"
            }
        ]
    }
);
