import { Technology, Course } from "./../tools/data.model";
import { getAllData } from "../tools/DataManager";
import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";

export default function Home({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {

  const [techs, setTechs] = useState<Technology[]>(technologies);
  const [updCourses, setUpdCourses] = useState<Course[]>(courses);

  const router: NextRouter = useRouter();


  return (
    <div className="flex flex-wrap justify-evenly">
      <div>
        {techs.map((technoogy: Technology, n: number) =>
          <div key={n} className="my-4">{technoogy.name}</div>
        )}

      </div>
      <div>
        {updCourses.map((course: Course, n: number) =>
          <div key={n} className="my-4">{course.name}</div>
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
