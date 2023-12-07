import { Technology, Course } from "./../tools/data.model";
import { getAllData } from "../tools/DataManager";
import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { sendJSONData } from "@/tools/Toolkit";

const URL_EDIT: string = `http://localhost:3000/api/put`;

export default function Edit({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {
    const router: NextRouter = useRouter();
    const identifier: string | string[] = router.query.editType!;
    const selected: string | string[] = router.query.id!;
    const difficultyArray: number[] = getDifficulty();
    const coursesCodes: string[] = getCoursesCodes();


    //state variables for technology

    const [selectedTech, setSelectedTech] = useState<Technology>(
        technologies.find((tech) => tech._id == selected) as Technology
    );
    const [selectedCourse, setSelectedCourse] = useState<Course>(
        courses.find((course) => course._id == selected) as Course
    );

    const [enableOk, setEnableOk] = useState<boolean>(false);
    const [selectedCourses, setSelectedCourses] = useState<{ code: string; name: string }[]>([]);

    const [fieldName, setfieldName] = useState<string>(
        identifier == "tech" ? selectedTech.name : selectedCourse.code
    );
    const [fieldDesc, setfieldDesc] = useState<string>(
        identifier == "tech" ? selectedTech.description : selectedCourse.name
    );
    const [techDiff, setTechDiff] = useState<number>(difficultyArray[0]);
    const [warning, setWarning] = useState<boolean>(false);

    const technologyCourses: string[] = selectedTech.courses.map(course => course.code);



    const onNameChange = (e: any) => {
        setfieldName(e.target.value);
    }

    const onDescriptionChange = (e: any) => {
        setfieldDesc(e.target.value);
    }

    const onCourseChange = (code: string, name: string) => {
        const isSelected = selectedCourses.some(course => course.code === code);

        if (isSelected) {
            // Remove if it is now unchecked
            setSelectedCourses(prevSelectedCourses => prevSelectedCourses.filter(course => course.code !== code));
        } else {
            // Add if it is checked
            setSelectedCourses(prevSelectedCourses => [...prevSelectedCourses, { code, name }]);
        }
    };


    useEffect(() => {
        console.log(selectedCourses);
    }, [selectedCourses])

    const onDiffChange = (e: any) => {
        setTechDiff(e.target.value);
    }

    useEffect(() => {
        console.log(coursesCodes);

        if (identifier == "course") {
            if (!coursesCodes.includes(fieldName.toUpperCase())) {
                setWarning(false);
                setEnableOk(fieldDesc.length > 0 && fieldName.length > 0);
            } else {
                setWarning(true);
                setEnableOk(false);
            }
        } else {
            setEnableOk(fieldDesc.length > 0 && fieldName.length > 0);
        }
    }, [fieldDesc, fieldName, coursesCodes, identifier]);

    useEffect(() => {
        console.log(techDiff);

    }, [techDiff])

    useEffect(() => {
        console.log(fieldName)
    }, [fieldName])

    useEffect(() => {
        console.log(fieldDesc)
    }, [fieldDesc])


    const onSubmit = () => {

        let sendJSON: Technology | Course;


        if (identifier == "tech") {

            sendJSON = {
                "name": fieldName,
                "description": fieldDesc,
                "difficulty": techDiff,
                "courses": selectedCourses
            } as Technology;
        } else if (identifier == "course") {
            sendJSON = {
                "code": fieldName.toUpperCase(),
                "name": fieldDesc
            } as Course;
        } else {
            sendJSON = {} as Technology | Course;
        }

        // console.log(sendJSON);

        sendJSONData(URL_EDIT + `/${selected}`, sendJSON, addResponse, addError, true);
    }

    const addResponse = async (responseText: string) => {
        console.log(`response received from the WEB API ${responseText}`);
        await router.replace(router.asPath);
        router.push("/");
    }

    const addError = (error: Error) => {
        console.log(`***error: ${error.message}`);
    }



    return (
        <div>
            {identifier == "tech" && (
                <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Edit Technology</h1>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Name</label>
                            <input className="w-full border rounded px-3 py-2" onChange={onNameChange} value={fieldName || selectedTech.name} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Description</label>
                            <textarea className="w-full border rounded px-3 py-2" onChange={onDescriptionChange} value={fieldDesc || selectedTech.description}></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Difficulty</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                onChange={onDiffChange}
                                defaultValue={selectedTech.difficulty}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Used in courses</label>
                            {courses.map((course, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={technologyCourses.includes(course.code)}
                                        onChange={() => onCourseChange(course.code, course.name)}
                                    />
                                    <span>{course.code} {course.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-10 mt-10">
                            <input
                                type="button"
                                className={` text-white px-4 py-2 roundedfocus:outline-none  ${enableOk ? "bg-blue-500 hover:bg-blue-700 focus:shadow-outline-blue active:bg-blue-800 cursor-pointer" : "pointer-events-none bg-gray-500"}`}
                                onClick={onSubmit}
                                value="Ok" />
                            <input type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray active:bg-gray-800" value="Cancel" onClick={() => router.replace("/")} />
                        </div>
                    </form>
                </div>
            )}

            {identifier == "course" && (
                <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Add New Course</h1>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Course Code</label>
                            <input className="w-full border rounded px-3 py-2" onChange={onNameChange} />
                            <span className={`text-red-600 text-lg ${warning ? "block" : "hidden"}`}>The code {fieldName} already exists</span>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Name:</label>
                            <input className="w-full border rounded px-3 py-2" onChange={onDescriptionChange}></input>
                        </div>
                        <div className="flex gap-10 mt-10">
                            <input
                                type="button"
                                className={` text-white px-4 py-2 roundedfocus:outline-none  ${enableOk ? "bg-blue-500 hover:bg-blue-700 focus:shadow-outline-blue active:bg-blue-800 cursor-pointer" : "pointer-events-none bg-gray-500"}`}
                                onClick={onSubmit}
                                value="Ok" />
                            <input type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray active:bg-gray-800" value="Cancel" onClick={() => router.replace("/")} />
                        </div>



                    </form>
                </div>
            )
            }
        </div>
    );


    function getDifficulty(): number[] {

        let difficultyArray: number[] = [];

        technologies.forEach((technology: Technology) => {

            difficultyArray.push(technology.difficulty);
        })

        let duplicatesOut: Set<number> = new Set(difficultyArray)

        difficultyArray = Array.from(duplicatesOut).sort((a, b) => a - b);


        return difficultyArray;

    }

    function getCoursesCodes(): string[] {
        let coursesCodes: string[] = [];

        courses.forEach((course: Course) => {
            coursesCodes.push(course.code);
        })


        return coursesCodes;
    }
}

export async function getServerSideProps() {

    const allData = await getAllData();

    return {
        props: {
            technologies: allData[0],
            courses: allData[1]
        }
    }
}