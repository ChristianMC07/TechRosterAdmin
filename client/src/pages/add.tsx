import { Technology, Course } from "./../tools/data.model";
import { getAllData } from "../tools/DataManager";
import { NextRouter, useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Add({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {
    const router: NextRouter = useRouter();
    const identifier: string | string[] = router.query.identifier!;
    const difficultyArray: number[] = getDifficulty();

    const [selectedCourses, setSelectedCourses] = useState<{ code: string; name: string }[]>([]);


    let techName: string = "";
    let techDesc: string = "";

    const onNameChange = (e: any) => {
        techName = e.target.value;
        console.log(techName);
    }

    const onDescriptionChange = (e: any) => {
        techDesc = e.target.value;
        console.log(techDesc);
    }

    const onCourseChange = (code: string, name: string) => {
        const isSelected = selectedCourses.some(course => course.code === code);

        //remove if it is now unchecked
        if (isSelected) {
            setSelectedCourses(selectedCourses.filter(course => course.code !== code));
            //... shorthand for push
        } else {
            setSelectedCourses([...selectedCourses, { code, name }]);
        }
    };


    useEffect(() => {
        console.log(selectedCourses);
    }, [selectedCourses])





    return (
        <div>
            {identifier == "tech" && (
                <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Add New Technology</h1>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Name</label>
                            <input className="w-full border rounded px-3 py-2" onChange={onNameChange} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Description</label>
                            <textarea className="w-full border rounded px-3 py-2" onChange={onDescriptionChange}></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Difficulty</label>
                            <select className="w-full border rounded px-3 py-2">
                                {difficultyArray.map((difficulty, index) => (
                                    <option key={index} value={difficulty}>
                                        {difficulty}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Used in courses</label>
                            {courses.map((course, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedCourses.some(selectedCourse => selectedCourse.code === course.code)}
                                        onChange={() => onCourseChange(course.code, course.name)}
                                    />
                                    <span>{course.code} {course.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-10 mt-10">
                            <input type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800" value="Ok" />
                            <input type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray active:bg-gray-800" value="Cancel" onClick={() => router.replace("/")} />
                        </div>
                    </form>
                </div>
            )}

            {identifier == "course" && (
                <div>
                    <h1>Add New Course</h1>
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