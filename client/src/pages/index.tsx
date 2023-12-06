import { Technology, Course } from "./../tools/data.model";
import { getAllData } from "../tools/DataManager";
import { useEffect, useState } from "react";

export default function Home({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {

  const [techs, setTechs] = useState<Technology[]>(technologies);
  const [updCourses, setUpdCourses] = useState<Course[]>(courses);


  return (
    // <div className="font-bold text-sm p-4">
    //   <pre>
    //     {JSON.stringify(technologies, null, "\t")}
    //   </pre>
    // </div>
    <div className="flex flex-wrap">
      <div>
        {techs.map((technoogy: Technology, n: number) =>
          <div key={n}>{technoogy.name}</div>
        )}

      </div>
      <div>
        {updCourses.map((course: Course, n: number) =>
          <div key={n}>{course.name}</div>
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
