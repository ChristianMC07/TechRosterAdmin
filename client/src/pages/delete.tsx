import { Technology, Course } from "@/tools/data.model";
import { getAllData } from "../tools/DataManager";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sendJSONDataDelete } from "@/tools/Toolkit";

const URL_DELETE: string = `http://localhost:3000/api/delete`;

export default function Delete({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {

    const router: NextRouter = useRouter();
    const identifier: string | string[] = router.query.deleteType!;
    const selected: string | string[] = router.query.id!;

    const [selectedTech, setSelectedTech] = useState<Technology>(
        technologies.find((tech) => tech._id == selected) as Technology
    );

    const [selectedCourse, setSelectedCourse] = useState<Course>(
        courses.find((course) => course._id == selected) as Course
    );

    const [fieldName, setfieldName] = useState<string>(
        identifier === "tech" ? (selectedTech.name.length > 0 ? selectedTech.name : "") : (selectedCourse.code.length > 0 ? selectedCourse.code : "")
    );

    const [fieldDesc, setfieldDesc] = useState<string>(
        identifier == "tech" ? selectedTech.description : (identifier == "course" ? selectedCourse.name : "")
    );



    const onSubmit = () => {

        sendJSONDataDelete(`${URL_DELETE}/${selected}`, deleteResponse, deleteError, true);
        console.log(`${URL_DELETE}/${selected}`);
    }

    const deleteResponse = async (responseText: string) => {
        console.log(`response received from the WEB API ${responseText}`);
        await router.replace(router.asPath);
        router.push("/");
    }

    const deleteError = (error: Error) => {
        console.log(`***error: ${error.message}`);
    }

    return (
        <div>
            {identifier == "tech" && (

                <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Are you sure you want to delete the following technology?</h1>
                    <h2>{fieldName}</h2>
                    <div className="flex gap-10 mt-10">
                        <input
                            type="button"
                            className={` text-white px-4 py-2 roundedfocus:outline-none bg-red-500 hover:bg-red-700 focus:shadow-outline-blue cursor-pointer`}
                            onClick={onSubmit}
                            value="Ok" />
                        <input type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray active:bg-gray-800" value="Cancel" onClick={() => router.replace("/")} />
                    </div>
                </div>





            )}
            {identifier == "course" && (

                <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Are you sure you want to delete the following Course?</h1>
                    <h2>{fieldName} {fieldDesc}</h2>

                    <div className="flex gap-10 mt-10">
                        <input
                            type="button"
                            className={` text-white px-4 py-2 roundedfocus:outline-none bg-red-500 hover:bg-red-700 focus:shadow-outline-blue cursor-pointer`}
                            onClick={onSubmit}
                            value="Ok" />
                        <input type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray active:bg-gray-800" value="Cancel" onClick={() => router.replace("/")} />
                    </div>
                </div>
            )}


        </div>
    )
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