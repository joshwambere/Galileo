db.createUser(
    {
        user: "admin",
        pwd: "CHANGE_ME_I_M_NOT_SECURE",
        roles: [
            {
                role: "root",
                db: "dev"
            },
            {
                role: "readWrite",
                db: "dev"
            },
            {
                role: "userAdminAnyDatabase",
                db: "dev"
            },
            {
                role: "dbAdminAnyDatabase",
                db: "dev"
            },
            {
                role: "readWriteAnyDatabase",
                db: "dev"
            }
        ]
    }
);
