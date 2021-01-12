class DatabaseConfiguration {

    public user: string;
    public host: string;
    public database: string;
    public password: string;
    public port: number;


    constructor(user: string, host: string, database: string, password: string, port: number) {

        this.user = user;
        this.host = host;
        this.database = database;
        this.password = password;
        this.port = port;
    }
}

export {DatabaseConfiguration as DatabaseConfiguration}