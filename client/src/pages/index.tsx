import { Technology, Course } from "./../tools/data.model";
import { getAllData } from "../tools/DataManager";
import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Home({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {

  const [techs, setTechs] = useState<Technology[]>(technologies);
  const [updCourses, setUpdCourses] = useState<Course[]>(courses);

  const router: NextRouter = useRouter();


  return (
    <div className="flex flex-wrap justify-around">
      <div>
        {techs.map((technoogy: Technology, n: number) =>
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => router.push("/add")} className="cursor-pointer" />
            <FontAwesomeIcon icon={faTrash} onClick={() => router.push("/delete")} className="cursor-pointer" />
            <div key={n} className="my-4">{technoogy.name}</div>
          </div>
        )}

      </div>
      <div>
        {updCourses.map((course: Course, n: number) =>
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => router.push("/add")} className="cursor-pointer" />
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
