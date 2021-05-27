const MongoClient = require('mongodb').MongoClient

export default class MongoDB extends MongoClient {
    private readonly url: string

    constructor(url: string = process.env.DB_URL) {
        super(url, {useNewUrlParser: true, useUnifiedTopology: true});
        this.url = url;
        global.mongo = this;
    }

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connect((err: any) => {
                if (err) reject(err)
                else resolve()
            })
        })
    }

    public getOne<T>(collection: string, filter: object, db: string = process.env.DB_NAME): Promise<T> {
        return this.db(db).collection(collection).findOne(filter)
    }

    public getMany<T>(collection: string, filter: object, many: boolean = false, db: string = process.env.DB_NAME): Promise<Array<T>> {
        return this.db(db).collection(collection).find(filter).toArray();
    }

    public insert(collection: string, data: object | Array<object>, many: boolean = false, db: string = process.env.DB_NAME): Promise<any> {
        return many ? this.db(db).collection(collection).insertMany(data) :
            this.db(db).collection(collection).insertOne(data)
    }

    public save(collection: string, data: any, db: string = process.env.DB_NAME): Promise<any> {
        return this.db(db).collection(collection).updateOne({_id: data._id}, {$set: data})
    }

    public update(collection: string, filter: object, data: object, many: boolean = false, db: string = process.env.DB_NAME): Promise<any> {
        return many ? this.db(db).collection(collection).updateMany(filter, {$set: data}) :
            this.db(db).collection(collection).updateOne(filter, {$set: data})
    }

    public delete(collection: string, filter: object, many: boolean = false, db: string = process.env.DB_NAME): Promise<any> {
        return many ? this.db(db).collection(collection).deleteMany(filter) :
            this.db(db).collection(collection).deleteOne(filter)
    }

    public count(collection: string, filter: object = {}, db: string = process.env.DB_NAME): Promise<number> {
        return this.db(db).collection(collection).countDocuments(filter)
    }
}