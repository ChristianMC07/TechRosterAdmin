import { MongoClient, Db, Collection, FindCursor, InsertOneResult, ObjectId, UpdateResult, DeleteResult } from "mongodb";
import { NextApiRequest, NextApiResponse } from 'next';
import sanitizeHtml from 'sanitize-html';
import { Technology, Course } from "@/tools/data.model";

// MongoDB constants
const MONGO_URL: string = process.env.MONGO_URL || "mongodb://mongo:27017/";
const MONGO_DB_NAME: string = "dbTechs";
const MONGO_COLLECTION_TECHS: string = "technologies";
const MONGO_COLLECTION_COURSES: string = "courses";

export async function getAllData() {
    // construct a MongoClient object
    let mongoClient: MongoClient = new MongoClient(MONGO_URL);

    let techArray: Technology[];
    let courseArray: Course[];
    let allArray: (Technology[] | Course[])[];

    try {
        allArray = [];
        await mongoClient.connect();
        // get JSON data from mongoDB server (ASYNC task)
        techArray = await mongoClient.db(MONGO_DB_NAME).collection<Technology>(MONGO_COLLECTION_TECHS).find().toArray();
        // need to convert ObjectId objects to strings
        techArray.forEach((tech: Technology) => tech._id = tech._id!.toString());

        allArray.push(techArray);

        courseArray = await mongoClient.db(MONGO_DB_NAME).collection<Course>(MONGO_COLLECTION_COURSES).find().toArray();
        courseArray.forEach((course: Course) => course._id = course._id!.toString());

        allArray.push(courseArray);


    } catch (error: any) {
        console.log(`>>> ERROR : ${error.message}`);
        throw error;
    } finally {
        mongoClient.close();
    }

    return allArray;
}

export async function createTechnology(request: NextApiRequest, response: NextApiResponse<any>) {
    let mongoClient: MongoClient = new MongoClient(MONGO_URL);
    try {
        await mongoClient.connect();
        let result: InsertOneResult;

        if ("courses" in request.body) {

            // sanitizing input
            request.body.name = sanitizeHtml(request.body.name);
            request.body.description = sanitizeHtml(request.body.description);
            request.body.difficulty = sanitizeHtml(request.body.difficulty);
            request.body.courses.forEach((course: Course) => {
                course.code = sanitizeHtml(course.code);
                course.name = sanitizeHtml(course.name);
            });

            // insert new document into DB
            result = await mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_TECHS).insertOne(request.body);
        } else {
            // sanitizing input
            request.body.code = sanitizeHtml(request.body.code);
            request.body.name = sanitizeHtml(request.body.name);

            // insert new document into DB
            result = await mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_COURSES).insertOne(request.body);
        }


        // status code for created
        response.status(200);
        response.send(result);
    } catch (error: any) {
        response.status(500);
        response.send({ error: error.message });
        throw error;
    } finally {
        mongoClient.close();
    }
}

export async function updateTechnology(request: NextApiRequest, response: NextApiResponse<any>) {
    let mongoClient: MongoClient = new MongoClient(MONGO_URL);
    try {
        await mongoClient.connect();
        let result: UpdateResult;

        let id: any = request.query.id;
        // sanitize it and convert to ObjectId
        id = new ObjectId(sanitizeHtml(id));

        if ("courses" in request.body) {

            // sanitizing input
            request.body.name = sanitizeHtml(request.body.name);
            request.body.description = sanitizeHtml(request.body.description);
            request.body.difficulty = sanitizeHtml(request.body.difficulty);
            request.body.courses.forEach((course: Course) => {
                course.code = sanitizeHtml(course.code);
                course.name = sanitizeHtml(course.name);
            });


            // update document
            let techCollection: Collection = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_TECHS);
            let selector: Object = { "_id": id };
            let newValues: Object = { $set: request.body };
            result = await techCollection.updateOne(selector, newValues);

            if (result.matchedCount <= 0) {
                response.status(404);
                response.send({ error: "No technology documents found with ID" });
            } else {
                // status code for updated
                response.status(200);
                response.send(result);
            }
        } else {
            request.body.code = sanitizeHtml(request.body.code);
            request.body.name = sanitizeHtml(request.body.name);

            //update document
            let courseCollection: Collection = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_COURSES);
            let selector: Object = { "_id": id };
            let newValues: Object = { $set: request.body };

            result = await courseCollection.updateOne(selector, newValues);

            // Now, update the corresponding technologies in the technologies collection
            let techCollection: Collection = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_TECHS);
            let techSelector: Object = { "courses.code": request.body.code };
            let techNewValues: Object = { $set: { "courses.$.name": request.body.name } };

            result = await techCollection.updateMany(techSelector, techNewValues);


            if (result.matchedCount <= 0) {
                response.status(404);
                response.send({ error: "No course documents found with ID" });
            } else {
                // status code for updated
                response.status(200);
                response.send(result);
            }

        }


    } catch (error: any) {
        response.status(500);
        response.send({ error: error.message });
        throw error;
    } finally {
        mongoClient.close();
    }
}


export async function deleteTechnology(request: NextApiRequest, response: NextApiResponse<any>) {
    let mongoClient: MongoClient = new MongoClient(MONGO_URL);
    try {
        await mongoClient.connect();

        // isolate the route parameter
        let id: any = request.query.id;
        // sanitize it and convert to ObjectId
        id = new ObjectId(sanitizeHtml(id));

        // check if the id exists in technologies collection
        const techCollection: Collection<Technology> = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_TECHS);
        const techExists = await techCollection.findOne({ _id: id });

        if (techExists) {
            // delete document from technologies collection
            const techResult: DeleteResult = await techCollection.deleteOne({ _id: id });
            if (techResult.deletedCount > 0) {
                response.status(200);
                response.send(techResult);
            } else {
                response.status(500);
                response.send({ error: "Failed to delete from technologies collection" });
            }
        } else {
            // check if the id exists in courses collection
            const courseCollection: Collection<Course> = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_COURSES);
            const courseExists = await courseCollection.findOne({ _id: id });

            if (courseExists) {
                // delete document from courses collection
                const courseResult: DeleteResult = await courseCollection.deleteOne({ _id: id });
                if (courseResult.deletedCount > 0) {
                    // Retrieve the associated code before sending the response
                    const associatedCode = courseExists.code;

                    // Now, perform the update operation on the technologies collection to remove the corresponding course
                    const techCollection: Collection<Technology> = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_TECHS);
                    const techUpdateQuery: Object = { "courses.code": associatedCode };
                    const techUpdateValues: Object = { $pull: { "courses": { code: associatedCode } } };
                    const techUpdateResult = await techCollection.updateMany(techUpdateQuery, techUpdateValues);

                    response.status(200);
                    response.send({
                        deletedCount: courseResult.deletedCount,
                        associatedCode,
                        techUpdateCount: techUpdateResult.modifiedCount,
                    });
                } else {
                    response.status(500);
                    response.send({ error: "Failed to delete from courses collection" });
                }

            } else {
                response.status(404);
                response.send({ error: "No documents found with the given ID" });
            }
        }
    } catch (error: any) {
        response.status(500);
        response.send({ error: error.message });
        throw error;
    } finally {
        mongoClient.close();
    }
}
