import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Need Tabs!
import { AuthContext } from "@/context/auth-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchBoughtItems() {
    if (!auth?.user?._id) return;

    // Call the new service
    const response = await fetchStudentBoughtCoursesService(auth.user._id);

    // Handle the new response structure
    if (response?.success) {
      setCourses(response.courses || []);
      setTestSeries(response.testSeries || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBoughtItems();
  }, [auth]);

  return (
    <div className="p-4 border-b border-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Learning</h1>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="test-series">Test Series</TabsTrigger>
        </TabsList>

        {/* COURSES TAB */}
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Card key={course._id} className="flex flex-col">
                  <CardContent className="p-4 flex-grow">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-48 w-full object-cover rounded-md mb-4"
                    />
                    <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.instructorName}</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => navigate(`/course-progress/${course._id}`)} className="w-full">
                      <Watch className="mr-2 h-4 w-4" /> Start Watching
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No courses purchased.</p>
            )}
          </div>
        </TabsContent>

        {/* TEST SERIES TAB */}
        <TabsContent value="test-series">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {testSeries.length > 0 ? (
              testSeries.map((series) => (
                <Card key={series._id} className="flex flex-col">
                  <CardContent className="p-4 flex-grow">
                    <img
                      src={series.image}
                      alt={series.title}
                      className="h-48 w-full object-cover rounded-md mb-4"
                    />
                    <h3 className="font-bold text-lg mb-1">{series.title}</h3>
                    <p className="text-sm text-gray-500">{series.instructorName}</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => navigate(`/student/test-player/${series._id}`)} className="w-full">
                      <PlayCircle className="mr-2 h-4 w-4" /> Attempt Tests
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No test series purchased.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StudentCoursesPage;