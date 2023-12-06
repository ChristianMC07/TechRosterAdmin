import { Technology, Course } from "./../tools/data.model";
import { getAllData } from "../tools/DataManager";
import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faSquarePlus } from "@fortawesome/free-solid-svg-icons";

export default function Home({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {

  const [techs, setTechs] = useState<Technology[]>(technologies);
  const [updCourses, setUpdCourses] = useState<Course[]>(courses);
  const [identifier, setIdentifier] = useState<number | undefined>(undefined);

  const router: NextRouter = useRouter();

  const addNewTech = (e: any) => {
    setIdentifier(0);

  }

  const addNewCourse = (e: any) => {
    setIdentifier(1);
  }

  useEffect(() => {
    if (identifier !== undefined) {
      router.push("/add");
    }
  }, [identifier])


  return (
    <div className="flex flex-wrap justify-around">
      <div>
        <FontAwesomeIcon icon={faSquarePlus} className="text-xl cursor-pointer" onClick={addNewTech} />
        {techs.map((technoogy: Technology, n: number) =>
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => router.push("/edit")} className="cursor-pointer" />
            <FontAwesomeIcon icon={faTrash} onClick={() => router.push("/delete")} className="cursor-pointer" />
            <div key={n} className="my-4">{technoogy.name}</div>
          </div>
        )}

      </div>
      <div>
        <FontAwesomeIcon icon={faSquarePlus} className="text-xl" onClick={addNewCourse} />
        {updCourses.map((course: Course, n: number) =>
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => router.push("/edit")} className="cursor-pointer" />
            <FontAwesomeIcon icon={faTrash} onClick={() => router.push("/delete")} className="cursor-pointer" />
            <div key={n} className="my-4">{course.code} | {course.name}</div>
          </div>
        )}

      </div>

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
