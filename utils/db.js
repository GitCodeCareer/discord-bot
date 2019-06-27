const firebase = require("firebase/app");
require("firebase/database")

class DB {

    constructor() {

        let firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DB_URL,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        }
        firebase.initializeApp(firebaseConfig);
        this.database = firebase.database()
    }

    getDatabase() {
        return this.database
    }

    startListening(path, eventType='value') {
        let ref = this.database.ref(path)
        ref.on(eventType, this.logData, this.errorData)
        console.log(`Now listening for updates at /${path}`)

        return ref
    }

    stopListening(path=null, eventType=null) {
        this.database.ref(path).off(eventType)
        console.log(`Stopped listening for updates at /${path}`)
    }

    logData(data) {
        console.log(data.val())
    }

    errorData(data) {
        console.error(data)
    }

    async writeData(path, obj) {
        await this.getDatabase().ref(path).set(obj)
    }

    async pdateData(path, obj) {
        await this.getDatabase().ref(path).update(obj)
    }

    async appendData(path, obj) {
        await this.getDatabase().ref(path).push(obj)
    }

    async deleteData(path) {
        await this.getDatabase().ref(path).remove()
    }
}

module.exports = new DB();