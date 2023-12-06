import { Technology, Course } from "./../tools/data.model";
import { getAllData } from "../tools/DataManager";

export default function Home({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {



  return (
    <div className="font-bold text-sm p-4">
      <pre>
        {JSON.stringify(technologies, null, "\t")}
      </pre>
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
