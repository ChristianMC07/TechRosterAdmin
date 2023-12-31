import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { Technology, Course } from "./../tools/data.model";
import { getAllData } from "../tools/DataManager";
import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";

export default function Home({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {

  const [techs, setTechs] = useState<Technology[]>(technologies);
  const [updCourses, setUpdCourses] = useState<Course[]>(courses);
  const [identifier, setIdentifier] = useState<string | undefined>(undefined);
  const [editType, seteditType] = useState<string | undefined>(undefined);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [deleteType, setDeleteType] = useState<string | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);

  const router: NextRouter = useRouter();

  const addNewTech = (e: any) => {
    setIdentifier("tech");

  }

  const addNewCourse = (e: any) => {
    setIdentifier("course");
  }

  useEffect(() => {
    if (identifier !== undefined) {
      router.push({
        pathname: "/add",
        query: { identifier: identifier },
      });
    }
  }, [identifier])

  const editTech = (techId: string) => {
    seteditType("tech");
    setEditId(techId);

  }

  const editCourse = (courseId: string) => {
    seteditType("course");
    setEditId(courseId)
  }

  useEffect(() => {
    if (editType !== undefined) {
      router.push({
        pathname: "/edit",
        query: {
          editType: editType,
          id: editId
        }
      })
    }
  }, [editType])

  const deleteTech = (techId: string) => {
    setDeleteType("tech");
    setDeleteId(techId);
  }

  const deleteCourse = (courseId: string) => {
    setDeleteType("course");
    setDeleteId(courseId);
  }

  useEffect(() => {
    if (deleteType !== undefined) {
      router.push({
        pathname: "/delete",
        query: {
          deleteType: deleteType,
          id: deleteId
        }
      })
    }

  }, [deleteType])





  return (
    <div className="flex flex-wrap justify-around">
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <FontAwesomeIcon icon={faSquarePlus} className="text-xl cursor-pointer text-slate-500 hover:text-slate-600" onClick={addNewTech} />
        {techs.map((technoogy: Technology, n: number) =>
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => editTech(technoogy._id!)} className="cursor-pointer text-blue-500 hover:text-blue-400" />
            <FontAwesomeIcon icon={faTrash} onClick={() => deleteTech(technoogy._id!)} className="cursor-pointer text-red-700 hover:text-red-500" />
            <div key={n} className="my-4">{technoogy.name}</div>
          </div>
        )}

      </div>
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <FontAwesomeIcon icon={faSquarePlus} className="text-xl cursor-pointer text-slate-500 hover:text-slate-600" onClick={addNewCourse} />
        {updCourses.map((course: Course, n: number) =>
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => editCourse(course._id!)} className="cursor-pointer text-blue-500 hover:text-blue-400" />
            <FontAwesomeIcon icon={faTrash} onClick={() => deleteCourse(course._id!)} className="cursor-pointer  text-red-700 hover:text-red-500" />
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
