import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { fetchAllTestSeriesService } from "@/services/test-service";
import { ArrowUpDownIcon, FileText, Video } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");

  // ─── BUG 3 FIX (frontend) ─────────────────────────────────────────────────
  // Filters must start as { category: [], level: [], primaryLanguage: [] }
  // so that handleFilterOnChange can always call .indexOf() and .filter()
  // without crashing. Previously it started as {} which made those array
  // methods throw and caused the blank white page.
  // ──────────────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    category: [],
    level: [],
    primaryLanguage: [],
  });

  const [contentType, setContentType] = useState("courses");

  const {
    studentViewCoursesList, setStudentViewCoursesList,
    loadingState, setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  // Build query string — only include keys that have at least one value selected
  function buildCourseQuery() {
    const params = new URLSearchParams();
    params.set("sortBy", sort);
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) params.set(key, values.join(","));
    });
    return params;
  }

  async function fetchData() {
    setLoadingState(true);
    let response;

    if (contentType === "courses") {
      response = await fetchStudentViewCourseListService(buildCourseQuery());
    } else {
      response = await fetchAllTestSeriesService();
    }

    if (response?.success) {
      setStudentViewCoursesList(response.data);
    } else {
      setStudentViewCoursesList([]);
    }
    setLoadingState(false);
  }

  useEffect(() => {
    fetchData();
  }, [filters, sort, contentType]);

  const handleFilterOnChange = (sectionId, option) => {
    setFilters((prev) => {
      // Ensure the section array always exists
      const current = prev[sectionId] ?? [];
      const updated = current.includes(option.id)
        ? current.filter((id) => id !== option.id)   // deselect
        : [...current, option.id];                   // select
      return { ...prev, [sectionId]: updated };
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">
        Explore {contentType === "courses" ? "Courses" : "Test Series"}
      </h1>

      <div className="flex flex-col md:flex-row gap-4">

        {/* SIDEBAR */}
        <aside className="w-full md:w-64 space-y-6">

          {/* CONTENT TYPE SWITCHER */}
          <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
            <h3 className="font-bold">I want to learn via:</h3>
            <div className="flex flex-col gap-3">
              <Label
                className={`flex items-center gap-2 cursor-pointer p-2 rounded ${contentType === "courses"
                  ? "bg-blue-100 border border-blue-500"
                  : "hover:bg-gray-200"
                  }`}
              >
                <input
                  type="radio" name="contentType"
                  checked={contentType === "courses"}
                  onChange={() => setContentType("courses")}
                  className="hidden"
                />
                <Video className="w-4 h-4 text-blue-600" /> Video Courses
              </Label>

              <Label
                className={`flex items-center gap-2 cursor-pointer p-2 rounded ${contentType === "test-series"
                  ? "bg-blue-100 border border-blue-500"
                  : "hover:bg-gray-200"
                  }`}
              >
                <input
                  type="radio" name="contentType"
                  checked={contentType === "test-series"}
                  onChange={() => setContentType("test-series")}
                  className="hidden"
                />
                <FileText className="w-4 h-4 text-orange-600" /> Mock Test Series
              </Label>
            </div>
          </div>

          {/* FILTERS — only shown for courses */}
          {contentType === "courses" &&
            Object.keys(filterOptions).map((sectionId) => (
              <div className="p-4 border-b space-y-4" key={sectionId}>
                <h3 className="font-bold mb-3 uppercase">{sectionId}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[sectionId].map((option) => (
                    <Label
                      key={option.id}
                      className="flex font-medium items-center gap-3"
                    >
                      <Checkbox
                        checked={filters[sectionId]?.includes(option.id) ?? false}
                        onCheckedChange={() => handleFilterOnChange(sectionId, option)}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <div className="flex justify-end mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowUpDownIcon className="h-4 w-4" /> Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((item) => (
                    <DropdownMenuRadioItem value={item.id} key={item.id}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loadingState ? (
              <Skeleton className="h-[300px] w-full" />
            ) : studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((item) => (
                <Card
                  key={item._id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 group"
                  onClick={() =>
                    contentType === "test-series"
                      ? navigate(`/test-series/details/${item._id}`)
                      : navigate(`/course/details/${item._id}`)
                  }
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden rounded-t-lg">
                    <img
                      src={
                        item.image ||
                        (contentType === "test-series"
                          ? "/placeholder-test.jpg"
                          : "/placeholder-course.jpg")
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={item.title}
                    />
                    {contentType === "test-series" && (
                      <span className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Test Series
                      </span>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 truncate group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{item.instructorName}</p>
                    {contentType === "test-series" && (
                      <p className="text-xs text-gray-400 mb-2">
                        {item.tests?.length || 0} Mock Tests included
                      </p>
                    )}
                    <p className="font-bold text-lg">₹{item.price || item.pricing}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <h2 className="text-xl font-bold text-gray-500 col-span-3 text-center py-10">
                No {contentType === "courses" ? "Courses" : "Test Series"} Found
              </h2>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;